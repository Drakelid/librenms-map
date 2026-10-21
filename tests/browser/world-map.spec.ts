import { test, expect, type Page } from '@playwright/test';
import { demoSnapshot } from '../../frontend/demo';

type Debug={zoom:number;markers:{id:string;name:string;label:string;count:number;status:string;warning:string|null}[];links:{key:string;count:number;state:string}[];undrawn:{withinSite:Record<string,number>;unlocated:number};warnings:{id:string;level:string;drawn:boolean}[];tiles:string[]};
const debug=(page:Page)=>page.evaluate(()=>(window as unknown as {libremapWorldDebug:()=>Debug}).libremapWorldDebug());

// The demo network placed at four sites; devices 11, 12, 13 and 15 have no coordinates.
const locations={
  locations:[
    {id:'1',name:'Rossa',lat:59.4138,lng:5.268},
    {id:'2',name:'Heiane',lat:58.97,lng:5.733},
    {id:'3',name:'SE',lat:60.39,lng:5.324},
    {id:'4',name:'Karmsundgata 12, Haugesund',lat:59.43,lng:5.35},
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
  await page.getByRole('button',{name:'rossa1: 6 devices'}).click();
  await expect(page.locator('.lm-details')).toContainText('LINKS WITHIN THIS LOCATION · 7');
  await expect(page.locator('.lm-details .lm-world-links-list li')).toHaveCount(7);
  await page.keyboard.press('Escape');
  await expect.poll(()=>tiles.length).toBeGreaterThan(0);
  for(const url of tiles)expect(url).toMatch(/^https:\/\/tiles\.test\/\d+\/\d+\/\d+\.png$/);
  await expect(page.locator('.lm-world-attribution')).toHaveText('© OpenStreetMap contributors');
  await expect(page.locator('.lm-summary')).toContainText('4No coordinates');

  // Addresses are hidden: locations are named by the LibreMap site of their devices.
  expect(state.markers.map(m=>m.label).sort()).toEqual(['heiane1','kvala1','rossa1','se1']);
  await expect(page.locator('.lm-world-label',{hasText:/Karmsundgata|^SE$/})).toHaveCount(0);

  // Locations open their devices; devices link back to LibreNMS details.
  await page.getByRole('button',{name:'se1: 1 device, 1 down'}).click();
  await expect(page.getByRole('heading',{name:'se1',exact:true})).toBeVisible();
  await expect(page.locator('.lm-details')).not.toContainText('Coordinates');
  await page.getByRole('button',{name:'hk-se1er1'}).click();
  await expect(page.getByRole('heading',{name:'hk-se1er1'})).toBeVisible();
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
  expect(state.markers.filter(m=>m.warning).map(m=>[m.label,m.warning])).toEqual([['se1','orange']]);
  await expect(page.locator('.lm-world-attribution')).toContainText('Weather warnings © MET Norway');
  await expect(page.locator('.lm-summary')).toContainText('1Under warning');

  // A covered location lists its warning; the warning opens MET's text and the affected locations.
  await page.getByRole('button',{name:'se1: 1 device, 1 down, orange weather warning'}).click();
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
