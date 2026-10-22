import { insidePolygon, pathData, project, type LatLng, type Ring } from './geo';

export type OutageKind='current'|'planned';
export type Verdict='in_outage_area'|'near_outage'|'no_known_outage';
export interface Outage {
  id:string; provider:string; kind:OutageKind;
  state:string|null; type:string|null; municipality:string|null; customers:number|null;
  text:string|null; gridLevel:string|null; reason:string|null;
  start:string|null; expectedEnd:string|null; endedAt:string|null;
  point:[number,number]|null; polygons:Ring[][]; lines:Ring[];
  // Where the outage's pin goes, so even an area too small to see at this zoom is marked.
  anchor:[number,number]|null;
  // The server could not draw this outage's shape (too detailed) and placed it at a point instead.
  shapeDropped:boolean;
  distanceKm:number|null;
  bounds:{minLat:number;maxLat:number;minLng:number;maxLng:number}|null;
}
export interface Evidence { source:string; observedAt:string|null; limitations:string[] }
export interface OutageFeed { outages:Outage[]; evidence:Evidence; count:number; complete:boolean; skipped:Record<string,number> }
/** An outage close to, but not containing, a place. */
export interface NearOutage { outage:Outage; km:number }
export interface OutageCheck { verdict:Verdict; why:string; outages:Outage[]; evidence:Evidence }
export interface ProviderHealth { key:string; name:string; fetchedAt:string|null; lastError:string|null; lastErrorAt:string|null }
export interface PowerHealth { status:'ok'|'not_read_yet'; providers:ProviderHealth[] }

// Distinct from the weather warnings' yellow, orange and red.
export const OUTAGE_COLORS:Record<OutageKind,string>={current:'#c2255c',planned:'#7048e8'};
export const KIND_NAMES:Record<OutageKind,string>={current:'Current outage',planned:'Planned outage'};
// A place this close to an outage area, line or point counts as near it.
export const NEAR_KM=1;
// Why the server left outages off the map.
export const SKIPPED_REASONS:Record<string,string>={unknown_kind:'not marked current or planned',no_location:'without a location'};

const object=(value:unknown):value is Record<string,unknown> => !!value && typeof value==='object' && !Array.isArray(value);
const text=(value:unknown,max:number)=>typeof value==='string' ? Array.from(value.trim()).slice(0,max).join('') : '';
const optional=(value:unknown,max:number)=>text(value,max) || null;
const time=(value:unknown)=>typeof value==='string' && !Number.isNaN(Date.parse(value)) ? value : null;
const isPoint=(p:unknown):p is [number,number] => Array.isArray(p) && typeof p[0]==='number' && typeof p[1]==='number' && Math.abs(p[0])<=180 && Math.abs(p[1])<=90;

function parseEvidence(value:unknown):Evidence {
  const e=object(value) ? value : {};
  return {
    source:text(e.source,120) || 'DRIFT',
    observedAt:time(e.observed_at),
    limitations:Array.isArray(e.limitations) ? e.limitations.map(l=>text(l,300)).filter(Boolean).slice(0,20) : [],
  };
}

const boxArea=(ring:Ring)=>{
  const lngs=ring.map(p=>p[0]), lats=ring.map(p=>p[1]);
  return (Math.max(...lngs)-Math.min(...lngs))*(Math.max(...lats)-Math.min(...lats));
};
/**
 * A point inside a polygon: the middle of its bounding box when that is
 * inside, else the middle of the widest stretch inside the outline on a row
 * near the middle. The box's middle alone can fall outside an L- or U-shaped
 * area, or in a hole.
 */
export function interiorPoint(polygon:Ring[]):[number,number] {
  const outer=polygon[0], lngs=outer.map(p=>p[0]), lats=outer.map(p=>p[1]);
  const minLat=Math.min(...lats), maxLat=Math.max(...lats);
  const centre={lng:(Math.min(...lngs)+Math.max(...lngs))/2,lat:(minLat+maxLat)/2};
  if(insidePolygon(centre,polygon)) return [centre.lng,centre.lat];
  for(const share of [.5,.45,.55,.35,.65,.25,.75,.15,.85]){
    const lat=minLat+(maxLat-minLat)*share, xs:number[]=[];
    for(let i=0,j=outer.length-1;i<outer.length;j=i++){
      const [xi,yi]=outer[i], [xj,yj]=outer[j];
      if((yi>lat)!==(yj>lat)) xs.push(xi+(lat-yi)*(xj-xi)/(yj-yi));
    }
    xs.sort((a,b)=>a-b);
    let best:[number,number]|undefined, width=0;
    for(let k=0;k+1<xs.length;k+=2){
      const mid:[number,number]=[(xs[k]+xs[k+1])/2,lat];
      if(xs[k+1]-xs[k]>width && insidePolygon({lng:mid[0],lat},polygon)){best=mid;width=xs[k+1]-xs[k];}
    }
    if(best) return best;
  }
  return outer[0];
}
/**
 * Where an outage's pin goes. The operator's point is used only when it lies
 * in the outage's area (or within 500 m of its lines): it is not always the
 * area's own position. Otherwise a point inside the largest area, or the
 * middle of the longest line.
 */
function anchorOf(point:[number,number]|null, polygons:Ring[][], lines:Ring[]):[number,number]|null {
  const at=point ? {lng:point[0],lat:point[1]} : undefined;
  if(polygons.length){
    if(point && at && polygons.some(p=>insidePolygon(at,p))) return point;
    return interiorPoint([...polygons].sort((a,b)=>boxArea(b[0])-boxArea(a[0]))[0]);
  }
  if(lines.length){
    if(point && at && lines.some(line=>line.some((p,i)=>i>0 && segmentKm(at,line[i-1],p)<=.5))) return point;
    const line=lines.reduce((a,b)=>b.length>a.length ? b : a);
    return line[Math.floor(line.length/2)];
  }
  return point;
}

/** One outage; the server already simplifies DRIFT's answer, but it is still treated as untrusted. */
function parseOutage(o:unknown):Outage|undefined {
  if(!object(o) || typeof o.id!=='string' || !o.id || (o.kind!=='current' && o.kind!=='planned')) return undefined;
  const polygons:Ring[][]=[];
  for(const polygon of Array.isArray(o.polygons) ? o.polygons : []){
    if(!Array.isArray(polygon)) continue;
    const rings=polygon.filter((ring):ring is Ring=>Array.isArray(ring) && ring.length>=4 && ring.every(isPoint));
    if(rings.length && rings[0]===polygon[0]) polygons.push(rings);
  }
  const lines=(Array.isArray(o.lines) ? o.lines : []).filter((line):line is Ring=>Array.isArray(line) && line.length>=2 && line.every(isPoint));
  const point=isPoint(o.point) ? o.point : null;
  // The bounds are the drawn shape's; the operator's point counts only for an outage without one.
  const shape=[...polygons.flatMap(p=>p[0]),...lines.flat()];
  const points=shape.length ? shape : point ? [point] : [];
  const lngs=points.map(p=>p[0]), lats=points.map(p=>p[1]);
  return {
    id:o.id,provider:text(o.provider,80) || 'Grid operator',kind:o.kind,
    state:optional(o.state,80),type:optional(o.type,80),municipality:optional(o.municipality,120),
    customers:typeof o.customers==='number' && Number.isFinite(o.customers) && o.customers>=0 ? Math.round(o.customers) : null,
    text:optional(o.text,1000),gridLevel:optional(o.grid_level,80),reason:optional(o.reason,300),
    start:time(o.start),expectedEnd:time(o.expected_end),endedAt:time(o.ended_at),
    point,polygons,lines,anchor:anchorOf(point,polygons,lines),shapeDropped:o.shape_dropped===true,
    distanceKm:typeof o.distance_km==='number' && Number.isFinite(o.distance_km) ? o.distance_km : null,
    bounds:points.length ? {minLat:Math.min(...lats),maxLat:Math.max(...lats),minLng:Math.min(...lngs),maxLng:Math.max(...lngs)} : null,
  };
}

/** Outages to draw: those with an area, lines or a point. Planned ones draw first, under current ones. */
export function parseOutages(value:unknown):OutageFeed {
  if(!object(value) || !Array.isArray(value.outages)) throw new Error('Unexpected power outage response.');
  const outages=value.outages.map(parseOutage).filter((o):o is Outage=>!!o && !!o.bounds);
  outages.sort((a,b)=>Number(a.kind==='current')-Number(b.kind==='current'));
  return {
    outages,evidence:parseEvidence(value.evidence),
    count:typeof value.count==='number' ? value.count : outages.length,
    complete:value.complete===true,
    skipped:object(value.skipped) ? Object.fromEntries(Object.entries(value.skipped).filter((e):e is [string,number]=>typeof e[1]==='number' && e[1]>0)) : {},
  };
}

export function parseCheck(value:unknown):OutageCheck {
  if(!object(value) || !(value.verdict==='in_outage_area' || value.verdict==='near_outage' || value.verdict==='no_known_outage')) throw new Error('Unexpected power outage response.');
  return {
    verdict:value.verdict,why:text(value.why,500),
    outages:(Array.isArray(value.outages) ? value.outages : []).map(parseOutage).filter((o):o is Outage=>!!o),
    evidence:parseEvidence(value.evidence),
  };
}

export function parseHealth(value:unknown):PowerHealth {
  if(!object(value) || !(value.status==='ok' || value.status==='not_read_yet')) throw new Error('Unexpected power outage status response.');
  const providers=object(value.providers) ? Object.entries(value.providers) : [];
  return {status:value.status,providers:providers.filter(([,p])=>object(p)).map(([key,p])=>{
    const provider=p as Record<string,unknown>;
    return {key,name:text(provider.name,80) || key,fetchedAt:time(provider.fetched_at),lastError:optional(provider.last_error,300),lastErrorAt:time(provider.last_error_at)};
  })};
}

/** Outages whose affected area contains the point, current ones first. Lines and points have no inside. */
export function outagesAt(point:LatLng, outages:Outage[]):Outage[] {
  return outages.filter(o=>o.bounds && point.lat>=o.bounds.minLat && point.lat<=o.bounds.maxLat && point.lng>=o.bounds.minLng && point.lng<=o.bounds.maxLng
    && o.polygons.some(polygon=>insidePolygon(point,polygon)))
    .sort((a,b)=>Number(b.kind==='current')-Number(a.kind==='current'));
}

/** Kilometres from a place to a point, on a local flat approximation; ample for distances of a few kilometres. */
function km(from:LatLng,[lng,lat]:[number,number]):{x:number;y:number} {
  return {x:(lng-from.lng)*111.32*Math.cos(from.lat*Math.PI/180),y:(lat-from.lat)*110.574};
}
function segmentKm(from:LatLng,a:[number,number],b:[number,number]):number {
  const p=km(from,a), q=km(from,b), dx=q.x-p.x, dy=q.y-p.y, length=dx*dx+dy*dy;
  const t=length ? Math.max(0,Math.min(1,-(p.x*dx+p.y*dy)/length)) : 0;
  return Math.hypot(p.x+t*dx,p.y+t*dy);
}
/** How far a place is from an outage's area edge, lines or point, in kilometres. */
export function distanceToOutage(place:LatLng, outage:Outage):number {
  let best=Infinity;
  const edges=(ring:Ring,closed:boolean)=>{for(let i=1;i<ring.length;i++)best=Math.min(best,segmentKm(place,ring[i-1],ring[i]));if(closed && ring.length>1)best=Math.min(best,segmentKm(place,ring[ring.length-1],ring[0]));};
  for(const polygon of outage.polygons)for(const ring of polygon)edges(ring,true);
  for(const line of outage.lines)edges(line,false);
  // The operator's point stands in only for an outage without an area or lines.
  if(outage.point && !outage.polygons.length && !outage.lines.length){const p=km(place,outage.point);best=Math.min(best,Math.hypot(p.x,p.y));}
  return best;
}
/** Outages within `limit` km of a place that do not contain it, nearest first. */
export function outagesNear(place:LatLng, outages:Outage[], limit=NEAR_KM):NearOutage[] {
  // About `limit` km in degrees, with room to spare, to skip far outages cheaply.
  const dLat=limit/110, dLng=limit/(111*Math.max(.1,Math.cos(place.lat*Math.PI/180)));
  const inside=new Set(outagesAt(place,outages));
  return outages.filter(o=>o.bounds && !inside.has(o) && place.lat>=o.bounds.minLat-dLat && place.lat<=o.bounds.maxLat+dLat && place.lng>=o.bounds.minLng-dLng && place.lng<=o.bounds.maxLng+dLng)
    .map(outage=>({outage,km:distanceToOutage(place,outage)}))
    .filter(n=>n.km<=limit)
    .sort((a,b)=>a.km-b.km);
}

/** An SVG path in world pixels at `zoom`: areas (holes cut by even-odd) or open lines. A point-only outage has only its pin. */
export function outagePath(outage:Outage, zoom:number):string {
  const areas=outage.polygons.map(polygon=>polygon.map(ring=>pathData(ring,zoom,true)).join('')).join('');
  const lines=outage.lines.map(line=>pathData(line,zoom,false)).join('');
  return areas+lines;
}

/** World pixels of an outage's pin at `zoom`. */
export function outageAnchorAt(outage:Outage, zoom:number) {
  return outage.anchor ? project({lat:outage.anchor[1],lng:outage.anchor[0]},zoom) : undefined;
}

/** How an outage is drawn: an area to fill, lines to stroke, or a point marker. */
export const outageShape=(outage:Outage)=>outage.polygons.length ? 'area' : outage.lines.length ? 'lines' : 'point';

const when=(t:string|null)=>t ? new Date(t).toLocaleString(undefined,{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '';

/** "Mon 21 Oct, 14:00 – expected Tue 22 Oct, 06:00" in the viewer's locale and time zone. */
export function outagePeriod(outage:Outage):string {
  const start=when(outage.start), end=when(outage.endedAt ?? outage.expectedEnd);
  const endLabel=outage.endedAt ? 'fixed' : 'expected';
  return start && end ? `${start} – ${endLabel} ${end}` : end ? `${endLabel[0].toUpperCase()}${endLabel.slice(1)} ${end}` : start ? `From ${start}` : 'Time not given';
}

/** "Maps read at 14:05", from the evidence's observed_at. */
export function mapsReadAt(evidence:Evidence):string {
  return evidence.observedAt ? `Maps read at ${new Date(evidence.observedAt).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})}` : 'Maps not read yet';
}

/**
 * A verdict in words. "No known outage" means only that nothing is on the
 * grid operators' maps there: it is never worded as the power being on.
 */
export function verdictText(check:OutageCheck):string {
  if(check.verdict==='in_outage_area') return 'Inside an outage area on the grid operator\'s map.';
  if(check.verdict==='near_outage'){
    const nearest=check.outages.map(o=>o.distanceKm).filter((d):d is number=>d!==null).sort((a,b)=>a-b)[0];
    return `Near an outage on the grid operator's map${nearest!==undefined ? ` (${nearest<1 ? nearest.toFixed(1) : Math.round(nearest)} km away)` : ''}.`;
  }
  return 'No outage on the grid operators\' maps here. This does not confirm the power is on.';
}
