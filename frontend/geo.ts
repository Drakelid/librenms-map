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

/**
 * Mainland Norway's outline, simplified to some 60 points ([lng, lat]); accurate to a few
 * kilometres, which the panning margin and the places it always allows (locations, outage
 * pins) make up for. Norway runs diagonally, so most of its bounding box is sea or Sweden.
 */
export const NORWAY_OUTLINE:Ring=[
  [7.0,57.95],[8.1,58.05],[9.0,58.45],[9.9,58.9],[11.0,58.95],[11.45,58.95],[11.8,59.85],[12.5,60.15],
  [12.2,61.0],[12.9,61.4],[12.25,62.3],[12.1,63.0],[12.2,63.6],[13.9,64.4],[14.2,65.1],[14.6,66.0],
  [15.4,66.3],[16.4,67.0],[17.9,67.95],[18.1,68.5],[19.9,68.35],[20.3,69.0],[21.1,69.3],[22.4,68.7],
  [23.7,68.7],[24.9,68.6],[25.8,69.0],[26.0,69.7],[27.0,69.9],[28.2,69.9],[28.9,69.0],[29.4,69.6],
  [30.0,69.65],[31.1,69.75],[31.1,70.45],[29.5,70.7],[27.6,71.1],[25.7,71.2],[23.6,70.9],[21.6,70.4],
  [19.5,70.3],[17.6,69.9],[16.0,69.4],[14.0,68.5],[12.5,67.5],[13.3,66.6],[12.3,65.9],[11.1,64.9],
  [10.0,64.3],[8.6,63.6],[7.0,62.95],[5.1,62.3],[4.7,61.3],[4.75,60.4],[5.0,59.3],[5.5,58.6],
  [6.0,58.2],[7.0,57.95],
];

/**
 * The view centre (world pixels at `zoom`) kept on the outline's land or within `margin` pixels of
 * its edge or of one of `places`; moved straight toward the nearest of those otherwise. With no
 * outline and no places, anywhere is allowed.
 */
export function keepNear(center:Point, zoom:number, outline:Ring|null, places:LatLng[], margin:number):Point {
  if(outline && insidePolygon(unproject(center,zoom),[outline])) return center;
  let best={d:Infinity,p:center};
  const consider=(p:Point)=>{const d=Math.hypot(p.x-center.x,p.y-center.y);if(d<best.d)best={d,p};};
  if(outline){
    const points=outline.map(([lng,lat])=>project({lat,lng},zoom));
    for(let i=1;i<points.length;i++){
      const a=points[i-1], b=points[i], dx=b.x-a.x, dy=b.y-a.y, length=dx*dx+dy*dy;
      const t=length ? Math.max(0,Math.min(1,((center.x-a.x)*dx+(center.y-a.y)*dy)/length)) : 0;
      consider({x:a.x+t*dx,y:a.y+t*dy});
    }
  }
  for(const place of places)consider(project(place,zoom));
  if(best.d<=margin || !Number.isFinite(best.d)) return center;
  const t=(best.d-margin)/best.d;
  return {x:center.x+(best.p.x-center.x)*t,y:center.y+(best.p.y-center.y)*t};
}

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
