import { insidePolygon, pathData, type LatLng, type Ring } from './geo';

export type WarningLevel='yellow'|'orange'|'red';
export interface Warning {
  id:string; level:WarningLevel; event:string; title:string; area:string;
  description:string; instruction:string; consequences:string;
  start:string|null; end:string|null; web:string|null; marine:boolean;
  polygons:Ring[][];
  bounds:{minLat:number;maxLat:number;minLng:number;maxLng:number};
}
export interface WarningFeed { warnings:Warning[]; attribution:string; fetchedAt:number; stale:boolean }

// MET Norway's awareness colours, slightly darkened so yellow reads on light tiles.
export const WARNING_COLORS:Record<WarningLevel,string>={yellow:'#e6b800',orange:'#f08a24',red:'#e03131'};
export const LEVEL_RANK:Record<WarningLevel,number>={yellow:1,orange:2,red:3};
export const LEVEL_NAMES:Record<WarningLevel,string>={yellow:'Yellow',orange:'Orange',red:'Red'};

const object=(value:unknown):value is Record<string,unknown> => !!value && typeof value==='object' && !Array.isArray(value);
const text=(value:unknown,max:number)=>typeof value==='string' ? Array.from(value.trim()).slice(0,max).join('') : '';
const isPoint=(p:unknown):p is [number,number] => Array.isArray(p) && typeof p[0]==='number' && typeof p[1]==='number' && Math.abs(p[0])<=180 && Math.abs(p[1])<=90;

/** The server already simplifies MET's feed; still treat it as untrusted. */
export function parseWarnings(value:unknown):WarningFeed {
  if(!object(value) || !Array.isArray(value.warnings)) throw new Error('Unexpected weather warning response.');
  const warnings:Warning[]=[];
  for(const w of value.warnings){
    if(!object(w) || typeof w.id!=='string' || !(w.level==='yellow' || w.level==='orange' || w.level==='red') || !Array.isArray(w.polygons)) continue;
    const polygons:Ring[][]=[];
    for(const polygon of w.polygons){
      if(!Array.isArray(polygon)) continue;
      const rings=polygon.filter((ring):ring is Ring=>Array.isArray(ring) && ring.length>=4 && ring.every(isPoint));
      if(rings.length && rings[0]===polygon[0]) polygons.push(rings);
    }
    if(!polygons.length) continue;
    const points=polygons.flatMap(p=>p[0]);
    const lngs=points.map(p=>p[0]), lats=points.map(p=>p[1]);
    const web=typeof w.web==='string' && /^https:\/\//i.test(w.web) ? w.web : null;
    const time=(t:unknown)=>typeof t==='string' && !Number.isNaN(Date.parse(t)) ? t : null;
    warnings.push({
      id:w.id,level:w.level,event:text(w.event,40),title:text(w.title,120) || 'Weather warning',area:text(w.area,200),
      description:text(w.description,1000),instruction:text(w.instruction,1000),consequences:text(w.consequences,1000),
      start:time(w.start),end:time(w.end),web,marine:w.marine===true,polygons,
      bounds:{minLat:Math.min(...lats),maxLat:Math.max(...lats),minLng:Math.min(...lngs),maxLng:Math.max(...lngs)},
    });
  }
  warnings.sort((a,b)=>LEVEL_RANK[a.level]-LEVEL_RANK[b.level]);
  return {
    warnings,
    attribution:text(value.attribution,120) || 'Weather warnings © MET Norway',
    fetchedAt:typeof value.fetchedAt==='number' ? value.fetchedAt : 0,
    stale:value.stale===true,
  };
}

/** Warnings whose area contains the point, most severe first. */
export function warningsAt(point:LatLng, warnings:Warning[]):Warning[] {
  return warnings.filter(w=>point.lat>=w.bounds.minLat && point.lat<=w.bounds.maxLat && point.lng>=w.bounds.minLng && point.lng<=w.bounds.maxLng
    && w.polygons.some(polygon=>insidePolygon(point,polygon)))
    .sort((a,b)=>LEVEL_RANK[b.level]-LEVEL_RANK[a.level]);
}

export const worstLevel=(list:Warning[]):WarningLevel|undefined => list.reduce<WarningLevel|undefined>((worst,w)=>!worst || LEVEL_RANK[w.level]>LEVEL_RANK[worst] ? w.level : worst,undefined);

/** An SVG path in world pixels at `zoom`; holes cut out with the even-odd rule. */
export function warningPath(warning:Warning, zoom:number):string {
  return warning.polygons.map(polygon=>polygon.map(ring=>pathData(ring,zoom,true)).join('')).join('');
}

/** "Mon 21 Oct, 14:00 – Tue 22 Oct, 06:00" in the viewer's locale and time zone. */
export function warningPeriod(warning:Warning):string {
  const format=(t:string|null)=>t ? new Date(t).toLocaleString(undefined,{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '';
  const start=format(warning.start), end=format(warning.end);
  return start && end ? `${start} – ${end}` : end ? `Until ${end}` : start ? `From ${start}` : 'Time not given';
}
