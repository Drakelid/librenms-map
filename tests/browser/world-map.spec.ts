import { test, expect, type Page } from '@playwright/test';
import { demoSnapshot } from '../../frontend/demo';

type Debug={zoom:number;markers:{id:string;name:string;count:number;status:string}[];links:{key:string;count:number;state:string}[];tiles:string[]};
const debug=(page:Page)=>page.evaluate(()=>(window as unknown as {libremapWorldDebug:()=>Debug}).libremapWorldDebug());

// The demo network placed at four sites; devices 11, 12, 13 and 15 have no coordinates.
const locations={
  locations:[
    {id:'1',name:'Rossa',lat:59.4138,lng:5.268},
    {id:'2',name:'Heiane',lat:58.97,lng:5.733},
    {id:'3',name:'SE',lat:60.39,lng:5.324},
    {id:'4',name:'Kvala',lat:59.43,lng:5.35},
  ],
  devices:{'0':'1','1':'1','4':'1','5':'1','6':'1','7':'1','2':'2','3':'2','8':'2','9':'2','14':'3','10':'4'},
  map:{tiles:'https://tiles.test/{z}/{x}/{y}.png',attribution:'© OpenStreetMap contributors',maxZoom:18,center:{lat:0,lng:0,zoom:2}},
};

async function open(page:Page){
  const tiles:string[]=[];
  await page.route('https://tiles.test/**',route=>{tiles.push(route.request().url());return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"/>'});});
  await page.route('**/world-page',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-mode="world" data-debug="true" data-endpoint="/world-topology" data-locations-endpoint="/world-locations" data-topology-url="/topology" data-custom-url="/custom"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/world-topology',route=>route.fulfill({json:demoSnapshot()}));
  await page.route('**/world-locations',route=>route.fulfill({json:locations}));
  await page.goto('/world-page');
  await expect(page.getByRole('status')).toContainText('12 devices at 4 locations');
  return tiles;
}

test('devices are placed at their locations with the links between them',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  const tiles=await open(page);
  const state=await debug(page);
  expect(state.markers.map(m=>[m.name,m.count,m.status]).sort()).toEqual([['Heiane',4,'up'],['Kvala',1,'up'],['Rossa',6,'up'],['SE',1,'down']]);
  // Rossa–Heiane and Rossa–Kvala carry load; the only Heiane–SE link is down.
  expect(state.links.map(l=>[l.key,l.state]).sort()).toEqual([['1|2','up'],['1|4','up'],['2|3','down']]);
  await expect.poll(()=>tiles.length).toBeGreaterThan(0);
  for(const url of tiles)expect(url).toMatch(/^https:\/\/tiles\.test\/\d+\/\d+\/\d+\.png$/);
  await expect(page.locator('.lm-world-attribution')).toHaveText('© OpenStreetMap contributors');
  await expect(page.locator('.lm-summary')).toContainText('4No coordinates');

  // Locations open their devices; devices link back to LibreNMS details.
  await page.getByRole('button',{name:'SE: 1 device, 1 down'}).click();
  await expect(page.getByRole('heading',{name:'SE',exact:true})).toBeVisible();
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
  await expect(page.getByRole('heading',{name:'SE',exact:true})).toBeVisible();
  const zoom=(await debug(page)).zoom;
  await page.getByRole('button',{name:'Zoom in'}).click();
  expect((await debug(page)).zoom).toBe(zoom+1);
  await page.keyboard.press('-');
  expect((await debug(page)).zoom).toBe(zoom);
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
