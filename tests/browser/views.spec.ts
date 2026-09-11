import { test, expect, type Page } from '@playwright/test';
import { demoSnapshot } from '../../frontend/demo';
import { emptyView } from '../../frontend/view-state';
import type { SavedView } from '../../frontend/types';

const graph = (page:Page) => page.evaluate(()=>(window as unknown as {libremapDebug:()=>{nodes:{id:string;visible:boolean;position:{x:number;y:number}}[]}}).libremapDebug());

test('corrupt demo view storage resets and remains usable',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('libremap:v2:demo:views','{corrupt'));
  await page.goto('/');
  await expect(page.getByRole('status')).toContainText('Demo topology');
  await expect(page.locator('.lm-view-status')).toHaveText('Demo views · this browser only');
  expect(await page.evaluate(()=>localStorage.getItem('libremap:v2:demo:views'))).toBe('[]');

  await page.getByRole('button',{name:'Save view',exact:true}).click();
  await page.getByRole('textbox',{name:'View name'}).fill('Recovered view');
  await page.getByRole('button',{name:'Save as new',exact:true}).click();
  await expect(page.locator('.lm-view-status')).toHaveText('Saved “Recovered view”.');
});

test('server-sized names and filters round-trip without truncation, including Unicode',async({page})=>{
  const site='s'.repeat(200);
  const search='😀'.repeat(200);
  const name='😀'.repeat(100);
  const snapshot=demoSnapshot();
  snapshot.config.overrides={'0':{role:'AGG',site}};
  const view:SavedView={id:'long-view',name,revision:1,updatedAt:new Date().toISOString(),state:{...emptyView(),site,search}};
  let saved:unknown;
  await page.route('**/limits-page',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-endpoint="/limits-topology" data-views-endpoint="/limits-views"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/limits-topology',route=>route.fulfill({json:snapshot}));
  await page.route(/\/limits-views(?:\/[^/]+)?$/,async route=>{
    if(route.request().method()==='GET')return route.fulfill({json:{views:[view]}});
    saved=route.request().postDataJSON();
    return route.fulfill({json:{view:{...view,revision:2}}});
  });
  await page.goto('/limits-page');
  await expect(page.locator('.lm-notice')).toContainText('Topology loaded');
  await page.getByRole('combobox',{name:'Saved view',exact:true}).selectOption(view.id);
  await expect(page.getByRole('combobox',{name:'Site',exact:true})).toHaveValue(site);
  await expect(page.getByRole('searchbox')).toHaveValue(search);
  await page.getByRole('button',{name:'Save view',exact:true}).click();
  const input=page.getByRole('textbox',{name:'View name'});
  await expect(input).toHaveValue(name);
  await input.fill(name+'x');
  expect(await input.evaluate((el:HTMLInputElement)=>el.checkValidity())).toBe(false);
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await page.getByRole('button',{name:'Save view',exact:true}).click();
  await expect(input).toHaveValue(name);
  expect(await input.evaluate((el:HTMLInputElement)=>el.checkValidity())).toBe(true);
  await page.getByRole('button',{name:'Save changes',exact:true}).click();
  await expect(page.locator('.lm-view-status')).toContainText('Saved');
  expect(saved).toMatchObject({name,state:{site,search},revision:1});
  await page.getByRole('searchbox').fill(search+'extra');
  await expect(page.getByRole('searchbox')).toHaveValue(search);
});

test('root focus, pins and named demo views survive layout and reload',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await expect(page.getByRole('status')).toContainText('Demo topology');
  await page.getByRole('combobox',{name:'Device group'}).selectOption('101');
  await page.getByRole('combobox',{name:'AGG root'}).selectOption('0');
  expect((await graph(page)).nodes.find(n=>n.id==='8')!.visible).toBe(false);
  expect((await graph(page)).nodes.find(n=>n.id==='1')!.visible).toBe(true);
  await page.getByRole('button',{name:'◈ hk-rossa1agg1'}).click();
  await page.getByRole('button',{name:'Pin position',exact:true}).click();
  await expect(page.getByRole('button',{name:'Unpin device'})).toBeVisible();
  await page.getByRole('button',{name:'Show other devices',exact:true}).click();
  const pinned=(await graph(page)).nodes.find(n=>n.id==='0')!.position;
  await page.getByRole('button',{name:'Re-layout',exact:true}).click();
  await expect.poll(async()=>(await graph(page)).nodes.find(n=>n.id==='0')!.position).toEqual(pinned);
  await page.getByRole('button',{name:'Save view',exact:true}).click();
  await page.getByRole('textbox',{name:'View name'}).fill('Rossa primary');
  await page.getByRole('button',{name:'Save as new',exact:true}).click();
  await expect(page.locator('.lm-view-status')).toContainText('Saved “Rossa primary”');
  const id=await page.getByRole('combobox',{name:'Saved view',exact:true}).inputValue();
  await page.getByRole('combobox',{name:'Device group'}).selectOption('102');
  await page.getByRole('combobox',{name:'AGG root'}).selectOption('2');
  await page.getByRole('button',{name:'Unpin all',exact:true}).click();
  await page.getByRole('button',{name:'Hide other devices',exact:true}).click();
  await page.getByRole('combobox',{name:'Saved view',exact:true}).selectOption('');
  await page.getByRole('combobox',{name:'Saved view',exact:true}).selectOption(id);
  await expect(page.getByRole('combobox',{name:'Device group'})).toHaveValue('101');
  await expect(page.getByRole('combobox',{name:'AGG root'})).toHaveValue('0');
  await expect(page.locator('.lm-pin-count')).toHaveText('1 pinned');
  await expect(page.getByRole('button',{name:'Hide other devices',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.reload();await expect(page.getByRole('status')).toContainText('Demo topology');
  await expect(page.getByRole('combobox',{name:'Device group'})).toHaveValue('101');
  await expect(page.getByRole('combobox',{name:'AGG root'})).toHaveValue('0');
  await expect(page.locator('.lm-pin-count')).toHaveText('1 pinned');
  await expect(page.getByRole('button',{name:'Hide other devices',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('combobox',{name:'Saved view',exact:true}).selectOption(id);
  await page.getByRole('button',{name:'Save view',exact:true}).click();
  await page.getByRole('textbox',{name:'View name'}).fill('Rossa operations');
  await page.getByRole('button',{name:'Save changes',exact:true}).click();
  await expect(page.locator('.lm-view-status')).toContainText('Saved “Rossa operations”');
  await page.screenshot({path:'test-results/libremap-views.png',fullPage:true});
  await page.getByRole('button',{name:'Delete view',exact:true}).click();
  await page.getByRole('button',{name:'Delete saved view',exact:true}).click();
  await expect(page.locator('.lm-view-status')).toContainText('Saved view deleted');
  expect(errors).toEqual([]);
});

test('live saved views use CSRF, handle revision conflicts, and restore the newest view',async({page})=>{
  let stored:SavedView|undefined;let conflict=false;const methods:string[]=[];
  await page.route('**/live-views',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-endpoint="/test-topology" data-views-endpoint="/test-views" data-csrf="test-csrf"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/test-topology',route=>route.fulfill({contentType:'application/json',body:JSON.stringify(demoSnapshot())}));
  await page.route(/\/test-views(?:\/[^/]+)?$/,async route=>{
    const request=route.request();const method=request.method();methods.push(method);
    expect(request.headers()['x-csrf-token']).toBe('test-csrf');
    if(method==='GET')return route.fulfill({json:{views:stored?[stored]:[]}});
    if(method==='POST'){
      const body=request.postDataJSON();stored={...body,id:'private-view',revision:1,updatedAt:new Date().toISOString()};
      return route.fulfill({status:201,json:{view:stored}});
    }
    if(method==='PUT'){
      if(conflict){stored={...stored!,name:'Changed elsewhere',revision:2,state:{...emptyView(),rootId:'2'}};return route.fulfill({status:409,json:{message:'Conflict'}});}
      const body=request.postDataJSON();expect(body.revision).toBe(stored!.revision);stored={...stored!,...body,revision:stored!.revision+1};return route.fulfill({json:{view:stored}});
    }
    if(method==='DELETE'){expect(new URL(request.url()).searchParams.get('revision')).toBe(String(stored!.revision));expect(request.postData()).toBeNull();stored=undefined;return route.fulfill({status:204});}
    throw new Error(`Unexpected method ${method}`);
  });
  await page.goto('/live-views');await expect(page.getByRole('status')).toContainText('Topology loaded');
  await page.getByRole('button',{name:'Save view',exact:true}).click();await page.getByRole('textbox',{name:'View name'}).fill('Private map');await page.getByRole('button',{name:'Save as new',exact:true}).click();
  await expect(page.locator('.lm-view-status')).toContainText('Saved “Private map”');
  conflict=true;
  await page.getByRole('button',{name:'Save view',exact:true}).click();await page.getByRole('button',{name:'Save changes',exact:true}).click();
  await expect(page.locator('.lm-view-status')).toContainText('changed in another tab');
  await page.getByRole('button',{name:'Reload views',exact:true}).click();
  await expect(page.getByRole('combobox',{name:'AGG root'})).toHaveValue('2');
  conflict=false;
  await page.getByRole('button',{name:'Save view',exact:true}).click();await page.getByRole('button',{name:'Save changes',exact:true}).click();
  await expect(page.locator('.lm-view-status')).toContainText('Saved “Changed elsewhere”');
  await page.getByRole('button',{name:'Delete view',exact:true}).click();await page.getByRole('button',{name:'Delete saved view',exact:true}).click();
  await expect(page.locator('.lm-view-status')).toContainText('Saved view deleted');
  expect(methods).toContain('POST');expect(methods).toContain('PUT');expect(methods).toContain('DELETE');
});

test('missing saved-view migration leaves live topology usable with an explicit error',async({page})=>{
  await page.route('**/live-views',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-endpoint="/test-topology" data-views-endpoint="/test-views"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/test-topology',route=>route.fulfill({json:demoSnapshot()}));
  await page.route('**/test-views',route=>route.fulfill({status:503,json:{message:'Migration pending'}}));
  await page.goto('/live-views');
  await expect(page.getByRole('status')).toContainText('Topology loaded');
  await expect(page.locator('.lm-view-status')).toContainText('migration may be pending');
  await expect(page.getByRole('button',{name:'◈ hk-rossa1agg1'})).toBeVisible();
});

test('saving waits for layout restoration and standalone viewport changes persist',async({page})=>{
  await page.addInitScript(()=>{
    const post=Worker.prototype.postMessage;
    Worker.prototype.postMessage=function(message:unknown,options?:Transferable[]|StructuredSerializeOptions){
      const send=()=>Reflect.apply(post,this,[message,options]);
      if(message && (message as {cmd?:string}).cmd==='layout' && sessionStorage.getItem('delay-layout')==='true')setTimeout(send,1200);else send();
    };
  });
  await page.goto('/');await expect(page.getByRole('status')).toContainText('Demo topology');
  await page.getByRole('button',{name:'Save view',exact:true}).click();await page.getByRole('textbox',{name:'View name'}).fill('Restore target');await page.getByRole('button',{name:'Save as new',exact:true}).click();
  await expect(page.locator('.lm-view-status')).toContainText('Saved “Restore target”');
  const select=page.getByRole('combobox',{name:'Saved view',exact:true});const id=await select.inputValue();
  await page.evaluate(()=>sessionStorage.setItem('delay-layout','true'));
  await select.selectOption('');await select.selectOption(id);
  await expect(page.getByRole('button',{name:'Save view',exact:true})).toBeDisabled();
  await expect(page.getByRole('button',{name:'Re-layout',exact:true})).toBeDisabled();
  await expect(page.getByRole('button',{name:'Save view',exact:true})).toBeEnabled({timeout:5000});
  await page.getByRole('button',{name:'Zoom in',exact:true}).click();
  const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('libremap:v2:demo')!).zoom as number);
  const initial=await state();
  await expect.poll(state).toBeGreaterThan(initial);
  const zoom=await state();
  await page.reload();await expect(page.getByRole('status')).toContainText('Demo topology');
  expect(await state()).toBeCloseTo(zoom,6);
});

test('a rejected save shows the server reason, such as the view limit',async({page})=>{
  await page.route('**/limit-page',route=>route.fulfill({contentType:'text/html',body:'<div id="libremap" data-endpoint="/limit-topology" data-views-endpoint="/limit-views"></div><script type="module" src="/frontend/main.ts"></script>'}));
  await page.route('**/limit-topology',route=>route.fulfill({json:demoSnapshot()}));
  await page.route('**/limit-views',route=>route.request().method()==='GET' ? route.fulfill({json:{views:[]}}) : route.fulfill({status:422,json:{message:'You can save up to 50 views.'}}));
  await page.goto('/limit-page');await expect(page.getByRole('status')).toContainText('Topology loaded');
  await page.getByRole('button',{name:'Save view',exact:true}).click();await page.getByRole('textbox',{name:'View name'}).fill('One too many');await page.getByRole('button',{name:'Save as new',exact:true}).click();
  await expect(page.locator('.lm-view-status')).toHaveText('You can save up to 50 views.');
});
