import { statusColor, themeController } from './canvas-style';
import { shortcutAllowed } from './canvas-tools';
import { clampCenter, fitView, project, TILE, tileUrl, worldSize, type Point } from './geo';
import { mountPageNav } from './page-nav';
import { deviceName, LOAD_COLORS, metric, topology } from './topology';
import { limitFilter } from './view-limits';
import type { Link, MapNode, Snapshot, Topology } from './types';
import './style.css';
import './views.css';
import './world-map.css';

interface WorldLocation { id:string; name:string; lat:number; lng:number }
interface MapConfig { tiles:string|null; attribution:string; maxZoom:number; center:{lat:number;lng:number;zoom:number} }
interface Locations { locations:WorldLocation[]; devices:Record<string,string>; map:MapConfig }
interface Site extends WorldLocation { nodes:MapNode[]; status:'up'|'down'|'unknown' }
interface SiteLink { key:string; a:Site; b:Site; links:Link[]; color:string; state:string; label:string }
type Selection={type:'site'|'device'|'link';id:string};

const SVG='http://www.w3.org/2000/svg';
// Marker names show once a map is zoomed in far enough to have room for them.
const LABEL_ZOOM=7, FIT_PADDING=70, SINGLE_SITE_ZOOM=12, TILE_FAILURE_NOTICE=6;
// Signed out, forbidden, session expired, or the plugin was disabled.
const ACCESS_LOST=new Set([401,403,404,419]);
class HttpError extends Error { constructor(message:string,public status:number){super(message);} }
const object=(value:unknown):value is Record<string,unknown> => !!value && typeof value==='object' && !Array.isArray(value);

/**
 * Devices placed at their LibreNMS location's coordinates on a tiled world
 * map, with the discovered links between locations. Locations come from the
 * server already filtered by the user's device permissions.
 */
export function mountWorldMap(root:HTMLElement) {
  root.innerHTML=`
    <div class="lm-shell lm-world-page">
      <header class="lm-header"><div class="lm-brand"><span class="lm-logo">◈</span><div><strong>LibreMap</strong><span>WORLD MAP</span></div></div><div class="lm-header-right"><nav class="lm-pages" aria-label="LibreMap pages" hidden></nav><a class="lm-back" href="/">LibreNMS ↗</a></div></header>
      <section class="lm-heading"><div><div class="lm-eyebrow">INFRASTRUCTURE / GEOGRAPHY</div></div><div class="lm-summary" aria-label="Location summary"></div></section>
      <div class="lm-toolbar"><label class="lm-search"><span>⌕</span><input type="search" aria-label="Find device" placeholder="Find a device or location…"></label><label class="lm-select">Device group <select aria-label="Device group"><option value="">All device groups</option></select></label><button data-world="problems" aria-pressed="false">Only problems</button><button data-world="links" aria-pressed="true" class="lm-active">Links</button><span class="lm-spacer"></span><button data-world="refresh">↻ Refresh</button><button data-world="fullscreen" title="Fullscreen">⛶</button></div>
      <div class="lm-notice" role="status" aria-live="polite">Loading device locations…</div>
      <main class="lm-workspace"><div class="lm-canvas-wrap lm-world-wrap">
        <div class="lm-world" tabindex="0" aria-label="World map of device locations. Drag to pan, scroll to zoom."><div class="lm-world-tiles"></div><svg class="lm-world-links"></svg><div class="lm-world-markers"></div></div>
        <div class="lm-empty" hidden></div>
        <div class="lm-map-controls"><button data-world="zoom-in" aria-label="Zoom in">+</button><button data-world="zoom-out" aria-label="Zoom out">−</button><button data-world="fit">Fit</button></div>
        <div class="lm-legend"><span><i class="lm-world-key" style="background:${statusColor('up')}"></i>Up</span><span><i class="lm-world-key" style="background:${statusColor('down')}"></i>Down</span><span><i class="lm-world-key" style="background:${statusColor('unknown')}"></i>Unknown</span><span><i style="color:${LOAD_COLORS.normal}"></i>&lt;50%</span><span><i style="color:${LOAD_COLORS.warning}"></i>50–70%</span><span><i style="color:${LOAD_COLORS.high}"></i>&gt;70%</span><span><i class="lm-dashed" style="color:#e05b65"></i>Link down</span></div>
        <div class="lm-world-attribution" hidden></div>
      </div><aside class="lm-details" aria-label="Selection details"></aside></main>
      <footer><span class="lm-updated">Waiting for data</span><span>Drag to pan · Scroll or double-click to zoom · Click a location to inspect · Keys: / find · F fit · + − zoom · arrows pan · D next problem · Esc clear</span></footer>
    </div>`;
  const $=<T extends Element>(selector:string)=>root.querySelector<T>(selector)!;
  const notice=$<HTMLElement>('.lm-notice'), panel=$<HTMLElement>('.lm-details'), empty=$<HTMLElement>('.lm-empty');
  const viewport=$<HTMLElement>('.lm-world'), tilesEl=$<HTMLElement>('.lm-world-tiles'), svg=$<SVGSVGElement>('.lm-world-links'), markersEl=$<HTMLElement>('.lm-world-markers');
  const search=$<HTMLInputElement>('[aria-label="Find device"]'), groupSelect=$<HTMLSelectElement>('[aria-label="Device group"]');
  const button=(action:string)=>$<HTMLButtonElement>(`[data-world="${action}"]`);
  if(root.dataset.homeUrl) $<HTMLAnchorElement>('.lm-back').href=root.dataset.homeUrl;
  mountPageNav($('.lm-pages'),root,'world');
  themeController(root,()=>{});

  let snapshot:Snapshot|undefined, graph:Topology={nodes:[],links:[],deviceGroups:[]}, places:Locations|undefined;
  let sites:Site[]=[], siteLinks:SiteLink[]=[], unlocated:MapNode[]=[];
  let view={zoom:2,center:{x:worldSize(2)/2,y:worldSize(2)/2}};
  let selected:Selection|undefined, problemsOnly=false, showLinks=true, busy=false, fitted=false, downCursor=-1, tileFailures=0;
  let clockOffset=0;
  const serverNow=()=>Date.now()/1000+clockOffset;
  const message=(text:string,error=false)=>{notice.textContent=text;notice.classList.toggle('lm-error',error);};
  const nameOf=(node:MapNode)=>deviceName(node);
  const siteName=(site:Site)=>site.name.trim() || 'Unnamed location';

  // ---- Data ---------------------------------------------------------------
  async function getJson(endpoint:string|undefined,what:string):Promise<unknown> {
    if(!endpoint) throw new Error(`Missing ${what} endpoint.`);
    const url=new URL(endpoint,location.href);
    if(url.origin!==location.origin) throw new Error(`The ${what} endpoint must use the same origin.`);
    const response=await fetch(url,{credentials:'same-origin',headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});
    if(!response.ok) {
      let reason=`LibreNMS returned HTTP ${response.status}`;
      if(response.status===422){const body:unknown=await response.json().catch(()=>undefined);if(object(body) && typeof body.message==='string' && body.message.length<=300)reason=body.message;}
      if(response.status===429)reason='Too many requests. The map will retry on the next refresh.';
      throw new HttpError(reason,response.status);
    }
    return response.json();
  }
  function parseLocations(value:unknown):Locations {
    if(!object(value) || !Array.isArray(value.locations) || !object(value.devices)) throw new Error('Unexpected locations response.');
    const locations=value.locations.filter((l):l is WorldLocation=>object(l) && typeof l.id==='string' && typeof l.name==='string'
      && typeof l.lat==='number' && typeof l.lng==='number' && Math.abs(l.lat)<=90 && Math.abs(l.lng)<=180);
    const devices:Record<string,string>={};
    for(const [id,locationId] of Object.entries(value.devices)) if(typeof locationId==='string') devices[id]=locationId;
    const map=object(value.map) ? value.map : {};
    const center=object(map.center) ? map.center : {};
    const number=(n:unknown,fallback:number)=>typeof n==='number' && Number.isFinite(n) ? n : fallback;
    return {locations,devices,map:{
      tiles:typeof map.tiles==='string' && map.tiles ? map.tiles : null,
      attribution:typeof map.attribution==='string' ? map.attribution : '',
      maxZoom:Math.max(1,Math.min(19,Math.round(number(map.maxZoom,18)))),
      center:{lat:number(center.lat,0),lng:number(center.lng,0),zoom:Math.max(1,Math.min(18,Math.round(number(center.zoom,2))))},
    }};
  }

  /** Group the visible devices by location and join them with discovered links. */
  function rebuild(){
    const query=search.value.trim().toLowerCase();
    const group=graph.deviceGroups.find(g=>g.id===groupSelect.value);
    const members=group ? new Set(group.deviceIds) : undefined;
    const byId=new Map((places?.locations ?? []).map(l=>[l.id,l]));
    const locationOf=(id:string)=>{const locationId=places?.devices[id];return locationId ? byId.get(locationId) : undefined;};
    const visible=graph.nodes.filter(n=>{
      if(members && !members.has(n.id)) return false;
      if(problemsOnly && n.status!=='down') return false;
      return !query || [nameOf(n),n.hostname,n.sysName ?? '',locationOf(n.id)?.name ?? ''].some(text=>text.toLowerCase().includes(query));
    });
    const bySite=new Map<string,Site>(), siteOf=new Map<string,Site>();
    unlocated=[];
    for(const node of visible){
      const place=locationOf(node.id);
      if(!place){unlocated.push(node);continue;}
      let site=bySite.get(place.id);
      if(!site){site={...place,nodes:[],status:'up'};bySite.set(place.id,site);}
      site.nodes.push(node);siteOf.set(node.id,site);
    }
    sites=[...bySite.values()];
    for(const site of sites){
      site.nodes.sort((a,b)=>nameOf(a).localeCompare(nameOf(b),undefined,{numeric:true}));
      site.status=site.nodes.some(n=>n.status==='down') ? 'down' : site.nodes.every(n=>n.status==='up') ? 'up' : 'unknown';
    }
    // Draw problem locations last, so they sit on top of healthy neighbours.
    sites.sort((a,b)=>Number(a.status==='down')-Number(b.status==='down') || a.id.localeCompare(b.id));
    const pairs=new Map<string,SiteLink>();
    for(const link of graph.links){
      const a=siteOf.get(link.source), b=siteOf.get(link.target);
      if(!a || !b || a===b) continue;
      const [first,second]=a.id<b.id ? [a,b] : [b,a], key=`${first.id}|${second.id}`;
      const pair=pairs.get(key) ?? {key,a:first,b:second,links:[],color:'',state:'',label:''};
      pair.links.push(link);pairs.set(key,pair);
    }
    siteLinks=[...pairs.values()];
    judgeLinks();
    if(selected?.type==='site' && !bySite.has(selected.id)) selected=undefined;
    if(selected?.type==='device' && !siteOf.has(selected.id)) selected=undefined;
    if(selected?.type==='link' && !pairs.has(selected.id)) selected=undefined;
    buildMarkers();buildLinks();renderSummary();renderDetails();
    empty.hidden=sites.length>0;
    empty.textContent=!snapshot ? 'Device locations unavailable. Use Refresh to retry.'
      : !(places?.locations.length) ? 'No devices have map coordinates yet. Give devices a LibreNMS location with coordinates to place them here.'
      : 'No located devices match these filters.';
    render();
  }

  /** A connection between locations takes the colour of its worst state, else its busiest link. */
  function judgeLinks(){
    const now=serverNow(), staleAfter=snapshot?.config.staleAfter ?? 900;
    for(const pair of siteLinks){
      const metrics=pair.links.map(link=>metric(link,now,staleAfter));
      const down=metrics.filter(m=>m.state==='down').length;
      const busiest=metrics.filter(m=>m.state==='up' && m.utilization!==null).sort((x,y)=>y.utilization!-x.utilization!)[0];
      if(down){pair.color='#e05b65';pair.state='down';pair.label=`${down} of ${pair.links.length} down`;}
      else if(busiest){pair.color=busiest.color;pair.state='up';pair.label=`busiest ${busiest.label}`;}
      else{pair.color='#8a96a9';pair.state='unknown';pair.label='load unknown';}
    }
  }
  /** Re-judge staleness in place, without rebuilding (and unfocusing) the map. */
  function recolorLinks(){
    judgeLinks();
    for(const pair of siteLinks){
      const pairLines=lines.get(pair.key);
      if(!pairLines) continue;
      pairLines[1].setAttribute('stroke',pair.color);
      if(pair.state==='up') pairLines[1].removeAttribute('stroke-dasharray'); else pairLines[1].setAttribute('stroke-dasharray','7 5');
      const title=pairLines[1].parentElement?.querySelector('title');
      if(title) title.textContent=`${siteName(pair.a)} ↔ ${siteName(pair.b)} · ${pair.links.length} link${pair.links.length===1 ? '' : 's'} · ${pair.label}`;
    }
  }

  // ---- View ---------------------------------------------------------------
  const size=()=>({w:viewport.clientWidth,h:viewport.clientHeight});
  /** Viewport pixels of a world point, using the copy of the globe nearest the centre. */
  function screen(p:Point):Point {
    const {w,h}=size(), world=worldSize(view.zoom);
    let dx=p.x-view.center.x;
    if(dx>world/2) dx-=world; else if(dx<-world/2) dx+=world;
    return {x:w/2+dx,y:h/2+p.y-view.center.y};
  }
  const tiles=new Map<string,HTMLImageElement>();
  function renderTiles(){
    const template=places?.map.tiles;
    if(!template){if(tiles.size){tilesEl.replaceChildren();tiles.clear();}return;}
    const {w,h}=size(), zoom=view.zoom, count=2**zoom;
    const left=view.center.x-w/2, top=view.center.y-h/2;
    const needed=new Set<string>();
    for(let ty=Math.max(0,Math.floor(top/TILE));ty<=Math.min(count-1,Math.floor((top+h)/TILE));ty++){
      for(let tx=Math.floor(left/TILE);tx<=Math.floor((left+w)/TILE);tx++){
        const key=`${zoom}/${tx}/${ty}`;needed.add(key);
        let image=tiles.get(key);
        if(!image){
          const src=tileUrl(template,zoom,tx,ty);
          if(!src) continue;
          image=new Image(TILE,TILE);image.alt='';image.decoding='async';image.draggable=false;
          image.onerror=()=>{image!.classList.add('lm-tile-failed');if(++tileFailures===TILE_FAILURE_NOTICE)message('Map tiles could not be loaded. Device locations are still shown.',true);};
          image.src=src;tiles.set(key,image);tilesEl.append(image);
        }
        image.style.transform=`translate(${Math.round(tx*TILE-left)}px,${Math.round(ty*TILE-top)}px)`;
      }
    }
    for(const [key,image] of tiles) if(!needed.has(key)){image.remove();tiles.delete(key);}
  }
  const markers=new Map<string,HTMLButtonElement>();
  function buildMarkers(){
    markers.clear();
    markersEl.replaceChildren(...sites.map(site=>{
      const count=site.nodes.length, down=site.nodes.filter(n=>n.status==='down').length;
      const marker=document.createElement('button');
      marker.type='button';marker.className=`lm-world-marker lm-world-${site.status}`;marker.dataset.site=site.id;
      marker.setAttribute('aria-label',`${siteName(site)}: ${count} device${count===1 ? '' : 's'}${down ? `, ${down} down` : ''}`);
      marker.style.setProperty('--marker',`${Math.round(Math.min(36,14+Math.sqrt(count)*4))}px`);
      const dot=document.createElement('span');dot.className='lm-world-dot';dot.textContent=count>1 ? String(count) : '';
      const label=document.createElement('span');label.className='lm-world-label';label.textContent=siteName(site);
      marker.append(dot,label);markers.set(site.id,marker);
      return marker;
    }));
  }
  const lines=new Map<string,SVGLineElement[]>();
  function buildLinks(){
    lines.clear();svg.replaceChildren();
    if(!showLinks) return;
    for(const pair of siteLinks){
      const g=document.createElementNS(SVG,'g');
      g.classList.add('lm-world-link');g.dataset.link=pair.key;g.setAttribute('tabindex','0');g.setAttribute('role','button');
      g.setAttribute('aria-label',`${siteName(pair.a)} to ${siteName(pair.b)}: ${pair.links.length} link${pair.links.length===1 ? '' : 's'}, ${pair.label}`);
      const title=document.createElementNS(SVG,'title');title.textContent=`${siteName(pair.a)} ↔ ${siteName(pair.b)} · ${pair.links.length} link${pair.links.length===1 ? '' : 's'} · ${pair.label}`;
      const hit=document.createElementNS(SVG,'line');hit.classList.add('lm-world-hit');
      const line=document.createElementNS(SVG,'line');line.classList.add('lm-world-line');
      line.setAttribute('stroke',pair.color);line.setAttribute('stroke-width',String(Math.min(7,2+Math.log2(pair.links.length))));
      if(pair.state!=='up') line.setAttribute('stroke-dasharray','7 5');
      g.append(title,hit,line);svg.append(g);lines.set(pair.key,[hit,line]);
    }
  }
  let frame=0;
  function render(){
    cancelAnimationFrame(frame);frame=0;
    const {w,h}=size();
    renderTiles();
    for(const site of sites){
      const marker=markers.get(site.id);
      if(!marker) continue;
      const p=screen(project(site,view.zoom));
      const outside=p.x<-60 || p.y<-60 || p.x>w+60 || p.y>h+60;
      marker.style.display=outside ? 'none' : '';
      if(!outside) marker.style.transform=`translate(${p.x}px,${p.y}px) translate(-50%,-50%)`;
      marker.classList.toggle('lm-selected',selected?.type==='site' && selected.id===site.id || selected?.type==='device' && site.nodes.some(n=>n.id===selected!.id));
    }
    markersEl.classList.toggle('lm-world-named',view.zoom>=LABEL_ZOOM);
    const world=worldSize(view.zoom);
    for(const pair of siteLinks){
      const pairLines=lines.get(pair.key);
      if(!pairLines) continue;
      const a=screen(project(pair.a,view.zoom)), b=screen(project(pair.b,view.zoom));
      // Draw the short way round, even across the date line.
      if(b.x-a.x>world/2) b.x-=world; else if(a.x-b.x>world/2) b.x+=world;
      for(const line of pairLines){line.setAttribute('x1',String(a.x));line.setAttribute('y1',String(a.y));line.setAttribute('x2',String(b.x));line.setAttribute('y2',String(b.y));}
      pairLines[1].classList.toggle('lm-selected',selected?.type==='link' && selected.id===pair.key);
    }
  }
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(render);};
  function setView(zoom:number,center:Point){
    const max=places?.map.maxZoom ?? 18;
    zoom=Math.max(1,Math.min(max,Math.round(zoom)));
    view={zoom,center:clampCenter(center,zoom,size().h)};
    syncControls();schedule();
  }
  /** Zoom by whole steps, keeping the point under `anchor` (viewport pixels) still. */
  function zoomBy(step:number,anchor?:Point){
    const {w,h}=size(), max=places?.map.maxZoom ?? 18;
    const zoom=Math.max(1,Math.min(max,view.zoom+step));
    if(zoom===view.zoom) return;
    const a=anchor ?? {x:w/2,y:h/2}, scale=2**(zoom-view.zoom);
    const offset={x:a.x-w/2,y:a.y-h/2};
    setView(zoom,{x:(view.center.x+offset.x)*scale-offset.x,y:(view.center.y+offset.y)*scale-offset.y});
  }
  function fit(){
    const {w,h}=size();
    if(!sites.length){
      const fallback=places?.map.center ?? {lat:0,lng:0,zoom:2};
      setView(fallback.zoom,project(fallback,fallback.zoom));return;
    }
    const target=fitView(sites,w,h,FIT_PADDING,places?.map.maxZoom ?? 18,SINGLE_SITE_ZOOM);
    setView(target.zoom,target.center);
  }
  function centreOn(site:Site){
    const zoom=Math.max(view.zoom,Math.min(places?.map.maxZoom ?? 18,LABEL_ZOOM+1));
    setView(zoom,project(site,zoom));
  }
  function syncControls(){
    const max=places?.map.maxZoom ?? 18, off=!snapshot;
    button('zoom-in').disabled=view.zoom>=max;button('zoom-out').disabled=view.zoom<=1;button('fit').disabled=off;
    search.disabled=off;groupSelect.disabled=off;button('problems').disabled=off;button('links').disabled=off;
    for(const [action,on] of [['problems',problemsOnly],['links',showLinks]] as const){button(action).classList.toggle('lm-active',on);button(action).setAttribute('aria-pressed',String(on));}
  }

  // ---- Summary and details -----------------------------------------------
  const el=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,className?:string)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;};
  function list(rows:[string,string][]){const dl=el('dl');for(const [label,value] of rows)dl.append(el('dt',label),el('dd',value));return dl;}
  function renderSummary(){
    const summary=$<HTMLElement>('.lm-summary');summary.replaceChildren();
    if(!snapshot) return;
    const located=sites.reduce((total,site)=>total+site.nodes.length,0), down=sites.filter(s=>s.status==='down').length;
    for(const [value,label] of [[located,'Located'],[sites.length,'Locations'],[unlocated.length,'No coordinates'],[down,'Problem sites']] as const){
      const jump=label==='Problem sites' && down>0;
      const item=el(jump ? 'button' : 'div');item.append(el('strong',String(value)),el('span',label));
      if(jump){item.className='lm-summary-down';item.dataset.world='next-down';item.title='Show the next location with a down device (D)';item.setAttribute('aria-label',`${down} problem sites. Show the next one`);}
      summary.append(item);
    }
  }
  function select(next:Selection|undefined){selected=next;renderDetails();schedule();}
  function closeButton(){const b=el('button','×','lm-close');b.setAttribute('aria-label','Close details');b.onclick=()=>select(undefined);return b;}
  function renderDetails(){
    panel.replaceChildren();
    const site=selected?.type==='site' ? sites.find(s=>s.id===selected!.id) : undefined;
    const node=selected?.type==='device' ? sites.flatMap(s=>s.nodes).find(n=>n.id===selected!.id) : undefined;
    const pair=selected?.type==='link' ? siteLinks.find(p=>p.key===selected!.id) : undefined;
    if(site) return siteDetails(site);
    if(node) return deviceDetails(node);
    if(pair) return linkDetails(pair);
    panel.append(el('div','WORLD MAP','lm-eyebrow'),el('h2','Where the network is'),
      el('p','Each marker is a LibreNMS location, sized by its number of devices and coloured by the worst device status there. Lines are discovered links between locations, coloured by their busiest link.'));
    if(unlocated.length){
      const more=el('details','','lm-world-unlocated');
      more.append(el('summary',`${unlocated.length} device${unlocated.length===1 ? ' has' : 's have'} no coordinates`));
      const names=el('ul');
      for(const n of unlocated.slice(0,50)) names.append(el('li',nameOf(n)));
      if(unlocated.length>50) names.append(el('li',`…and ${unlocated.length-50} more`));
      more.append(names,el('p','Give these devices a LibreNMS location with coordinates to place them on the map.'));
      panel.append(more);
    }
  }
  function deviceButton(n:MapNode){
    const b=el('button',undefined,'lm-world-device');
    const dot=el('i');dot.style.background=statusColor(n.status);
    b.append(dot,el('span',nameOf(n)));b.title=n.status;b.onclick=()=>select({type:'device',id:n.id});
    return b;
  }
  function siteDetails(site:Site){
    const down=site.nodes.filter(n=>n.status==='down').length;
    panel.append(closeButton(),el('div','LOCATION','lm-eyebrow'),el('h2',siteName(site)),list([
      ['Devices',String(site.nodes.length)],['Down',String(down)],['Coordinates',`${site.lat.toFixed(5)}, ${site.lng.toFixed(5)}`],
    ]));
    const devices=el('div',undefined,'lm-device-list');devices.append(...site.nodes.map(deviceButton));panel.append(devices);
    const connected=siteLinks.filter(p=>p.a===site || p.b===site);
    if(connected.length){
      panel.append(el('div','CONNECTED LOCATIONS','lm-eyebrow'));
      const others=el('div',undefined,'lm-device-list');
      for(const pair of connected){
        const other=pair.a===site ? pair.b : pair.a;
        const b=el('button',`${siteName(other)} · ${pair.links.length} link${pair.links.length===1 ? '' : 's'} · ${pair.label}`);
        b.onclick=()=>select({type:'link',id:pair.key});others.append(b);
      }
      panel.append(others);
    }
  }
  function deviceDetails(n:MapNode){
    const site=sites.find(s=>s.nodes.includes(n))!;
    const back=el('button',`← ${siteName(site)}`,'lm-world-back');back.onclick=()=>select({type:'site',id:site.id});
    panel.append(closeButton(),back,el('div',`${n.role} / DEVICE`,'lm-eyebrow'),el('h2',nameOf(n)),list([
      ['Status',n.status],...(nameOf(n)!==n.hostname ? [['Hostname',n.hostname] as [string,string]] : []),['Location',siteName(site)],['Site',n.site],
    ]));
    if(n.url){const url=new URL(n.url,location.href);if(url.origin===location.origin){const a=el('a','Open in LibreNMS ↗','lm-device-link');a.href=url.href;panel.append(a);}}
  }
  function linkDetails(pair:SiteLink){
    const names=new Map(graph.nodes.map(n=>[n.id,nameOf(n)]));
    panel.append(closeButton(),el('div','CONNECTIONS','lm-eyebrow'),el('h2',`${siteName(pair.a)} ↔ ${siteName(pair.b)}`),list([['Links',String(pair.links.length)],['Status',pair.label]]));
    const rows=el('ul',undefined,'lm-world-links-list');
    const now=serverNow(), staleAfter=snapshot?.config.staleAfter ?? 900;
    for(const link of pair.links){
      const m=metric(link,now,staleAfter);
      const item=el('li');const state=el('strong',m.label);state.style.color=m.color;
      item.append(state,el('span',`${names.get(link.source) ?? link.source} ${link.sourcePort} ↔ ${names.get(link.target) ?? link.target} ${link.targetPort}`));
      rows.append(item);
    }
    panel.append(rows);
    for(const site of [pair.a,pair.b]){const b=el('button',`Show ${siteName(site)}`,'lm-world-back');b.onclick=()=>{select({type:'site',id:site.id});centreOn(site);};panel.append(b);}
  }
  function nextDown(){
    const down=sites.filter(s=>s.status==='down');
    if(!down.length){message(snapshot && graph.nodes.some(n=>n.status==='down') ? 'Down devices have no coordinates or are hidden by the current filters.' : 'No located devices are down.');return;}
    downCursor=(downCursor+1)%down.length;
    const site=down[downCursor];
    select({type:'site',id:site.id});centreOn(site);
    message(`Problem location ${downCursor+1} of ${down.length}: ${siteName(site)}`);
  }

  // ---- Loading ------------------------------------------------------------
  async function refresh(){
    if(busy) return;
    busy=true;button('refresh').disabled=true;
    try{
      const [topologyData,locationData]=await Promise.all([getJson(root.dataset.endpoint,'topology'),getJson(root.dataset.locationsEndpoint,'locations')]);
      if(!object(topologyData) || !Array.isArray(topologyData.devices) || !Array.isArray(topologyData.links) || !object(topologyData.config)) throw new Error('Unexpected topology response.');
      snapshot=topologyData as unknown as Snapshot;places=parseLocations(locationData);graph=topology(snapshot);
      clockOffset=Number.isFinite(snapshot.generatedAt) ? snapshot.generatedAt-Date.now()/1000 : 0;
      const group=groupSelect.value;
      groupSelect.replaceChildren(new Option('All device groups',''),...graph.deviceGroups.map(g=>new Option(g.name,g.id)));
      groupSelect.value=graph.deviceGroups.some(g=>g.id===group) ? group : '';
      const attribution=$<HTMLElement>('.lm-world-attribution');
      attribution.textContent=places.map.tiles ? places.map.attribution : '';attribution.hidden=!attribution.textContent;
      rebuild();syncControls();
      if(!fitted){fit();fitted=true;}
      $<HTMLElement>('.lm-updated').textContent=`Snapshot fetched · ${new Date(snapshot.generatedAt*1000).toLocaleTimeString()}`;
      message(places.locations.length ? `${sites.reduce((t,s)=>t+s.nodes.length,0)} devices at ${sites.length} locations` : 'No devices have map coordinates yet.');
    }catch(error){
      const text=error instanceof Error ? error.message : 'Unable to load device locations';
      // Keep an authorized map through a transient failure; clear it when access is lost.
      if(snapshot && !(error instanceof HttpError && ACCESS_LOST.has(error.status))){message(`${text} · Showing the data from ${new Date(snapshot.generatedAt*1000).toLocaleTimeString()}.`,true);return;}
      snapshot=undefined;places=undefined;graph={nodes:[],links:[],deviceGroups:[]};selected=undefined;fitted=false;
      rebuild();syncControls();message(text,true);
    }finally{busy=false;button('refresh').disabled=false;}
  }

  // ---- Interaction --------------------------------------------------------
  let drag:{id:number;start:Point;center:Point;moved:boolean}|undefined;
  viewport.addEventListener('pointerdown',event=>{
    if(event.button!==0 || (event.target as Element).closest('.lm-world-marker, .lm-world-link')) return;
    drag={id:event.pointerId,start:{x:event.clientX,y:event.clientY},center:{...view.center},moved:false};
    viewport.setPointerCapture(event.pointerId);viewport.classList.add('lm-dragging');
  });
  viewport.addEventListener('pointermove',event=>{
    if(!drag || event.pointerId!==drag.id) return;
    const dx=event.clientX-drag.start.x, dy=event.clientY-drag.start.y;
    if(!drag.moved && Math.hypot(dx,dy)<4) return;
    drag.moved=true;
    view={zoom:view.zoom,center:clampCenter({x:drag.center.x-dx,y:drag.center.y-dy},view.zoom,size().h)};schedule();
  });
  const endDrag=(event:PointerEvent)=>{
    if(!drag || event.pointerId!==drag.id) return;
    // A click on empty map clears the selection; a drag never does.
    if(!drag.moved && event.type==='pointerup' && selected) select(undefined);
    drag=undefined;viewport.classList.remove('lm-dragging');
  };
  viewport.addEventListener('pointerup',endDrag);viewport.addEventListener('pointercancel',endDrag);
  let lastWheel=0;
  viewport.addEventListener('wheel',event=>{
    event.preventDefault();
    // Whole zoom steps keep tiles sharp; throttle trackpads' bursts of small deltas.
    if(event.timeStamp-lastWheel<180 || event.deltaY===0) return;
    lastWheel=event.timeStamp;
    const box=viewport.getBoundingClientRect();
    zoomBy(event.deltaY<0 ? 1 : -1,{x:event.clientX-box.left,y:event.clientY-box.top});
  },{passive:false});
  viewport.addEventListener('dblclick',event=>{
    if((event.target as Element).closest('.lm-world-marker, .lm-world-link')) return;
    const box=viewport.getBoundingClientRect();
    zoomBy(event.shiftKey ? -1 : 1,{x:event.clientX-box.left,y:event.clientY-box.top});
  });
  markersEl.addEventListener('click',event=>{
    const marker=(event.target as Element).closest<HTMLElement>('.lm-world-marker');
    if(marker?.dataset.site) select({type:'site',id:marker.dataset.site});
  });
  const pickLink=(event:Event)=>{
    const link=(event.target as Element).closest<SVGGElement>('.lm-world-link');
    if(link?.dataset.link) select({type:'link',id:link.dataset.link});
  };
  svg.addEventListener('click',pickLink);
  svg.addEventListener('keydown',event=>{if(event.key==='Enter' || event.key===' '){event.preventDefault();pickLink(event);}});
  search.addEventListener('input',()=>{search.value=limitFilter(search.value);rebuild();});
  groupSelect.addEventListener('change',()=>{rebuild();fit();});
  root.addEventListener('click',event=>{
    const action=(event.target as Element).closest<HTMLElement>('[data-world]')?.dataset.world;
    switch(action){
      case 'problems':problemsOnly=!problemsOnly;syncControls();rebuild();if(problemsOnly && sites.length)fit();break;
      case 'links':showLinks=!showLinks;syncControls();buildLinks();render();break;
      case 'refresh':void refresh();break;
      case 'fit':fit();break;
      case 'zoom-in':zoomBy(1);break;
      case 'zoom-out':zoomBy(-1);break;
      case 'next-down':nextDown();break;
      case 'fullscreen':void (document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen()).catch(()=>message('Fullscreen is unavailable in this browser.'));break;
    }
  });
  document.addEventListener('keydown',event=>{
    if(!shortcutAllowed(event,root)) return;
    const pan=(dx:number,dy:number)=>setView(view.zoom,{x:view.center.x+dx,y:view.center.y+dy});
    const actions:Record<string,()=>void>={
      '/':()=>{if(!search.disabled)search.focus();},
      f:fit,'+':()=>zoomBy(1),'=':()=>zoomBy(1),'-':()=>zoomBy(-1),d:nextDown,
      ArrowLeft:()=>pan(-120,0),ArrowRight:()=>pan(120,0),ArrowUp:()=>pan(0,-120),ArrowDown:()=>pan(0,120),
      Escape:()=>{if(selected)select(undefined);},
    };
    const action=actions[event.key.length===1 ? event.key.toLowerCase() : event.key];
    if(action){event.preventDefault();action();}
  });
  new ResizeObserver(()=>{setView(view.zoom,view.center);if(!fitted && sites.length){fit();fitted=true;}}).observe(viewport);
  // Re-judge link staleness between fetches on the server's clock.
  setInterval(()=>{if(snapshot && siteLinks.length)recolorLinks();},10000);
  setInterval(()=>{if(!document.hidden)void refresh();},60000);

  // Read-only diagnostic hook for browser checks with fixtures that opt in.
  if(root.dataset.debug==='true') Object.defineProperty(window,'libremapWorldDebug',{value:()=>({
    zoom:view.zoom,center:{...view.center},
    markers:sites.map(site=>({id:site.id,name:site.name,count:site.nodes.length,status:site.status,position:screen(project(site,view.zoom))})),
    links:siteLinks.map(pair=>({key:pair.key,count:pair.links.length,state:pair.state,label:pair.label,color:pair.color})),
    tiles:[...tiles.values()].map(image=>image.src),
  }),configurable:true});

  syncControls();renderDetails();void refresh();
}
