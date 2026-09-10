import { test, expect } from '@playwright/test';
import { demoSnapshot } from '../../frontend/demo';

test('demo renders AGG roots, details, search, backbone and stable refresh', async ({ page }) => {
  const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('status')).toContainText('Demo topology');
  const read = () => page.evaluate(() => (window as unknown as {libremapDebug:()=>{nodes:{id:string;tier:number;position:{x:number;y:number};visible:boolean}[];edges:number}}).libremapDebug());
  const graph=await read();
  expect(graph.nodes).toHaveLength(16); expect(graph.edges).toBe(18);
  const roots=graph.nodes.filter(n=>n.tier===0);
  expect(roots).toHaveLength(4); expect(new Set(roots.map(n=>n.position.y)).size).toBe(1);
  expect(graph.nodes.filter(n=>n.tier>0).every(n=>n.position.y>roots[0].position.y)).toBe(true);
  await page.getByRole('button',{name:'◈ hk-rossa1agg1'}).click();
  await expect(page.getByRole('heading',{name:'hk-rossa1agg1'})).toBeVisible();
  await page.getByRole('button',{name:'Refresh'}).click();
  await expect(page.getByRole('status')).toContainText('Demo topology');
  expect((await read()).nodes.map(n=>n.position)).toEqual(graph.nodes.map(n=>n.position));
  await page.getByRole('searchbox').fill('does-not-exist');
  await expect(page.getByText('No devices match these filters.')).toBeVisible();
  await page.getByRole('searchbox').fill('');
  await page.getByRole('button',{name:'AGG backbone'}).click();
  expect((await read()).nodes.filter(n=>n.visible)).toHaveLength(4);
  await page.getByRole('button',{name:'AGG backbone'}).click();
  await page.getByRole('button',{name:'Close details'}).click();
  await page.screenshot({path:'test-results/libremap-light.png',fullPage:true,animations:'disabled'});
  await page.getByRole('button',{name:'Theme'}).click();
  await expect(page.locator('#libremap')).toHaveClass(/lm-dark/);
  await page.screenshot({path:'test-results/libremap-dark.png',fullPage:true,animations:'disabled'});
  expect(errors).toEqual([]);
});

test('other devices start hidden and can be revealed inside the focused AGG group',async({page})=>{
  const snapshot=demoSnapshot();
  snapshot.devices=snapshot.devices.map(device=>device.id==='4'?{...device,hostname:'access-switch'}:device);
  await page.route('**/role-filter-test',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-endpoint="/role-filter-snapshot" data-storage-key="role-filter" data-debug="true"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/role-filter-snapshot',route=>route.fulfill({json:snapshot}));
  const visible=(id:string)=>page.evaluate(deviceId=>(window as unknown as {libremapDebug:()=>{nodes:{id:string;visible:boolean}[]}}).libremapDebug().nodes.find(node=>node.id===deviceId)?.visible,id);
  await page.goto('/role-filter-test');
  await expect(page.getByRole('status')).toContainText('Topology loaded');
  expect(await visible('4')).toBe(false);
  await page.getByRole('combobox',{name:'AGG root'}).selectOption('0');
  await page.getByRole('button',{name:'Show other devices'}).click();
  await expect(page.getByRole('button',{name:'Hide other devices'})).toHaveAttribute('aria-pressed','true');
  expect(await visible('4')).toBe(true);
  expect(await visible('15')).toBe(false); // The reveal remains inside the focused branch.
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('libremap:v2:role-filter') ?? '{}').showOther)).toBe(true);
  await page.reload();
  await expect(page.getByRole('status')).toContainText('Topology loaded');
  await expect(page.getByRole('button',{name:'Hide other devices'})).toHaveAttribute('aria-pressed','true');
  expect(await visible('4')).toBe(true);
  await page.getByRole('button',{name:'Hide other devices'}).click();
  expect(await visible('4')).toBe(false);
});

test('inside LibreNMS the map follows the site style and page background',async({page})=>{
  // Mirrors LibreNMS: styles.css paints body white, tw_dark.css paints `.dark body` #272b30.
  await page.route('**/host-theme',route=>route.fulfill({contentType:'text/html',body:'<style>body{margin:0;background:#fff}.dark body{background-color:#272b30}</style><div id="libremap" data-endpoint="/host-snapshot" data-host-theme="true"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/host-snapshot',route=>route.fulfill({json:demoSnapshot()}));
  await page.goto('/host-theme');
  await expect(page.getByRole('status')).toContainText('Topology loaded');
  const map=page.locator('#libremap'), canvas=page.locator('.lm-canvas-wrap');
  await expect(map).not.toHaveClass(/lm-dark/);
  await expect(canvas).toHaveCSS('background-color','rgb(255, 255, 255)');
  await expect(page.getByRole('button',{name:'Theme'})).toHaveCount(0);
  await page.screenshot({path:'test-results/libremap-host-light.png',fullPage:true,animations:'disabled'});
  // applySiteStyle toggles `dark` on <html>, including live in "device" mode.
  await page.evaluate(()=>document.documentElement.classList.add('dark'));
  await expect(map).toHaveClass(/lm-dark/);
  await expect(canvas).toHaveCSS('background-color','rgb(39, 43, 48)');
  await page.screenshot({path:'test-results/libremap-host-dark.png',fullPage:true,animations:'disabled'});
  await page.evaluate(()=>document.documentElement.classList.remove('dark'));
  await expect(map).not.toHaveClass(/lm-dark/);
  await expect(canvas).toHaveCSS('background-color','rgb(255, 255, 255)');
});

test('outside LibreNMS the map follows the OS color scheme',async({page})=>{
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto('/');
  await expect(page.getByRole('status')).toContainText('Demo topology');
  await expect(page.locator('#libremap')).toHaveClass(/lm-dark/);
  await page.emulateMedia({colorScheme:'light'});
  await expect(page.locator('#libremap')).not.toHaveClass(/lm-dark/);
});

test('failed live endpoint displays an error without demo fallback',async({page})=>{
  await page.route('**/live-test',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-endpoint="/unavailable"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/unavailable',route=>route.fulfill({status:403,contentType:'application/json',body:'{}'}));
  await page.goto('/live-test');
  await expect(page.getByRole('status')).toContainText('HTTP 403');
  await expect(page.getByText('Topology unavailable. Use Refresh to retry.')).toBeVisible();
  await expect(page.getByText('DEMO DATA',{exact:true})).toHaveCount(0);
});

test('a rejected topology displays the server reason',async({page})=>{
  await page.route('**/limit-test',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-endpoint="/topology-limit"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/topology-limit',route=>route.fulfill({status:422,json:{message:'LibreMap device limit exceeded. Increase libremap.max_devices before loading this network.'}}));
  await page.goto('/limit-test');
  await expect(page.getByRole('status')).toHaveText('LibreMap device limit exceeded. Increase libremap.max_devices before loading this network.');
});

test('production bundle loads its worker beneath a published asset path',async({page})=>{
  const errors:string[]=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/production-test',route=>route.fulfill({contentType:'text/html',body:'<link rel="stylesheet" href="/dist/libremap.css"><div id="libremap" data-demo="true" data-storage-key="production-test"></div><script type="module" src="/dist/libremap.js"></script>'}));
  await page.goto('/production-test');
  await expect(page.getByRole('status')).toContainText('Demo topology',{timeout:15000});
  await expect(page.getByRole('heading',{name:'Follow the connection'})).toBeVisible();
  expect(errors).toEqual([]);
});

test('dragged positions survive refresh and a full page reload',async({page})=>{
  await page.goto('/');
  await expect(page.getByRole('status')).toContainText('Demo topology');
  const read = () => page.evaluate(() => (window as unknown as {libremapDebug:()=>{nodes:{id:string;position:{x:number;y:number};renderedPosition:{x:number;y:number}}[]}}).libremapDebug().nodes[0]);
  const before=await read();
  const bounds=(await page.locator('.lm-canvas').boundingBox())!;
  const start={x:bounds.x+before.renderedPosition.x,y:bounds.y+before.renderedPosition.y};
  await page.mouse.move(start.x,start.y); await page.mouse.down(); await page.mouse.move(start.x+36,start.y+28,{steps:8}); await page.mouse.up();
  const moved=await read(); expect(moved.position).not.toEqual(before.position);
  await page.getByRole('button',{name:'Refresh'}).click();
  expect((await read()).position).toEqual(moved.position);
  await page.reload(); await expect(page.getByRole('status')).toContainText('Demo topology');
  expect((await read()).position).toEqual(moved.position);
});

test('loss of authorization clears the previously rendered topology',async({page})=>{
  let authorized=true;
  await page.route('**/live-test',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-endpoint="/snapshot"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/snapshot',route=>route.fulfill({status:authorized?200:403,contentType:'application/json',body:JSON.stringify(authorized?demoSnapshot():{})}));
  await page.goto('/live-test'); await expect(page.getByRole('status')).toContainText('Topology loaded');
  await expect(page.getByRole('button',{name:'◈ hk-rossa1agg1'})).toBeVisible();
  authorized=false; await page.getByRole('button',{name:'Refresh'}).click();
  await expect(page.getByRole('status')).toContainText('HTTP 403');
  await expect(page.getByRole('button',{name:'◈ hk-rossa1agg1'})).toHaveCount(0);
  await expect(page.locator('.lm-summary')).toBeEmpty();
});

test('a failed refresh cannot erase the stored workspace',async({page})=>{
  let authorized=true;
  await page.route('**/live-test',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-endpoint="/snapshot" data-storage-key="persist-test"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/snapshot',route=>route.fulfill({status:authorized?200:403,contentType:'application/json',body:JSON.stringify(authorized?demoSnapshot():{})}));
  const stored=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('libremap:v2:persist-test') ?? 'null'));
  await page.goto('/live-test'); await expect(page.getByRole('status')).toContainText('Topology loaded');
  await page.getByRole('button',{name:'◈ hk-rossa1agg1'}).click();
  await page.getByRole('button',{name:'Pin position',exact:true}).click();
  await expect(page.locator('.lm-pin-count')).toHaveText('1 pinned');
  const saved=await stored(); expect(saved.pinned).toEqual(['0']);

  authorized=false; await page.getByRole('button',{name:'Refresh'}).click();
  await expect(page.getByRole('status')).toContainText('HTTP 403');
  // Controls that write the workspace must be inert while no topology is loaded.
  await expect(page.getByRole('searchbox')).toBeDisabled();
  await expect(page.getByRole('button',{name:'AGG backbone'})).toBeDisabled();
  await expect(page.getByRole('button',{name:'Re-layout',exact:true})).toBeDisabled();
  expect(await stored()).toEqual(saved);

  authorized=true; await page.getByRole('button',{name:'Refresh'}).click();
  await expect(page.getByRole('status')).toContainText('Topology loaded');
  await expect(page.locator('.lm-pin-count')).toHaveText('1 pinned');
  await page.reload(); await expect(page.getByRole('status')).toContainText('Topology loaded');
  await expect(page.locator('.lm-pin-count')).toHaveText('1 pinned');
  expect((await stored()).pinned).toEqual(['0']);
});
