import type { CustomDevice, CustomDocument, CustomLink, CustomShape, Position } from './types';

// Match src/CustomMaps/MapDocument.php. Text limits count Unicode code points, as Laravel does.
export const CUSTOM_LIMITS = { devices:500, links:2000, shapes:200, text:200, label:100 } as const;
export const SHAPE_MIN=20, SHAPE_MAX=5000;
export const SHAPE_DEFAULTS = { text:{width:220,height:48}, box:{width:520,height:320} } as const;
const KEY=/^[a-z]-[a-z0-9]{1,32}$/, ID=/^[1-9]\d{0,9}$/;
const object=(value:unknown):value is Record<string,unknown> => !!value && typeof value==='object' && !Array.isArray(value);
const coordinate=(n:unknown):n is number => typeof n==='number' && Number.isFinite(n) && Math.abs(n)<=1_000_000;
const size=(n:unknown):n is number => typeof n==='number' && Number.isFinite(n) && n>=SHAPE_MIN && n<=SHAPE_MAX;
export const clip=(value:unknown,max:number):string => typeof value==='string' ? Array.from(value).slice(0,max).join('') : '';

export const emptyDocument=():CustomDocument=>({devices:[],shapes:[],links:[],zoom:1,pan:{x:0,y:0}});

/** Treat a saved document as untrusted: drop malformed elements instead of rendering them. */
export function normalizeDocument(value:unknown):CustomDocument {
  const doc=emptyDocument();
  if(!object(value)) return doc;
  const keys=new Set<string>(), deviceIds=new Set<string>();
  const fresh=(key:unknown):key is string => typeof key==='string' && KEY.test(key) && !keys.has(key);
  if(Array.isArray(value.devices)) for(const d of value.devices) {
    if(doc.devices.length>=CUSTOM_LIMITS.devices) break;
    if(object(d) && fresh(d.key) && typeof d.deviceId==='string' && ID.test(d.deviceId) && !deviceIds.has(d.deviceId) && coordinate(d.x) && coordinate(d.y)) {
      keys.add(d.key);deviceIds.add(d.deviceId);doc.devices.push({key:d.key,deviceId:d.deviceId,x:d.x,y:d.y});
    }
  }
  if(Array.isArray(value.shapes)) for(const s of value.shapes) {
    if(doc.shapes.length>=CUSTOM_LIMITS.shapes) break;
    if(object(s) && fresh(s.key) && (s.kind==='text' || s.kind==='box') && coordinate(s.x) && coordinate(s.y) && size(s.width) && size(s.height)) {
      keys.add(s.key);doc.shapes.push({key:s.key,kind:s.kind,x:s.x,y:s.y,width:s.width,height:s.height,text:clip(s.text,CUSTOM_LIMITS.text)});
    }
  }
  const devices=new Set(doc.devices.map(d=>d.key));
  if(Array.isArray(value.links)) for(const l of value.links) {
    if(doc.links.length>=CUSTOM_LIMITS.links) break;
    if(object(l) && fresh(l.key) && typeof l.source==='string' && typeof l.target==='string' && l.source!==l.target && devices.has(l.source) && devices.has(l.target)) {
      keys.add(l.key);
      doc.links.push({key:l.key,source:l.source,target:l.target,label:clip(l.label,CUSTOM_LIMITS.label),portId:typeof l.portId==='string' && ID.test(l.portId) ? l.portId : null});
    }
  }
  if(typeof value.zoom==='number' && Number.isFinite(value.zoom)) doc.zoom=Math.min(2.5,Math.max(0.15,value.zoom));
  if(object(value.pan) && coordinate(value.pan.x) && coordinate(value.pan.y)) doc.pan={x:value.pan.x,y:value.pan.y};
  return doc;
}

/** A random element key, unique within one document in practice. */
export function newKey(prefix:'d'|'s'|'l'):string {
  const bytes=crypto.getRandomValues(new Uint8Array(12));
  return `${prefix}-${[...bytes].map(b=>(b%36).toString(36)).join('')}`;
}

const at=(p:Position):Position=>({x:Math.max(-1_000_000,Math.min(1_000_000,p.x)),y:Math.max(-1_000_000,Math.min(1_000_000,p.y))});

/** Each operation edits the document in place and returns the new element, or the reason it was refused. */
export function addDevice(doc:CustomDocument, deviceId:string, position:Position):CustomDevice|string {
  if(!ID.test(deviceId)) return 'Choose a device from the list.';
  if(doc.devices.some(d=>d.deviceId===deviceId)) return 'That device is already on this map.';
  if(doc.devices.length>=CUSTOM_LIMITS.devices) return `A map can hold up to ${CUSTOM_LIMITS.devices} devices.`;
  const device={key:newKey('d'),deviceId,...at(position)};
  doc.devices.push(device);
  return device;
}

export function addShape(doc:CustomDocument, kind:'text'|'box', position:Position):CustomShape|string {
  if(doc.shapes.length>=CUSTOM_LIMITS.shapes) return `A map can hold up to ${CUSTOM_LIMITS.shapes} text labels and areas.`;
  const shape:CustomShape={key:newKey('s'),kind,...at(position),...SHAPE_DEFAULTS[kind],text:kind==='text' ? 'Label' : 'Area'};
  doc.shapes.push(shape);
  return shape;
}

export function connect(doc:CustomDocument, source:string, target:string):CustomLink|string {
  const keys=new Set(doc.devices.map(d=>d.key));
  if(source===target || !keys.has(source) || !keys.has(target)) return 'A line must join two different devices.';
  if(doc.links.length>=CUSTOM_LIMITS.links) return `A map can hold up to ${CUSTOM_LIMITS.links} lines.`;
  const link={key:newKey('l'),source,target,label:'',portId:null};
  doc.links.push(link);
  return link;
}

/** Remove any element; removing a device also removes the lines that end on it. */
export function removeElement(doc:CustomDocument, key:string):boolean {
  const before=doc.devices.length+doc.shapes.length+doc.links.length;
  doc.devices=doc.devices.filter(d=>d.key!==key);
  doc.shapes=doc.shapes.filter(s=>s.key!==key);
  doc.links=doc.links.filter(l=>l.key!==key && l.source!==key && l.target!==key);
  return doc.devices.length+doc.shapes.length+doc.links.length!==before;
}

export const clampSize=(n:number):number => Math.round(Math.min(SHAPE_MAX,Math.max(SHAPE_MIN,Number.isFinite(n) ? n : SHAPE_MIN)));
