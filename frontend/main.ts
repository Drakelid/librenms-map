import cytoscape, { type Core, type StylesheetStyle } from 'cytoscape';
import { layoutGraph, resetLayoutWorker } from './layout';
import { compactWideRestore, packTierPositions } from './layout-positions';
import { mountLinkPreview } from './link-preview';
import { demoSnapshot } from './demo';
import { deviceName, lateralOffsets, LOAD_COLORS, metric, PARALLEL_CONNECTION_GAP, topology } from './topology';
import { limitFilter } from './view-limits';
import { arrangePositions, emptyView, HOPS_MAX, hopNeighborhood, normalizeView, visibleNodes } from './view-state';
import { demoViewStore, httpViewStore } from './view-store';
import { mountViews } from './views-panel';
import type { Position, Snapshot, Topology, ViewState } from './types';
import './style.css';
import './link-preview.css';
import './views.css';

const root = document.querySelector<HTMLElement>('#libremap');
if (root) mount(root);

function mount(root: HTMLElement) {
  const demo = root.dataset.demo === 'true';
  root.innerHTML = `
    <div class="lm-shell">
      <header class="lm-header"><div class="lm-brand"><span class="lm-logo">◈</span><div><strong>LibreMap</strong><span>NETWORK TOPOLOGY</span></div></div><div class="lm-header-right"><span class="lm-source">${demo ? 'DEMO DATA' : 'LIBRENMS'}</span><button data-action="theme" title="Toggle color theme">◐ <span>Theme</span></button><a class="lm-back" href="/">LibreNMS ↗</a></div></header>
      <section class="lm-heading"><div><div class="lm-eyebrow">INFRASTRUCTURE / TOPOLOGY</div></div><div class="lm-summary" aria-label="Network summary"></div></section>
      <div class="lm-toolbar"><label class="lm-search"><span>⌕</span><input type="search" aria-label="Find device" placeholder="Find a device…"></label><label class="lm-select">Site <select aria-label="Site"><option value="">All sites</option></select></label><button data-action="overview">AGG backbone</button><button data-action="other-devices" aria-pressed="false">Show other devices</button><span class="lm-spacer"></span><button data-action="refresh">↻ Refresh</button><button data-action="layout">Re-layout</button><button data-action="fullscreen" title="Fullscreen">⛶</button></div>
      <div class="lm-viewbar"><label class="lm-select">Device group <select aria-label="Device group"><option value="">All device groups</option></select></label><label class="lm-select">AGG root <select aria-label="AGG root"><option value="">All AGG groups</option></select></label><label class="lm-select">Highlight <select aria-label="Highlight hops">${Array.from({length:HOPS_MAX},(_,i)=>`<option value="${i+1}">${i+1} hop${i?'s':''}</option>`).join('')}</select></label><span class="lm-pin-count">0 pinned</span><button data-action="unpin-all">Unpin all</button><div class="lm-views"></div></div>
      <div class="lm-notice" role="status" aria-live="polite">Loading topology…</div>
      <main class="lm-workspace"><div class="lm-canvas-wrap"><div class="lm-canvas-caption"><span class="lm-live-dot"></span><strong>Physical topology</strong><span>AGG → ER · discovered links</span></div><div class="lm-canvas" aria-label="Interactive network topology"></div><div class="lm-empty" hidden></div><div class="lm-map-controls"><button data-action="zoom-in" aria-label="Zoom in">+</button><button data-action="zoom-out" aria-label="Zoom out">−</button><button data-action="fit">Fit</button></div><div class="lm-legend"><span><i style="color:${LOAD_COLORS.normal}"></i>&lt;50%</span><span><i style="color:${LOAD_COLORS.warning}"></i>50–70%</span><span><i style="color:${LOAD_COLORS.high}"></i>&gt;70%</span><span><i class="lm-dashed" style="color:#e05b65"></i>Down</span><span><i class="lm-dashed" style="color:#8a96a9"></i>Unknown / stale</span></div></div><aside class="lm-details" aria-label="Selection details"></aside></main>
      <footer><span class="lm-updated">Waiting for data</span><span>Drag to arrange · Scroll to zoom · Hover links for traffic · Click to inspect</span></footer>
    </div>`;
  if (demo) root.querySelector('.lm-back')?.remove();
  // Inside LibreNMS the user's site style decides the theme; no separate toggle.
  const hostTheme = root.dataset.hostTheme === 'true';
  if (hostTheme) root.querySelector('[data-action="theme"]')?.remove();
  else if(root.dataset.homeUrl) root.querySelector<HTMLAnchorElement>('.lm-back')!.href=root.dataset.homeUrl;
  const $ = <T extends HTMLElement>(selector:string) => root.querySelector<T>(selector)!;
  const notice = $('.lm-notice');
  const search = $<HTMLInputElement>('[aria-label="Find device"]');
  const site = $<HTMLSelectElement>('[aria-label="Site"]');
  const deviceGroup = $<HTMLSelectElement>('[aria-label="Device group"]');
  const focus = $<HTMLSelectElement>('[aria-label="AGG root"]');
  const hops = $<HTMLSelectElement>('[aria-label="Highlight hops"]');
  const cy: Core = cytoscape({ container:$('.lm-canvas'), minZoom:0.15, maxZoom:2.5, selectionType:'single', style:styles(root) });
  // LibreNMS toggles `dark` on <html> (live, in its "device" mode) and paints its
  // page background on <body>; the map adopts both. Elsewhere, such as the demo,
  // follow the OS preference unless the Theme button overrides it.
  const systemDark=window.matchMedia('(prefers-color-scheme: dark)');
  let manualDark:boolean|undefined;
  let appliedTheme='';
  function applyTheme(){
    const dark=hostTheme ? document.documentElement.classList.contains('dark') : manualDark ?? systemDark.matches;
    const background=hostTheme ? getComputedStyle(document.body).backgroundColor : '';
    const theme=`${dark}|${background}`;
    if(theme===appliedTheme)return;
    appliedTheme=theme;
    root.classList.toggle('lm-dark',dark);
    // Only an opaque host color replaces the map's own background.
    if(/^rgb\(/.test(background))root.style.setProperty('--bg',background);else root.style.removeProperty('--bg');
    cy.style(styles(root));
  }
  applyTheme();
  if(hostTheme)new MutationObserver(applyTheme).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  else systemDark.addEventListener('change',applyTheme);
  let snapshot: Snapshot | undefined;
  const linkPreview=demo ? undefined : mountLinkPreview(root,cy,()=>snapshot?.generatedAt);
  let graph: Topology = { nodes:[], links:[], deviceGroups:[] };
  let backbone = false;
  let showOther = false;
  let busy = false;
  let selected: { type:'node'|'link'; id:string } | undefined;
  let layoutRequest = 0;
  let layoutTimer:ReturnType<typeof setTimeout> | undefined;
  let pendingRestore:Record<string,Position> = {};
  let pendingViewport:Pick<ViewState,'zoom'|'pan'>|undefined;
  let layoutPending=false;
  let viewportTimer:ReturnType<typeof setTimeout>|undefined;
  let searchTimer:ReturnType<typeof setTimeout>|undefined;
  // Samples carry the server's poll_time, so judge staleness on the server's
  // clock: a skewed browser clock must not mark every link STALE.
  let clockOffset=0;
  const serverNow=()=>Date.now()/1000+clockOffset;
  const storageKey = `libremap:v1:${root.dataset.storageKey ?? 'local'}`;
  const workspaceKey = `libremap:v2:${root.dataset.storageKey ?? 'local'}`;
  function readWorkspace():ViewState {
    try {
      const current=localStorage.getItem(workspaceKey);
      return current ? normalizeView(JSON.parse(current)) : normalizeView({positions:JSON.parse(localStorage.getItem(storageKey) ?? '{}')});
    } catch { return emptyView(); /* Storage is optional. */ }
  }
  let initialWorkspace=readWorkspace();
  let saved:Record<string,Position> = initialWorkspace.positions;
  let pins=new Set(initialWorkspace.pinned);
  let initialized=false;
  let basePositions:Record<string,Position>={};
  let focusedPacking=false;
  const renderedPositions=():Record<string,Position>=>Object.fromEntries(cy.nodes().map(node=>[node.id(),node.position()]));
  const workspacePositions=():Record<string,Position>=>{
    const rendered=renderedPositions();
    if(!focusedPacking)return rendered;
    const positions={...basePositions};
    // A device pinned while focused adopts its visible coordinate as its new
    // full-map anchor; all other focused coordinates remain presentational.
    for(const id of pins)if(rendered[id])positions[id]=rendered[id];
    return positions;
  };
  function capture():ViewState {
    return normalizeView({rootId:focus.value || null,deviceGroupId:deviceGroup.value || null,site:site.value,search:search.value,backbone,showOther,hops:Number(hops.value),positions:workspacePositions(),pinned:[...pins],zoom:cy.zoom(),pan:cy.pan()},graph);
  }
  const persist = () => {
    // Never overwrite a stored workspace while no topology is loaded: an empty
    // graph would silently erase the operator's saved positions and pins.
    if (!snapshot) return;
    saved = workspacePositions();
    try { localStorage.setItem(workspaceKey, JSON.stringify(capture())); } catch { notice.textContent = 'Workspace could not be saved in this browser.'; }
  };
  const message = (text:string, error=false) => { notice.textContent=text; notice.classList.toggle('lm-error',error); };
  let store;
  try {store=demo ? demoViewStore(`${workspaceKey}:views`) : root.dataset.viewsEndpoint ? httpViewStore(root.dataset.viewsEndpoint,root.dataset.csrf ?? '') : undefined;} catch { /* A missing endpoint disables server views only. */ }
  const views=mountViews($('.lm-views'),{store,demo,capture,restore:restoreView});
  // Graph controls are meaningless without a snapshot, so an unavailable
  // topology disables them exactly like an in-flight layout does.
  function syncControls(){
    const off=layoutPending || !snapshot;
    search.disabled=off;site.disabled=off;deviceGroup.disabled=off;focus.disabled=off;hops.disabled=off;
    for(const action of ['layout','zoom-in','zoom-out','fit','overview','other-devices'])$<HTMLButtonElement>(`[data-action="${action}"]`).disabled=off;
    root.querySelectorAll<HTMLButtonElement>('.lm-pin-device,.lm-focus-device').forEach(b=>{b.disabled=off;});
    $<HTMLButtonElement>('[data-action="unpin-all"]').disabled=off || pins.size===0;
  }
  function setLayoutPending(value:boolean){
    layoutPending=value;views.setLayoutPending(value);cy.autoungrabify(value);cy.userPanningEnabled(!value);cy.userZoomingEnabled(!value);
    syncControls();
  }
  function updatePins(){
    cy.nodes().forEach(n=>{
      const pinned=pins.has(n.id());n.data({pinned:pinned?1:0,label:`${n.data('name')}\n${n.data('role')}  ·  ${String(n.data('status')).toUpperCase()}${pinned?'  ·  PIN':''}`});
      if(pinned)n.lock();else n.unlock();
    });
    $('.lm-pin-count').textContent=`${pins.size} pinned`;
    syncControls();
  }
  function restoreView(value:ViewState){
    if(!snapshot)return;
    const state=normalizeView(value,graph);
    focus.value=state.rootId ?? '';deviceGroup.value=state.deviceGroupId ?? '';site.value=state.site;search.value=state.search;backbone=state.backbone;showOther=state.showOther;hops.value=String(state.hops);pins=new Set(state.pinned);
    selected=undefined;cy.elements().unselect().removeClass('lm-dim');updatePins();renderDetails();updateBackbone();updateOtherDevices();
    layout(state.positions,state);
  }
  function updateBackbone(){const button=$<HTMLButtonElement>('[data-action="overview"]');button.classList.toggle('lm-active',backbone);button.setAttribute('aria-pressed',String(backbone));}
  function updateOtherDevices(){const button=$<HTMLButtonElement>('[data-action="other-devices"]');button.classList.toggle('lm-active',showOther);button.setAttribute('aria-pressed',String(showOther));button.textContent=showOther?'Hide other devices':'Show other devices';}
  const detailsDefault = () => {
    const panel = $('.lm-details'); panel.replaceChildren();
    const eyebrow = document.createElement('div'); eyebrow.className='lm-eyebrow'; eyebrow.textContent='NETWORK EXPLORER'; panel.append(eyebrow);
    const heading = document.createElement('h2'); heading.textContent='Follow the connection'; panel.append(heading);
    const desc = document.createElement('p'); desc.textContent='Hover a link to preview both interface traffic graphs. Select a device or link to inspect its status and traffic.'; panel.append(desc);
    const list = document.createElement('div'); list.className='lm-device-list';
    for (const node of graph.nodes.filter(n => n.role==='AGG')) {
      const button = document.createElement('button'); button.textContent=`◈  ${deviceName(node)}`; button.addEventListener('click',()=>selectNode(node.id)); list.append(button);
    }
    panel.append(list);
    const hint=document.createElement('p'); hint.className='lm-hint'; hint.textContent='Choose a LibreNMS device group or an AGG root to focus the map. Filters combine, and Show other devices reveals non-AGG/ER members inside that scope. Highlight sets how many connection hops around a selected device stay in view. Save a named view to return to this workspace.'; panel.append(hint);
  };
  function renderDetails() {
    if (!selected) return detailsDefault();
    const node = selected.type==='node' ? graph.nodes.find(n=>n.id===selected!.id) : undefined;
    const link = selected.type==='link' ? graph.links.find(l=>l.id===selected!.id) : undefined;
    if (!node && !link) { selected=undefined; return detailsDefault(); }
    const panel=$('.lm-details'); panel.replaceChildren();
    const close=document.createElement('button'); close.className='lm-close'; close.textContent='×'; close.setAttribute('aria-label','Close details'); close.onclick=()=>{ selected=undefined; cy.elements().removeClass('lm-dim'); cy.elements().unselect(); detailsDefault(); }; panel.append(close);
    const eyebrow=document.createElement('div'); eyebrow.className='lm-eyebrow'; eyebrow.textContent=node ? `${node.role} / DEVICE` : 'PHYSICAL LINK'; panel.append(eyebrow);
    const nameOf=(id:string)=>{const n=graph.nodes.find(n=>n.id===id);return n ? deviceName(n) : undefined;};
    const title=document.createElement('h2'); title.textContent=node ? deviceName(node) : `${nameOf(link!.source)} ↔ ${nameOf(link!.target)}`; panel.append(title);
    const rows: [string,string][] = node ? [['Status',node.status],...(deviceName(node)!==node.hostname ? [['Hostname',node.hostname] as [string,string]] : []),['Role',node.role],['Site',node.site],['Placement',node.reachable ? node.tier===0 ? 'Root tier' : `Hop ${node.tier} from AGG` : 'No discovered AGG path'],['Connections',String(graph.links.filter(l=>l.source===node.id || l.target===node.id).length)]] : [
      ['Status',metric(link!,serverNow(),snapshot!.config.staleAfter).label], ['Source interface',link!.sourcePort],['Remote interface',link!.targetPort],['Capacity',rate(link!.speedBps)],['Inbound at source',rate(link!.inBps)],['Outbound at source',rate(link!.outBps)],['Sample time',link!.sampledAt ? new Date(link!.sampledAt*1000).toLocaleString() : 'Unavailable'],
    ];
    const dl=document.createElement('dl'); for (const [label,value] of rows) { const dt=document.createElement('dt'); dt.textContent=label; const dd=document.createElement('dd'); dd.textContent=value; if(link && label==='Status')dd.dataset.linkStatus='true'; dl.append(dt,dd); } panel.append(dl);
    if(node){
      const pin=document.createElement('button');pin.className='lm-pin-device';pin.disabled=layoutPending;pin.textContent=pins.has(node.id)?'Unpin device':'Pin position';pin.setAttribute('aria-pressed',String(pins.has(node.id)));
      pin.onclick=()=>{if(pins.has(node.id))pins.delete(node.id);else{pins.add(node.id);basePositions[node.id]={...cy.getElementById(node.id).position()};}updatePins();filters(false);persist();renderDetails();};panel.append(pin);
      if(node.role==='AGG'){const button=document.createElement('button');button.className='lm-focus-device';button.disabled=layoutPending;button.textContent='Focus AGG group';button.onclick=()=>{focus.value=node.id;filters();persist();};panel.append(button);}
    }
    if (node?.url) { const url = new URL(node.url,window.location.href); if (url.origin===window.location.origin && ['http:','https:'].includes(url.protocol)) { const a=document.createElement('a'); a.className='lm-device-link'; a.href=url.href; a.textContent='Open in LibreNMS ↗'; panel.append(a); } }
  }
  function selectNode(id:string) {
    const element=cy.getElementById(id); if (!element.length) return;
    selected={type:'node',id}; cy.elements().unselect(); element.select();
    const near=hopNeighborhood(graph,id,Number(hops.value),new Set(cy.nodes(':visible').map(n=>n.id())));
    cy.elements().addClass('lm-dim'); cy.elements().filter(e=>e.isNode() ? near.nodes.has(e.id()) : near.links.has(e.data('linkId'))).removeClass('lm-dim'); renderDetails();
  }
  function filters(fit=true) {
    const visible = visibleNodes(graph,{rootId:focus.value || null,deviceGroupId:deviceGroup.value || null,site:site.value,search:search.value,backbone,showOther});
    const focused=!!focus.value || !!deviceGroup.value;
    cy.batch(()=> {
      cy.nodes().forEach(n=>{n.style('display',visible.has(n.id())?'element':'none');});
      cy.edges().forEach(e=>{e.style('display',visible.has(e.source().id()) && visible.has(e.target().id())?'element':'none');});
      if(focused && visible.size && Object.keys(basePositions).length){
        const focusedGraph:Topology={nodes:graph.nodes.filter(node=>visible.has(node.id)),links:graph.links.filter(link=>visible.has(link.source) && visible.has(link.target)),deviceGroups:[]};
        const order=new Map(focusedGraph.nodes.map(node=>[node.id,basePositions[node.id]?.x ?? 0]));
        const automatic=packTierPositions(focusedGraph,order,true);
        const focusedPins=new Set([...pins].filter(id=>visible.has(id)));
        const pinRestore=Object.fromEntries([...focusedPins].filter(id=>basePositions[id]).map(id=>[id,basePositions[id]]));
        const positions=arrangePositions(focusedGraph,automatic,pinRestore,focusedPins);
        cy.nodes().filter(node=>visible.has(node.id()) && !pins.has(node.id())).forEach(node=>{node.position(positions[node.id()]);});
        focusedPacking=true;
      }else if(!focused && focusedPacking){
        cy.nodes().filter(node=>!pins.has(node.id()) && !!basePositions[node.id()]).forEach(node=>{node.position(basePositions[node.id()]);});
        focusedPacking=false;
      }
    });
    $('.lm-empty').hidden=visible.size>0; $('.lm-empty').textContent=graph.nodes.length ? 'No devices match these filters.' : 'No authorized devices are available.';
    if (fit && visible.size) cy.fit(cy.elements(':visible'),70);
  }
  function layout(restore:Record<string,Position>={},viewport?:Pick<ViewState,'zoom'|'pan'>) {
    const compactRestore=compactWideRestore(restore,pins);
    pendingRestore=compactRestore;pendingViewport=compactRestore===restore ? viewport : undefined;layoutRequest++;
    setLayoutPending(true);
    clearTimeout(layoutTimer);
    layoutTimer=setTimeout(()=>{layoutRequest++;resetLayoutWorker();setLayoutPending(false);message('Layout timed out. Existing positions are retained; retry Re-layout.',true);},20000);
    const requestId=layoutRequest;
    void layoutGraph(graph).then(positions=>applyLayout(requestId,positions)).catch(()=>{
      if(requestId!==layoutRequest) return;
      clearTimeout(layoutTimer);setLayoutPending(false);message('Automatic layout failed. Check the published worker asset and retry Re-layout.',true);
    });
  }
  function applyLayout(requestId:number,positions:Record<string,Position>) {
    if (requestId!==layoutRequest) return;
    clearTimeout(layoutTimer);
    const resolved=arrangePositions(graph,positions,pendingRestore,pins);
    basePositions=resolved;focusedPacking=false;
    cy.batch(()=>cy.nodes().forEach(n=>{n.unlock();n.position(resolved[n.id()]);}));updatePins();
    filters(!pendingViewport);
    if(pendingViewport)cy.viewport(pendingViewport);
    pendingViewport=undefined;setLayoutPending(false);persist();message(demo ? 'Demo topology · illustrative devices and traffic' : 'Topology loaded · positions saved in this browser');
  }
  function apply(next:Snapshot) {
    linkPreview?.hide();
    const restoreInFlight=layoutPending ? pendingRestore : undefined;
    const viewportInFlight=layoutPending ? pendingViewport : undefined;
    const previousSignature=JSON.stringify([graph.nodes.map(n=>[n.id,n.role,n.site,n.tier]),graph.links.map(l=>l.id)]);
    snapshot=next; graph=topology(next);
    clockOffset=Number.isFinite(next.generatedAt) ? next.generatedAt-Date.now()/1000 : 0;
    const signature=JSON.stringify([graph.nodes.map(n=>[n.id,n.role,n.site,n.tier]),graph.links.map(l=>l.id)]);
    const currentPositions=workspacePositions();
    const oldSite=site.value;
    site.replaceChildren(new Option('All sites',''),...Array.from(new Set(graph.nodes.map(n=>n.site))).sort().map(s=>new Option(s,s)));
    if ([...site.options].some(o=>o.value===oldSite)) site.value=oldSite;
    const oldFocus=focus.value;
    focus.replaceChildren(new Option('All AGG groups',''),...graph.nodes.filter(n=>n.role==='AGG').map(n=>new Option(deviceName(n),n.id)));
    if([...focus.options].some(o=>o.value===oldFocus))focus.value=oldFocus;
    const oldDeviceGroup=deviceGroup.value;
    deviceGroup.replaceChildren(new Option('All device groups',''),...graph.deviceGroups.map(group=>new Option(group.name,group.id)));
    if([...deviceGroup.options].some(option=>option.value===oldDeviceGroup))deviceGroup.value=oldDeviceGroup;
    pins=new Set([...pins].filter(id=>graph.nodes.some(n=>n.id===id)));
    if(!initialized){
      // Also covers recovery after a failed fetch, which resets to this state.
      const state=normalizeView(initialWorkspace,graph);focus.value=state.rootId ?? '';deviceGroup.value=state.deviceGroupId ?? '';site.value=state.site;search.value=state.search;backbone=state.backbone;showOther=state.showOther;hops.value=String(state.hops);pins=new Set(state.pinned);updateBackbone();updateOtherDevices();
    }
    cy.batch(()=>{
      const nodeIds=new Set(graph.nodes.map(n=>n.id)); const edgeIds=new Set(graph.links.map(l=>`edge:${l.id}`));
      cy.edges().filter(e=>!edgeIds.has(e.id())).remove(); cy.nodes().filter(n=>!nodeIds.has(n.id())).remove();
      for (const n of graph.nodes) { const name=deviceName(n); const data={...n,name,label:`${name}\n${n.role}  ·  ${n.status.toUpperCase()}`,color:n.status==='down'?'#e05b65':n.status==='up'?'#36b89a':'#8a96a9',width:n.role==='AGG'?220:206}; const old=cy.getElementById(n.id); if(old.length) old.data(data); else cy.add({data}); }
      const offsets=lateralOffsets(graph);
      for (const l of graph.links) { const m=metric(l,serverNow(),next.config.staleAfter); const data={...l,id:`edge:${l.id}`,linkId:l.id,label:m.label,color:m.color,state:m.state,lateral:offsets.has(l.id)?1:0,curveDistance:offsets.get(l.id) ?? 0}; const old=cy.getElementById(data.id); if(old.length) old.data(data); else cy.add({data}); }
    });
    updatePins();
    const summary=$('.lm-summary'); summary.replaceChildren();
    for (const [value,label] of [[graph.nodes.length,'Devices'],[graph.links.length,'Links'],[graph.nodes.filter(n=>n.role==='AGG').length,'AGG roots'],[graph.nodes.filter(n=>n.status==='down').length,'Down']]) { const item=document.createElement('div'); const strong=document.createElement('strong'); strong.textContent=String(value); const span=document.createElement('span'); span.textContent=String(label); item.append(strong,span); summary.append(item); }
    $('.lm-updated').textContent=`${demo?'Demo snapshot':'Snapshot fetched'} · ${new Date(next.generatedAt*1000).toLocaleTimeString()}`;
    filters(false); renderDetails();views.setAvailable(true);
    if(!initialized)void views.reload();
    if (signature!==previousSignature || layoutPending) layout(restoreInFlight ?? {...saved,...currentPositions},viewportInFlight ?? (!initialized && Object.keys(saved).length ? initialWorkspace : initialized ? {zoom:cy.zoom(),pan:cy.pan()} : undefined));
    else message(demo ? 'Demo topology · illustrative devices and traffic' : 'Updated · layout unchanged');
    initialized=true;
  }
  async function refresh() {
    if (busy) return; busy=true;
    try {
      if (demo) apply(demoSnapshot());
      else {
        if (!root.dataset.endpoint) throw new Error('Missing topology endpoint');
        const endpoint=new URL(root.dataset.endpoint,location.href);
        if(endpoint.origin!==location.origin) throw new Error('Topology endpoint must use the same origin');
        const response=await fetch(endpoint,{credentials:'same-origin',headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});
        if(response.status===429) throw new Error('Too many topology requests. The map will retry on the next refresh.');
        if(!response.ok) throw new Error(await topologyFailure(response));
        const data=await response.json();
        if(!Array.isArray(data.devices)||!Array.isArray(data.links)||!data.config) throw new Error('Unexpected topology response');
        apply(data);
      }
    } catch(error) {
      linkPreview?.hide();
      // Permissions may have changed. Do not leave previously authorized graph data on screen.
      cy.elements().remove(); graph={nodes:[],links:[],deviceGroups:[]}; basePositions={};focusedPacking=false;selected=undefined; snapshot=undefined; layoutRequest++; clearTimeout(layoutTimer); detailsDefault();
      setLayoutPending(false);clearTimeout(viewportTimer);clearTimeout(searchTimer);
      // Clear the on-screen pins, but reload the stored workspace rather than
      // emptying it: a transient failure must not cost the operator their saved
      // positions, and normalizeView re-filters them against whatever loads next.
      pins.clear();initialWorkspace=readWorkspace();saved=initialWorkspace.positions;initialized=false;
      site.replaceChildren(new Option('All sites',''));deviceGroup.replaceChildren(new Option('All device groups',''));focus.replaceChildren(new Option('All AGG groups',''));views.setAvailable(false);updatePins();
      $('.lm-summary').replaceChildren(); $('.lm-empty').hidden=false; $('.lm-empty').textContent='Topology unavailable. Use Refresh to retry.';
      message(error instanceof Error?error.message:'Unable to load topology',true);
    } finally { busy=false; }
  }
  cy.on('tap','node',event=>selectNode(event.target.id()));
  // Inspecting a link keeps a selected device's neighborhood in focus; the link and its ends join it.
  cy.on('tap','edge',event=>{selected={type:'link',id:event.target.data('linkId')};event.target.union(event.target.connectedNodes()).removeClass('lm-dim');renderDetails();});
  cy.on('tap',event=>{if(event.target===cy){selected=undefined;cy.elements().removeClass('lm-dim');detailsDefault();}});
  cy.on('dragfree','node',event=>{basePositions[event.target.id()]={...event.target.position()};persist();});
  cy.on('zoom',()=>cy.edges().toggleClass('lm-no-label',cy.zoom()<0.45));
  cy.on('pan zoom',()=>{
    if(!snapshot || layoutPending)return;
    clearTimeout(viewportTimer);viewportTimer=setTimeout(()=>{if(snapshot && !layoutPending)persist();},200);
  });
  // Filter on every keystroke, but fit and store once typing pauses so the
  // viewport does not jump and storage is not rewritten per character.
  search.addEventListener('input',()=>{
    search.value=limitFilter(search.value);filters(false);
    clearTimeout(searchTimer);searchTimer=setTimeout(()=>{if(!snapshot)return;const visible=cy.elements(':visible');if(visible.length)cy.fit(visible,70);persist();},300);
  });
site.addEventListener('change',()=>{filters();persist();});deviceGroup.addEventListener('change',()=>{filters();persist();});focus.addEventListener('change',()=>{filters();persist();});hops.addEventListener('change',()=>{if(selected?.type==='node')selectNode(selected.id);persist();});
  root.addEventListener('click',event=>{
    const button=(event.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]'); if(!button) return;
    switch(button.dataset.action) {
      case 'refresh': void refresh(); break;
      case 'fit':cy.fit(cy.elements(':visible'),70);break;
      case 'layout':layout(Object.fromEntries(cy.nodes().map(n=>({id:n.id(),position:n.position()})).filter(n=>pins.has(n.id)).map(n=>[n.id,n.position])));break;
      case 'unpin-all':pins.clear();updatePins();filters(false);persist();renderDetails();break;
      case 'zoom-in':cy.zoom({level:cy.zoom()*1.2,renderedPosition:{x:cy.width()/2,y:cy.height()/2}});break;
      case 'zoom-out':cy.zoom({level:cy.zoom()/1.2,renderedPosition:{x:cy.width()/2,y:cy.height()/2}});break;
      case 'overview':backbone=!backbone;updateBackbone();filters();persist();break;
      case 'other-devices':showOther=!showOther;updateOtherDevices();filters();persist();break;
      case 'theme':manualDark=!root.classList.contains('lm-dark');applyTheme();break;
      case 'fullscreen':void (document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen()).catch(()=>message('Fullscreen is unavailable in this browser.'));break;
    }
  });
  new ResizeObserver(()=>cy.resize()).observe($('.lm-canvas'));
  syncControls(); detailsDefault(); void refresh();
  setInterval(()=>{if(!document.hidden) void refresh();},60000);
  setInterval(()=>{
    if(!snapshot)return;
    const now=serverNow();
    cy.batch(()=>graph.links.forEach(l=>{
      const m=metric(l,now,snapshot!.config.staleAfter);
      cy.getElementById(`edge:${l.id}`).data({label:m.label,color:m.color,state:m.state});
      if(selected?.type==='link' && selected.id===l.id){
        const status=root.querySelector<HTMLElement>('[data-link-status]');
        if(status)status.textContent=m.label;
      }
    }));
  },10000);
  // Read-only diagnostic hook for browser acceptance checks: the demo, or test
  // fixtures that opt in with data-debug. The plugin's own page never sets it.
  if(demo || root.dataset.debug==='true') Object.defineProperty(window,'libremapDebug',{value:()=>({
    zoom:cy.zoom(),
    nodes:cy.nodes().map(n=>({id:n.id(),tier:n.data('tier'),position:n.position(),renderedPosition:n.renderedPosition(),visible:n.visible(),dimmed:n.hasClass('lm-dim')})),
    edges:cy.edges().length,
    links:cy.edges().map(e=>({port:e.data('sourcePort') as string,midpoint:e.renderedMidpoint(),label:e.data('label') as string,lineStyle:e.style('line-style') as string,dimmed:e.hasClass('lm-dim'),labelBox:e.renderedBoundingBox({includeNodes:false,includeEdges:false,includeLabels:true,includeOverlays:false})})),
  }),configurable:true});
}

async function topologyFailure(response:Response):Promise<string> {
  if(response.status===422) {
    const body:unknown=await response.json().catch(()=>undefined);
    const reason=body && typeof body==='object' && 'message' in body && typeof body.message==='string' ? body.message.trim() : '';
    if(reason && reason.length<=300)return reason;
  }
  return `LibreNMS returned HTTP ${response.status}`;
}

function rate(value:number|null) {
  if(value===null||!Number.isFinite(value)) return 'N/A';
  return value>=1e9 ? `${(value/1e9).toFixed(2)} Gbps` : value>=1e6 ? `${(value/1e6).toFixed(1)} Mbps` : `${Math.round(value/1e3)} Kbps`;
}
/** Canvas colors come from the same CSS variables as the rest of the map. */
function styles(root:HTMLElement):StylesheetStyle[] {
  const css=getComputedStyle(root);
  const color=(name:string,fallback:string)=>css.getPropertyValue(name).trim() || fallback;
  const panel=color('--panel','#ffffff'), ink=color('--ink','#20324b'), line=color('--line','#e4eaf2');
  return [
    {selector:'node',style:{shape:'round-rectangle',width:'data(width)',height:72,'background-color':panel,'border-width':1.5,'border-color':'data(color)',label:'data(label)',color:ink,'font-family':'Inter, Segoe UI, sans-serif','font-size':18,'font-weight':500,'text-wrap':'wrap','text-valign':'center','text-halign':'center','line-height':1.6}},
    {selector:'node[role = "AGG"]',style:{height:82,'border-width':2.5,'background-color':color('--node-agg','#eef5ff'),'font-weight':700}},
    {selector:'edge',style:{width:2.4,'curve-style':'bezier','control-point-step-size':PARALLEL_CONNECTION_GAP,'line-color':'data(color)',label:'data(label)','font-size':15,'font-weight':600,color:color('--edge-ink','#4d6077'),'text-background-color':panel,'text-background-opacity':1,'text-background-padding':'4px','text-background-shape':'roundrectangle','text-border-width':1,'text-border-opacity':1,'text-border-color':line,'text-rotation':'none','text-events':'yes'}},
    {selector:'edge[lateral = 1]',style:{'curve-style':'unbundled-bezier','control-point-distances':'data(curveDistance)','control-point-weights':[0.5]}},
    // Dashed links carry no current load: down, stale or unknown. Down also sets a solid red >70% link apart.
    {selector:'edge[state = "down"], edge[state = "stale"], edge[state = "unknown"]',style:{'line-style':'dashed'}},
    {selector:':selected',style:{'overlay-color':'#55a7ce','overlay-opacity':0.12,'overlay-padding':7}},
    {selector:'.lm-dim',style:{opacity:0.18}},
    {selector:'.lm-no-label',style:{label:''}},
  ];
}
