import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compactWideRestore, packTierPositions } from '../frontend/layout-positions';
import type { MapNode, Topology } from '../frontend/types';

const nodes=(count:number,tier=1):MapNode[]=>Array.from({length:count},(_,index)=>({
  id:String(index+1),hostname:`site1er${index+1}`,status:'up',role:'ER',site:'site1',tier,reachable:true,
}));

test('a production-sized topology tier wraps vertically instead of forming one very wide row',()=>{
  const graph:Topology={nodes:nodes(2048),links:[],deviceGroups:[]};
  const positions=packTierPositions(graph,new Map(graph.nodes.map((node,index)=>[node.id,index])));
  const xs=Object.values(positions).map(position=>position.x);
  const ys=Object.values(positions).map(position=>position.y);
  const width=Math.max(...xs)-Math.min(...xs)+210;
  const height=Math.max(...ys)-Math.min(...ys)+76;

  assert.ok(new Set(ys).size>1);
  assert.ok(width/height<1.8,`expected a compact overview, received ${width}x${height}`);
});

test('small tiers remain on one row and later tiers stay below earlier tiers',()=>{
  const first=nodes(4,0);
  const second=nodes(6,1).map((node,index)=>({...node,id:String(index+5)}));
  const graph:Topology={nodes:[...first,...second],links:[],deviceGroups:[]};
  const positions=packTierPositions(graph,new Map(graph.nodes.map((node,index)=>[node.id,index])));

  assert.equal(new Set(first.map(node=>positions[node.id].y)).size,1);
  assert.equal(new Set(second.map(node=>positions[node.id].y)).size,1);
  assert.ok(Math.min(...second.map(node=>positions[node.id].y))>Math.max(...first.map(node=>positions[node.id].y)));
  assert.equal(Math.abs(positions[first[1].id].x-positions[first[0].id].x),238);
  assert.equal(positions[second[0].id].y-positions[first[0].id].y,135);
});

test('focused tiers use tighter spacing and fewer columns',()=>{
  const graph:Topology={nodes:nodes(20),links:[],deviceGroups:[]};
  const positions=packTierPositions(graph,new Map(graph.nodes.map((node,index)=>[node.id,index])),true);
  const xs=[...new Set(Object.values(positions).map(position=>position.x))].sort((a,b)=>a-b);
  const ys=[...new Set(Object.values(positions).map(position=>position.y))].sort((a,b)=>a-b);

  assert.equal(xs[1]-xs[0],228);
  assert.equal(ys[1]-ys[0],112);
  assert.equal(xs.length,4);
  assert.equal(ys.length,5);
});

test('old automatic restores are repacked without moving pinned devices',()=>{
  const wide=Object.fromEntries(Array.from({length:20},(_,index)=>[String(index+1),{x:index*260,y:0}]));
  assert.deepEqual(compactWideRestore(wide,new Set(['4'])),{'4':wide['4']});
  const legacyGrid=Object.fromEntries(Array.from({length:20},(_,index)=>[String(index+1),{x:(index%5)*260,y:Math.floor(index/5)*210}]));
  assert.deepEqual(compactWideRestore(legacyGrid,new Set(['4'])),{'4':legacyGrid['4']});
  const currentGrid=Object.fromEntries(Array.from({length:20},(_,index)=>[String(index+1),{x:(index%5)*238,y:Math.floor(index/5)*135}]));
  assert.equal(compactWideRestore(currentGrid,new Set()),currentGrid);
});
