import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mapsReadAt, outagePath, outagePeriod, outagesAt, outageShape, parseCheck, parseHealth, parseOutages, verdictText } from '../frontend/power';

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
  assert.match(outagePath(feed.outages[3],5),/^M[\d. ]+a7 7 /); // A circle at the point.
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
