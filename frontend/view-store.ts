import type { SavedView, ViewState } from './types';
import { normalizeView } from './view-state';

export interface ViewStore {
  list():Promise<SavedView[]>;
  save(name:string,state:ViewState,existing?:SavedView):Promise<SavedView>;
  remove(view:SavedView):Promise<void>;
}
export class ViewError extends Error { constructor(message:string,public status=0){super(message);} }

export function httpViewStore(endpoint:string,csrf:string):ViewStore {
  const base=new URL(endpoint,location.href);
  if(base.origin!==location.origin) throw new Error('Saved views must use the same origin.');
  async function request(method:string,id?:string,body?:unknown) {
    const response=await fetch(id ? `${base.href.replace(/\/$/,'')}/${encodeURIComponent(id)}` : base.href,{
      method,credentials:'same-origin',headers:{Accept:'application/json','Content-Type':'application/json','X-CSRF-TOKEN':csrf},
      body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000),
    });
    if(!response.ok) {
      const messages:Record<number,string>={401:'Your session has expired. Sign in and reload.',403:'You no longer have access to saved views.',404:'This view is no longer available. Reload views.',409:'This view changed in another tab. Reload views before saving again.',419:'Your session has expired. Reload the page before saving.',422:'The view could not be saved. Check its name, device access and size.',429:'Too many requests. Wait a moment before saving again.',503:'Saved views are unavailable. The plugin database migration may be pending.'};
      throw new ViewError(messages[response.status] ?? `Saved views request failed (HTTP ${response.status}).`,response.status);
    }
    return response.status===204 ? undefined : response.json();
  }
  return {
    list:async()=>{const result=await request('GET');if(!Array.isArray(result.views)) throw new Error('Unexpected saved views response.');return result.views;},
    save:async(name,state,existing)=>(await request(existing?'PUT':'POST',existing?.id,{name,state,...(existing?{revision:existing.revision}:{})})).view,
    remove:async(view)=>{await request('DELETE',view.id,{revision:view.revision});},
  };
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
      if(existing && (index<0 || views[index].revision!==existing.revision)) throw new ViewError('This view changed in another tab. Reload views before saving again.',409);
      if(!existing && views.length>=50) throw new ViewError('You can save up to 50 views. Delete a view before creating another.',422);
      const view:SavedView={id:existing?.id ?? crypto.randomUUID(),name,state:normalizeView(state),revision:(existing?.revision ?? 0)+1,updatedAt:new Date().toISOString()};
      if(index<0) views.push(view); else views[index]=view;
      write(views);return view;
    },
    remove:async(view)=>{const views=read();const current=views.find(v=>v.id===view.id);if(!current || current.revision!==view.revision)throw new ViewError('This view changed in another tab. Reload views before deleting it.',409);write(views.filter(v=>v.id!==view.id));},
  };
}
