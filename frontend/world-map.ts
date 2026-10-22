import { statusColor, themeController } from './canvas-style';
import { shortcutAllowed } from './canvas-tools';
import { clampCenter, fitView, project, TILE, tileUrl, withoutCoordinates, worldSize, type Point } from './geo';
import { mountPageNav } from './page-nav';
import { deviceName, LOAD_COLORS, metric, topology } from './topology';
import { KIND_NAMES, mapsReadAt, NEAR_KM, OUTAGE_COLORS, outageAnchorAt, outagePath, outagePeriod, outagesAt, outagesNear, outageShape, parseCheck, parseHealth, parseOutages, SKIPPED_REASONS, verdictText, type Evidence, type NearOutage, type Outage, type OutageCheck, type PowerHealth } from './power';
import { limitFilter } from './view-limits';
import type { Link, MapNode, Snapshot, Topology } from './types';
import { LEVEL_NAMES, LEVEL_RANK, parseWarnings, WARNING_COLORS, warningPath, warningPeriod, warningsAt, worstLevel, type Warning } from './weather';
import './style.css';
import './views.css';
import './world-map.css';

interface WorldLocation { id:string; name:string; lat:number; lng:number }
interface MapConfig { tiles:string|null; attribution:string; maxZoom:number; center:{lat:number;lng:number;zoom:number} }
interface Locations { locations:WorldLocation[]; devices:Record<string,string>; map:MapConfig }
interface Site extends WorldLocation { nodes:MapNode[]; status:'up'|'down'|'unknown' }
interface SiteLink { key:string; a:Site; b:Site; links:Link[]; color:string; state:string; label:string }
type Selection={type:'site'|'device'|'link'|'warning'|'outage';id:string};
interface SiteCheck { at:number; check?:OutageCheck; error?:string }

const SVG='http://www.w3.org/2000/svg';
// Marker names show once a map is zoomed in far enough to have room for them.
const LABEL_ZOOM=7, FIT_PADDING=70, SINGLE_SITE_ZOOM=12, TILE_FAILURE_NOTICE=6;
// MET Norway updates warnings every few minutes; the server caches for five.
const WEATHER_REFRESH_MS=5*60_000;
// DRIFT reads the grid operators' maps every five minutes; the server caches its answers for one.
const POWER_REFRESH_MS=5*60_000, POWER_CHECK_MS=60_000;
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
      <div class="lm-toolbar"><label class="lm-search"><span>⌕</span><input type="search" aria-label="Find device" placeholder="Find a device or location…"></label><label class="lm-select">Device group <select aria-label="Device group"><option value="">All device groups</option></select></label><button data-world="problems" aria-pressed="false">Only problems</button><button data-world="links" aria-pressed="true" class="lm-active">Links</button><button data-world="weather" aria-pressed="false" hidden title="Show MET Norway weather warnings">⚠ Weather warnings</button><button data-world="power" aria-pressed="false" hidden title="Show power outages on the grid operators' maps">⚡ Power outages</button><button data-world="names" aria-pressed="false" title="Label locations with the names of their devices">Device names</button><button data-world="addresses" aria-pressed="false" title="Show the LibreNMS location text and coordinates">Addresses</button><span class="lm-spacer"></span><button data-world="refresh">↻ Refresh</button><button data-world="fullscreen" title="Fullscreen">⛶</button></div>
      <div class="lm-notice" role="status" aria-live="polite">Loading device locations…</div>
      <main class="lm-workspace"><div class="lm-canvas-wrap lm-world-wrap">
        <div class="lm-world" tabindex="0" aria-label="World map of device locations. Drag to pan, scroll to zoom."><div class="lm-world-pane"><div class="lm-world-tiles"></div><svg class="lm-world-weather"></svg><svg class="lm-world-power"></svg><svg class="lm-world-links"></svg><div class="lm-world-markers"></div></div></div>
        <div class="lm-empty" hidden></div>
        <div class="lm-map-controls"><button data-world="zoom-in" aria-label="Zoom in">+</button><button data-world="zoom-out" aria-label="Zoom out">−</button><button data-world="fit">Fit</button></div>
        <div class="lm-legend"><span><i class="lm-world-key" style="background:${statusColor('up')}"></i>Up</span><span><i class="lm-world-key" style="background:${statusColor('down')}"></i>Down</span><span><i class="lm-world-key" style="background:${statusColor('unknown')}"></i>Unknown</span><span><i style="color:${LOAD_COLORS.normal}"></i>&lt;50%</span><span><i style="color:${LOAD_COLORS.warning}"></i>50–70%</span><span><i style="color:${LOAD_COLORS.high}"></i>&gt;70%</span><span><i class="lm-dashed" style="color:#e05b65"></i>Link down</span>${(['yellow','orange','red'] as const).map(level=>`<span class="lm-world-weather-key" hidden><i class="lm-world-area" style="--area:${WARNING_COLORS[level]}"></i>${LEVEL_NAMES[level]} warning</span>`).join('')}${(['current','planned'] as const).map(kind=>`<span class="lm-world-power-key" hidden><i class="lm-world-area lm-world-${kind}" style="--area:${OUTAGE_COLORS[kind]}"></i>${KIND_NAMES[kind]}</span>`).join('')}</div>
        <div class="lm-world-attribution" hidden></div>
      </div><aside class="lm-details" aria-label="Selection details"></aside></main>
      <footer><span class="lm-updated">Waiting for data</span><span>Drag to pan · Scroll or double-click to zoom · Click a location to inspect · Keys: / find · F fit · + − zoom · arrows pan · D next problem · O next location in an outage · Esc clear</span></footer>
    </div>`;
  const $=<T extends Element>(selector:string)=>root.querySelector<T>(selector)!;
  const notice=$<HTMLElement>('.lm-notice'), panel=$<HTMLElement>('.lm-details'), empty=$<HTMLElement>('.lm-empty');
  const viewport=$<HTMLElement>('.lm-world'), pane=$<HTMLElement>('.lm-world-pane'), tilesEl=$<HTMLElement>('.lm-world-tiles'), svg=$<SVGSVGElement>('.lm-world-links'), markersEl=$<HTMLElement>('.lm-world-markers');
  const weatherSvg=$<SVGSVGElement>('.lm-world-weather'), powerSvg=$<SVGSVGElement>('.lm-world-power');
  const search=$<HTMLInputElement>('[aria-label="Find device"]'), groupSelect=$<HTMLSelectElement>('[aria-label="Device group"]');
  const button=(action:string)=>$<HTMLButtonElement>(`[data-world="${action}"]`);
  if(root.dataset.homeUrl) $<HTMLAnchorElement>('.lm-back').href=root.dataset.homeUrl;
  mountPageNav($('.lm-pages'),root,'world');
  themeController(root,()=>{});

  let snapshot:Snapshot|undefined, graph:Topology={nodes:[],links:[],deviceGroups:[]}, places:Locations|undefined;
  let sites:Site[]=[], siteLinks:SiteLink[]=[], unlocated:MapNode[]=[];
  // Visible links that are not lines: both ends at one location, or an end without coordinates.
  let withinSite=new Map<string,Link[]>(), undrawnUnlocated=0;
  let view={zoom:2,center:{x:worldSize(2)/2,y:worldSize(2)/2}};
  let selected:Selection|undefined, problemsOnly=false, showLinks=true, busy=false, fitted=false, downCursor=-1, tileFailures=0;
  let clockOffset=0;
  const serverNow=()=>Date.now()/1000+clockOffset;
  const message=(text:string,error=false)=>{notice.textContent=text;notice.classList.toggle('lm-error',error);};
  const isAddress=(text:string)=>/^\d{1,3}(\.\d{1,3}){3}$/.test(text) || (text.includes(':') && /^[0-9a-f:.]+$/i.test(text));
  /** A device's name: its hostname, else its sysName when the hostname is only an IP address, else that address. */
  function nameOf(node:MapNode):string {
    const host=node.hostname.trim(), sysName=(node.sysName ?? '').trim();
    if(host && !isAddress(host)) return host;
    return sysName || host || deviceName(node);
  }

  // Per-viewer display preferences; storage is optional.
  const prefsKey=`libremap:world:${root.dataset.storageKey ?? 'local'}`;
  const prefs:Record<string,unknown>=(()=>{try{const value=JSON.parse(localStorage.getItem(prefsKey) ?? '{}');return object(value) ? value : {};}catch{return {};}})();
  const savePrefs=()=>{try{localStorage.setItem(prefsKey,JSON.stringify({addresses:showAddresses,deviceNames:showDeviceNames,weather:weatherOn,power:powerOn}));}catch{/* Storage is optional. */}};
  // LibreNMS location text is often a street address: hidden unless asked for.
  let showAddresses=prefs.addresses===true;
  // Device names stay off the map itself unless asked for; the details panel still lists them.
  let showDeviceNames=prefs.deviceNames===true;
  const weatherEndpoint=root.dataset.weatherEndpoint;
  let weatherOn=!!weatherEndpoint && prefs.weather===true;
  let warnings:Warning[]=[], weatherAttribution='', weatherFetchedAt=0, weatherBusy=false;
  const siteWarnings=new Map<string,Warning[]>();
  // Power outages come from DRIFT through the LibreNMS server; the browser never sees DRIFT or its token.
  const powerEndpoint=root.dataset.powerEndpoint;
  let powerOn=!!powerEndpoint && prefs.power===true;
  let outages:Outage[]=[], powerEvidence:Evidence|undefined, powerComplete=true, powerHealth:PowerHealth|undefined, powerBusy=false;
  let powerSkipped:Record<string,number>={}, outageCursor=-1;
  // The sidebar's full outage list: folded until opened, and showing current outages first.
  let powerListOpen=false, powerListKind:'current'|'planned'|'all'='current';
  // Locations inside an outage area, and those within NEAR_KM of one.
  const siteOutages=new Map<string,Outage[]>(), siteNear=new Map<string,NearOutage[]>(), siteChecks=new Map<string,SiteCheck>();

  // Naming has two audiences. The map itself (marker labels, their screen
  // reader text, link tooltips) follows the Addresses and Device names
  // toggles. The details panel, opened by selecting something, always names
  // things fully.

  /** A device's LibreMap site, or nothing when it is unclassified. */
  const siteOfDevice=(n:MapNode)=>n.site && n.site!=='Unclassified' ? n.site : '';
  /**
   * A device's site as far as the map may show it. Sites are usually read from
   * the hostname or sysName ("hk-rossa1agg1" → "rossa1"), so with device names
   * hidden only a site an administrator set in libremap.overrides is shown.
   */
  function mapSite(n:MapNode):string {
    if(showDeviceNames) return siteOfDevice(n);
    const configured=snapshot?.config.overrides?.[n.id]?.site;
    return typeof configured==='string' ? configured.trim() : '';
  }
  const joinSites=(names:string[])=>{const unique=[...new Set(names.filter(Boolean))].sort();return unique.length>1 ? `${unique[0]} +${unique.length-1}` : unique[0] ?? '';};
  /** The name the map itself may show: the address when shown, else its sites the map may show, else nothing. */
  function shownName(site:Site):string {
    if(showAddresses && site.name.trim()) return site.name.trim();
    return joinSites(site.nodes.map(mapSite));
  }
  // Locations with no name the map may show are numbered, in a fixed order.
  let locationNumbers=new Map<string,number>();
  /** A location's name on the map: screen reader text and link tooltips. */
  const mapName=(site:Site)=>shownName(site) || (showDeviceNames && site.nodes.length ? deviceNames(site) : `Location ${locationNumbers.get(site.id) ?? ''}`.trim());
  /** A location's name in the details panel: its address when shown, else its site, else its devices. */
  const siteName=(site:Site)=>(showAddresses && site.name.trim()) || joinSites(site.nodes.map(siteOfDevice)) || deviceNames(site) || 'Location';
  /** The first few device names at a location; the rest as a count. */
  function deviceNames(site:Site,shown=3):string {
    const names=site.nodes.slice(0,shown).map(nameOf).join(', ');
    return site.nodes.length>shown ? `${names} +${site.nodes.length-shown}` : names;
  }
  /**
   * The text beside a marker: its device names when asked for, else its name.
   * A location with neither gets no label; its dot already shows the count.
   */
  const markerLabel=(site:Site)=>showDeviceNames ? deviceNames(site) : shownName(site);

  // ---- Data ---------------------------------------------------------------
  async function getJson(endpoint:string|undefined,what:string):Promise<unknown> {
    if(!endpoint) throw new Error(`Missing ${what} endpoint.`);
    const url=new URL(endpoint,location.href);
    if(url.origin!==location.origin) throw new Error(`The ${what} endpoint must use the same origin.`);
    const response=await fetch(url,{credentials:'same-origin',headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});
    if(!response.ok) {
      let reason=`LibreNMS returned HTTP ${response.status}`;
      if(response.status===422 || response.status===502 || response.status===503){const body:unknown=await response.json().catch(()=>undefined);if(object(body) && typeof body.message==='string' && body.message.length<=300)reason=body.message;}
      if(response.status===429)reason='Too many requests. The map will retry on the next refresh.';
      throw new HttpError(reason,response.status);
    }
    return response.json();
  }
  function parseLocations(value:unknown):Locations {
    if(!object(value) || !Array.isArray(value.locations) || !object(value.devices)) throw new Error('Unexpected locations response.');
    const locations=value.locations.filter((l):l is WorldLocation=>object(l) && typeof l.id==='string' && typeof l.name==='string'
      && typeof l.lat==='number' && typeof l.lng==='number' && Math.abs(l.lat)<=90 && Math.abs(l.lng)<=180)
      // Shown addresses never repeat the coordinates the text may carry; a text of only coordinates becomes unnamed.
      .map(l=>({id:l.id,name:withoutCoordinates(l.name),lat:l.lat,lng:l.lng}));
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
      // Hidden addresses are not searchable either, so results never hint at them.
      return !query || [nameOf(n),n.hostname,n.sysName ?? '',n.site,showAddresses ? locationOf(n.id)?.name ?? '' : ''].some(text=>text.toLowerCase().includes(query));
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
    // Links that cannot be a line between two locations are counted, not silently dropped.
    const visibleIds=new Set(visible.map(n=>n.id));
    withinSite=new Map();undrawnUnlocated=0;
    for(const link of graph.links){
      const a=siteOf.get(link.source), b=siteOf.get(link.target);
      if(a && a===b){withinSite.set(a.id,[...(withinSite.get(a.id) ?? []),link]);continue;}
      if(!a || !b){if(visibleIds.has(link.source) && visibleIds.has(link.target))undrawnUnlocated++;continue;}
      const [first,second]=a.id<b.id ? [a,b] : [b,a], key=`${first.id}|${second.id}`;
      const pair=pairs.get(key) ?? {key,a:first,b:second,links:[],color:'',state:'',label:''};
      pair.links.push(link);pairs.set(key,pair);
    }
    siteLinks=[...pairs.values()];
    judgeLinks();
    matchWarnings();
    matchOutages();
    if(selected?.type==='site' && !bySite.has(selected.id)) selected=undefined;
    if(selected?.type==='device' && !siteOf.has(selected.id)) selected=undefined;
    if(selected?.type==='link' && !pairs.has(selected.id)) selected=undefined;
    if(selected?.type==='warning' && !warnings.some(w=>w.id===selected!.id)) selected=undefined;
    if(selected?.type==='outage' && !outages.some(o=>o.id===selected!.id)) selected=undefined;
    buildMarkers();buildLinks();renderSummary();renderDetails();
    empty.hidden=sites.length>0;
    empty.textContent=!snapshot ? 'Device locations unavailable. Use Refresh to retry.'
      : !(places?.locations.length) ? 'No devices have map coordinates yet. Give devices a LibreNMS location with coordinates to place them here.'
      : 'No located devices match these filters.';
    render();
  }

  /** Which active warnings cover each visible location. */
  function matchWarnings(){
    siteWarnings.clear();
    if(!weatherOn) return;
    for(const site of sites){const covering=warningsAt(site,warnings);if(covering.length)siteWarnings.set(site.id,covering);}
  }
  /** Which outage areas contain each visible location. */
  function matchOutages(){
    siteOutages.clear();siteNear.clear();
    if(!powerOn) return;
    for(const site of sites){
      const covering=outagesAt(site,outages);
      if(covering.length){siteOutages.set(site.id,covering);continue;}
      const near=outagesNear(site,outages);
      if(near.length)siteNear.set(site.id,near);
    }
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
      if(title) title.textContent=`${mapName(pair.a)} ↔ ${mapName(pair.b)} · ${pair.links.length} link${pair.links.length===1 ? '' : 's'} · ${pair.label}`;
    }
  }

  // ---- View ---------------------------------------------------------------
  // The viewport's size, read once per resize rather than on every frame.
  let box={w:0,h:0};
  const measure=()=>{box={w:viewport.clientWidth,h:viewport.clientHeight};};
  const size=()=>{if(!box.w && !box.h)measure();return box;};
  /** Viewport pixels of a world point, using the copy of the globe nearest the centre. */
  function screen(p:Point):Point {
    const {w,h}=size(), world=worldSize(view.zoom);
    let dx=p.x-view.center.x;
    if(dx>world/2) dx-=world; else if(dx<-world/2) dx+=world;
    return {x:w/2+dx,y:h/2+p.y-view.center.y};
  }
  /*
   * Every layer lives in one pane. Panning only moves the pane with a
   * compositor transform; the tiles, markers, lines and areas inside it keep
   * their positions, relative to `origin` (the world pixel at the pane's top
   * left), until the zoom or size changes, the content is rebuilt, or the
   * view has moved further than the margin laid out around it.
   */
  let origin={x:0,y:0}, laidOut={zoom:-1,x:0,y:0,w:0,h:0};
  const invalidate=()=>{laidOut.zoom=-1;};
  const tiles=new Map<string,HTMLImageElement>();
  let tileOrigin='';
  function renderTiles(){
    const template=places?.map.tiles;
    if(!template){if(tiles.size){tilesEl.replaceChildren();tiles.clear();}return;}
    const {w,h}=size(), zoom=view.zoom, count=2**zoom;
    const left=view.center.x-w/2, top=view.center.y-h/2;
    // Existing tiles move only when the pane's origin changes.
    const moved=tileOrigin!==`${zoom}/${origin.x}/${origin.y}`;tileOrigin=`${zoom}/${origin.x}/${origin.y}`;
    const needed=new Set<string>();
    // One tile beyond each edge, so panning reveals tiles that are already loading.
    for(let ty=Math.max(0,Math.floor(top/TILE)-1);ty<=Math.min(count-1,Math.floor((top+h)/TILE)+1);ty++){
      for(let tx=Math.floor(left/TILE)-1;tx<=Math.floor((left+w)/TILE)+1;tx++){
        const key=`${zoom}/${tx}/${ty}`;needed.add(key);
        let image=tiles.get(key);
        const fresh=!image;
        if(!image){
          const src=tileUrl(template,zoom,tx,ty);
          if(!src) continue;
          image=new Image(TILE,TILE);image.alt='';image.decoding='async';image.draggable=false;
          image.onerror=()=>{image!.classList.add('lm-tile-failed');if(++tileFailures===TILE_FAILURE_NOTICE)message('Map tiles could not be loaded. Device locations are still shown.',true);};
          image.src=src;tiles.set(key,image);tilesEl.append(image);
        }
        if(fresh || moved) image.style.transform=`translate(${tx*TILE-origin.x}px,${ty*TILE-origin.y}px)`;
      }
    }
    for(const [key,image] of tiles) if(!needed.has(key)){image.remove();tiles.delete(key);}
  }
  const markers=new Map<string,HTMLButtonElement>();
  function buildMarkers(){
    markers.clear();invalidate();
    markersEl.replaceChildren(...sites.map(site=>{
      const count=site.nodes.length, down=site.nodes.filter(n=>n.status==='down').length;
      const marker=document.createElement('button');
      const level=worstLevel(siteWarnings.get(site.id) ?? []);
      const outage=siteOutages.get(site.id)?.[0]?.kind, near=siteNear.get(site.id)?.[0];
      marker.type='button';marker.className=`lm-world-marker lm-world-${site.status}`;marker.dataset.site=site.id;
      // Inside an outage area: a heavy ring and an "OUTAGE" tag; near one: a dashed ring.
      if(outage){marker.classList.add('lm-world-in-outage',`lm-world-in-${outage}`);marker.style.setProperty('--outage',OUTAGE_COLORS[outage]);}
      else if(near){marker.classList.add('lm-world-near-outage');marker.style.setProperty('--outage',OUTAGE_COLORS[near.outage.kind]);}
      marker.setAttribute('aria-label',`${mapName(site)}: ${count} device${count===1 ? '' : 's'}${down ? `, ${down} down` : ''}${level ? `, ${level} weather warning` : ''}${outage ? `, inside a ${outage} power outage area` : near ? `, ${kmText(near.km)} from a ${near.outage.kind} power outage` : ''}`);
      marker.style.setProperty('--marker',`${Math.round(Math.min(36,14+Math.sqrt(count)*4))}px`);
      const dot=document.createElement('span');dot.className='lm-world-dot';dot.textContent=count>1 ? String(count) : '';
      const label=document.createElement('span');label.className='lm-world-label';label.textContent=markerLabel(site);
      marker.append(dot,label);
      if(level){
        const badge=document.createElement('span');badge.className='lm-world-badge';badge.textContent='!';badge.style.setProperty('--area',WARNING_COLORS[level]);
        marker.dataset.warning=level;marker.append(badge);
      }
      if(outage){
        const badge=document.createElement('span');badge.className='lm-world-badge lm-world-power-badge';badge.textContent='⚡';badge.style.setProperty('--area',OUTAGE_COLORS[outage]);
        const tag=document.createElement('span');tag.className='lm-world-outage-tag';tag.textContent=outage==='current' ? '⚡ OUTAGE' : '⚡ PLANNED';
        marker.dataset.outage=outage;marker.append(badge,tag);
      }else if(near){
        const badge=document.createElement('span');badge.className='lm-world-badge lm-world-power-badge lm-world-near-badge';badge.textContent='⚡';badge.style.setProperty('--area',OUTAGE_COLORS[near.outage.kind]);
        marker.dataset.nearOutage=near.outage.kind;marker.append(badge);
      }
      markers.set(site.id,marker);
      return marker;
    }));
  }
  const lines=new Map<string,SVGLineElement[]>();
  function buildLinks(){
    lines.clear();svg.replaceChildren();invalidate();
    if(!showLinks) return;
    for(const pair of siteLinks){
      const g=document.createElementNS(SVG,'g');
      g.classList.add('lm-world-link');g.dataset.link=pair.key;g.setAttribute('tabindex','0');g.setAttribute('role','button');
      g.setAttribute('aria-label',`${mapName(pair.a)} to ${mapName(pair.b)}: ${pair.links.length} link${pair.links.length===1 ? '' : 's'}, ${pair.label}`);
      const title=document.createElementNS(SVG,'title');title.textContent=`${mapName(pair.a)} ↔ ${mapName(pair.b)} · ${pair.links.length} link${pair.links.length===1 ? '' : 's'} · ${pair.label}`;
      const hit=document.createElementNS(SVG,'line');hit.classList.add('lm-world-hit');
      const line=document.createElementNS(SVG,'line');line.classList.add('lm-world-line');
      line.setAttribute('stroke',pair.color);line.setAttribute('stroke-width',String(Math.min(7,2+Math.log2(pair.links.length))));
      if(pair.state!=='up') line.setAttribute('stroke-dasharray','7 5');
      g.append(title,hit,line);svg.append(g);lines.set(pair.key,[hit,line]);
    }
  }
  // Warning areas are drawn in world pixels, offset by the pane's origin;
  // their paths are recomputed only when the zoom changes.
  let weatherLayer:SVGGElement|undefined, weatherZoom=-1;
  const weatherPaths=new Map<string,SVGPathElement>();
  function buildWeather(){
    weatherSvg.replaceChildren();weatherPaths.clear();weatherLayer=undefined;weatherZoom=-1;invalidate();
    for(const key of root.querySelectorAll<HTMLElement>('.lm-world-weather-key'))key.hidden=!weatherOn;
    if(!weatherOn) return;
    weatherLayer=document.createElementNS(SVG,'g');
    for(const warning of warnings){
      const path=document.createElementNS(SVG,'path');
      path.classList.add('lm-world-warning');path.dataset.warning=warning.id;
      path.setAttribute('fill-rule','evenodd');path.style.setProperty('--area',WARNING_COLORS[warning.level]);
      const title=document.createElementNS(SVG,'title');title.textContent=`${LEVEL_NAMES[warning.level]} warning: ${warning.title}${warning.area ? ` · ${warning.area}` : ''}`;
      path.append(title);weatherLayer.append(path);weatherPaths.set(warning.id,path);
    }
    weatherSvg.append(weatherLayer);
  }
  function renderWeather(){
    if(!weatherLayer) return;
    if(weatherZoom!==view.zoom){
      for(const warning of warnings)weatherPaths.get(warning.id)?.setAttribute('d',warningPath(warning,view.zoom));
      weatherZoom=view.zoom;
    }
    weatherLayer.setAttribute('transform',`translate(${-origin.x} ${-origin.y})`);
  }
  // Outage areas, lines and points: drawn like the warning areas, above them.
  // Every outage also gets a fixed-size ⚡ pin, so an area too small to see at this zoom is still marked.
  let powerLayer:SVGGElement|undefined, powerZoom=-1;
  const powerPaths=new Map<string,SVGPathElement>(), powerPins=new Map<string,SVGGElement>();
  const outageTitle=(outage:Outage)=>`${KIND_NAMES[outage.kind]}: ${outage.provider}${outage.municipality ? ` · ${outage.municipality}` : ''}${outage.customers!==null ? ` · ${outage.customers} customers` : ''}`;
  function buildPower(){
    powerSvg.replaceChildren();powerPaths.clear();powerPins.clear();powerLayer=undefined;powerZoom=-1;invalidate();
    for(const key of root.querySelectorAll<HTMLElement>('.lm-world-power-key'))key.hidden=!powerOn;
    if(!powerOn) return;
    powerLayer=document.createElementNS(SVG,'g');
    const pins=document.createElementNS(SVG,'g');
    for(const outage of outages){
      const path=document.createElementNS(SVG,'path');
      path.classList.add('lm-world-outage',`lm-world-${outage.kind}`,`lm-world-outage-${outageShape(outage)}`);path.dataset.outage=outage.id;
      path.setAttribute('fill-rule','evenodd');path.style.setProperty('--area',OUTAGE_COLORS[outage.kind]);
      const title=document.createElementNS(SVG,'title');title.textContent=outageTitle(outage);
      path.append(title);powerLayer.append(path);powerPaths.set(outage.id,path);
      if(!outage.anchor) continue;
      const pin=document.createElementNS(SVG,'g');
      pin.classList.add('lm-world-outage-pin',`lm-world-${outage.kind}`);pin.dataset.outage=outage.id;pin.style.setProperty('--area',OUTAGE_COLORS[outage.kind]);
      const circle=document.createElementNS(SVG,'circle');circle.setAttribute('r','10');
      const bolt=document.createElementNS(SVG,'text');bolt.textContent='⚡';bolt.setAttribute('text-anchor','middle');bolt.setAttribute('dy','4.5');
      const pinTitle=document.createElementNS(SVG,'title');pinTitle.textContent=outageTitle(outage);
      pin.append(pinTitle,circle,bolt);pins.append(pin);powerPins.set(outage.id,pin);
    }
    // Pins above every area, current outages above planned ones (the list's order).
    powerLayer.append(pins);
    powerSvg.append(powerLayer);
  }
  function renderPower(){
    if(!powerLayer) return;
    if(powerZoom!==view.zoom){
      for(const outage of outages){
        powerPaths.get(outage.id)?.setAttribute('d',outagePath(outage,view.zoom));
        const at=outageAnchorAt(outage,view.zoom);
        if(at) powerPins.get(outage.id)?.setAttribute('transform',`translate(${at.x.toFixed(1)} ${at.y.toFixed(1)})`);
      }
      powerZoom=view.zoom;
    }
    powerLayer.setAttribute('transform',`translate(${-origin.x} ${-origin.y})`);
  }

  /** Pane pixels of a world point, using the copy of the globe nearest the centre. */
  function toPane(p:Point):Point {
    const world=worldSize(view.zoom);
    let dx=p.x-view.center.x;
    if(dx>world/2) dx-=world; else if(dx<-world/2) dx+=world;
    return {x:view.center.x+dx-origin.x,y:p.y-origin.y};
  }
  /** Position everything inside the pane for the current zoom, around the current view. */
  function layout(){
    const {w,h}=size(), zoom=view.zoom;
    origin={x:Math.round(view.center.x-w/2),y:Math.round(view.center.y-h/2)};
    laidOut={zoom,x:view.center.x,y:view.center.y,w,h};
    renderWeather();
    renderPower();
    // Markers within one viewport of the visible area are placed; the view can pan that far before the next layout.
    for(const site of sites){
      const marker=markers.get(site.id);
      if(!marker) continue;
      const p=toPane(project(site,zoom));
      const outside=p.x<-w-60 || p.y<-h-60 || p.x>2*w+60 || p.y>2*h+60;
      marker.style.display=outside ? 'none' : '';
      if(!outside) marker.style.transform=`translate(${p.x}px,${p.y}px) translate(-50%,-50%)`;
    }
    // Labels show once zoomed in, or always when the viewer asked for device names.
    markersEl.classList.toggle('lm-world-named',zoom>=LABEL_ZOOM || showDeviceNames);
    markersEl.classList.toggle('lm-world-device-names',showDeviceNames);
    const world=worldSize(zoom);
    for(const pair of siteLinks){
      const pairLines=lines.get(pair.key);
      if(!pairLines) continue;
      const a=toPane(project(pair.a,zoom)), b=toPane(project(pair.b,zoom));
      // Draw the short way round, even across the date line.
      if(b.x-a.x>world/2) b.x-=world; else if(a.x-b.x>world/2) b.x+=world;
      for(const line of pairLines){line.setAttribute('x1',String(a.x));line.setAttribute('y1',String(a.y));line.setAttribute('x2',String(b.x));line.setAttribute('y2',String(b.y));}
    }
    renderSelection();
  }
  /** Highlight the selection; only selecting something or a new layout changes it. */
  function renderSelection(){
    const siteId=selected?.type==='site' ? selected.id : selected?.type==='device' ? sites.find(s=>s.nodes.some(n=>n.id===selected!.id))?.id : undefined;
    for(const [id,marker] of markers)marker.classList.toggle('lm-selected',id===siteId);
    for(const [key,pairLines] of lines)pairLines[1].classList.toggle('lm-selected',selected?.type==='link' && selected.id===key);
    for(const [id,path] of weatherPaths)path.classList.toggle('lm-selected',selected?.type==='warning' && selected.id===id);
    for(const [id,path] of powerPaths)path.classList.toggle('lm-selected',selected?.type==='outage' && selected.id===id);
    for(const [id,pin] of powerPins)pin.classList.toggle('lm-selected',selected?.type==='outage' && selected.id===id);
  }

  let frame=0;
  /** Per frame: move the pane, and lay it out again only when the view has outgrown the last layout. */
  function render(){
    cancelAnimationFrame(frame);frame=0;
    const {w,h}=size();
    // Also after the centre wraps round the globe, which moves it by a whole world width.
    if(laidOut.zoom!==view.zoom || laidOut.w!==w || laidOut.h!==h
      || Math.abs(view.center.x-laidOut.x)>Math.min(w,worldSize(view.zoom)/2) || Math.abs(view.center.y-laidOut.y)>h) layout();
    pane.style.transform=`translate3d(${Math.round(origin.x-(view.center.x-w/2))}px,${Math.round(origin.y-(view.center.y-h/2))}px,0)`;
    renderTiles();
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
    // Centre on the viewport as it is now, not as it was last measured.
    measure();
    const zoom=Math.max(view.zoom,Math.min(places?.map.maxZoom ?? 18,LABEL_ZOOM+1));
    setView(zoom,project(site,zoom));
  }
  function syncControls(){
    const max=places?.map.maxZoom ?? 18, off=!snapshot;
    button('zoom-in').disabled=view.zoom>=max;button('zoom-out').disabled=view.zoom<=1;button('fit').disabled=off;
    search.disabled=off;groupSelect.disabled=off;button('problems').disabled=off;button('links').disabled=off;
    button('addresses').disabled=off;button('names').disabled=off;
    button('weather').hidden=!weatherEndpoint;button('weather').disabled=weatherBusy;
    button('power').hidden=!powerEndpoint;button('power').disabled=powerBusy;
    for(const [action,on] of [['problems',problemsOnly],['links',showLinks],['addresses',showAddresses],['names',showDeviceNames],['weather',weatherOn],['power',powerOn]] as const){button(action).classList.toggle('lm-active',on);button(action).setAttribute('aria-pressed',String(on));}
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
    if(weatherOn){
      const item=el('div',undefined,'lm-summary-weather');item.append(el('strong',String(siteWarnings.size)),el('span','Under warning'));
      summary.append(item);
    }
    if(powerOn){
      // Clickable when any location is affected: steps through them, like the problem count.
      const inside=siteOutages.size;
      const item=el(inside ? 'button' : 'div',undefined,`lm-summary-power${inside ? ' lm-summary-power-hit' : ''}`);
      item.append(el('strong',String(inside)),el('span','In outage area'));
      if(inside){item.dataset.world='next-outage';item.title='Show the next location inside an outage area (O)';item.setAttribute('aria-label',`${inside} location${inside===1 ? '' : 's'} inside an outage area. Show the next one`);}
      summary.append(item);
      if(siteNear.size){const near=el('div',undefined,'lm-summary-power');near.append(el('strong',String(siteNear.size)),el('span',`Within ${NEAR_KM} km`));summary.append(near);}
    }
  }
  /** "350 m" or "1.2 km". */
  const kmText=(km:number)=>km<1 ? `${Math.max(10,Math.round(km*100)*10)} m` : `${km.toFixed(1)} km`;
  /** A coloured banner saying plainly that a location is inside, or near, a power outage. */
  function powerBanner(site:Site){
    const inside=siteOutages.get(site.id) ?? [], near=siteNear.get(site.id) ?? [];
    if(!powerOn || (!inside.length && !near.length)) return undefined;
    const top=inside[0] ?? near[0].outage;
    const banner=el('div',undefined,`lm-world-outage-banner${inside.length ? '' : ' lm-world-outage-banner-near'}`);
    banner.style.setProperty('--outage',OUTAGE_COLORS[top.kind]);
    banner.append(el('strong',inside.length
      ? `⚡ ${top.kind==='current' ? 'INSIDE A POWER OUTAGE AREA' : 'INSIDE A PLANNED OUTAGE AREA'}`
      : `⚡ ${kmText(near[0].km)} FROM A ${top.kind==='current' ? 'POWER OUTAGE' : 'PLANNED OUTAGE'}`));
    const detail=[top.provider,top.municipality,top.customers!==null ? `${top.customers} customers` : '',outagePeriod(top)].filter(Boolean).join(' · ');
    banner.append(el('span',detail));
    if(inside.length>1) banner.append(el('span',`and ${inside.length-1} more outage${inside.length===2 ? '' : 's'} here`));
    const open=el('button','Show the outage');open.onclick=()=>select({type:'outage',id:top.id});banner.append(open);
    return banner;
  }
  function nextOutage(){
    // Current outages first, then planned.
    const affected=sites.filter(s=>siteOutages.has(s.id)).sort((a,b)=>Number(siteOutages.get(b.id)![0].kind==='current')-Number(siteOutages.get(a.id)![0].kind==='current'));
    if(!powerOn){message('Turn on ⚡ Power outages to step through affected locations.');return;}
    if(!affected.length){message(siteNear.size ? `No location is inside an outage area; ${siteNear.size} ${siteNear.size===1 ? 'is' : 'are'} within ${NEAR_KM} km of one.` : 'No location is inside or near an outage on the grid operators\' maps.');return;}
    outageCursor=(outageCursor+1)%affected.length;
    const site=affected[outageCursor];
    select({type:'site',id:site.id});centreOn(site);
    message(`Location in an outage area ${outageCursor+1} of ${affected.length}: ${siteName(site)}`);
  }
  function select(next:Selection|undefined){selected=next;renderDetails();renderSelection();}
  function closeButton(){const b=el('button','×','lm-close');b.setAttribute('aria-label','Close details');b.onclick=()=>select(undefined);return b;}
  function renderDetails(){
    panel.replaceChildren();
    const site=selected?.type==='site' ? sites.find(s=>s.id===selected!.id) : undefined;
    const node=selected?.type==='device' ? sites.flatMap(s=>s.nodes).find(n=>n.id===selected!.id) : undefined;
    const pair=selected?.type==='link' ? siteLinks.find(p=>p.key===selected!.id) : undefined;
    const warning=selected?.type==='warning' ? warnings.find(w=>w.id===selected!.id) : undefined;
    const outage=selected?.type==='outage' ? outages.find(o=>o.id===selected!.id) : undefined;
    if(site) return siteDetails(site);
    if(node) return deviceDetails(node);
    if(pair) return linkDetails(pair);
    if(warning) return warningDetails(warning);
    if(outage) return outageDetails(outage);
    panel.append(el('div','WORLD MAP','lm-eyebrow'),el('h2','Where the network is'),
      el('p','Each marker is a LibreNMS location, sized by its number of devices and coloured by the worst device status there. Lines are discovered links between locations, coloured by their busiest link.'));
    const internal=[...withinSite.values()].reduce((total,list)=>total+list.length,0);
    if(internal || undrawnUnlocated){
      const parts=[
        internal ? `${internal} join devices at the same location (listed under that location)` : '',
        undrawnUnlocated ? `${undrawnUnlocated} reach a device without coordinates` : '',
      ].filter(Boolean);
      panel.append(el('p',`${internal+undrawnUnlocated} link${internal+undrawnUnlocated===1 ? ' is' : 's are'} not drawn as lines: ${parts.join('; ')}.`,'lm-hint lm-world-undrawn'));
    }
    if(!showAddresses && !showDeviceNames) panel.append(el('p','Markers are shown without names. Select Addresses for the LibreNMS location text, or Device names to label them with their devices. Select a location to see its devices.','lm-hint'));
    else if(!showAddresses) panel.append(el('p','Select Addresses to show the LibreNMS location text and coordinates.','lm-hint'));
    if(weatherOn){
      panel.append(el('div',`WEATHER WARNINGS · ${warnings.length}`,'lm-eyebrow lm-world-section'));
      if(warnings.length) panel.append(warningList(warnings));
      else panel.append(el('p',weatherFetchedAt ? 'MET Norway has no active warnings.' : 'Loading weather warnings…'));
    }
    if(powerOn){
      panel.append(el('div',`POWER OUTAGES · ${outages.length}`,'lm-eyebrow lm-world-section'));
      if(outages.length) panel.append(...powerOverview());
      else panel.append(el('p',powerEvidence ? 'No outages on the grid operators\' maps. This does not confirm the power is on everywhere.' : 'Loading power outages…'));
      panel.append(powerStatus());
    }
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
      ['Devices',String(site.nodes.length)],['Down',String(down)],
      ...(showAddresses ? [['Coordinates',`${site.lat.toFixed(5)}, ${site.lng.toFixed(5)}`] as [string,string]] : []),
    ]));
    // First thing under the heading, so it cannot be missed.
    const banner=powerBanner(site);if(banner)panel.append(banner);
    const covering=siteWarnings.get(site.id) ?? [];
    if(covering.length) panel.append(el('div','WEATHER WARNINGS HERE','lm-eyebrow lm-world-section'),warningList(covering));
    if(powerOn) panel.append(el('div','POWER HERE','lm-eyebrow lm-world-section'),powerHere(site));
    const devices=el('div',undefined,'lm-device-list');devices.append(...site.nodes.map(deviceButton));panel.append(devices);
    const internal=withinSite.get(site.id) ?? [];
    if(internal.length){
      panel.append(el('div',`LINKS WITHIN THIS LOCATION · ${internal.length}`,'lm-eyebrow lm-world-section'),linkRows(internal));
    }
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
  function warningList(list:Warning[]){
    const box=el('div',undefined,'lm-device-list lm-world-warnings');
    // Most severe first; the drawing order is the reverse.
    for(const warning of [...list].sort((a,b)=>LEVEL_RANK[b.level]-LEVEL_RANK[a.level])){
      const b=el('button',undefined,'lm-world-device');
      const dot=el('i');dot.style.background=WARNING_COLORS[warning.level];
      b.append(dot,el('span',`${warning.title}${warning.area ? ` · ${warning.area}` : ''}`));
      b.title=`${LEVEL_NAMES[warning.level]} warning`;b.onclick=()=>select({type:'warning',id:warning.id});
      box.append(b);
    }
    return box;
  }
  function warningDetails(warning:Warning){
    const affected=sites.filter(site=>siteWarnings.get(site.id)?.includes(warning));
    panel.append(closeButton(),el('div',`${LEVEL_NAMES[warning.level].toUpperCase()} WARNING · MET NORWAY`,'lm-eyebrow'),el('h2',warning.title),list([
      ...(warning.area ? [['Area',warning.area] as [string,string]] : []),['When',warningPeriod(warning)],['Locations affected',String(affected.length)],
    ]));
    for(const [label,body] of [['',warning.description],['Consequences',warning.consequences],['Advice',warning.instruction]] as const){
      if(!body) continue;
      if(label) panel.append(el('div',label.toUpperCase(),'lm-eyebrow lm-world-section'));
      panel.append(el('p',body));
    }
    if(affected.length){
      const locations=el('div',undefined,'lm-device-list');
      for(const site of affected){const b=el('button',siteName(site));b.onclick=()=>{select({type:'site',id:site.id});centreOn(site);};locations.append(b);}
      panel.append(el('div','AFFECTED LOCATIONS','lm-eyebrow lm-world-section'),locations);
    }
    if(warning.web){const a=el('a','Details at MET Norway ↗','lm-device-link');a.href=warning.web;a.target='_blank';a.rel='noopener noreferrer';panel.append(a);}
  }
  /**
   * Totals, the outages that touch the map's locations, and the full list
   * folded away: there can be hundreds, and listing them all made the page
   * as long as the list.
   */
  function powerOverview():HTMLElement[] {
    const current=outages.filter(o=>o.kind==='current'), planned=outages.filter(o=>o.kind==='planned');
    const customers=current.reduce((total,o)=>total+(o.customers ?? 0),0);
    const parts:HTMLElement[]=[el('p',`${current.length} current · ${planned.length} planned${customers ? ` · ${customers.toLocaleString()} customers affected now` : ''}`,'lm-world-power-totals')];
    const touching=new Set<Outage>();
    for(const list of siteOutages.values())for(const o of list)touching.add(o);
    for(const list of siteNear.values())for(const n of list)touching.add(n.outage);
    parts.push(el('div',`AT YOUR LOCATIONS · ${touching.size}`,'lm-eyebrow lm-world-section'));
    parts.push(touching.size ? outageList([...touching]) : el('p',`None of these outages is at or within ${NEAR_KM} km of a located device.`));
    const all=el('details','','lm-world-outage-all');
    all.open=powerListOpen;all.addEventListener('toggle',()=>{powerListOpen=all.open;});
    all.append(el('summary',`All outages (${outages.length})`));
    const filters=el('div',undefined,'lm-world-outage-filters');
    for(const [kind,label] of [['current',`Current (${current.length})`],['planned',`Planned (${planned.length})`],['all','All']] as const){
      const b=el('button',label);b.setAttribute('aria-pressed',String(powerListKind===kind));b.classList.toggle('lm-active',powerListKind===kind);
      b.onclick=()=>{powerListKind=kind;renderDetails();};
      filters.append(b);
    }
    const shown=powerListKind==='all' ? outages : powerListKind==='current' ? current : planned;
    all.append(filters,shown.length ? outageList(shown) : el('p',`No ${powerListKind} outages.`));
    parts.push(all);
    return parts;
  }
  function outageList(list:Outage[]){
    const box=el('div',undefined,'lm-device-list lm-world-outages');
    // Current first, then by customers affected; the drawing order is the reverse.
    for(const outage of [...list].sort((a,b)=>Number(b.kind==='current')-Number(a.kind==='current') || (b.customers ?? 0)-(a.customers ?? 0))){
      const b=el('button',undefined,'lm-world-device');
      const dot=el('i');dot.style.background=OUTAGE_COLORS[outage.kind];
      b.append(dot,el('span',`${outage.provider}${outage.municipality ? ` · ${outage.municipality}` : ''}${outage.customers!==null ? ` · ${outage.customers} customers` : ''}`));
      b.title=KIND_NAMES[outage.kind];
      // Outages found by the location check may have no drawn shape to open.
      if(outages.some(o=>o.id===outage.id)) b.onclick=()=>select({type:'outage',id:outage.id});
      else b.disabled=true;
      box.append(b);
    }
    return box;
  }
  /** "Maps read at …", and any operator map that is stale or failed to read. */
  function powerStatus(){
    const box=el('div',undefined,'lm-hint lm-world-power-status');
    if(!powerEvidence){box.textContent='Grid operator maps: waiting for DRIFT.';return box;}
    box.append(el('p',`${mapsReadAt(powerEvidence)} · ${powerEvidence.source}`));
    if(!powerComplete) box.append(el('p','The list may be incomplete: it was cut off, or a map has not been read yet.'));
    for(const [reason,count] of Object.entries(powerSkipped)){
      if(reason==='shape_too_large') box.append(el('p',`⚠ ${count} outage area${count===1 ? ' was' : 's were'} too detailed to draw and ${count===1 ? 'is' : 'are'} shown as a pin.`));
      else box.append(el('p',`⚠ ${count} outage${count===1 ? '' : 's'} from DRIFT ${count===1 ? 'is' : 'are'} not on the map: ${SKIPPED_REASONS[reason] ?? reason}.`));
    }
    for(const limitation of powerEvidence.limitations) box.append(el('p',`⚠ ${limitation}`));
    for(const provider of powerHealth?.providers ?? []){
      if(provider.lastError) box.append(el('p',`⚠ ${provider.name}: ${provider.lastError}${provider.lastErrorAt ? ` (${new Date(provider.lastErrorAt).toLocaleTimeString()})` : ''}`));
      else if(!provider.fetchedAt) box.append(el('p',`${provider.name}: map not read yet`));
    }
    return box;
  }
  /** The /outage-at verdict for a location, fetched when it is opened and at most once a minute. */
  function powerHere(site:Site){
    const box=el('div',undefined,'lm-world-power-here');
    const entry=siteChecks.get(site.id);
    if(!entry || Date.now()-entry.at>POWER_CHECK_MS) void checkSite(site);
    if(!entry || (!entry.check && !entry.error)){box.append(el('p','Checking the grid operators\' maps…'));return box;}
    if(entry.error){box.append(el('p',entry.error,'lm-hint'));return box;}
    const check=entry.check!;
    const verdict=el('p',verdictText(check),`lm-world-verdict lm-world-${check.verdict}`);
    box.append(verdict);
    if(check.why) box.append(el('p',check.why,'lm-hint'));
    if(check.outages.length) box.append(outageList(check.outages.map(o=>outages.find(drawn=>drawn.id===o.id) ?? o)));
    box.append(el('p',mapsReadAt(check.evidence),'lm-hint'));
    for(const limitation of check.evidence.limitations) box.append(el('p',`⚠ ${limitation}`,'lm-hint'));
    return box;
  }
  async function checkSite(site:Site){
    const endpoint=root.dataset.powerAtEndpoint;
    if(!endpoint) return;
    const previous=siteChecks.get(site.id);
    siteChecks.set(site.id,{at:Date.now(),check:previous?.check});
    try{
      const url=new URL(endpoint,location.href);url.searchParams.set('lat',String(site.lat));url.searchParams.set('lon',String(site.lng));
      siteChecks.set(site.id,{at:Date.now(),check:parseCheck(await getJson(url.href,'power outage check'))});
    }catch(error){
      siteChecks.set(site.id,{at:Date.now(),error:error instanceof Error ? error.message : 'The power outage check failed.'});
    }
    if(powerOn && selected?.type==='site' && selected.id===site.id) renderDetails();
  }
  /** Fit the whole outage area or lines into view; a point-only outage is centred at a street-level zoom. */
  function focusOutage(outage:Outage){
    const b=outage.bounds;
    const points=b ? [{lat:b.minLat,lng:b.minLng},{lat:b.maxLat,lng:b.maxLng}] : outage.anchor ? [{lat:outage.anchor[1],lng:outage.anchor[0]}] : [];
    if(!points.length) return;
    measure();
    const {w,h}=size();
    // A tiny area is not zoomed in further than street level.
    const target=fitView(points,w,h,FIT_PADDING,Math.min(places?.map.maxZoom ?? 18,15),14);
    setView(target.zoom,target.center);
  }
  function outageDetails(outage:Outage){
    const affected=sites.filter(site=>siteOutages.get(site.id)?.includes(outage));
    const nearby=sites.map(site=>({site,near:siteNear.get(site.id)?.find(n=>n.outage===outage)})).filter((s):s is {site:Site;near:NearOutage}=>!!s.near);
    panel.append(closeButton(),el('div',`${KIND_NAMES[outage.kind].toUpperCase()} · ${outage.provider.toUpperCase()}`,'lm-eyebrow'),el('h2',outage.municipality ?? outage.provider),list([
      ...(outage.state ? [['State',outage.state] as [string,string]] : []),
      ...(outage.type ? [['Type',outage.type] as [string,string]] : []),
      ...(outage.customers!==null ? [['Customers affected',String(outage.customers)] as [string,string]] : []),
      ['When',outagePeriod(outage)],
      ...(outage.gridLevel ? [['Grid level',outage.gridLevel] as [string,string]] : []),
      ...(outage.reason ? [['Reason',outage.reason] as [string,string]] : []),
      ['Locations in area',String(affected.length)],
      ['Devices in area',String(affected.reduce((total,site)=>total+site.nodes.length,0))],
    ]));
    if(outage.text) panel.append(el('p',outage.text));
    if(outageShape(outage)==='point') panel.append(el('p','The grid operator gives this outage as a point, without an area, so the map cannot tell which locations it covers. Locations within 1 km are listed as near it.','lm-hint'));
    if(outage.shapeDropped) panel.append(el('p','This outage\'s area was too detailed to draw alongside the others, so it is shown as a pin.','lm-hint'));
    const show=el('button','Show on the map','lm-world-back');
    show.onclick=()=>focusOutage(outage);
    panel.append(show);
    if(affected.length){
      const locations=el('div',undefined,'lm-device-list lm-world-in-outage-list');
      for(const site of affected){const b=el('button',`⚡ ${siteName(site)} · ${site.nodes.length} device${site.nodes.length===1 ? '' : 's'}`);b.onclick=()=>{select({type:'site',id:site.id});centreOn(site);};locations.append(b);}
      panel.append(el('div','LOCATIONS INSIDE THIS AREA','lm-eyebrow lm-world-section'),locations);
    }
    if(nearby.length){
      const locations=el('div',undefined,'lm-device-list');
      for(const {site,near} of nearby.sort((a,b)=>a.near.km-b.near.km)){const b=el('button',`${siteName(site)} · ${kmText(near.km)} away`);b.onclick=()=>{select({type:'site',id:site.id});centreOn(site);};locations.append(b);}
      panel.append(el('div',`LOCATIONS WITHIN ${NEAR_KM} KM`,'lm-eyebrow lm-world-section'),locations);
    }
    panel.append(powerStatus());
  }
  function deviceDetails(n:MapNode){
    const site=sites.find(s=>s.nodes.includes(n))!;
    const back=el('button',`← ${siteName(site)}`,'lm-world-back');back.onclick=()=>select({type:'site',id:site.id});
    panel.append(closeButton(),back,el('div',`${n.role} / DEVICE`,'lm-eyebrow'),el('h2',nameOf(n)),list([
      // The heading is the hostname, else the sysName or IP; show the other identifiers beside it.
      ['Status',n.status],
      ...(n.hostname.trim() && n.hostname.trim()!==nameOf(n) ? [[isAddress(n.hostname.trim()) ? 'IP address' : 'Hostname',n.hostname.trim()] as [string,string]] : []),
      ...(n.sysName?.trim() && n.sysName.trim()!==nameOf(n) ? [['sysName',n.sysName.trim()] as [string,string]] : []),['Location',siteName(site)],...(siteOfDevice(n) ? [['Site',siteOfDevice(n)] as [string,string]] : []),
    ]));
    const banner=powerBanner(site);if(banner)panel.append(banner);
    if(n.url){const url=new URL(n.url,location.href);if(url.origin===location.origin){const a=el('a','Open in LibreNMS ↗','lm-device-link');a.href=url.href;panel.append(a);}}
  }
  /** Each link's load and both interfaces; a far port LibreNMS did not match is marked. */
  function linkRows(links:Link[]){
    const names=new Map(graph.nodes.map(n=>[n.id,nameOf(n)]));
    const rows=el('ul',undefined,'lm-world-links-list');
    const now=serverNow(), staleAfter=snapshot?.config.staleAfter ?? 900;
    for(const link of links){
      const m=metric(link,now,staleAfter);
      const item=el('li');const state=el('strong',m.label);state.style.color=m.color;
      const far=link.targetPortId ? link.targetPort : `${link.targetPort} (reported by neighbor)`;
      item.append(state,el('span',`${names.get(link.source) ?? link.source} ${link.sourcePort} ↔ ${names.get(link.target) ?? link.target} ${far}`));
      rows.append(item);
    }
    return rows;
  }
  function linkDetails(pair:SiteLink){
    panel.append(closeButton(),el('div','CONNECTIONS','lm-eyebrow'),el('h2',`${siteName(pair.a)} ↔ ${siteName(pair.b)}`),list([['Links',String(pair.links.length)],['Status',pair.label]]),linkRows(pair.links));
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
      // Numbered by LibreNMS location ID, so a location keeps its number across refreshes and filters.
      locationNumbers=new Map([...places.locations].sort((a,b)=>Number(a.id)-Number(b.id) || a.id.localeCompare(b.id)).map((l,i)=>[l.id,i+1]));
      clockOffset=Number.isFinite(snapshot.generatedAt) ? snapshot.generatedAt-Date.now()/1000 : 0;
      const group=groupSelect.value;
      groupSelect.replaceChildren(new Option('All device groups',''),...graph.deviceGroups.map(g=>new Option(g.name,g.id)));
      groupSelect.value=graph.deviceGroups.some(g=>g.id===group) ? group : '';
      updateAttribution();
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
  function updateAttribution(){
    const attribution=$<HTMLElement>('.lm-world-attribution');
    attribution.textContent=[places?.map.tiles ? places.map.attribution : '',weatherOn ? weatherAttribution || 'Weather warnings © MET Norway' : '',powerOn ? `Power outages: grid operators' maps via ${powerEvidence?.source ?? 'DRIFT'}` : ''].filter(Boolean).join(' · ');
    attribution.hidden=!attribution.textContent;
  }
  async function refreshWeather(){
    if(!weatherOn || weatherBusy || !weatherEndpoint) return;
    weatherBusy=true;syncControls();
    try{
      const feed=parseWarnings(await getJson(weatherEndpoint,'weather warning'));
      if(!weatherOn) return;
      warnings=feed.warnings;weatherAttribution=feed.attribution;weatherFetchedAt=feed.fetchedAt || Date.now()/1000;
      buildWeather();rebuild();updateAttribution();
      const at=new Date(weatherFetchedAt*1000).toLocaleTimeString();
      message(feed.stale ? `MET Norway is unreachable · Showing the weather warnings from ${at}.` : `${warnings.length} active weather warning${warnings.length===1 ? '' : 's'} · ${siteWarnings.size} location${siteWarnings.size===1 ? '' : 's'} affected · MET Norway, ${at}`,feed.stale);
    }catch(error){
      message(`${error instanceof Error ? error.message : 'Weather warnings are unavailable.'}${warnings.length ? ' · Showing the last warnings received.' : ''}`,true);
    }finally{weatherBusy=false;syncControls();}
  }
  function setWeather(on:boolean){
    weatherOn=on && !!weatherEndpoint;savePrefs();
    if(!weatherOn){warnings=[];weatherFetchedAt=0;if(selected?.type==='warning')selected=undefined;}
    buildWeather();rebuild();updateAttribution();syncControls();
    if(weatherOn)void refreshWeather();
  }
  async function refreshPower(){
    if(!powerOn || powerBusy || !powerEndpoint) return;
    powerBusy=true;syncControls();
    try{
      // The status is a supplement: the outages are still drawn if it fails.
      const [feed,health]=await Promise.all([
        getJson(powerEndpoint,'power outage').then(parseOutages),
        getJson(root.dataset.powerHealthEndpoint,'power outage status').then(parseHealth).catch(()=>undefined),
      ]);
      if(!powerOn) return;
      outages=feed.outages;powerEvidence=feed.evidence;powerComplete=feed.complete;powerHealth=health;powerSkipped=feed.skipped;
      buildPower();rebuild();updateAttribution();
      const current=outages.filter(o=>o.kind==='current').length;
      const missing=Object.entries(feed.skipped).filter(([reason])=>reason!=='shape_too_large').reduce((total,[,count])=>total+count,0);
      const caveats=[...feed.evidence.limitations,...(feed.complete ? [] : ['the list may be incomplete']),...(missing ? [`${missing} outage${missing===1 ? '' : 's'} could not be placed`] : [])];
      message(`${current} current and ${outages.length-current} planned power outage${outages.length===1 ? '' : 's'} · ${siteOutages.size} location${siteOutages.size===1 ? '' : 's'} inside an outage area${siteNear.size ? `, ${siteNear.size} within ${NEAR_KM} km` : ''} · ${mapsReadAt(feed.evidence)}${caveats.length ? ` · ⚠ ${caveats.join('; ')}` : ''}`,caveats.length>0);
    }catch(error){
      message(`${error instanceof Error ? error.message : 'Power outages are unavailable.'}${outages.length ? ' · Showing the last outages received.' : ''}`,true);
    }finally{powerBusy=false;syncControls();}
  }
  function setPower(on:boolean){
    powerOn=on && !!powerEndpoint;savePrefs();
    if(!powerOn){outages=[];powerEvidence=undefined;powerHealth=undefined;powerComplete=true;powerSkipped={};outageCursor=-1;siteChecks.clear();if(selected?.type==='outage')selected=undefined;}
    buildPower();rebuild();updateAttribution();syncControls();
    if(powerOn)void refreshPower();
  }

  // ---- Interaction --------------------------------------------------------
  let drag:{id:number;start:Point;center:Point;moved:boolean;warning?:string;outage?:string}|undefined;
  viewport.addEventListener('pointerdown',event=>{
    if(event.button!==0 || (event.target as Element).closest('.lm-world-marker, .lm-world-link')) return;
    // Warning and outage areas cover the map; pressing one still pans, and only a click selects it.
    const warning=(event.target as Element).closest<SVGPathElement>('.lm-world-warning')?.dataset.warning;
    const outage=(event.target as Element).closest<SVGElement>('.lm-world-outage, .lm-world-outage-pin')?.dataset.outage;
    drag={id:event.pointerId,start:{x:event.clientX,y:event.clientY},center:{...view.center},moved:false,warning,outage};
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
    // A click on a warning or outage area selects it, on empty map clears the selection; a drag does neither.
    if(!drag.moved && event.type==='pointerup'){
      if(drag.outage) select({type:'outage',id:drag.outage});
      else if(drag.warning) select({type:'warning',id:drag.warning});
      else if(selected) select(undefined);
    }
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
      case 'weather':setWeather(!weatherOn);break;
      case 'power':setPower(!powerOn);break;
      case 'addresses':showAddresses=!showAddresses;savePrefs();syncControls();rebuild();break;
      case 'names':showDeviceNames=!showDeviceNames;savePrefs();syncControls();rebuild();break;
      case 'refresh':void refresh();break;
      case 'fit':fit();break;
      case 'zoom-in':zoomBy(1);break;
      case 'zoom-out':zoomBy(-1);break;
      case 'next-down':nextDown();break;
      case 'next-outage':nextOutage();break;
      case 'fullscreen':void (document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen()).catch(()=>message('Fullscreen is unavailable in this browser.'));break;
    }
  });
  document.addEventListener('keydown',event=>{
    if(!shortcutAllowed(event,root)) return;
    const pan=(dx:number,dy:number)=>setView(view.zoom,{x:view.center.x+dx,y:view.center.y+dy});
    const actions:Record<string,()=>void>={
      '/':()=>{if(!search.disabled)search.focus();},
      f:fit,'+':()=>zoomBy(1),'=':()=>zoomBy(1),'-':()=>zoomBy(-1),d:nextDown,o:nextOutage,
      ArrowLeft:()=>pan(-120,0),ArrowRight:()=>pan(120,0),ArrowUp:()=>pan(0,-120),ArrowDown:()=>pan(0,120),
      Escape:()=>{if(selected)select(undefined);},
    };
    const action=actions[event.key.length===1 ? event.key.toLowerCase() : event.key];
    if(action){event.preventDefault();action();}
  });
  // The viewport clips the map but can still be scrolled by the browser, for example to show
  // a focused marker near its edge. That would shift everything the view maths places; undo it.
  viewport.addEventListener('scroll',()=>{if(viewport.scrollLeft || viewport.scrollTop){viewport.scrollLeft=0;viewport.scrollTop=0;}});
  new ResizeObserver(()=>{measure();setView(view.zoom,view.center);if(!fitted && sites.length){fit();fitted=true;}}).observe(viewport);
  // Re-judge link staleness between fetches on the server's clock.
  setInterval(()=>{if(snapshot && siteLinks.length)recolorLinks();},10000);
  setInterval(()=>{if(!document.hidden)void refresh();},60000);
  setInterval(()=>{if(weatherOn && !document.hidden)void refreshWeather();},WEATHER_REFRESH_MS);
  setInterval(()=>{if(powerOn && !document.hidden)void refreshPower();},POWER_REFRESH_MS);

  // Read-only diagnostic hook for browser checks with fixtures that opt in.
  if(root.dataset.debug==='true') Object.defineProperty(window,'libremapWorldDebug',{value:()=>({
    zoom:view.zoom,center:{...view.center},
    markers:sites.map(site=>({id:site.id,name:site.name,label:mapName(site),text:markers.get(site.id)?.querySelector('.lm-world-label')?.textContent ?? '',count:site.nodes.length,status:site.status,warning:worstLevel(siteWarnings.get(site.id) ?? []) ?? null,outage:siteOutages.get(site.id)?.[0]?.kind ?? null,nearOutage:siteNear.get(site.id)?.[0]?.outage.kind ?? null,position:screen(project(site,view.zoom))})),
    links:siteLinks.map(pair=>({key:pair.key,count:pair.links.length,state:pair.state,label:pair.label,color:pair.color})),
    undrawn:{withinSite:Object.fromEntries([...withinSite].map(([id,list])=>[id,list.length])),unlocated:undrawnUnlocated},
    warnings:weatherOn ? warnings.map(w=>({id:w.id,level:w.level,drawn:!!weatherPaths.get(w.id)?.getAttribute('d')})) : [],
    outages:powerOn ? outages.map(o=>({id:o.id,kind:o.kind,shape:outageShape(o),drawn:!!powerPaths.get(o.id)?.getAttribute('d') || !!powerPins.get(o.id)?.getAttribute('transform'),pinned:!!powerPins.get(o.id)?.getAttribute('transform')})) : [],
    tiles:[...tiles.values()].map(image=>image.src),
  }),configurable:true});

  syncControls();renderDetails();buildWeather();buildPower();void refresh();
  if(weatherOn)void refreshWeather();
  if(powerOn)void refreshPower();
}
