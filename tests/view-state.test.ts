import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arrangePositions, branchNodes, emptyView, HOPS_MAX, hopNeighborhood, normalizeView, visibleNodes } from '../frontend/view-state';
import { topology } from '../frontend/topology';
import type { MapNode, Topology } from '../frontend/types';
import { demoSnapshot } from '../frontend/demo';
const graph=topology(demoSnapshot());

test('focused root includes its peer and redundant ER links but stops at neighboring AGGs',()=>{
  const ids=branchNodes(graph,'0');
  assert.ok(ids.has('0') && ids.has('1') && ids.has('4') && ids.has('7'));
  assert.ok(ids.has('2')); // Boundary AGG remains visible.
  assert.ok(!ids.has('3') && !ids.has('8') && !ids.has('9'));
  assert.equal(branchNodes(graph,null).size,graph.nodes.length);
  assert.equal(branchNodes(graph,'999').size,graph.nodes.length);
});
test('search cannot expand beyond explicit site or backbone filters',()=>{
  const ids=visibleNodes(graph,{rootId:null,site:'rossa1',search:'agg1',backbone:true,showOther:false});
  assert.ok(ids.has('0'));
  assert.ok(!ids.has('4')); // Direct ER neighbor must remain outside backbone.
  assert.ok(!ids.has('2')); // Different site must remain outside the site filter.
});
test('other devices are hidden by default and revealed only inside the active scope',()=>{
  const scoped={nodes:[
    {id:'1',hostname:'site1agg1',status:'up',role:'AGG',site:'site1',tier:0,reachable:true},
    {id:'2',hostname:'site1er1',status:'up',role:'ER',site:'site1',tier:1,reachable:true},
    {id:'3',hostname:'site1-switch',status:'up',role:'OTHER',site:'site1',tier:2,reachable:true},
    {id:'4',hostname:'site2-switch',status:'up',role:'OTHER',site:'site2',tier:1,reachable:true},
  ],links:[
    {id:'1-2',source:'1',target:'2',sourcePort:'a',targetPort:'b',sourcePortId:'1',targetPortId:'2',speedBps:null,inBps:null,outBps:null,sampledAt:null,status:'up'},
    {id:'2-3',source:'2',target:'3',sourcePort:'a',targetPort:'b',sourcePortId:'3',targetPortId:'4',speedBps:null,inBps:null,outBps:null,sampledAt:null,status:'up'},
    {id:'1-4',source:'1',target:'4',sourcePort:'a',targetPort:'b',sourcePortId:'5',targetPortId:'6',speedBps:null,inBps:null,outBps:null,sampledAt:null,status:'up'},
  ],deviceGroups:[{id:'7',name:'Site 1 devices',deviceIds:['1','3','4']}]} satisfies Topology;
  const hidden=visibleNodes(scoped,{rootId:'1',site:'site1',search:'',backbone:false,showOther:false});
  assert.deepEqual([...hidden],['1','2']);
  const revealed=visibleNodes(scoped,{rootId:'1',site:'site1',search:'',backbone:false,showOther:true});
  assert.deepEqual([...revealed],['1','2','3']);
});
test('device group focus intersects branch, site, role visibility and search filters',()=>{
  const scoped={nodes:[
    {id:'1',hostname:'site1agg1',status:'up',role:'AGG',site:'site1',tier:0,reachable:true},
    {id:'2',hostname:'site1er1',status:'up',role:'ER',site:'site1',tier:1,reachable:true},
    {id:'3',hostname:'site1-switch',status:'up',role:'OTHER',site:'site1',tier:2,reachable:true},
    {id:'4',hostname:'site2agg1',status:'up',role:'AGG',site:'site2',tier:0,reachable:true},
  ],links:[
    {id:'1-2',source:'1',target:'2',sourcePort:'a',targetPort:'b',sourcePortId:'1',targetPortId:'2',speedBps:null,inBps:null,outBps:null,sampledAt:null,status:'up'},
    {id:'2-3',source:'2',target:'3',sourcePort:'a',targetPort:'b',sourcePortId:'3',targetPortId:'4',speedBps:null,inBps:null,outBps:null,sampledAt:null,status:'up'},
    {id:'1-4',source:'1',target:'4',sourcePort:'a',targetPort:'b',sourcePortId:'5',targetPortId:'6',speedBps:null,inBps:null,outBps:null,sampledAt:null,status:'up'},
  ],deviceGroups:[{id:'7',name:'Selected',deviceIds:['1','3','4']}]} satisfies Topology;
  assert.deepEqual([...visibleNodes(scoped,{rootId:'1',deviceGroupId:'7',site:'site1',search:'',backbone:false,showOther:false})],['1']);
  assert.deepEqual([...visibleNodes(scoped,{rootId:'1',deviceGroupId:'7',site:'site1',search:'',backbone:false,showOther:true})],['1','3']);
  assert.deepEqual([...visibleNodes(scoped,{rootId:null,deviceGroupId:'7',site:'site1',search:'agg',backbone:false,showOther:true})],['1']);
  assert.deepEqual([...visibleNodes(scoped,{rootId:null,deviceGroupId:'999',site:'',search:'',backbone:false,showOther:true})],[]);
  assert.equal(normalizeView({deviceGroupId:'7'},scoped).deviceGroupId,'7');
  assert.equal(normalizeView({deviceGroupId:'999'},scoped).deviceGroupId,null);
});
test('search matches the display name, hostname and sysName',()=>{
  const named={nodes:[
    {id:'1',hostname:'10.0.0.1',sysName:'rossa1agg1.example.net',displayName:'Core AGG',status:'up',role:'AGG',site:'rossa1',tier:0,reachable:true},
    {id:'2',hostname:'10.0.0.2',status:'up',role:'AGG',site:'rossa1',tier:0,reachable:true},
  ],links:[],deviceGroups:[]} satisfies Topology;
  for(const search of ['core agg','10.0.0.1','example.net']) assert.deepEqual([...visibleNodes(named,{rootId:null,site:'',search,backbone:false,showOther:false})],['1']);
});
test('highlight hops walk visible links outward from the selected device',()=>{
  const link=(id:string,source:string,target:string)=>({id,source,target,sourcePort:'a',targetPort:'b',sourcePortId:id,targetPortId:id,speedBps:null,inBps:null,outBps:null,sampledAt:null,status:'up' as const});
  const chain:Topology={nodes:['1','2','3','4','5'].map((id,i)=>({id,hostname:`n${id}`,status:'up' as const,role:i?'ER':'AGG',site:'s1',tier:i,reachable:true})),
    links:[link('a','1','2'),link('b','2','3'),link('c','3','4'),link('d','1','5'),link('e','5','3')],deviceGroups:[]};
  const all=new Set(chain.nodes.map(n=>n.id));
  const one=hopNeighborhood(chain,'1',1,all);
  assert.deepEqual([...one.nodes].sort(),['1','2','5']);assert.deepEqual([...one.links].sort(),['a','d']);
  const two=hopNeighborhood(chain,'1',2,all);
  assert.deepEqual([...two.nodes].sort(),['1','2','3','5']);assert.deepEqual([...two.links].sort(),['a','b','d','e']);
  assert.deepEqual([...hopNeighborhood(chain,'1',HOPS_MAX,all).nodes].sort(),['1','2','3','4','5']);
  // A hidden device neither lights up nor bridges to the devices beyond it.
  assert.deepEqual([...hopNeighborhood(chain,'1',HOPS_MAX,new Set(['1','2','4','5'])).nodes].sort(),['1','2','5']);
});
test('highlight hops survive normalization only as whole numbers within bounds',()=>{
  assert.equal(normalizeView({hops:3}).hops,3);
  for(const hops of [0,HOPS_MAX+1,1.5,'2',null]) assert.equal(normalizeView({hops}).hops,1);
});
test('saved state redacts removed devices and rejects corrupt coordinates and roots',()=>{
  const result=normalizeView({rootId:'999',positions:{'0':{x:42,y:90},'999':{x:4,y:5},'1':{x:Infinity,y:3}},pinned:['0','1','999'],zoom:100,pan:{x:NaN,y:4},site:'private-site',search:'x'.repeat(200)},graph);
  assert.deepEqual(result.positions,{'0':{x:42,y:90}});
  assert.deepEqual(result.pinned,['0']);
  assert.equal(result.rootId,null); assert.equal(result.site,'');assert.equal(result.zoom,2.5);
  assert.deepEqual(result.pan,{x:0,y:0});assert.equal(result.search.length,200);
  assert.equal(normalizeView({rootId:'4'},graph).rootId,null); // ER cannot become a root.
  assert.deepEqual(normalizeView(null),emptyView());
});

test('server-accepted filter lengths survive normalization, including Unicode',()=>{
  for(const text of ['x'.repeat(200), '😀'.repeat(200)]) {
    const result=normalizeView({site:text,search:text});
    assert.equal(result.site,text);
    assert.equal(result.search,text);
    assert.equal(normalizeView({search:text+'extra'}).search,text);
  }
  assert.equal(normalizeView({site:'x'.repeat(201)}).site,'');
});
test('automatic re-layout respects a pinned device and avoids its occupied position',()=>{
  const automatic=Object.fromEntries(graph.nodes.map((n,i)=>[n.id,{x:i*260,y:0}]));
  const pins=new Set(['0']);const restore={'0':{...automatic['4']}};
  const result=arrangePositions(graph,automatic,restore,pins);
  assert.deepEqual(result['0'],restore['0']);assert.notDeepEqual(result['4'],restore['0']);
  assert.equal(Object.keys(result).length,graph.nodes.length);
  for(const n of graph.nodes.filter(n=>n.id!=='0')) assert.ok(Math.abs(result[n.id].x-result['0'].x)>=228 || Math.abs(result[n.id].y-result['0'].y)>=94);
});

test('dense placement keeps every automatic node clear of the others',()=>{
  // All candidates start on one point, so the placement search runs for each
  // node. This guards the cell-bucketed overlap test against regressions.
  const nodes:MapNode[]=Array.from({length:400},(_,i)=>({id:String(i+1),hostname:`n${i}`,status:'up',role:'ER',site:'s1',tier:i%8,reachable:true}));
  const automatic=Object.fromEntries(nodes.map(n=>[n.id,{x:0,y:0}]));
  const result=arrangePositions({nodes,links:[],deviceGroups:[]},automatic,{},new Set());
  const points=Object.values(result);
  assert.equal(points.length,nodes.length);
  for(let i=0;i<points.length;i++) for(let j=i+1;j<points.length;j++)
    assert.ok(Math.abs(points[i].x-points[j].x)>=228 || Math.abs(points[i].y-points[j].y)>=94,`nodes ${i} and ${j} overlap`);
});

test('saved positions are bounded by the loaded map, not a fixed 2,000',()=>{
  // libremap.max_devices may exceed 2,000; the server's limit follows it.
  const nodes:MapNode[]=Array.from({length:2500},(_,i)=>({id:String(i+1),hostname:`n${i}`,status:'up',role:'ER',site:'s1',tier:1,reachable:true}));
  const positions=Object.fromEntries(nodes.map(n=>[n.id,{x:1,y:2}]));
  const result=normalizeView({positions,pinned:nodes.map(n=>n.id)},{nodes,links:[],deviceGroups:[]});
  assert.equal(Object.keys(result.positions).length,2500);
  assert.equal(result.pinned.length,2500);
  assert.equal(Object.keys(normalizeView({positions}).positions).length,2500);
});
