// Web Mercator ("slippy map") maths for the world map. World pixel coordinates
// at zoom z run from 0 to TILE * 2^z on both axes.
export const TILE=256;
export const MAX_LAT=85.05112878;

export interface LatLng { lat:number; lng:number }
export interface Point { x:number; y:number }

export const worldSize=(zoom:number)=>TILE*2**zoom;

export function project({lat,lng}:LatLng, zoom:number):Point {
  const size=worldSize(zoom);
  const phi=Math.max(-MAX_LAT,Math.min(MAX_LAT,lat))*Math.PI/180;
  return {x:(lng+180)/360*size,y:(1-Math.log(Math.tan(phi)+1/Math.cos(phi))/Math.PI)/2*size};
}

export function unproject({x,y}:Point, zoom:number):LatLng {
  const size=worldSize(zoom);
  return {lng:x/size*360-180,lat:Math.atan(Math.sinh(Math.PI*(1-2*y/size)))*180/Math.PI};
}

/** The highest whole zoom (and its centre) that shows every point inside the viewport. */
export function fitView(points:LatLng[], width:number, height:number, padding:number, maxZoom:number, singleZoom=10):{zoom:number;center:Point} {
  if(!points.length) return {zoom:1,center:{x:worldSize(1)/2,y:worldSize(1)/2}};
  const projected=points.map(p=>project(p,0));
  const xs=projected.map(p=>p.x), ys=projected.map(p=>p.y);
  const minX=Math.min(...xs), maxX=Math.max(...xs), minY=Math.min(...ys), maxY=Math.max(...ys);
  const spanX=maxX-minX, spanY=maxY-minY;
  const room={x:Math.max(1,width-2*padding),y:Math.max(1,height-2*padding)};
  const fit=spanX===0 && spanY===0 ? singleZoom
    : Math.floor(Math.log2(Math.min(spanX ? room.x/spanX : Infinity,spanY ? room.y/spanY : Infinity)));
  const zoom=Math.max(1,Math.min(maxZoom,fit));
  const scale=2**zoom;
  return {zoom,center:{x:(minX+maxX)/2*scale,y:(minY+maxY)/2*scale}};
}

/** A tile address, or undefined when the template does not yield an http(s) URL. */
export function tileUrl(template:string, zoom:number, x:number, y:number):string|undefined {
  const count=2**zoom;
  const column=((x%count)+count)%count; // Wrap horizontally around the globe.
  if(y<0 || y>=count) return undefined;
  const href=template.replace(/\{s\}/g,'abc'[(column+y)%3]).replace(/\{z\}/g,String(zoom)).replace(/\{x\}/g,String(column)).replace(/\{y\}/g,String(y));
  try {
    const url=new URL(href);
    return url.protocol==='https:' || url.protocol==='http:' ? url.href : undefined;
  } catch { return undefined; }
}

// LibreNMS reads "[lat, lng]" in a location's text as its coordinates.
const BRACKETED_COORDINATES=/\[\s*[-+]?\d{1,3}(?:\.\d+)?\s*,\s*[-+]?\d{1,3}(?:\.\d+)?\s*\]/g;

/** A location's text without the "[lat, lng]" coordinates LibreNMS lets it carry. */
export function withoutCoordinates(text:string):string {
  return text.replace(BRACKETED_COORDINATES,' ').replace(/\s+([,;])/g,'$1').replace(/\s{2,}/g,' ').trim().replace(/^[,;\s]+|[,;\s]+$/g,'');
}

/** A GeoJSON ring of [lng, lat] points; the first ring of a polygon is its outline, the rest are holes. */
export type Ring=[number,number][];

function insideRing({lat,lng}:LatLng, ring:Ring):boolean {
  let inside=false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++){
    const [xi,yi]=ring[i], [xj,yj]=ring[j];
    if((yi>lat)!==(yj>lat) && lng<(xj-xi)*(lat-yi)/(yj-yi)+xi) inside=!inside;
  }
  return inside;
}

/**
 * A ring or line as SVG path data in world pixels at `zoom`. Points within
 * `tolerance` pixels of the last one kept are dropped, so a detailed coast is
 * not drawn with thousands of points per pixel when zoomed out. A shape too
 * small to keep its form is drawn in full; it has few pixels anyway.
 */
export function pathData(points:Ring, zoom:number, closed:boolean, tolerance=0.75):string {
  const projected=points.map(([lng,lat])=>project({lat,lng},zoom));
  const xy=(p:Point)=>`${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  const kept:Point[]=[];
  projected.forEach((p,i)=>{
    const last=kept[kept.length-1];
    if(last && i<projected.length-1 && Math.abs(p.x-last.x)<tolerance && Math.abs(p.y-last.y)<tolerance) return;
    kept.push(p);
  });
  const shape=kept.length>=(closed ? 4 : 2) ? kept : projected;
  return 'M'+shape.map(xy).join('L')+(closed ? 'Z' : '');
}

/** Whether a point lies inside a polygon's outline and outside all of its holes. */
export function insidePolygon(point:LatLng, polygon:Ring[]):boolean {
  if(!polygon.length || !insideRing(point,polygon[0])) return false;
  return !polygon.slice(1).some(hole=>insideRing(point,hole));
}

/** A latitude/longitude box the map stays within. */
export interface Bounds { south:number; west:number; north:number; east:number }

export const insideBounds=(p:LatLng, b:Bounds|null|undefined)=>!b || (p.lat>=b.south && p.lat<=b.north && p.lng>=b.west && p.lng<=b.east);

/** Room around the map area when panning: a fifth of the viewport's shorter side, so a coast never sits on the edge of the screen. */
export const areaPadding=(width:number, height:number)=>Math.round(Math.min(width,height)*.2);

/**
 * The view centre (world pixels at `zoom`) moved just enough that a `width`
 * by `height` viewport stays inside the bounds, grown by `padding` pixels on
 * every side (or per axis); centred on an axis where that is narrower than
 * the viewport.
 */
export function clampToBounds(center:Point, zoom:number, width:number, height:number, b:Bounds, padding:number|Point=0):Point {
  const nw=project({lat:b.north,lng:b.west},zoom), se=project({lat:b.south,lng:b.east},zoom);
  const pad=typeof padding==='number' ? {x:padding,y:padding} : padding;
  nw.x-=pad.x;nw.y-=pad.y;se.x+=pad.x;se.y+=pad.y;
  const axis=(c:number,low:number,high:number,half:number)=>high-low<=2*half ? (low+high)/2 : Math.max(low+half,Math.min(high-half,c));
  return {x:axis(center.x,nw.x,se.x,width/2),y:axis(center.y,nw.y,se.y,height/2)};
}

/** The lowest zoom worth allowing: the highest at which the whole of the bounds still fits the viewport. */
export function minZoomFor(b:Bounds, width:number, height:number, maxZoom:number):number {
  return fitView([{lat:b.north,lng:b.west},{lat:b.south,lng:b.east}],width,height,0,maxZoom).zoom;
}

/** Keep the viewport centre on the map vertically; the map wraps horizontally. */
export function clampCenter(center:Point, zoom:number, height:number):Point {
  const size=worldSize(zoom), half=height/2;
  const y=size<=height ? size/2 : Math.max(half,Math.min(size-half,center.y));
  return {x:((center.x%size)+size)%size,y};
}
