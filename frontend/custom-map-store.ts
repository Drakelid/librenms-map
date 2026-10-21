import type { CustomDocument, CustomMapSnapshot, CustomMapSummary, Device, LivePort } from './types';

export class CustomMapError extends Error { constructor(message:string,public status=0){super(message);} }

export interface CustomMapStore {
  list():Promise<CustomMapSummary[]>;
  load(id:string):Promise<CustomMapSnapshot>;
  create(name:string,shared:boolean,document:CustomDocument):Promise<CustomMapSnapshot>;
  update(map:CustomMapSummary,name:string,shared:boolean,document:CustomDocument):Promise<CustomMapSnapshot>;
  remove(map:CustomMapSummary):Promise<void>;
  devices():Promise<Device[]>;
  ports(deviceId:string):Promise<LivePort[]>;
}

const object=(value:unknown):value is Record<string,unknown> => !!value && typeof value==='object' && !Array.isArray(value);

export function httpCustomMapStore(mapsEndpoint:string,devicesEndpoint:string,csrf:string):CustomMapStore {
  const maps=new URL(mapsEndpoint,location.href), devices=new URL(devicesEndpoint,location.href);
  if(maps.origin!==location.origin || devices.origin!==location.origin) throw new Error('Custom maps must use the same origin.');
  const under=(base:URL,...parts:string[])=>new URL(`${base.href.replace(/\/$/,'')}/${parts.map(encodeURIComponent).join('/')}`);
  async function request(method:string,url:URL,body?:unknown):Promise<unknown> {
    const headers:Record<string,string>={Accept:'application/json','X-CSRF-TOKEN':csrf};
    if(body!==undefined) headers['Content-Type']='application/json';
    const response=await fetch(url,{method,credentials:'same-origin',headers,body:body===undefined ? undefined : JSON.stringify(body),signal:AbortSignal.timeout(20000)});
    if(!response.ok) throw new CustomMapError(await failureMessage(response),response.status);
    return response.status===204 ? undefined : response.json();
  }
  const snapshot=(value:unknown):CustomMapSnapshot => {
    if(!object(value) || !object(value.map) || !object(value.live) || typeof value.map.id!=='string') throw new CustomMapError('Unexpected custom map response.');
    return value as unknown as CustomMapSnapshot;
  };
  const field=<T>(value:unknown,name:string):T[] => {
    if(!object(value) || !Array.isArray(value[name])) throw new CustomMapError('Unexpected custom map response.');
    return value[name] as T[];
  };
  return {
    list:async()=>field<CustomMapSummary>(await request('GET',maps),'maps'),
    load:async id=>snapshot(await request('GET',under(maps,id))),
    create:async(name,shared,document)=>snapshot(await request('POST',maps,{name,shared,document})),
    update:async(map,name,shared,document)=>snapshot(await request('PUT',under(maps,map.id),{name,shared,document,revision:map.revision})),
    // The revision travels in the query string: some proxies drop DELETE bodies.
    remove:async map=>{const url=under(maps,map.id);url.searchParams.set('revision',String(map.revision));await request('DELETE',url);},
    devices:async()=>field<Device>(await request('GET',devices),'devices'),
    ports:async deviceId=>field<LivePort>(await request('GET',under(devices,deviceId,'ports')),'ports'),
  };
}

async function failureMessage(response:Response):Promise<string> {
  // A 422 carries the server's reason, such as the map limit or an unavailable device.
  if(response.status===422) {
    const body:unknown=await response.json().catch(()=>undefined);
    const text=object(body) && typeof body.message==='string' ? body.message.trim() : '';
    if(text && text.length<=300) return text;
  }
  const messages:Record<number,string>={
    401:'Your session has expired. Sign in and reload.',
    403:'You no longer have access to custom maps.',
    404:'This map is no longer available. It may have been deleted or unshared.',
    409:'This map changed in another session. Reload it before saving again.',
    419:'Your session has expired. Reload the page before saving.',
    422:'The map could not be saved. Check its name, devices and size.',
    429:'Too many requests. Wait a moment and try again.',
    503:'Custom maps are unavailable. The plugin database migration may be pending.',
  };
  return messages[response.status] ?? `Custom map request failed (HTTP ${response.status}).`;
}
