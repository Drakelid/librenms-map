import { test } from 'node:test';
import assert from 'node:assert/strict';
import { areaPadding, clampCenter, clampToBounds, fitView, insideBounds, minZoomFor, pathData, project, tileUrl, unproject, withoutCoordinates, worldSize } from '../frontend/geo';

const close=(actual:number,expected:number,tolerance=1e-6)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} ≉ ${expected}`);

test('Web Mercator projection round-trips and matches the tile grid',()=>{
  // Null Island sits at the centre of the world at every zoom.
  assert.deepEqual(project({lat:0,lng:0},0),{x:128,y:128});
  const haugesund={lat:59.4138,lng:5.268};
  for(const zoom of [0,5,12]){
    const back=unproject(project(haugesund,zoom),zoom);
    close(back.lat,haugesund.lat);close(back.lng,haugesund.lng);
  }
  // At zoom 10 Haugesund lies in OpenStreetMap tile 526/300.
  const p=project(haugesund,10);
  assert.deepEqual([Math.floor(p.x/256),Math.floor(p.y/256)],[526,300]);
  // Latitudes beyond the Mercator limit clamp to the map edge.
  close(project({lat:89.9,lng:0},1).y,0,1e-3);
});

test('fitting shows every location with padding, and one location at a fixed zoom',()=>{
  const sites=[{lat:59.41,lng:5.27},{lat:58.97,lng:5.73},{lat:60.39,lng:5.32}];
  const {zoom,center}=fitView(sites,1000,600,50,18);
  for(const site of sites){
    const p=project(site,zoom);
    assert.ok(Math.abs(p.x-center.x)<=450 && Math.abs(p.y-center.y)<=250,`${JSON.stringify(site)} outside the view at zoom ${zoom}`);
  }
  // One more zoom level would no longer fit.
  const tighter=sites.map(s=>project(s,zoom+1));
  const spanY=Math.max(...tighter.map(p=>p.y))-Math.min(...tighter.map(p=>p.y));
  assert.ok(spanY>500);
  assert.equal(fitView([sites[0]],1000,600,50,18,12).zoom,12);
  assert.equal(fitView([sites[0]],1000,600,50,8,12).zoom,8);
  assert.equal(fitView([],1000,600,50,18).zoom,1);
});

test('tile URLs wrap horizontally, reject invalid rows and non-web schemes',()=>{
  assert.equal(tileUrl('https://{s}.tile.example/{z}/{x}/{y}.png',2,5,1),'https://c.tile.example/2/1/1.png');
  assert.equal(tileUrl('https://tiles.example/{z}/{x}/{y}.png',2,-1,0),'https://tiles.example/2/3/0.png');
  assert.equal(tileUrl('https://tiles.example/{z}/{x}/{y}.png',2,0,4),undefined);
  assert.equal(tileUrl('javascript:{z}{x}{y}',2,0,0),undefined);
});

test('addresses drop the bracketed coordinates LibreNMS reads from location text',()=>{
  assert.equal(withoutCoordinates('Karmsundgata 12, Haugesund [59.4138,5.2680]'),'Karmsundgata 12, Haugesund');
  assert.equal(withoutCoordinates('Rossa [ -59.41 , +5.27 ] substation'),'Rossa substation');
  assert.equal(withoutCoordinates('Haugesund, [59.41,5.27]'),'Haugesund');
  assert.equal(withoutCoordinates('[59.41,5.27]'),'');
  // Other brackets and numbers are part of the address.
  assert.equal(withoutCoordinates('Rack [B2], Floor 3'),'Rack [B2], Floor 3');
  assert.equal(withoutCoordinates('Smedasundet 97 (bygg 2)'),'Smedasundet 97 (bygg 2)');
});

test('the centre stays on the map vertically and wraps horizontally',()=>{
  assert.deepEqual(clampCenter({x:-10,y:-500},2,400),{x:worldSize(2)-10,y:200});
  // A world smaller than the viewport is centred.
  assert.deepEqual(clampCenter({x:10,y:0},1,800),{x:10,y:256});
});

test('paths drop points that share a pixel, but keep small shapes whole',()=>{
  // A detailed ring: 1,000 points along a 1°×1° square.
  const ring:[number,number][]=[];
  for(let i=0;i<250;i++)ring.push([5+i/250,60]);
  for(let i=0;i<250;i++)ring.push([6,60+i/250]);
  for(let i=0;i<250;i++)ring.push([6-i/250,61]);
  for(let i=0;i<=250;i++)ring.push([5,61-i/250]);
  const points=(d:string)=>d.split(/[ML]/).filter(Boolean).length;
  assert.ok(points(pathData(ring,5,true))<ring.length/4,'simplified when zoomed out');
  assert.equal(points(pathData(ring,16,true)),ring.length,'every point kept when zoomed in');
  assert.match(pathData(ring,5,true),/^M[\d. L]+Z$/);
  // A shape smaller than a pixel is drawn in full rather than vanishing.
  const tiny:[number,number][]=[[5,60],[5.0001,60],[5.0001,60.0001],[5,60]];
  assert.equal(points(pathData(tiny,2,true)),4);
  assert.match(pathData([[5,60],[5.0001,60.0001]],2,false),/^M[\d. ]+L[\d. ]+$/);
});

test('the view stays inside the map area, and cannot zoom out past it',()=>{
  const norway={south:57.8,west:4.3,north:71.3,east:31.3};
  assert.equal(insideBounds({lat:59.41,lng:5.27},norway),true);
  assert.equal(insideBounds({lat:64.18,lng:-51.72},norway),false); // Nuuk, Greenland.
  assert.equal(insideBounds({lat:64.18,lng:-51.72},null),true);

  const zoom=7, w=1000, h=520;
  const nw=project({lat:norway.north,lng:norway.west},zoom), se=project({lat:norway.south,lng:norway.east},zoom);
  // Panned far west, over Greenland: pulled back so the view's left edge is Norway's western edge.
  const west=clampToBounds(project({lat:64.18,lng:-51.72},zoom),zoom,w,h,norway);
  close(west.x-w/2,nw.x);
  assert.ok(west.y-h/2>=nw.y-1e-6 && west.y+h/2<=se.y+1e-6);
  // A view already inside is left alone.
  const middle=project({lat:65,lng:14},zoom);
  assert.deepEqual(clampToBounds(middle,zoom,w,h,norway),middle);

  // At the lowest zoom the whole of Norway fits; one step out would show more than it.
  const min=minZoomFor(norway,w,h,18);
  const span=(z:number)=>{const a=project({lat:norway.north,lng:norway.west},z), b=project({lat:norway.south,lng:norway.east},z);return {x:b.x-a.x,y:b.y-a.y};};
  assert.ok(span(min).x<=w && span(min).y<=h);
  assert.ok(span(min+1).x>w || span(min+1).y>h);
  // Narrower than the viewport there, so the view is centred on Norway on that axis.
  const centred=clampToBounds(project({lat:64.18,lng:-51.72},min),min,w,h,norway);
  const a=project({lat:norway.north,lng:norway.west},min), b=project({lat:norway.south,lng:norway.east},min);
  close(centred.x,(a.x+b.x)/2);close(centred.y,(a.y+b.y)/2);
});

test('panning leaves room around the map area',()=>{
  const norway={south:57.8,west:4.3,north:71.3,east:31.3}, zoom=7, w=1000, h=520, pad=areaPadding(w,h);
  assert.equal(pad,104);
  const nw=project({lat:norway.north,lng:norway.west},zoom);
  // Pushed far west, the view's left edge stops `pad` pixels beyond Norway's western edge.
  const west=clampToBounds(project({lat:64.18,lng:-51.72},zoom),zoom,w,h,norway,pad);
  close(west.x-w/2,nw.x-pad);
});
