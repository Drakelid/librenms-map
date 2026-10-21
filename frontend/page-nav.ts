export type Page='topology'|'world'|'custom';

const PAGES:[Page,string,'topologyUrl'|'worldUrl'|'customUrl'][]=[
  ['topology','Topology map','topologyUrl'],
  ['world','World map','worldUrl'],
  ['custom','Custom maps','customUrl'],
];

/**
 * Links between the plugin's pages, from the URLs the host page supplies. The
 * current page is marked, not linked. Nothing renders without other pages,
 * as in the standalone demo.
 */
export function mountPageNav(nav:HTMLElement, root:HTMLElement, current:Page):void {
  const items=PAGES.filter(([page,,key])=>page===current || root.dataset[key]);
  nav.replaceChildren();
  nav.hidden=items.length<2;
  if(nav.hidden) return;
  for(const [page,label,key] of items) {
    if(page===current) {
      const here=document.createElement('span');here.textContent=label;here.setAttribute('aria-current','page');
      nav.append(here);
      continue;
    }
    const url=new URL(root.dataset[key]!,location.href);
    if(url.origin!==location.origin) continue;
    const link=document.createElement('a');link.href=url.href;link.textContent=label;
    nav.append(link);
  }
}
