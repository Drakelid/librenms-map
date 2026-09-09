import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arrangePositions, branchNodes, emptyView, normalizeView, visibleNodes } from '../frontend/view-state';
import { topology } from '../frontend/topology';
import type { MapNode } from '../frontend/types';
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
  const ids=visibleNodes(graph,{rootId:null,site:'rossa1',search:'agg1',backbone:true});
  assert.ok(ids.has('0'));
  assert.ok(!ids.has('4')); // Direct ER neighbor must remain outside backbone.
  assert.ok(!ids.has('2')); // Different site must remain outside the site filter.
});
test('saved state redacts removed devices and rejects corrupt coordinates and roots',()=>{
  const result=normalizeView({rootId:'999',positions:{'0':{x:42,y:90},'999':{x:4,y:5},'1':{x:Infinity,y:3}},pinned:['0','1','999'],zoom:100,pan:{x:NaN,y:4},site:'private-site',search:'x'.repeat(200)},graph);
  assert.deepEqual(result.positions,{'0':{x:42,y:90}});
  assert.deepEqual(result.pinned,['0']);
  assert.equal(result.rootId,null); assert.equal(result.site,'');assert.equal(result.zoom,2.5);
  assert.deepEqual(result.pan,{x:0,y:0});assert.equal(result.search.length,128);
  assert.equal(normalizeView({rootId:'4'},graph).rootId,null); // ER cannot become a root.
  assert.deepEqual(normalizeView(null),emptyView());
});
test('automatic re-layout respects a pinned device and avoids its occupied position',()=>{
  const automatic=Object.fromEntries(graph.nodes.map((n,i)=>[n.id,{x:i*260,y:0}]));
  const pins=new Set(['0']);const restore={'0':{...automatic['4']}};
  const result=arrangePositions(graph,automatic,restore,pins);
  assert.deepEqual(result['0'],restore['0']);assert.notDeepEqual(result['4'],restore['0']);
  assert.equal(Object.keys(result).length,graph.nodes.length);
  for(const n of graph.nodes.filter(n=>n.id!=='0')) assert.ok(Math.abs(result[n.id].x-result['0'].x)>=246 || Math.abs(result[n.id].y-result['0'].y)>=105);
});

test('dense placement keeps every automatic node clear of the others',()=>{
  // All candidates start on one point, so the placement search runs for each
  // node. This guards the cell-bucketed overlap test against regressions.
  const nodes:MapNode[]=Array.from({length:400},(_,i)=>({id:String(i+1),hostname:`n${i}`,status:'up',role:'ER',site:'s1',tier:i%8,reachable:true}));
  const automatic=Object.fromEntries(nodes.map(n=>[n.id,{x:0,y:0}]));
  const result=arrangePositions({nodes,links:[]},automatic,{},new Set());
  const points=Object.values(result);
  assert.equal(points.length,nodes.length);
  for(let i=0;i<points.length;i++) for(let j=i+1;j<points.length;j++)
    assert.ok(Math.abs(points[i].x-points[j].x)>=246 || Math.abs(points[i].y-points[j].y)>=105,`nodes ${i} and ${j} overlap`);
});
