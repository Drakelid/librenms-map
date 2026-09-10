import type { SavedView, ViewState } from './types';
import { normalizeView } from './view-state';

export interface ViewStore {
  list():Promise<SavedView[]>;
  save(name:string,state:ViewState,existing?:SavedView):Promise<SavedView>;
  remove(view:SavedView):Promise<void>;
}
export class ViewError extends Error { constructor(message:string,public status=0){super(message);} }

const conflicts:Record<string,string>={
  PUT:'This view changed in another tab. Reload views before saving again.',
  DELETE:'This view changed in another tab. Reload views before deleting it.',
};

export function httpViewStore(endpoint:string,csrf:string):ViewStore {
  const base=new URL(endpoint,location.href);
  if(base.origin!==location.origin) throw new Error('Saved views must use the same origin.');
  async function request(method:string,id?:string,body?:unknown,query:Record<string,string>={}) {
    const url=new URL(id ? `${base.href.replace(/\/$/,'')}/${encodeURIComponent(id)}` : base.href);
    for(const [key,value] of Object.entries(query)) url.searchParams.set(key,value);
    const headers:Record<string,string>={Accept:'application/json','X-CSRF-TOKEN':csrf};
    if(body!==undefined) headers['Content-Type']='application/json';
    const response=await fetch(url,{
      method,credentials:'same-origin',headers,
      body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000),
    });
    if(!response.ok) throw new ViewError(await failureMessage(response,method),response.status);
    return response.status===204 ? undefined : response.json();
  }
  return {
    list:async()=>{const result=await request('GET');if(!Array.isArray(result.views)) throw new Error('Unexpected saved views response.');return result.views;},
    save:async(name,state,existing)=>(await request(existing?'PUT':'POST',existing?.id,{name,state,...(existing?{revision:existing.revision}:{})})).view,
    // The revision travels in the query string: some proxies drop DELETE bodies.
    remove:async(view)=>{await request('DELETE',view.id,undefined,{revision:String(view.revision)});},
  };
}

async function failureMessage(response:Response,method:string):Promise<string> {
  // A 422 carries the server's reason, such as the 50-view limit; show it.
  if(response.status===422) {
    const body:unknown=await response.json().catch(()=>undefined);
    const text=body && typeof body==='object' && 'message' in body && typeof body.message==='string' ? body.message.trim() : '';
    if(text && text.length<=300) return text;
  }
  const messages:Record<number,string>={
    401:'Your session has expired. Sign in and reload.',
    403:'You no longer have access to saved views.',
    404:'This view is no longer available. Reload views.',
    409:conflicts[method] ?? conflicts.PUT,
    419:'Your session has expired. Reload the page before saving.',
    422:'The view could not be saved. Check its name, device access and size.',
    429:'Too many requests. Wait a moment before saving again.',
    503:'Saved views are unavailable. The plugin database migration may be pending.',
  };
  return messages[response.status] ?? `Saved views request failed (HTTP ${response.status}).`;
}

// crypto.randomUUID needs a secure context; the demo may be served over plain
// HTTP on a LAN address, where only getRandomValues is available.
function uuid():string {
  if(typeof crypto.randomUUID==='function') return crypto.randomUUID();
  const bytes=crypto.getRandomValues(new Uint8Array(16));
  bytes[6]=(bytes[6] & 0x0f) | 0x40; bytes[8]=(bytes[8] & 0x3f) | 0x80;
  const hex=[...bytes].map(b=>b.toString(16).padStart(2,'0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

/** Explicit demo-only persistence. Never used as a fallback for a live HTTP failure. */
export function demoViewStore(key:string):ViewStore {
  function read():SavedView[]{
    const value:unknown=JSON.parse(localStorage.getItem(key) ?? '[]');
    if(!Array.isArray(value)) return [];
    return value.filter(v=>v && typeof v.id==='string' && typeof v.name==='string' && Number.isInteger(v.revision)).slice(0,50).map(v=>({...v,state:normalizeView(v.state)}));
  }
  function write(views:SavedView[]){localStorage.setItem(key,JSON.stringify(views));}
  return {
    list:async()=>read(),
    save:async(name,state,existing)=>{
      const views=read();const index=views.findIndex(v=>v.id===existing?.id);
      if(existing && (index<0 || views[index].revision!==existing.revision)) throw new ViewError(conflicts.PUT,409);
      if(!existing && views.length>=50) throw new ViewError('You can save up to 50 views. Delete a view before creating another.',422);
      const view:SavedView={id:existing?.id ?? uuid(),name,state:normalizeView(state),revision:(existing?.revision ?? 0)+1,updatedAt:new Date().toISOString()};
      // Newest first, matching the server's listing order.
      write([view,...views.filter(v=>v.id!==view.id)]);return view;
    },
    remove:async(view)=>{const views=read();const current=views.find(v=>v.id===view.id);if(!current || current.revision!==view.revision)throw new ViewError(conflicts.DELETE,409);write(views.filter(v=>v.id!==view.id));},
  };
}
