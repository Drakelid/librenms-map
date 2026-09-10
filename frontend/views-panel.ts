import type { SavedView, ViewState } from './types';
import { ViewError, type ViewStore } from './view-store';
import { textLength, VIEW_NAME_MAX } from './view-limits';

export function mountViews(panel:HTMLElement,options:{store?:ViewStore;demo:boolean;capture:()=>ViewState;restore:(state:ViewState)=>void}) {
  panel.innerHTML=`<label class="lm-select">Saved view <select aria-label="Saved view"><option value="">Current workspace</option></select></label><button data-view-action="save" disabled>Save view</button><button data-view-action="delete" disabled>Delete view</button><button data-view-action="reload">Reload views</button><span class="lm-view-status" aria-live="polite"></span><dialog class="lm-view-dialog" aria-labelledby="lm-view-title"><form><h2 id="lm-view-title">Save current view</h2><p>Remember filters, positions, pins and zoom.</p><label>View name<input name="name" aria-label="View name" required autocomplete="off"></label><div class="lm-dialog-actions"><button type="button" data-view-action="cancel">Cancel</button><button type="submit" value="new">Save as new</button><button type="submit" value="update">Save changes</button></div></form></dialog><dialog class="lm-delete-dialog" aria-labelledby="lm-delete-title"><h2 id="lm-delete-title">Delete saved view?</h2><p></p><div class="lm-dialog-actions"><button data-view-action="cancel-delete">Cancel</button><button data-view-action="confirm-delete">Delete saved view</button></div></dialog>`;
  const select=panel.querySelector<HTMLSelectElement>('select')!;
  const status=panel.querySelector<HTMLElement>('.lm-view-status')!;
  const dialog=panel.querySelector<HTMLDialogElement>('.lm-view-dialog')!;
  const deletion=panel.querySelector<HTMLDialogElement>('.lm-delete-dialog')!;
  const name=panel.querySelector<HTMLInputElement>('input')!;
  let views:SavedView[]=[]; let active:SavedView|undefined; let busy=false; let available=false; let layoutPending=false; let epoch=0;
  function message(text:string,error=false){status.textContent=text;status.classList.toggle('lm-view-error',error);}
  function controls(){
    panel.querySelectorAll<HTMLButtonElement>('button').forEach(b=>{b.disabled=busy;});
    panel.querySelector<HTMLButtonElement>('[data-view-action="save"]')!.disabled=busy || layoutPending || !available || !options.store;
    panel.querySelector<HTMLButtonElement>('[data-view-action="delete"]')!.disabled=busy || !available || !active;
    panel.querySelector<HTMLButtonElement>('[data-view-action="reload"]')!.disabled=busy || !options.store;
    panel.querySelectorAll<HTMLButtonElement>('.lm-view-dialog button[type="submit"]').forEach(b=>{b.disabled=busy || layoutPending;});
    select.disabled=busy || layoutPending || !available;
  }
  function render(){select.replaceChildren(new Option('Current workspace',''),...views.map(v=>new Option(v.name,v.id)));select.value=active?.id ?? '';controls();}
  function failure(error:unknown){
    if(error instanceof ViewError && [401,403,404,419].includes(error.status)){views=[];active=undefined;render();}
    message(error instanceof Error ? error.message : 'Saved views are unavailable.',true);
  }
  async function reload(){
    if(!options.store || busy)return;
    busy=true;controls();const requestEpoch=epoch;
    try{const result=await options.store.list();if(requestEpoch!==epoch)return;views=result;active=views.find(v=>v.id===active?.id);if(active)options.restore(active.state);render();message(options.demo?'Demo views · this browser only':'Private views · saved to LibreNMS');}
    catch(error){if(requestEpoch===epoch)failure(error);}
    finally{busy=false;controls();}
  }
  select.onchange=()=>{active=views.find(v=>v.id===select.value);if(active){options.restore(active.state);message(`Loaded “${active.name}”.`);}controls();};
  panel.addEventListener('click',event=>{
    const action=(event.target as HTMLElement).closest<HTMLElement>('[data-view-action]')?.dataset.viewAction;
    if(action==='reload')void reload();
    if(action==='save'){
      name.value=active?.name ?? '';
      name.setCustomValidity('');
      panel.querySelector<HTMLButtonElement>('[value="update"]')!.hidden=!active;
      dialog.showModal();name.focus();
    }
    if(action==='cancel')dialog.close();
    if(action==='delete' && active){deletion.querySelector('p')!.textContent=`“${active.name}” will be removed. The current map will stay open.`;deletion.showModal();}
    if(action==='cancel-delete')deletion.close();
    if(action==='confirm-delete')void remove();
  });
  dialog.querySelector('form')!.onsubmit=async event=>{
    event.preventDefault();if(!options.store || busy || layoutPending || !available)return;
    const trimmed=name.value.trim();if(!trimmed || textLength(trimmed)>VIEW_NAME_MAX){name.setCustomValidity(!trimmed?'Enter a view name.':`Use at most ${VIEW_NAME_MAX} characters.`);name.reportValidity();return;}name.setCustomValidity('');
    const existing=(event.submitter as HTMLButtonElement)?.value==='update'?active:undefined;
    busy=true;controls();const requestEpoch=epoch;
    try{const view=await options.store.save(trimmed,options.capture(),existing);if(requestEpoch!==epoch)return;active=view;views=[...views.filter(v=>v.id!==view.id),view];render();dialog.close();message(`Saved “${view.name}”.`);}
    catch(error){if(requestEpoch===epoch){dialog.close();failure(error);}}
    finally{busy=false;controls();}
  };
  // HTML maxlength counts UTF-16 units, unlike Laravel's character limit.
  name.oninput=()=>name.setCustomValidity(textLength(name.value.trim())>VIEW_NAME_MAX?`Use at most ${VIEW_NAME_MAX} characters.`:'');
  async function remove(){
    if(!options.store || !active || busy)return;
    busy=true;controls();const requestEpoch=epoch;const removing=active;
    try{await options.store.remove(removing);if(requestEpoch!==epoch)return;views=views.filter(v=>v.id!==removing.id);active=undefined;render();deletion.close();message('Saved view deleted.');}
    catch(error){if(requestEpoch===epoch){deletion.close();failure(error);}}
    finally{busy=false;controls();}
  }
  if(!options.store)message('Saved views are unavailable on this page.');
  controls();
  return {
    setLayoutPending(value:boolean){layoutPending=value;controls();},
    setAvailable(value:boolean){available=value;if(!value){epoch++;views=[];active=undefined;dialog.close();deletion.close();render();message('Load the topology to use saved views.');}controls();},
    reload,
  };
}
