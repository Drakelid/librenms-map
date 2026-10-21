import cytoscape, { type Core, type ElementDefinition } from 'cytoscape';
import { customStyles, rate, statusColor, themeController } from './canvas-style';
import { addDevice, addShape, clampSize, clip, connect, CUSTOM_LIMITS, emptyDocument, normalizeDocument, removeElement, SHAPE_MAX, SHAPE_MIN } from './custom-map-document';
import { CustomMapError, httpCustomMapStore, type CustomMapStore } from './custom-map-store';
import { deviceName, LOAD_COLORS, metric } from './topology';
import { textLength } from './view-limits';
import type { CustomDocument, CustomLink, CustomMapSnapshot, CustomMapSummary, Device, LivePort, Position } from './types';
import './style.css';
import './views.css';
import './custom-map.css';

const NAME_MAX=100;

/**
 * Hand-drawn maps. The owner places devices, areas and text, and draws lines;
 * a line bound to an interface shows that interface's live load. A shared map
 * is read-only to everyone else, and the server hides devices and interfaces
 * the reader cannot access.
 */
export function mountCustomMap(root:HTMLElement) {
  root.innerHTML=`
    <div class="lm-shell lm-custom">
      <header class="lm-header"><div class="lm-brand"><span class="lm-logo">◈</span><div><strong>LibreMap</strong><span>CUSTOM MAPS</span></div></div><div class="lm-header-right"><a class="lm-nav" href="#" hidden>Topology map</a><a class="lm-back" href="/">LibreNMS ↗</a></div></header>
      <div class="lm-toolbar">
        <label class="lm-select">Map <select aria-label="Custom map"></select></label>
        <button data-cm="new">New map</button><button data-cm="rename">Rename</button><button data-cm="share" aria-pressed="false">Share read-only</button><button data-cm="delete">Delete</button>
        <span class="lm-spacer"></span>
        <button data-cm="edit" aria-pressed="false">Edit</button><button data-cm="save">Save</button><button data-cm="discard">Discard changes</button>
      </div>
      <div class="lm-viewbar lm-editbar" hidden>
        <label class="lm-select">Device <input class="lm-cm-device" list="lm-cm-devices" aria-label="Device to add" placeholder="Search devices…" autocomplete="off"></label><datalist id="lm-cm-devices"></datalist>
        <button data-cm="add-device">Add device</button><button data-cm="add-text">Add text</button><button data-cm="add-box">Add area</button>
        <button data-cm="connect" aria-pressed="false">Draw line</button><button data-cm="remove">Remove selected</button>
      </div>
      <div class="lm-notice" role="status" aria-live="polite">Loading custom maps…</div>
      <main class="lm-workspace"><div class="lm-canvas-wrap"><div class="lm-canvas-caption"><span class="lm-live-dot"></span><strong class="lm-cm-title">Custom maps</strong><span class="lm-cm-meta"></span></div><div class="lm-canvas" aria-label="Custom network map"></div><div class="lm-empty"></div><div class="lm-map-controls"><button data-cm="zoom-in" aria-label="Zoom in">+</button><button data-cm="zoom-out" aria-label="Zoom out">−</button><button data-cm="fit">Fit</button></div><div class="lm-legend"><span><i style="color:${LOAD_COLORS.normal}"></i>&lt;50%</span><span><i style="color:${LOAD_COLORS.warning}"></i>50–70%</span><span><i style="color:${LOAD_COLORS.high}"></i>&gt;70%</span><span><i class="lm-dashed" style="color:#e05b65"></i>Down</span><span><i class="lm-dashed" style="color:#8a96a9"></i>Disabled / unknown / stale</span><span><i class="lm-dotted"></i>Drawn (no interface)</span></div></div><aside class="lm-details" aria-label="Selection details"></aside></main>
      <footer><span class="lm-updated">Waiting for data</span><span>Edit to place devices, areas and text · Draw line joins two devices · Bind a line to an interface for live load</span></footer>
      <dialog class="lm-cm-name-dialog" aria-labelledby="lm-cm-name-title"><form><h2 id="lm-cm-name-title">New map</h2><label>Map name<input name="name" aria-label="Map name" required autocomplete="off"></label><div class="lm-dialog-actions"><button type="button" data-cm="cancel-name">Cancel</button><button type="submit">Save</button></div></form></dialog>
      <dialog class="lm-cm-delete-dialog" aria-labelledby="lm-cm-delete-title"><h2 id="lm-cm-delete-title">Delete map?</h2><p></p><div class="lm-dialog-actions"><button data-cm="cancel-delete">Cancel</button><button data-cm="confirm-delete">Delete map</button></div></dialog>
    </div>`;
  const $=<T extends HTMLElement>(selector:string)=>root.querySelector<T>(selector)!;
  const button=(action:string)=>$<HTMLButtonElement>(`[data-cm="${action}"]`);
  const notice=$('.lm-notice'), select=$<HTMLSelectElement>('[aria-label="Custom map"]'), panel=$('.lm-details');
  const deviceInput=$<HTMLInputElement>('.lm-cm-device'), datalist=$<HTMLDataListElement>('#lm-cm-devices');
  const nameDialog=$<HTMLDialogElement>('.lm-cm-name-dialog'), nameInput=nameDialog.querySelector<HTMLInputElement>('input')!;
  const deleteDialog=$<HTMLDialogElement>('.lm-cm-delete-dialog');
  const back=$<HTMLAnchorElement>('.lm-back'), topologyLink=$<HTMLAnchorElement>('.lm-nav');
  if(root.dataset.homeUrl) back.href=root.dataset.homeUrl;
  if(root.dataset.topologyUrl){topologyLink.href=root.dataset.topologyUrl;topologyLink.hidden=false;}

  const cy:Core=cytoscape({container:$('.lm-canvas'),minZoom:0.15,maxZoom:2.5,selectionType:'single',autoungrabify:true,style:customStyles(root)});
  themeController(root,()=>cy.style(customStyles(root)));

  let store:CustomMapStore|undefined;
  try { if(root.dataset.mapsEndpoint && root.dataset.devicesEndpoint) store=httpCustomMapStore(root.dataset.mapsEndpoint,root.dataset.devicesEndpoint,root.dataset.csrf ?? ''); } catch { /* Reported below. */ }

  let maps:CustomMapSummary[]=[];
  let current:CustomMapSnapshot|undefined;
  let doc:CustomDocument=emptyDocument();
  let editing=false, dirty=false, busy=false, drawing=false;
  let drawFrom:string|undefined, selected:string|undefined;
  let nameMode:'new'|'rename'='new';
  let catalog:Device[]|undefined;
  // Live data the reader may see: from the last server response, plus catalog
  // entries and interface listings fetched while editing.
  const devices=new Map<string,Device>(), ports=new Map<string,LivePort>(), portLists=new Map<string,Promise<LivePort[]>>();
  let staleAfter=900, clockOffset=0;
  const serverNow=()=>Date.now()/1000+clockOffset;

  const message=(text:string,error=false)=>{notice.textContent=text;notice.classList.toggle('lm-error',error);};
  const owned=()=>!!current?.map.owned;

  function controls(){
    const own=owned();
    select.disabled=busy;
    button('new').disabled=busy || !store;
    for(const action of ['rename','share','delete','edit']){button(action).hidden=!own;button(action).disabled=busy;}
    button('share').setAttribute('aria-pressed',String(!!current?.map.shared));
    button('share').textContent=current?.map.shared ? 'Shared read-only' : 'Share read-only';
    button('share').classList.toggle('lm-active',!!current?.map.shared);
    button('edit').setAttribute('aria-pressed',String(editing));button('edit').classList.toggle('lm-active',editing);
    button('edit').textContent=editing ? 'Done editing' : 'Edit';
    button('save').hidden=!editing;button('discard').hidden=!editing;
    button('save').disabled=busy || !dirty;button('discard').disabled=busy || !dirty;
    $('.lm-editbar').hidden=!editing;
    button('connect').setAttribute('aria-pressed',String(drawing));button('connect').classList.toggle('lm-active',drawing);
    button('remove').disabled=busy || !selected;
    for(const action of ['add-device','add-text','add-box','connect'])button(action).disabled=busy;
    $('.lm-cm-title').textContent=current ? current.map.name : 'Custom maps';
    $('.lm-cm-meta').textContent=current ? `${current.map.owned ? 'Your map' : `Shared by ${current.map.ownerName ?? 'another user'}`} · ${current.map.shared ? 'shared read-only' : 'private'}${dirty ? ' · unsaved changes' : ''}` : '';
    cy.autoungrabify(!editing || busy);
  }

  function renderList(){
    const mine=maps.filter(m=>m.owned), shared=maps.filter(m=>!m.owned);
    const groups:HTMLElement[]=[new Option(maps.length ? 'Choose a map…' : 'No maps yet','')];
    for(const [label,entries] of [['My maps',mine],['Shared with me',shared]] as const){
      if(!entries.length)continue;
      const group=document.createElement('optgroup');group.label=label;
      group.append(...entries.map(m=>new Option(m.owned ? m.name : `${m.name} — ${m.ownerName ?? 'shared'}`,m.id)));
      groups.push(group);
    }
    select.replaceChildren(...groups);select.value=current?.map.id ?? '';
  }

  // Canvas elements are rebuilt from the document; live data only recolors them.
  const deviceData=(key:string,deviceId:string)=>{
    const live=devices.get(deviceId);
    const name=live ? deviceName(live) : `Device ${deviceId}`, status=live?.status ?? 'unknown';
    return {id:key,kind:'device',deviceId,name,label:`${name}\n${status.toUpperCase()}`,color:statusColor(status),width:206};
  };
  const linkMetric=(link:CustomLink)=>{
    const port=link.portId ? ports.get(link.portId) : undefined;
    if(!port) return undefined;
    return {port,...metric({...port,id:link.key,source:link.source,target:link.target,sourcePort:port.name,targetPort:'',sourcePortId:port.id,targetPortId:''},serverNow(),staleAfter)};
  };
  const linkData=(link:CustomLink)=>{
    const m=linkMetric(link);
    const label=[link.label,m?.label].filter(Boolean).join(' · ');
    return {id:link.key,source:link.source,target:link.target,label,color:m?.color ?? '#8a96a9',state:m?.state ?? 'drawn'};
  };
  function draw(){
    const elements:ElementDefinition[]=[
      ...doc.shapes.map(s=>({group:'nodes' as const,data:{id:s.key,kind:s.kind,label:s.text,width:s.width,height:s.height,color:'#8a96a9'},position:{x:s.x,y:s.y}})),
      ...doc.devices.map(d=>({group:'nodes' as const,data:deviceData(d.key,d.deviceId),position:{x:d.x,y:d.y}})),
      ...doc.links.map(l=>({group:'edges' as const,data:linkData(l)})),
    ];
    cy.batch(()=>{cy.elements().remove();cy.add(elements);});
    if(selected && !cy.getElementById(selected).length)selected=undefined;
    if(selected)cy.getElementById(selected).select();
    if(drawFrom)cy.getElementById(drawFrom).addClass('lm-connect-source');
    const empty=$('.lm-empty');
    empty.hidden=!!cy.elements().length;
    empty.textContent=!store ? 'Custom maps are unavailable on this page.' : !current ? (maps.length ? 'Choose a map, or create a new one.' : 'No custom maps yet. Create one with New map.')
      : owned() ? (editing ? 'Add devices, areas and text with the tools above.' : 'This map is empty. Select Edit to start drawing.') : 'This map is empty, or holds no devices you can access.';
  }
  /** Apply live data without rebuilding the canvas or the details panel (it may hold focused inputs). */
  function recolor(){
    cy.batch(()=>{for(const link of doc.links)cy.getElementById(link.key).data(linkData(link));for(const d of doc.devices)cy.getElementById(d.key).data(deviceData(d.key,d.deviceId));});
    const link=doc.links.find(l=>l.key===selected), status=panel.querySelector<HTMLElement>('[data-link-status]');
    if(link && status)status.textContent=linkMetric(link)?.label ?? 'Drawn only';
  }

  function absorbLive(snapshot:CustomMapSnapshot){
    clockOffset=Number.isFinite(snapshot.generatedAt) ? snapshot.generatedAt-Date.now()/1000 : 0;
    staleAfter=Number.isFinite(snapshot.config?.staleAfter) && snapshot.config.staleAfter>0 ? snapshot.config.staleAfter : 900;
    for(const [id,device] of Object.entries(snapshot.live.devices ?? {}))devices.set(id,device);
    for(const [id,port] of Object.entries(snapshot.live.ports ?? {}))ports.set(id,port);
    $('.lm-updated').textContent=`Live data fetched · ${new Date(snapshot.generatedAt*1000).toLocaleTimeString()}`;
  }
  /** Adopt a server copy of the map. `viewport` restores the saved zoom and pan. */
  function adopt(snapshot:CustomMapSnapshot,viewport:boolean){
    const {document:saved,...summary}=snapshot.map;
    current=snapshot;doc=normalizeDocument(saved);dirty=false;drawFrom=undefined;
    maps=[summary,...maps.filter(m=>m.id!==summary.id)].sort((a,b)=>a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
    if(!summary.owned)editing=false;
    absorbLive(snapshot);draw();
    if(viewport){
      const untouched=doc.zoom===1 && doc.pan.x===0 && doc.pan.y===0;
      if(untouched && cy.elements().length)cy.fit(cy.elements(),70);else cy.viewport({zoom:doc.zoom,pan:doc.pan});
    }
    renderList();renderDetails();controls();
  }
  function close(){
    current=undefined;doc=emptyDocument();dirty=false;editing=false;drawing=false;drawFrom=undefined;selected=undefined;
    history.replaceState(null,'',mapUrl());draw();renderList();renderDetails();controls();
  }
  function changed(){dirty=true;controls();}

  function mapUrl(id?:string){const url=new URL(location.href);if(id)url.searchParams.set('map',id);else url.searchParams.delete('map');return url.href;}
  const confirmDiscard=()=>!dirty || window.confirm('Discard unsaved changes to this map?');

  function failure(error:unknown){
    message(error instanceof Error ? error.message : 'Custom maps are unavailable.',true);
    // The map was deleted, unshared, or access was lost: do not keep showing it.
    if(error instanceof CustomMapError && [401,403,404,419].includes(error.status) && current && !dirty){
      maps=maps.filter(m=>m.id!==current!.map.id);close();
    }
  }
  async function run<T>(task:()=>Promise<T>):Promise<T|undefined>{
    if(busy)return undefined;
    busy=true;controls();
    try{return await task();}
    catch(error){failure(error);return undefined;}
    finally{busy=false;controls();}
  }

  async function open(id:string){
    if(!store)return;
    if(!confirmDiscard()){select.value=current?.map.id ?? '';return;}
    if(!id){close();message('Choose a map, or create a new one.');return;}
    editing=false;drawing=false;selected=undefined;
    const snapshot=await run(()=>store!.load(id));
    if(!snapshot){select.value=current?.map.id ?? '';return;}
    adopt(snapshot,true);history.replaceState(null,'',mapUrl(id));
    message(snapshot.map.owned ? `Opened “${snapshot.map.name}”.` : `Opened “${snapshot.map.name}”, shared read-only by ${snapshot.map.ownerName ?? 'another user'}.`);
  }
  async function save(meta:{name?:string;shared?:boolean}={}){
    if(!store || !current?.map.owned)return false;
    doc.zoom=Math.min(2.5,Math.max(0.15,cy.zoom()));doc.pan={...cy.pan()};
    const map=current.map;
    const snapshot=await run(()=>store!.update(map,meta.name ?? map.name,meta.shared ?? map.shared,doc));
    if(!snapshot)return false;
    adopt(snapshot,false);message(`Saved “${snapshot.map.name}”.`);
    return true;
  }
  async function loadCatalog(){
    if(catalog || !store)return;
    const list=await run(()=>store!.devices());
    if(!list)return;
    catalog=[...list].sort((a,b)=>deviceName(a).localeCompare(deviceName(b),undefined,{numeric:true}));
    for(const device of catalog)if(!devices.has(device.id))devices.set(device.id,device);
    datalist.replaceChildren(...catalog.map(device=>new Option(`${deviceName(device)} (#${device.id})`)));
  }
  const portsOf=(deviceId:string)=>{
    let list=portLists.get(deviceId);
    if(!list){list=store!.ports(deviceId);portLists.set(deviceId,list);list.catch(()=>portLists.delete(deviceId));}
    return list;
  };
  /** New elements fill a card-sized grid around the view's centre instead of stacking. */
  function center(index:number):Position{
    const box=cy.extent(), column=index%4, row=Math.floor(index/4)%6;
    return {x:(box.x1+box.x2)/2+(column-1.5)*240,y:(box.y1+box.y2)/2+(row-1)*110};
  }
  function choose(key:string|undefined){
    selected=key;cy.elements().unselect();if(key)cy.getElementById(key).select();renderDetails();controls();
  }

  // ---- Details panel ------------------------------------------------------
  const el=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,className?:string)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;};
  function list(rows:[string,string][]){const dl=el('dl');for(const [label,value] of rows)dl.append(el('dt',label),el('dd',value));return dl;}
  function field(label:string,control:HTMLElement){const wrap=el('label',undefined,'lm-cm-field');wrap.append(el('span',label),control);return wrap;}
  function closeButton(){const b=el('button','×','lm-close');b.setAttribute('aria-label','Close details');b.onclick=()=>choose(undefined);return b;}
  function removeButton(){
    const b=el('button','Remove from map','lm-cm-remove');b.onclick=()=>{if(selected && removeElement(doc,selected)){selected=undefined;draw();renderDetails();changed();}};return b;
  }

  function renderDetails(){
    panel.replaceChildren();
    if(!current){
      panel.append(el('div','CUSTOM MAPS','lm-eyebrow'),el('h2','Draw your own map'),
        el('p','Create a map, place the devices you care about, mark areas and add notes, then draw lines between devices. Bind a line to an interface to show its live load and status.'),
        el('p','Share a map read-only with every LibreNMS user. Each reader sees only the devices and interfaces they are allowed to see.','lm-hint'));
      return;
    }
    const element=selected ? cy.getElementById(selected) : undefined;
    if(!element?.length){
      const map=current.map;
      panel.append(el('div','MAP','lm-eyebrow'),el('h2',map.name),list([
        ['Owner',map.owned ? 'You' : map.ownerName ?? 'Another user'],['Visibility',map.shared ? 'Shared read-only with all users' : 'Private'],
        ['Devices',String(doc.devices.length)],['Lines',String(doc.links.length)],['Last saved',new Date(map.updatedAt).toLocaleString()],
      ]));
      if(map.shared)panel.append(el('p','Anyone signed in to LibreNMS can open this map from Custom maps, or with this page’s address. Devices they cannot access are hidden from them.','lm-hint'));
      else if(map.owned && !editing)panel.append(el('p','Select Edit to add devices, areas, text and lines. Drag to arrange, then Save.','lm-hint'));
      return;
    }
    panel.append(closeButton());
    const kind=element.data('kind') as string|undefined;
    if(element.isNode() && kind==='device')return deviceDetails(element.data('deviceId') as string);
    if(element.isNode())return shapeDetails(element.id());
    linkDetails(element.id());
  }
  function deviceDetails(deviceId:string){
    const live=devices.get(deviceId);
    const name=live ? deviceName(live) : `Device ${deviceId}`;
    panel.append(el('div','DEVICE','lm-eyebrow'),el('h2',name),list([['Status',live?.status ?? 'unknown'],...(live && live.hostname!==name ? [['Hostname',live.hostname] as [string,string]] : []),['Lines on this map',String(doc.links.filter(l=>l.source===selected || l.target===selected).length)]]));
    if(live?.url){const url=new URL(live.url,location.href);if(url.origin===location.origin){const a=el('a','Open in LibreNMS ↗','lm-device-link');a.href=url.href;panel.append(a);}}
    if(editing)panel.append(removeButton());
  }
  function shapeDetails(key:string){
    const shape=doc.shapes.find(s=>s.key===key);
    if(!shape)return;
    panel.append(el('div',shape.kind==='box' ? 'AREA' : 'TEXT','lm-eyebrow'));
    if(!editing){panel.append(el('h2',shape.text || (shape.kind==='box' ? 'Unnamed area' : 'Empty text')));return;}
    const text=el('textarea');text.value=shape.text;text.rows=3;text.setAttribute('aria-label',shape.kind==='box' ? 'Area label' : 'Text');
    text.oninput=()=>{shape.text=clip(text.value,CUSTOM_LIMITS.text);if(text.value!==shape.text)text.value=shape.text;cy.getElementById(key).data('label',shape.text);changed();};
    panel.append(field(shape.kind==='box' ? 'Label' : 'Text',text));
    for(const dimension of ['width','height'] as const){
      const input=el('input');input.type='number';input.min=String(SHAPE_MIN);input.max=String(SHAPE_MAX);input.step='10';input.value=String(shape[dimension]);input.setAttribute('aria-label',dimension==='width' ? 'Width' : 'Height');
      input.onchange=()=>{shape[dimension]=clampSize(Number(input.value));input.value=String(shape[dimension]);cy.getElementById(key).data(dimension,shape[dimension]);changed();};
      panel.append(field(dimension==='width' ? 'Width' : 'Height',input));
    }
    panel.append(removeButton());
  }
  function linkDetails(key:string){
    const link=doc.links.find(l=>l.key===key);
    if(!link)return;
    const end=(nodeKey:string)=>{const d=doc.devices.find(device=>device.key===nodeKey);return d ? {deviceId:d.deviceId,name:deviceData(nodeKey,d.deviceId).name} : undefined;};
    const source=end(link.source), target=end(link.target);
    panel.append(el('div','DRAWN LINE','lm-eyebrow'),el('h2',`${source?.name ?? '?'} ↔ ${target?.name ?? '?'}`));
    const m=linkMetric(link);
    const status=el('dd',m ? m.label : 'Drawn only');status.dataset.linkStatus='true';
    const rows=list(m ? [['Interface',`${devices.get(m.port.deviceId) ? deviceName(devices.get(m.port.deviceId)!) : ''} ${m.port.name}`.trim()],['Capacity',rate(m.port.speedBps)],['Inbound',rate(m.port.inBps)],['Outbound',rate(m.port.outBps)],['Sample time',m.port.sampledAt ? new Date(m.port.sampledAt*1000).toLocaleString() : 'Unavailable']] : []);
    rows.prepend(el('dt','Status'),status);
    if(!editing){if(link.label)panel.append(el('p',link.label));panel.append(rows);return;}
    const label=el('input');label.value=link.label;label.setAttribute('aria-label','Line label');label.autocomplete='off';
    label.oninput=()=>{link.label=clip(label.value,CUSTOM_LIMITS.label);if(label.value!==link.label)label.value=link.label;cy.getElementById(key).data(linkData(link));changed();};
    panel.append(field('Label',label));
    const binding=el('select');binding.setAttribute('aria-label','Interface');binding.disabled=true;
    binding.append(new Option('Loading interfaces…',link.portId ?? ''));
    panel.append(field('Interface for live load',binding),rows,removeButton());
    void Promise.all([source,target].map(e=>e ? portsOf(e.deviceId).then(list=>({e,list})) : Promise.resolve(undefined))).then(results=>{
      if(selected!==key || !binding.isConnected)return;
      const groups:HTMLElement[]=[new Option('None — drawn only','')];
      for(const result of results){
        if(!result)continue;
        for(const port of result.list)ports.set(port.id,port);
        const group=document.createElement('optgroup');group.label=result.e.name;
        group.append(...result.list.map(port=>new Option(port.name,port.id)));
        groups.push(group);
      }
      binding.replaceChildren(...groups);binding.value=link.portId ?? '';binding.disabled=false;
    // An interface listing failure concerns one device, never the map itself.
    }).catch(error=>{if(binding.isConnected)binding.replaceChildren(new Option('Interfaces unavailable',''));message(error instanceof Error ? error.message : 'Interfaces unavailable.',true);});
    binding.onchange=()=>{link.portId=binding.value || null;cy.getElementById(key).data(linkData(link));changed();renderDetails();};
  }

  // ---- Canvas interaction -------------------------------------------------
  cy.on('tap','node',event=>{
    const node=event.target;
    if(editing && drawing && node.data('kind')==='device'){
      if(!drawFrom){drawFrom=node.id();node.addClass('lm-connect-source');message('Now select the device at the other end.');return;}
      const from=drawFrom;drawFrom=undefined;cy.nodes().removeClass('lm-connect-source');
      if(from===node.id()){message('Line cancelled.');return;}
      const result=connect(doc,from,node.id());
      if(typeof result==='string'){message(result,true);return;}
      draw();choose(result.key);changed();message('Line drawn. Select another device to draw the next line, or bind this one to an interface.');
      return;
    }
    choose(node.id());
  });
  cy.on('tap','edge',event=>choose(event.target.id()));
  cy.on('tap',event=>{if(event.target===cy){if(drawFrom){drawFrom=undefined;cy.nodes().removeClass('lm-connect-source');}choose(undefined);}});
  cy.on('dragfree','node',event=>{
    if(!editing)return;
    const {x,y}=event.target.position(), key=event.target.id();
    const item=doc.devices.find(d=>d.key===key) ?? doc.shapes.find(s=>s.key===key);
    if(item){item.x=x;item.y=y;changed();}
  });
  cy.on('zoom',()=>cy.edges().toggleClass('lm-no-label',cy.zoom()<0.45));

  // ---- Toolbar ------------------------------------------------------------
  select.addEventListener('change',()=>void open(select.value));
  function askName(mode:'new'|'rename'){
    nameMode=mode;nameDialog.querySelector('h2')!.textContent=mode==='new' ? 'New map' : 'Rename map';
    nameInput.value=mode==='rename' ? current?.map.name ?? '' : '';nameInput.setCustomValidity('');
    nameDialog.showModal();nameInput.focus();
  }
  nameInput.oninput=()=>nameInput.setCustomValidity(textLength(nameInput.value.trim())>NAME_MAX ? `Use at most ${NAME_MAX} characters.` : '');
  nameDialog.querySelector('form')!.onsubmit=async event=>{
    event.preventDefault();
    const name=nameInput.value.trim();
    if(!name || textLength(name)>NAME_MAX){nameInput.setCustomValidity(!name ? 'Enter a map name.' : `Use at most ${NAME_MAX} characters.`);nameInput.reportValidity();return;}
    nameDialog.close();
    if(nameMode==='rename'){await save({name});return;}
    if(!store || !confirmDiscard())return;
    const snapshot=await run(()=>store!.create(name,false,emptyDocument()));
    if(!snapshot)return;
    selected=undefined;editing=true;adopt(snapshot,true);history.replaceState(null,'',mapUrl(snapshot.map.id));
    message(`Created “${snapshot.map.name}”. Add devices, areas and text, then Save.`);
    void loadCatalog();
  };
  root.addEventListener('click',event=>{
    const action=(event.target as HTMLElement).closest<HTMLElement>('[data-cm]')?.dataset.cm;
    switch(action){
      case 'new':askName('new');break;
      case 'rename':askName('rename');break;
      case 'cancel-name':nameDialog.close();break;
      case 'share':
        if(current)void save({shared:!current.map.shared}).then(ok=>{if(ok)message(current?.map.shared ? 'Shared read-only with all LibreNMS users.' : 'This map is private again.');});
        break;
      case 'delete':
        if(current){deleteDialog.querySelector('p')!.textContent=`“${current.map.name}” will be deleted for you${current.map.shared ? ' and everyone it is shared with' : ''}.`;deleteDialog.showModal();}
        break;
      case 'cancel-delete':deleteDialog.close();break;
      case 'confirm-delete':deleteDialog.close();void removeMap();break;
      case 'edit':void toggleEditing();break;
      case 'save':void save();break;
      case 'discard':
        if(current && window.confirm('Discard unsaved changes to this map?')){doc=normalizeDocument(current.map.document);dirty=false;drawFrom=undefined;draw();renderDetails();controls();message('Changes discarded.');}
        break;
      case 'add-device':{
        const id=/#([1-9]\d{0,9})\)$/.exec(deviceInput.value.trim())?.[1] ?? (catalog?.some(d=>d.id===deviceInput.value.trim()) ? deviceInput.value.trim() : '');
        const result=addDevice(doc,id,center(doc.devices.length));
        if(typeof result==='string'){message(result,true);break;}
        deviceInput.value='';draw();choose(result.key);changed();message('Device added. Drag it into place.');
        break;
      }
      case 'add-text':case 'add-box':{
        const result=addShape(doc,action==='add-text' ? 'text' : 'box',center(doc.shapes.length));
        if(typeof result==='string'){message(result,true);break;}
        draw();choose(result.key);changed();
        break;
      }
      case 'connect':
        drawing=!drawing;drawFrom=undefined;cy.nodes().removeClass('lm-connect-source');controls();
        message(drawing ? 'Select the device where the line starts.' : 'Finished drawing lines.');
        break;
      case 'remove':if(selected && removeElement(doc,selected)){selected=undefined;draw();renderDetails();changed();}break;
      case 'zoom-in':cy.zoom({level:cy.zoom()*1.2,renderedPosition:{x:cy.width()/2,y:cy.height()/2}});break;
      case 'zoom-out':cy.zoom({level:cy.zoom()/1.2,renderedPosition:{x:cy.width()/2,y:cy.height()/2}});break;
      case 'fit':if(cy.elements().length)cy.fit(cy.elements(),70);break;
    }
  });
  deviceInput.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();button('add-device').click();}});
  async function removeMap(){
    const map=current?.map;
    if(!map || !store)return;
    const done=await run(async()=>{await store!.remove(map);return true;});
    if(!done)return;
    maps=maps.filter(m=>m.id!==map.id);close();message(`Deleted “${map.name}”.`);
  }
  /** Leaving edit mode saves pending changes; nothing is discarded without asking. */
  async function toggleEditing(){
    if(!editing){editing=true;controls();renderDetails();draw();void loadCatalog();return;}
    if(dirty && !await save())return;
    editing=false;drawing=false;drawFrom=undefined;cy.nodes().removeClass('lm-connect-source');
    draw();renderDetails();controls();
  }
  document.addEventListener('keydown',event=>{
    const target=event.target as HTMLElement;
    if(!editing || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable || root.querySelector('dialog[open]'))return;
    if(event.key==='Escape' && (drawFrom || drawing)){drawing=false;drawFrom=undefined;cy.nodes().removeClass('lm-connect-source');controls();message('Finished drawing lines.');}
    if(event.key==='Delete' && selected && removeElement(doc,selected)){event.preventDefault();selected=undefined;draw();renderDetails();changed();}
  });
  window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});

  // ---- Live refresh -------------------------------------------------------
  async function refresh(){
    if(!store || !current || busy || document.hidden)return;
    const id=current.map.id;
    try{
      const snapshot=await store.load(id);
      if(current?.map.id!==id || busy)return;
      // Never replace edits in progress; another session's save surfaces as a 409 on Save.
      if(editing || dirty){absorbLive(snapshot);recolor();return;}
      const keep={zoom:cy.zoom(),pan:{...cy.pan()}};adopt(snapshot,false);cy.viewport(keep);
    }catch(error){
      if(current?.map.id===id && error instanceof CustomMapError && [401,403,404,419].includes(error.status))failure(error);
      else message(`${error instanceof Error ? error.message : 'Live data unavailable.'} · Showing the last data received.`,true);
    }
  }
  setInterval(()=>void refresh(),60000);
  // Re-judge staleness between fetches on the server's clock.
  setInterval(()=>{if(current)recolor();},10000);
  new ResizeObserver(()=>cy.resize()).observe($('.lm-canvas'));

  // Read-only diagnostic hook for browser checks with test fixtures that opt in
  // with data-debug. The plugin's own page never sets it.
  if(root.dataset.debug==='true') Object.defineProperty(window,'libremapCustomDebug',{value:()=>({
    nodes:cy.nodes().map(n=>({key:n.id(),kind:n.data('kind') as string,label:n.data('label') as string,position:n.position(),renderedPosition:n.renderedPosition()})),
    edges:cy.edges().map(e=>({key:e.id(),label:e.data('label') as string,state:e.data('state') as string,lineStyle:e.style('line-style') as string,midpoint:e.renderedMidpoint()})),
    grabbable:cy.nodes().every(n=>n.grabbable()),
  }),configurable:true});

  // ---- Start --------------------------------------------------------------
  draw();renderList();renderDetails();controls();
  if(!store){message('Custom maps are unavailable on this page.',true);return;}
  void (async()=>{
    const list=await run(()=>store!.list());
    if(!list)return;
    maps=list;renderList();
    const requested=new URL(location.href).searchParams.get('map');
    if(requested && /^[0-9a-f-]{36}$/i.test(requested))await open(requested);
    else{draw();message(maps.length ? 'Choose a map, or create a new one.' : 'No custom maps yet. Create one with New map.');}
  })();
}
