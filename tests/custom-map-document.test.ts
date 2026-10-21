import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDevice, addShape, clampSize, connect, CUSTOM_LIMITS, emptyDocument, normalizeDocument, removeElement, SHAPE_MAX, SHAPE_MIN } from '../frontend/custom-map-document';

test('saved documents are treated as untrusted input',()=>{
  const doc=normalizeDocument({
    devices:[
      {key:'d-a',deviceId:'1',x:0,y:0},
      {key:'d-a',deviceId:'2',x:0,y:0}, // Duplicate key.
      {key:'d-b',deviceId:'1',x:5,y:5}, // Device already placed.
      {key:'d-c',deviceId:'0',x:5,y:5}, // Not a device ID.
      {key:'d-d',deviceId:'3',x:Infinity,y:0},
      {key:'D-e',deviceId:'4',x:0,y:0}, // Not a key.
      {key:'d-f',deviceId:'5',x:250,y:0},
    ],
    shapes:[{key:'s-a',kind:'box',x:0,y:0,width:400,height:200,text:'x'.repeat(500)},{key:'s-b',kind:'circle',x:0,y:0,width:40,height:40,text:''},{key:'s-c',kind:'text',x:0,y:0,width:SHAPE_MAX+1,height:40,text:''}],
    links:[
      {key:'l-a',source:'d-a',target:'d-f',label:'Fibre',portId:'17'},
      {key:'l-b',source:'d-a',target:'d-a',label:'',portId:null},
      {key:'l-c',source:'d-a',target:'d-missing',label:'',portId:null},
      {key:'l-d',source:'d-a',target:'d-f',label:'',portId:'abc'},
    ],
    zoom:100,pan:{x:NaN,y:0},
  });
  assert.deepEqual(doc.devices.map(d=>d.key),['d-a','d-f']);
  assert.deepEqual(doc.shapes.map(s=>s.key),['s-a']);
  assert.equal([...doc.shapes[0].text].length,CUSTOM_LIMITS.text);
  assert.deepEqual(doc.links.map(l=>[l.key,l.portId]),[['l-a','17'],['l-d',null]]);
  assert.equal(doc.zoom,2.5);
  assert.deepEqual(doc.pan,{x:0,y:0});
  assert.deepEqual(normalizeDocument('nope'),emptyDocument());
});

test('editing places each device once and lines only between devices',()=>{
  const doc=emptyDocument();
  const a=addDevice(doc,'1',{x:0,y:0}), b=addDevice(doc,'2',{x:300,y:0});
  assert.ok(typeof a!=='string' && typeof b!=='string');
  assert.equal(typeof addDevice(doc,'1',{x:0,y:0}),'string');
  assert.equal(typeof addDevice(doc,'',{x:0,y:0}),'string');
  const area=addShape(doc,'box',{x:0,y:0});
  assert.ok(typeof area!=='string');
  assert.equal(typeof connect(doc,a.key,a.key),'string');
  assert.equal(typeof connect(doc,a.key,area.key),'string'); // Areas are not endpoints.
  const line=connect(doc,a.key,b.key);
  assert.ok(typeof line!=='string' && line.portId===null);
  // Keys are unique and survive a round trip through normalization.
  assert.deepEqual(normalizeDocument(JSON.parse(JSON.stringify(doc))),doc);
  // Removing a device removes the lines that end on it.
  assert.ok(removeElement(doc,b.key));
  assert.deepEqual(doc.links,[]);
  assert.equal(removeElement(doc,'d-missing'),false);
});

test('shape sizes are clamped to the server bounds',()=>{
  assert.equal(clampSize(1),SHAPE_MIN);
  assert.equal(clampSize(1e9),SHAPE_MAX);
  assert.equal(clampSize(Number.NaN),SHAPE_MIN);
  assert.equal(clampSize(240.4),240);
});
