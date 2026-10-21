import type { Core } from 'cytoscape';

// Keep exports printable and within browser canvas limits at the device cap.
const EXPORT_SCALE=2, EXPORT_MAX=8000;

/** Download the visible elements of the whole map, not only the viewport, as a PNG. */
export async function exportPng(cy:Core,root:HTMLElement,name:string):Promise<void> {
  if(!cy.elements(':visible').length) throw new Error('There is nothing on the map to export.');
  const background=getComputedStyle(root).getPropertyValue('--bg').trim() || '#ffffff';
  const blob=await cy.png({output:'blob-promise',full:true,scale:EXPORT_SCALE,maxWidth:EXPORT_MAX,maxHeight:EXPORT_MAX,bg:background});
  const url=URL.createObjectURL(blob);
  try {
    const link=document.createElement('a');
    link.href=url;link.download=`${fileName(name)}-${new Date().toISOString().slice(0,10)}.png`;
    document.body.append(link);link.click();link.remove();
  } finally { setTimeout(()=>URL.revokeObjectURL(url),1000); }
}

/** A portable file name: letters, digits and single dashes only. */
export function fileName(name:string):string {
  return name.normalize('NFKD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60) || 'libremap';
}

/** Single-key shortcuts must not fire while typing, in a dialog, or with a modifier held. */
export function shortcutAllowed(event:KeyboardEvent,root:HTMLElement):boolean {
  const target=event.target as HTMLElement|null;
  if(event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented) return false;
  if(target && (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable)) return false;
  return !root.querySelector('dialog[open]');
}

/** Zoom by a step around the canvas centre. */
export function zoomBy(cy:Core,factor:number):void {
  cy.zoom({level:cy.zoom()*factor,renderedPosition:{x:cy.width()/2,y:cy.height()/2}});
}

/**
 * Draw the background dot grid in model space so it pans and zooms with the
 * map. The step grows in multiples of five so dots never crowd together.
 */
export function syncGrid(cy:Core,wrap:HTMLElement,canvas:HTMLElement,grid:number):void {
  const zoom=cy.zoom(), pan=cy.pan();
  let step=grid;
  while(step*zoom<10) step*=5;
  const size=step*zoom;
  wrap.style.backgroundSize=`${size}px ${size}px`;
  // Each dot sits at its tile's centre: shift by half a tile to put dots on grid points.
  wrap.style.backgroundPosition=`${canvas.offsetLeft+pan.x-size/2}px ${canvas.offsetTop+pan.y-size/2}px`;
}
