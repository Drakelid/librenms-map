import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distanceToOutage, interiorPoint, mapsReadAt, outageAnchorAt, outagePath, outagePeriod, outagesAt, outagesNear, outageShape, parseCheck, parseHealth, parseOutages, verdictText } from '../frontend/power';

const square=(lng:number,lat:number,size=1)=>[[lng,lat],[lng+size,lat],[lng+size,lat+size],[lng,lat+size],[lng,lat]];
const outage=(id:string,kind:string,shape:Record<string,unknown>)=>({id,kind,provider:'BKK',polygons:[],lines:[],point:null,...shape});
const evidence={source:'DRIFT',observed_at:'2026-10-22T12:05:00+00:00',limitations:['Lyse map is stale']};

test('outage feeds are validated before they are drawn',()=>{
  const feed=parseOutages({count:5,complete:false,evidence,outages:[
    outage('area','current',{polygons:[[square(5,60)]],customers:120,municipality:'Bergen'}),
    outage('planned','planned',{polygons:[[square(5,60,3)]],start:'2026-10-23T08:00:00+02:00',expected_end:'2026-10-23T12:00:00+02:00'}),
    outage('line','current',{lines:[[[5,61],[5.5,61.2]]]}),
    outage('point','current',{point:[6,59]}),
    outage('nowhere','current',{}), // Nothing to draw.
    outage('odd','restored',{point:[6,59]}),
    outage('broken','current',{polygons:[[[[5,60],[6,60]]]]}), // Too few points to be an area.
  ]});
  // Planned outages draw first, under the current ones.
  assert.deepEqual(feed.outages.map(o=>o.id),['planned','area','line','point']);
  assert.deepEqual(feed.outages.map(outageShape),['area','area','lines','point']);
  assert.equal(feed.complete,false);
  assert.equal(feed.count,5);
  assert.deepEqual(feed.evidence.limitations,['Lyse map is stale']);
  assert.equal(feed.outages[1].customers,120);
  assert.deepEqual(feed.outages[1].bounds,{minLat:60,maxLat:61,minLng:5,maxLng:6});
  assert.throws(()=>parseOutages({}));

  // Only areas contain locations, current outages first.
  assert.deepEqual(outagesAt({lat:60.5,lng:5.5},feed.outages).map(o=>o.id),['area','planned']);
  assert.deepEqual(outagesAt({lat:59,lng:6},feed.outages).map(o=>o.id),[]); // On the point outage itself.

  assert.match(outagePath(feed.outages[1],0),/^M[\d. L]+Z$/);
  assert.match(outagePath(feed.outages[2],0),/^M[\d. ]+L[\d. ]+$/); // An open line.
  assert.equal(outagePath(feed.outages[3],5),''); // A point-only outage is drawn by its pin alone.
  assert.match(outagePeriod(feed.outages[0]),/ – expected /);
  assert.equal(outagePeriod(feed.outages[2]),'Time not given');
});

test('location checks never word "no known outage" as the power being on',()=>{
  const none=parseCheck({verdict:'no_known_outage',why:'Nothing within 2 km.',outages:[],evidence});
  assert.equal(verdictText(none),'No outage on the grid operators\' maps here. This does not confirm the power is on.');

  const near=parseCheck({verdict:'near_outage',outages:[{id:'x',kind:'current',provider:'Fagne',distance_km:1.4},{id:'y',kind:'planned',provider:'Fagne',distance_km:0.4}],evidence});
  assert.equal(verdictText(near),'Near an outage on the grid operator\'s map (0.4 km away).');
  assert.match(verdictText(parseCheck({verdict:'in_outage_area',outages:[],evidence})),/^Inside an outage area/);
  assert.throws(()=>parseCheck({verdict:'power_on'}));

  assert.match(mapsReadAt(none.evidence),/^Maps read at /);
  assert.equal(mapsReadAt(parseCheck({verdict:'no_known_outage'}).evidence),'Maps not read yet');
});

test('the status names each operator map and its errors',()=>{
  const health=parseHealth({status:'ok',poll_seconds:300,providers:{
    fagne:{name:'Fagne',fetched_at:'2026-10-22T12:05:00+00:00',last_error:null},
    lyse:{name:'Lyse Elnett',fetched_at:null,last_error:'timeout',last_error_at:'2026-10-22T12:04:00+00:00'},
    junk:'nope',
  }});
  assert.deepEqual(health.providers.map(p=>[p.key,p.name,p.lastError]),[['fagne','Fagne',null],['lyse','Lyse Elnett','timeout']]);
  assert.throws(()=>parseHealth({status:'broken'}));
});

test('every outage has a pin, and places near one are found',()=>{
  const feed=parseOutages({evidence,skipped:{unknown_kind:2,no_location:0,shape_too_large:1},outages:[
    outage('area','current',{polygons:[[square(5,60),square(5.4,60.4,.2)],[square(7,62,.1)]]}),
    outage('reported','current',{polygons:[[square(5,60)]],point:[5.3,60.2]}),
    outage('line','planned',{lines:[[[6,61],[6.2,61],[6.4,61]]]}),
    outage('point','current',{point:[8,63],shape_dropped:true}),
  ]});
  // Only reasons with a count are kept.
  assert.deepEqual(feed.skipped,{unknown_kind:2,shape_too_large:1});
  const byId=(id:string)=>feed.outages.find(o=>o.id===id)!;
  // The operator's point when it is inside the area; a line's middle point.
  // The area's middle falls in its hole, so the pin moves to a point inside the area itself.
  const [lng,lat]=byId('area').anchor!;
  assert.deepEqual(outagesAt({lat,lng},[byId('area')]).map(o=>o.id),['area']);
  assert.deepEqual(byId('reported').anchor,[5.3,60.2]);
  assert.deepEqual(byId('line').anchor,[6.2,61]);
  assert.equal(byId('point').shapeDropped,true);
  assert.ok(outageAnchorAt(byId('point'),5));

  // About 550 m north of the area's top edge (lat 61): near it, not inside.
  const north={lat:61.005,lng:5.5};
  assert.deepEqual(outagesAt(north,feed.outages),[]);
  const near=outagesNear(north,feed.outages);
  assert.deepEqual(near.map(n=>n.outage.id),['area','reported']);
  assert.ok(near[0].km>0.5 && near[0].km<0.6,`${near[0].km}`);
  // Inside an area is not "near" it.
  assert.deepEqual(outagesNear({lat:60.2,lng:5.2},feed.outages).map(n=>n.outage.id),[]);
  // Near a line and a point, within 1 km but not 3 km away.
  assert.deepEqual(outagesNear({lat:61.005,lng:6.3},feed.outages).map(n=>n.outage.id),['line']);
  assert.deepEqual(outagesNear({lat:63,lng:8.01},feed.outages).map(n=>n.outage.id),['point']);
  assert.deepEqual(outagesNear({lat:63.03,lng:8},feed.outages),[]);
  assert.ok(Math.abs(distanceToOutage({lat:63,lng:8},byId('point')))<1e-9);
});

test('pins and bounds follow the drawn area, not a stray operator point',()=>{
  // The operator's point is 50 km away from its area: it moves neither the pin nor the bounds.
  const feed=parseOutages({evidence,outages:[outage('stray','current',{polygons:[[square(5,60,.01)]],point:[6,60.4]})]});
  const stray=feed.outages[0];
  const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-9,`${a} ≉ ${b}`);
  close(stray.anchor![0],5.005);close(stray.anchor![1],60.005);
  close(stray.bounds!.maxLat,60.01);close(stray.bounds!.maxLng,5.01);close(stray.bounds!.minLat,60);close(stray.bounds!.minLng,5);
  // Nor does it make a place beside it count as near the outage.
  assert.deepEqual(outagesNear({lat:60.4,lng:6},feed.outages),[]);

  // A U-shaped area, open at the top: its box's middle is in the gap, outside the area.
  const u:[number,number][]=[[0,0],[3,0],[3,3],[2,3],[2,1],[1,1],[1,3],[0,3],[0,0]];
  const [x,y]=interiorPoint([u]);
  assert.deepEqual(outagesAt({lat:y,lng:x},parseOutages({evidence,outages:[outage('u','current',{polygons:[[u]]})]}).outages).map(o=>o.id),['u']);
});
