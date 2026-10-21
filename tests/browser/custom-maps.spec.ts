import { test, expect, type Page } from '@playwright/test';
import type { CustomDocument, CustomMapSnapshot, Device, LivePort } from '../../frontend/types';

const now=()=>Math.floor(Date.now()/1000);
const catalog:Device[]=[
  {id:'1',hostname:'rossa1agg1',displayName:'rossa1agg1',status:'up',url:'/device/device=1/'},
  {id:'2',hostname:'rossa1er1',displayName:'rossa1er1',status:'down',url:'/device/device=2/'},
];
const port:LivePort={id:'11',deviceId:'1',name:'xe-0/0/1',speedBps:1e9,inBps:8e8,outBps:1e8,sampledAt:now(),status:'up'};

type Debug={nodes:{key:string;kind:string;label:string;position:{x:number;y:number};renderedPosition:{x:number;y:number}}[];edges:{key:string;label:string;state:string;lineStyle:string;midpoint:{x:number;y:number}}[];grabbable:boolean};
const debug=(page:Page)=>page.evaluate(()=>(window as unknown as {libremapCustomDebug:()=>Debug}).libremapCustomDebug());

/** An in-memory stand-in for the plugin's custom map endpoints. */
async function server(page:Page,options:{shared?:CustomMapSnapshot}={}) {
  const writes:{method:string;body:unknown}[]=[];
  let mine:CustomMapSnapshot|undefined;
  const live=(doc:CustomDocument)=>({
    devices:Object.fromEntries(catalog.filter(d=>doc.devices.some(p=>p.deviceId===d.id)).map(d=>[d.id,d])),
    ports:Object.fromEntries(doc.links.some(l=>l.portId===port.id) ? [[port.id,port]] : []),
  });
  await page.route(/\/custom-page(\?.*)?$/,route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-mode="custom" data-debug="true" data-maps-endpoint="/cm" data-devices-endpoint="/cm-devices" data-topology-url="/topology" data-home-url="/nms"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/cm-devices',route=>route.fulfill({json:{devices:catalog}}));
  await page.route(/\/cm-devices\/\d+\/ports$/,route=>route.fulfill({json:{ports:route.request().url().includes('/1/') ? [port] : []}}));
  await page.route(/\/cm(\/[^/?]+)?(\?.*)?$/,async route=>{
    const request=route.request(), method=request.method(), id=/\/cm\/([^/?]+)/.exec(request.url())?.[1];
    if(method==='GET' && !id)return route.fulfill({json:{maps:[mine,options.shared].filter(Boolean).map(s=>{const {document:_,...summary}=s!.map;return summary;})}});
    if(method==='GET')return route.fulfill(id===mine?.map.id ? {json:mine} : id===options.shared?.map.id ? {json:options.shared} : {status:404,json:{}});
    const body=request.postDataJSON() as {name:string;shared:boolean;document:CustomDocument;revision?:number};
    writes.push({method,body});
    if(method==='POST'){
      mine={map:{id:'0d6f1b2e-1111-4a4a-9b9b-000000000001',name:body.name,shared:body.shared,owned:true,ownerName:null,revision:1,updatedAt:new Date().toISOString(),document:body.document},live:live(body.document),generatedAt:now(),config:{staleAfter:900}};
      return route.fulfill({status:201,json:mine});
    }
    if(method==='PUT' && mine){
      if(body.revision!==mine.map.revision)return route.fulfill({status:409,json:{}});
      mine={...mine,map:{...mine.map,name:body.name,shared:body.shared,revision:mine.map.revision+1,document:body.document},live:live(body.document),generatedAt:now()};
      return route.fulfill({json:mine});
    }
    return route.fulfill({status:404,json:{}});
  });
  return writes;
}

async function tapNode(page:Page,label:string){
  const node=(await debug(page)).nodes.find(n=>n.label.startsWith(label))!;
  const box=(await page.locator('.lm-canvas').boundingBox())!;
  await page.mouse.click(box.x+node.renderedPosition.x,box.y+node.renderedPosition.y);
}

test('an owner draws, binds and saves a custom map',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  const writes=await server(page);
  await page.goto('/custom-page');
  await expect(page.getByRole('status')).toContainText('No custom maps yet');
  await expect(page.getByRole('link',{name:'Topology map'})).toHaveAttribute('href','/topology');

  await page.getByRole('button',{name:'New map',exact:true}).click();
  await page.getByRole('textbox',{name:'Map name'}).fill('Rossa ring');
  await page.getByRole('button',{name:'Save',exact:true}).first().click();
  await expect(page.getByRole('status')).toContainText('Created “Rossa ring”');
  await expect(page).toHaveURL(/map=0d6f1b2e-/);

  const device=page.getByRole('combobox',{name:'Device to add'});
  for(const name of ['rossa1agg1 (#1)','rossa1er1 (#2)']){
    await device.fill(name);await page.getByRole('button',{name:'Add device',exact:true}).click();
  }
  await page.getByRole('button',{name:'Add area',exact:true}).click();
  await page.getByRole('textbox',{name:'Area label'}).fill('Rossa site');
  expect((await debug(page)).nodes.map(n=>n.kind).sort()).toEqual(['box','device','device']);
  expect((await debug(page)).grabbable).toBe(true);

  await page.getByRole('button',{name:'Draw line',exact:true}).click();
  await tapNode(page,'rossa1agg1');await tapNode(page,'rossa1er1');
  await expect(page.getByRole('status')).toContainText('Line drawn');
  let edges=(await debug(page)).edges;
  expect(edges).toHaveLength(1);
  expect(edges[0]).toMatchObject({state:'drawn',lineStyle:'dotted'});

  // Undo and redo the line from the keyboard.
  await page.keyboard.press('Control+z');
  expect((await debug(page)).edges).toHaveLength(0);
  await page.keyboard.press('Control+Shift+z');
  expect((await debug(page)).edges).toHaveLength(1);
  await page.getByRole('button',{name:'Draw line',exact:true}).click();

  // Dragged devices snap to the 20px grid.
  const dragged=(await debug(page)).nodes.find(n=>n.label.startsWith('rossa1er1'))!;
  const canvas=(await page.locator('.lm-canvas').boundingBox())!;
  const from={x:canvas.x+dragged.renderedPosition.x,y:canvas.y+dragged.renderedPosition.y};
  await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(from.x+33,from.y+47,{steps:6});await page.mouse.up();
  const moved=(await debug(page)).nodes.find(n=>n.key===dragged.key)!;
  expect(Math.abs(moved.position.x%20)).toBe(0);expect(Math.abs(moved.position.y%20)).toBe(0);
  await page.getByRole('button',{name:'↶ Undo',exact:true}).click();
  expect((await debug(page)).nodes.find(n=>n.key===dragged.key)!.position).toEqual(dragged.position);
  await page.getByRole('button',{name:'↷ Redo',exact:true}).click();
  // The line crosses the area; it must still be selectable above it.
  const line=(await debug(page)).edges[0];
  await page.mouse.click(canvas.x+line.midpoint.x,canvas.y+line.midpoint.y);

  // Bind the line to an interface: it now shows that interface's live load.
  await page.getByRole('textbox',{name:'Line label'}).fill('Fibre');
  const binding=page.getByRole('combobox',{name:'Interface'});
  await expect(binding).toBeEnabled();
  await binding.selectOption('11');
  edges=(await debug(page)).edges;
  expect(edges[0]).toMatchObject({label:'Fibre · 80%',state:'up',lineStyle:'solid'});
  await expect(page.locator('[data-link-status]')).toHaveText('80%');

  await page.getByRole('button',{name:'Save',exact:true}).first().click();
  await expect(page.getByRole('status')).toContainText('Saved “Rossa ring”');
  const put=writes.find(w=>w.method==='PUT')!.body as {revision:number;document:CustomDocument};
  expect(put.revision).toBe(1);
  expect(put.document.devices.map(d=>d.deviceId).sort()).toEqual(['1','2']);
  expect(put.document.shapes[0]).toMatchObject({kind:'box',text:'Rossa site'});
  expect(put.document.links[0]).toMatchObject({label:'Fibre',portId:'11'});

  // Leaving edit mode locks the layout; a reload reopens the same map.
  await page.getByRole('button',{name:'Done editing',exact:true}).click();
  expect((await debug(page)).grabbable).toBe(false);
  await page.reload();
  await expect(page.getByRole('status')).toContainText('Opened “Rossa ring”');
  expect((await debug(page)).edges[0].label).toBe('Fibre · 80%');
  expect(errors).toEqual([]);
});

test('a shared map is read-only to other users',async({page})=>{
  const shared:CustomMapSnapshot={
    map:{id:'0d6f1b2e-2222-4a4a-9b9b-000000000002',name:'NOC wall',shared:true,owned:false,ownerName:'alice',revision:4,updatedAt:new Date().toISOString(),
      document:{devices:[{key:'d-a',deviceId:'1',x:0,y:0}],shapes:[{key:'s-a',kind:'text',x:0,y:-120,width:220,height:48,text:'Core'}],links:[],zoom:1,pan:{x:0,y:0}}},
    live:{devices:{'1':catalog[0]},ports:{}},generatedAt:now(),config:{staleAfter:900},
  };
  await server(page,{shared});
  await page.goto('/custom-page');
  await page.getByRole('combobox',{name:'Custom map'}).selectOption(shared.map.id);
  await expect(page.getByRole('status')).toContainText('shared read-only by alice');
  for(const name of ['Edit','Rename','Delete','Share read-only','Shared read-only'])await expect(page.getByRole('button',{name,exact:true})).toBeHidden();
  expect((await debug(page)).grabbable).toBe(false);
  await expect(page.locator('.lm-cm-meta')).toHaveText('Shared by alice · shared read-only');
});

test('a map that disappears is closed instead of left on screen',async({page})=>{
  await server(page);
  await page.goto('/custom-page?map=0d6f1b2e-3333-4a4a-9b9b-000000000003');
  await expect(page.getByRole('status')).toContainText('no longer available');
  await expect(page.locator('.lm-empty')).toContainText('No custom maps yet');
});
