import type { Core, EdgeSingular } from 'cytoscape';

const GRAPH_WIDTH=300, GRAPH_HEIGHT=150, HOVER_DELAY=180;

export function mountLinkPreview(root:HTMLElement,cy:Core,refreshKey:()=>number|undefined):{hide:()=>void} {
  const wrap=root.querySelector<HTMLElement>('.lm-canvas-wrap')!;
  const canvas=root.querySelector<HTMLElement>('.lm-canvas')!;
  const preview=document.createElement('div');
  preview.className='lm-link-preview';preview.hidden=true;preview.setAttribute('role','tooltip');
  wrap.append(preview);
  let hovered='',timer:ReturnType<typeof setTimeout>|undefined;

  const hide=()=>{
    hovered='';clearTimeout(timer);preview.hidden=true;preview.replaceChildren();
  };
  const graphUrl=(portId:string):string|undefined=>{
    if(!/^[1-9][0-9]*$/.test(portId))return undefined;
    const home=new URL(root.dataset.homeUrl || '/',location.href);
    if(home.origin!==location.origin)return undefined;
    home.pathname=`${home.pathname.replace(/\/+$/,'')}/graph`.replace(/\/{2,}/g,'/');
    home.search='';home.hash='';
    const params={type:'port_bits',id:portId,from:'-1d',legend:'no',width:String(GRAPH_WIDTH),height:String(GRAPH_HEIGHT),refreshnum:String(refreshKey() ?? 0)};
    for(const [key,value] of Object.entries(params))home.searchParams.set(key,value);
    return home.href;
  };
  const place=(position:{x:number;y:number})=>{
    const desired={x:canvas.offsetLeft+position.x+14,y:canvas.offsetTop+position.y+14};
    const maxLeft=Math.max(8,wrap.clientWidth-preview.offsetWidth-8);
    const maxTop=Math.max(8,wrap.clientHeight-preview.offsetHeight-8);
    preview.style.left=`${Math.max(8,Math.min(desired.x,maxLeft))}px`;
    preview.style.top=`${Math.max(8,Math.min(desired.y,maxTop))}px`;
  };
  const show=(edge:EdgeSingular,position:{x:number;y:number})=>{
    const endpoints=[
      {hostname:String(edge.source().data('name') ?? ''),port:String(edge.data('sourcePort') ?? ''),portId:String(edge.data('sourcePortId') ?? '')},
      {hostname:String(edge.target().data('name') ?? ''),port:String(edge.data('targetPort') ?? ''),portId:String(edge.data('targetPortId') ?? '')},
    ];
    const title=document.createElement('div');title.className='lm-link-preview-title';title.textContent='Interface traffic · last 24 hours';
    const graphs=document.createElement('div');graphs.className='lm-link-preview-graphs';
    for(const endpoint of endpoints){
      const figure=document.createElement('figure');
      const caption=document.createElement('figcaption');
      const hostname=document.createElement('strong');hostname.textContent=endpoint.hostname;
      const port=document.createElement('span');port.textContent=endpoint.port;
      caption.append(hostname,port);figure.append(caption);
      const src=graphUrl(endpoint.portId);
      if(src){
        const image=document.createElement('img');image.src=src;image.width=GRAPH_WIDTH;image.height=GRAPH_HEIGHT;image.alt=`Traffic graph for ${endpoint.hostname} ${endpoint.port}`;image.decoding='async';
        figure.append(image);
      } else {
        const unavailable=document.createElement('div');unavailable.className='lm-link-preview-unavailable';unavailable.textContent='Traffic graph unavailable';figure.append(unavailable);
      }
      graphs.append(figure);
    }
    preview.replaceChildren(title,graphs);preview.hidden=false;place(position);
  };

  cy.on('mouseover','edge',event=>{
    clearTimeout(timer);hovered=event.target.id();
    const edge=event.target as EdgeSingular;
    const position=event.renderedPosition ?? edge.renderedMidpoint();
    timer=setTimeout(()=>{if(hovered===edge.id() && edge.visible())show(edge,position);},HOVER_DELAY);
  });
  cy.on('mouseout','edge',event=>{if(hovered===event.target.id())hide();});
  cy.on('pan zoom',hide);
  canvas.addEventListener('mouseleave',hide);
  return {hide};
}
