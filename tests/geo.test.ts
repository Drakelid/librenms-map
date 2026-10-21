import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clampCenter, fitView, project, tileUrl, unproject, withoutCoordinates, worldSize } from '../frontend/geo';

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
