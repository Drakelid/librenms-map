import { test, expect, type Page } from '@playwright/test';
import { demoSnapshot } from '../../frontend/demo';

type Debug={zoom:number;markers:{id:string;name:string;label:string;text:string;count:number;status:string;warning:string|null}[];links:{key:string;count:number;state:string}[];undrawn:{withinSite:Record<string,number>;unlocated:number};warnings:{id:string;level:string;drawn:boolean}[];tiles:string[]};
const debug=(page:Page)=>page.evaluate(()=>(window as unknown as {libremapWorldDebug:()=>Debug}).libremapWorldDebug());

// The demo network placed at four sites; devices 11, 12, 13 and 15 have no coordinates.
const locations={
  locations:[
    {id:'1',name:'Rossa',lat:59.4138,lng:5.268},
    {id:'2',name:'Heiane',lat:58.97,lng:5.733},
    {id:'3',name:'SE',lat:60.39,lng:5.324},
    // Coordinates in the location text, as LibreNMS allows, are never shown.
    {id:'4',name:'Karmsundgata 12, Haugesund [59.43,5.35]',lat:59.43,lng:5.35},
  ],
  devices:{'0':'1','1':'1','4':'1','5':'1','6':'1','7':'1','2':'2','3':'2','8':'2','9':'2','14':'3','10':'4'},
  map:{tiles:'https://tiles.test/{z}/{x}/{y}.png',attribution:'© OpenStreetMap contributors',maxZoom:18,center:{lat:0,lng:0,zoom:2}},
};

// An orange warning over SE (60.39, 5.32), and a yellow one far from every location.
const square=(lng:number,lat:number)=>[[[lng,lat],[lng+1,lat],[lng+1,lat+1],[lng,lat+1],[lng,lat]]];
const weather={source:'MET Norway',attribution:'Weather warnings © MET Norway',fetchedAt:Math.floor(Date.now()/1000),stale:false,warnings:[
  {id:'far',level:'yellow',event:'snow',title:'Snow',area:'Finnmark',description:'Heavy snow.',instruction:'',consequences:'',start:null,end:null,web:null,marine:false,polygons:[square(25,69)]},
  {id:'wind',level:'orange',event:'wind',title:'Strong wind',area:'Vestland',description:'Gusts up to 35 m/s.',instruction:'Secure loose objects.',consequences:'Power outages are likely.',start:'2026-10-21T12:00:00+00:00',end:'2026-10-22T06:00:00+00:00',web:'https://www.met.no/',marine:false,polygons:[square(5,60)]},
]};

async function open(page:Page){
  const tiles:string[]=[];
  await page.route('https://tiles.test/**',route=>{tiles.push(route.request().url());return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"/>'});});
  await page.route('**/world-page',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-mode="world" data-debug="true" data-storage-key="world-test" data-endpoint="/world-topology" data-locations-endpoint="/world-locations" data-weather-endpoint="/world-weather" data-topology-url="/topology" data-custom-url="/custom"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/world-topology',route=>route.fulfill({json:demoSnapshot()}));
  await page.route('**/world-locations',route=>route.fulfill({json:locations}));
  await page.route('**/world-weather',route=>route.fulfill({json:weather}));
  await page.goto('/world-page');
  await expect(page.getByRole('status')).toContainText('12 devices at 4 locations');
  return tiles;
}

test('devices are placed at their locations with the links between them',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  const tiles=await open(page);
  const state=await debug(page);
  expect(state.markers.map(m=>[m.name,m.count,m.status]).sort()).toEqual([['Heiane',4,'up'],['Karmsundgata 12, Haugesund',1,'up'],['Rossa',6,'up'],['SE',1,'down']]);
  // Rossa–Heiane and Rossa–Kvala carry load; the only Heiane–SE link is down.
  expect(state.links.map(l=>[l.key,l.state]).sort()).toEqual([['1|2','up'],['1|4','up'],['2|3','down']]);
  // Every one of the demo's 18 links is accounted for: 3 lines, 10 inside a location, 5 to devices without coordinates.
  expect(state.undrawn).toEqual({withinSite:{'1':7,'2':3},unlocated:5});
  await expect(page.locator('.lm-world-undrawn')).toHaveText('15 links are not drawn as lines: 10 join devices at the same location (listed under that location); 5 reach a device without coordinates.');
  await page.getByRole('button',{name:'Location 1: 6 devices'}).click();
  await expect(page.locator('.lm-details')).toContainText('LINKS WITHIN THIS LOCATION · 7');
  await expect(page.locator('.lm-details .lm-world-links-list li')).toHaveCount(7);
  await page.keyboard.press('Escape');
  await expect.poll(()=>tiles.length).toBeGreaterThan(0);
  for(const url of tiles)expect(url).toMatch(/^https:\/\/tiles\.test\/\d+\/\d+\/\d+\.png$/);
  await expect(page.locator('.lm-world-attribution')).toHaveText('© OpenStreetMap contributors');
  await expect(page.locator('.lm-summary')).toContainText('4No coordinates');

  // Addresses and device names are hidden: the map itself shows no names, and
  // sites read from hostnames ("hk-rossa1agg1" → "rossa1") are not shown either.
  expect(state.markers.map(m=>m.label).sort()).toEqual(['Location 1','Location 2','Location 3','Location 4']);
  for(const layer of ['.lm-world-markers','.lm-world-links'])await expect(page.locator(layer)).not.toContainText(/hk-|rossa1|heiane1|kvala1|se1/);
  await expect(page.locator('.lm-world-label',{hasText:/Karmsundgata|^SE$/})).toHaveCount(0);

  // Locations open their devices, always by their real names; devices link back to LibreNMS details.
  await page.getByRole('button',{name:'Location 3: 1 device, 1 down'}).click();
  // The map hides the site (it comes from the hostname); the details panel names it.
  await expect(page.getByRole('heading',{name:'se1',exact:true})).toBeVisible();
  await expect(page.locator('.lm-details')).not.toContainText('Coordinates');
  await page.locator('.lm-details').getByRole('button',{name:'hk-se1er1',exact:true}).click();
  await expect(page.getByRole('heading',{name:'hk-se1er1',exact:true})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading',{name:'Where the network is'})).toBeVisible();

  // The pages link to each other; the current one is marked, not linked.
  const nav=page.getByRole('navigation',{name:'LibreMap pages'});
  await expect(nav.getByRole('link',{name:'Topology map'})).toHaveAttribute('href','/topology');
  await expect(nav.getByRole('link',{name:'Custom maps'})).toHaveAttribute('href','/custom');
  await expect(nav.locator('[aria-current="page"]')).toHaveText('World map');
  expect(errors).toEqual([]);
});

test('filters, problem navigation and zoom',async({page})=>{
  await open(page);
  await page.getByRole('searchbox').fill('heiane');
  expect((await debug(page)).markers.map(m=>m.name)).toEqual(['Heiane']);
  await page.getByRole('searchbox').fill('');
  await page.getByRole('button',{name:'Only problems',exact:true}).click();
  expect((await debug(page)).markers.map(m=>m.name)).toEqual(['SE']);
  await page.getByRole('button',{name:'Only problems',exact:true}).click();
  expect((await debug(page)).markers).toHaveLength(4);

  // D jumps to the next location with a down device.
  await page.locator('.lm-world').focus();
  await page.keyboard.press('d');
  await expect(page.getByRole('heading',{name:'se1',exact:true})).toBeVisible();
  const zoom=(await debug(page)).zoom;
  await page.getByRole('button',{name:'Zoom in'}).click();
  expect((await debug(page)).zoom).toBe(zoom+1);
  await page.keyboard.press('-');
  expect((await debug(page)).zoom).toBe(zoom);
});

test('addresses appear only when asked for, and the choice is remembered',async({page})=>{
  await open(page);
  // Hidden addresses are not searchable: "Karmsund" is only in a location's address.
  await page.getByRole('searchbox').fill('Karmsund');
  expect((await debug(page)).markers).toEqual([]);

  await page.getByRole('button',{name:'Addresses',exact:true}).click();
  await expect(page.getByRole('button',{name:'Addresses',exact:true})).toHaveAttribute('aria-pressed','true');
  expect((await debug(page)).markers.map(m=>m.label)).toEqual(['Karmsundgata 12, Haugesund']);
  await page.getByRole('searchbox').fill('');
  expect((await debug(page)).markers.map(m=>m.label).sort()).toEqual(['Heiane','Karmsundgata 12, Haugesund','Rossa','SE']);
  await page.getByRole('button',{name:'SE: 1 device, 1 down'}).click();
  await expect(page.locator('.lm-details')).toContainText('60.39000, 5.32400');
  await page.reload();
  await expect(page.getByRole('button',{name:'Addresses',exact:true})).toHaveAttribute('aria-pressed','true');
});

test('device names label the markers only when asked for',async({page})=>{
  await open(page);
  const text=async()=>Object.fromEntries((await debug(page)).markers.map(m=>[m.label,m.text]));
  // Off by default: markers have no label, and no device name is on the map.
  expect(await text()).toEqual({'Location 1':'','Location 2':'','Location 3':'','Location 4':''});
  await expect(page.locator('.lm-world-markers')).not.toContainText('hk-');

  const toggle=page.getByRole('button',{name:'Device names',exact:true});
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed','true');
  expect(await text()).toEqual({
    rossa1:'hk-rossa1agg1, hk-rossa1agg2, hk-rossa1er1 +3',
    heiane1:'hk-heiane1agg1, hk-heiane1agg2, hk-heiane1er1 +1',
    se1:'hk-se1er1',kvala1:'hk-kvala1er1',
  });
  // Shown at any zoom, not only once zoomed in.
  await expect(page.locator('.lm-world-markers')).toHaveClass(/lm-world-named/);
  await expect(page.locator('.lm-world-label',{hasText:'hk-se1er1'})).toBeVisible();
  // With names on, the details panel uses them too.
  await page.getByRole('button',{name:'rossa1: 6 devices'}).click();
  await expect(page.locator('.lm-details').getByRole('button',{name:'hk-rossa1agg1'})).toBeVisible();
  await expect(page.locator('.lm-details')).toContainText('hk-rossa1agg2 ');

  await page.reload();
  await expect(page.getByRole('button',{name:'Device names',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Device names',exact:true}).click();
  expect((await text())['Location 1']).toBe('');
  // Off again: no device name on the map, but a selected location still lists its devices by name.
  await expect(page.locator('.lm-world-markers')).not.toContainText('hk-');
  await page.getByRole('button',{name:'Location 1: 6 devices'}).click();
  await expect(page.getByRole('heading',{name:'rossa1',exact:true})).toBeVisible();
  await expect(page.locator('.lm-details')).toContainText('hk-rossa1agg2 ');
  await page.locator('.lm-details').getByRole('button',{name:'hk-rossa1agg1',exact:true}).click();
  await expect(page.getByRole('heading',{name:'hk-rossa1agg1',exact:true})).toBeVisible();
  await expect(page.locator('.lm-details dl')).toContainText('Siterossa1');
  // The toggle never puts placeholders such as "AGG 1" or "Device 2" in the panel.
  await expect(page.locator('.lm-details')).not.toContainText(/\b(AGG|ER|Device) \d+\b/);
  await page.keyboard.press('Escape');
  await page.locator('.lm-world-unlocated summary').click();
  await expect(page.locator('.lm-world-unlocated')).toContainText('hk-solvang1er1');
});

test('a device is named by its hostname, else its sysName, else its IP address',async({page})=>{
  await page.route('**/world-page',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-mode="world" data-debug="true" data-endpoint="/world-topology" data-locations-endpoint="/world-locations"></div><script type="module" src="/frontend/main.ts"></script>'}));
  const snapshot=demoSnapshot();
  // Added by IP: one with a sysName, one without. Both carry a display name that must not win.
  Object.assign(snapshot.devices.find(d=>d.id==='14')!,{hostname:'192.0.2.14',sysName:'hk-se1er1.example.net',displayName:'SE core'});
  Object.assign(snapshot.devices.find(d=>d.id==='10')!,{hostname:'192.0.2.10',sysName:null,displayName:'Kvala edge'});
  await page.route('**/world-topology',route=>route.fulfill({json:snapshot}));
  await page.route('**/world-locations',route=>route.fulfill({json:{...locations,map:{...locations.map,tiles:null}}}));
  await page.goto('/world-page');
  await expect(page.getByRole('status')).toContainText('12 devices at 4 locations');

  await page.getByRole('button',{name:'Location 3: 1 device, 1 down'}).click();
  await page.locator('.lm-details').getByRole('button',{name:'hk-se1er1.example.net',exact:true}).click();
  await expect(page.getByRole('heading',{name:'hk-se1er1.example.net',exact:true})).toBeVisible();
  await expect(page.locator('.lm-details dl')).toContainText('IP address192.0.2.14');
  await page.keyboard.press('Escape');

  await page.getByRole('button',{name:'Location 4: 1 device'}).click();
  await page.locator('.lm-details').getByRole('button',{name:'192.0.2.10',exact:true}).click();
  await expect(page.getByRole('heading',{name:'192.0.2.10',exact:true})).toBeVisible();
  await expect(page.locator('.lm-details')).not.toContainText(/SE core|Kvala edge/);
});

test('a site set by an administrator still names its location with device names hidden',async({page})=>{
  await page.route('**/world-page',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-mode="world" data-debug="true" data-endpoint="/world-topology" data-locations-endpoint="/world-locations"></div><script type="module" src="/frontend/main.ts"></script>'}));
  const snapshot=demoSnapshot();
  snapshot.config.overrides={'14':{site:'Bergen POP'}};
  await page.route('**/world-topology',route=>route.fulfill({json:snapshot}));
  await page.route('**/world-locations',route=>route.fulfill({json:{...locations,map:{...locations.map,tiles:null}}}));
  await page.goto('/world-page');
  await expect(page.getByRole('status')).toContainText('12 devices at 4 locations');
  const labels=Object.fromEntries((await debug(page)).markers.map(m=>[m.name,m.text]));
  expect(labels).toEqual({Rossa:'',Heiane:'',SE:'Bergen POP','Karmsundgata 12, Haugesund':''});
  await page.getByRole('button',{name:'Bergen POP: 1 device, 1 down'}).click();
  await page.locator('.lm-details').getByRole('button',{name:'hk-se1er1',exact:true}).click();
  await expect(page.locator('.lm-details dl')).toContainText('SiteBergen POP');
  await expect(page.locator('.lm-world-markers')).not.toContainText(/hk-|se1/);
});

test('weather warnings are drawn on request and flag the locations they cover',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await open(page);
  const toggle=page.getByRole('button',{name:'⚠ Weather warnings',exact:true});
  await expect(toggle).toHaveAttribute('aria-pressed','false');
  expect((await debug(page)).warnings).toEqual([]);

  await toggle.click();
  await expect(page.getByRole('status')).toContainText('2 active weather warnings · 1 location affected');
  let state=await debug(page);
  expect(state.warnings.map(w=>[w.id,w.level,w.drawn])).toEqual([['far','yellow',true],['wind','orange',true]]);
  expect(state.markers.filter(m=>m.warning).map(m=>[m.label,m.warning])).toEqual([['Location 3','orange']]);
  await expect(page.locator('.lm-world-attribution')).toContainText('Weather warnings © MET Norway');
  await expect(page.locator('.lm-summary')).toContainText('1Under warning');

  // A covered location lists its warning; the warning opens MET's text and the affected locations.
  await page.getByRole('button',{name:'Location 3: 1 device, 1 down, orange weather warning'}).click();
  await page.locator('.lm-details').getByRole('button',{name:'Strong wind · Vestland'}).click();
  await expect(page.getByRole('heading',{name:'Strong wind'})).toBeVisible();
  await expect(page.locator('.lm-details')).toContainText('Power outages are likely.');
  await expect(page.locator('.lm-details')).toContainText('Secure loose objects.');
  await expect(page.getByRole('link',{name:'Details at MET Norway ↗'})).toHaveAttribute('href','https://www.met.no/');

  // The toggle is remembered; turning it off removes every trace of the warnings.
  await page.reload();
  await expect(page.getByRole('button',{name:'⚠ Weather warnings',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect.poll(async()=>(await debug(page)).markers.filter(m=>m.warning).length).toBe(1);
  await page.getByRole('button',{name:'⚠ Weather warnings',exact:true}).click();
  state=await debug(page);
  expect(state.warnings).toEqual([]);
  expect(state.markers.some(m=>m.warning)).toBe(false);
  await expect(page.locator('.lm-world-warning')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('without coordinates the map explains how to add them',async({page})=>{
  await page.route('**/world-page',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-mode="world" data-endpoint="/world-topology" data-locations-endpoint="/world-locations"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/world-topology',route=>route.fulfill({json:demoSnapshot()}));
  await page.route('**/world-locations',route=>route.fulfill({json:{locations:[],devices:{},map:{tiles:null,attribution:'',maxZoom:18,center:{lat:0,lng:0,zoom:2}}}}));
  await page.goto('/world-page');
  await expect(page.locator('.lm-empty')).toContainText('No devices have map coordinates yet');
  await expect(page.locator('.lm-world-unlocated summary')).toHaveText('16 devices have no coordinates');
  await expect(page.locator('.lm-world-tiles img')).toHaveCount(0);
});

test('power outages mark their areas with pins and flag the locations inside or near them',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  type PowerDebug={outages:{id:string;kind:string;shape:string;drawn:boolean;pinned:boolean}[];markers:{name:string;outage:string|null;nearOutage:string|null}[]};
  const evidence={source:'DRIFT',observed_at:new Date().toISOString(),limitations:[]};
  // A small current area around Rossa, a point outage about 500 m from Heiane, and a far planned area.
  const ring=(lng:number,lat:number,d:number)=>[[[lng-d,lat-d],[lng+d,lat-d],[lng+d,lat+d],[lng-d,lat+d],[lng-d,lat-d]]];
  const feed={count:4,complete:true,evidence,skipped:{unknown_kind:1},outages:[
    {id:'Fagne:1',kind:'current',provider:'Fagne',municipality:'Haugesund',customers:42,polygons:[ring(5.268,59.4138,.002)],lines:[],point:null},
    {id:'Lyse:2',kind:'current',provider:'Lyse Elnett',municipality:'Stavanger',polygons:[],lines:[],point:[5.733,58.9745]},
    {id:'BKK:3',kind:'planned',provider:'BKK',municipality:'Voss',polygons:[ring(6.4,60.6,.001)],lines:[],point:null},
  ]};
  await page.route('**/world-page',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-mode="world" data-debug="true" data-storage-key="world-power" data-endpoint="/world-topology" data-locations-endpoint="/world-locations" data-power-endpoint="/world-power" data-power-at-endpoint="/world-power-at" data-power-health-endpoint="/world-power-health" data-topology-url="/topology" data-custom-url="/custom"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/world-topology',route=>route.fulfill({json:demoSnapshot()}));
  await page.route('**/world-locations',route=>route.fulfill({json:{...locations,map:{...locations.map,tiles:null}}}));
  await page.route('**/world-power',route=>route.fulfill({json:feed}));
  await page.route('**/world-power-health',route=>route.fulfill({json:{status:'ok',poll_seconds:300,providers:{}}}));
  await page.route('**/world-power-at**',route=>route.fulfill({json:{verdict:'in_outage_area',why:'Inside the Fagne outage area.',outages:[],evidence}}));
  await page.goto('/world-page');
  await expect(page.getByRole('status')).toContainText('12 devices at 4 locations');

  await page.getByRole('button',{name:'⚡ Power outages',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('1 location inside an outage area, 1 within 1 km');
  await expect(page.getByRole('status')).toContainText('1 outage could not be placed');
  const state=await page.evaluate(()=>(window as unknown as {libremapWorldDebug:()=>PowerDebug}).libremapWorldDebug());
  // Every outage has a pin, including the point-only one, whose area is too small to see when zoomed out.
  expect(state.outages.map(o=>[o.id,o.shape,o.drawn,o.pinned])).toEqual([['BKK:3','area',true,true],['Fagne:1','area',true,true],['Lyse:2','point',true,true]]);
  await expect(page.locator('.lm-world-outage-pin')).toHaveCount(3);
  expect(state.markers.filter(m=>m.outage || m.nearOutage).map(m=>[m.name,m.outage,m.nearOutage])).toEqual([['Rossa','current',null],['Heiane',null,'current']]);
  await expect(page.locator('.lm-world-outage-tag')).toHaveText(['⚡ OUTAGE']);
  await expect(page.locator('.lm-summary')).toContainText('1In outage area');
  await expect(page.locator('.lm-details')).toContainText('1 outage from DRIFT is not on the map: not marked current or planned.');

  // The summary steps to the affected location, whose details open with a banner.
  await page.locator('.lm-summary').getByRole('button',{name:/inside an outage area/}).click();
  const banner=page.locator('.lm-world-outage-banner');
  await expect(banner).toContainText('INSIDE A POWER OUTAGE AREA');
  await expect(banner).toContainText('Fagne · Haugesund · 42 customers');
  await banner.getByRole('button',{name:'Show the outage'}).click();
  await expect(page.getByRole('heading',{name:'Haugesund'})).toBeVisible();
  await expect(page.locator('.lm-details')).toContainText('LOCATIONS INSIDE THIS AREA');
  await expect(page.locator('.lm-details dl')).toContainText('Devices in area6');

  // A location near an outage says how near.
  await page.getByRole('button',{name:/from a current power outage/}).click();
  await expect(page.locator('.lm-world-outage-banner')).toContainText(/FROM A POWER OUTAGE/);
  expect(errors).toEqual([]);
});
