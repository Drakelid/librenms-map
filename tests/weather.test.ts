import { test } from 'node:test';
import assert from 'node:assert/strict';
import { insidePolygon } from '../frontend/geo';
import { parseWarnings, warningPath, warningsAt, worstLevel } from '../frontend/weather';

const square=(lng:number,lat:number,size=1)=>[[lng,lat],[lng+size,lat],[lng+size,lat+size],[lng,lat+size],[lng,lat]];
const warning=(id:string,level:string,polygons:unknown)=>({id,level,title:id,polygons});

test('polygons honour their holes',()=>{
  const ring=[square(0,0,10),square(4,4,2)] as [number,number][][];
  assert.equal(insidePolygon({lat:1,lng:1},ring),true);
  assert.equal(insidePolygon({lat:5,lng:5},ring),false); // Inside the hole.
  assert.equal(insidePolygon({lat:11,lng:1},ring),false);
});

test('warning feeds are validated before they are drawn',()=>{
  const feed=parseWarnings({attribution:'Weather warnings © MET Norway',fetchedAt:5,warnings:[
    warning('red','red',[[square(5,60)]]),
    warning('yellow','yellow',[[square(5,60,3)]]),
    warning('purple','purple',[[square(5,60)]]),
    warning('broken','orange',[[[[5,60],[6,60]]]]), // Too few points to be an area.
    {...warning('link','orange',[[square(20,69)]]),web:'javascript:alert(1)'},
  ]});
  // Least severe first, so the most severe draws on top.
  assert.deepEqual(feed.warnings.map(w=>w.id),['yellow','link','red']);
  assert.equal(feed.warnings.find(w=>w.id==='link')!.web,null);
  assert.deepEqual(feed.warnings[0].bounds,{minLat:60,maxLat:63,minLng:5,maxLng:8});
  assert.throws(()=>parseWarnings({}));

  // A location under two warnings reports the most severe first.
  const covering=warningsAt({lat:60.4,lng:5.3},feed.warnings);
  assert.deepEqual(covering.map(w=>w.id),['red','yellow']);
  assert.equal(worstLevel(covering),'red');
  assert.deepEqual(warningsAt({lat:62.5,lng:7.5},feed.warnings).map(w=>w.id),['yellow']);
  assert.equal(worstLevel([]),undefined);
  assert.match(warningPath(feed.warnings[0],0),/^M[\d. L]+Z$/);
});
