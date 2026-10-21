import type { StylesheetStyle } from 'cytoscape';
import { PARALLEL_CONNECTION_GAP } from './topology';

export function rate(value:number|null) {
  if(value===null||!Number.isFinite(value)) return 'N/A';
  return value>=1e9 ? `${(value/1e9).toFixed(2)} Gbps` : value>=1e6 ? `${(value/1e6).toFixed(1)} Mbps` : `${Math.round(value/1e3)} Kbps`;
}

export const statusColor=(status:string)=>status==='down' ? '#e05b65' : status==='up' ? '#36b89a' : '#8a96a9';

const palette=(root:HTMLElement)=>{
  const css=getComputedStyle(root);
  const color=(name:string,fallback:string)=>css.getPropertyValue(name).trim() || fallback;
  return {color,panel:color('--panel','#ffffff'),ink:color('--ink','#20324b'),line:color('--line','#e4eaf2'),muted:color('--muted','#7a889c'),accent:color('--accent','#246b89')};
};

/** Canvas colors come from the same CSS variables as the rest of the map. */
export function topologyStyles(root:HTMLElement):StylesheetStyle[] {
  const {color,panel,ink,line}=palette(root);
  return [
    {selector:'node',style:{shape:'round-rectangle',width:'data(width)',height:72,'background-color':panel,'border-width':1.5,'border-color':'data(color)',label:'data(label)',color:ink,'font-family':'Inter, Segoe UI, sans-serif','font-size':18,'font-weight':500,'text-wrap':'wrap','text-valign':'center','text-halign':'center','line-height':1.6}},
    {selector:'node[role = "AGG"]',style:{height:82,'border-width':2.5,'background-color':color('--node-agg','#eef5ff'),'font-weight':700}},
    {selector:'edge',style:{width:2.4,'curve-style':'bezier','control-point-step-size':PARALLEL_CONNECTION_GAP,'line-color':'data(color)',label:'data(label)','font-size':15,'font-weight':600,color:color('--edge-ink','#4d6077'),'text-background-color':panel,'text-background-opacity':1,'text-background-padding':'4px','text-background-shape':'roundrectangle','text-border-width':1,'text-border-opacity':1,'text-border-color':line,'text-rotation':'none','text-events':'yes'}},
    {selector:'edge[lateral = 1]',style:{'curve-style':'unbundled-bezier','control-point-distances':'data(curveDistance)','control-point-weights':[0.5]}},
    // Dashed links carry no current load: down, stale or unknown. Down also sets a solid red >70% link apart.
    {selector:'edge[state = "down"], edge[state = "stale"], edge[state = "unknown"]',style:{'line-style':'dashed'}},
    {selector:':selected',style:{'overlay-color':'#55a7ce','overlay-opacity':0.12,'overlay-padding':7}},
    {selector:'.lm-dim',style:{opacity:0.18}},
    {selector:'.lm-no-label',style:{label:''}},
  ];
}

/** Topology cards and links, plus the custom map's own areas, text and drawn lines. */
export function customStyles(root:HTMLElement):StylesheetStyle[] {
  const {ink,muted,accent}=palette(root);
  return [
    ...topologyStyles(root),
    {selector:'node[kind = "device"]',style:{'z-index':10}},
    {selector:'node[kind = "box"]',style:{height:'data(height)','background-color':accent,'background-opacity':0.05,'border-width':1.5,'border-style':'dashed','border-color':muted,color:muted,'font-size':16,'font-weight':600,'text-valign':'top','text-halign':'center','text-margin-y':30,'text-max-width':'data(width)','z-index':0}},
    {selector:'node[kind = "text"]',style:{shape:'rectangle',height:'data(height)','background-opacity':0,'border-width':0,color:ink,'font-size':18,'font-weight':600,'text-max-width':'data(width)','z-index':5}},
    // Drawn without an interface: the owner's annotation, never a measured connection.
    {selector:'edge[state = "drawn"]',style:{'line-style':'dotted','line-color':muted,width:2.4}},
    {selector:'.lm-connect-source',style:{'border-width':3.5,'border-color':'#299e9b'}},
  ];
}

/**
 * LibreNMS toggles `dark` on <html> (live, in its "device" mode) and paints its
 * page background on <body>; the map adopts both. Elsewhere, such as the demo,
 * follow the OS preference unless toggled.
 */
export function themeController(root:HTMLElement,onChange:()=>void):{toggle():void} {
  const hostTheme=root.dataset.hostTheme==='true';
  const systemDark=window.matchMedia('(prefers-color-scheme: dark)');
  let manualDark:boolean|undefined;
  let applied='';
  function apply(){
    const dark=hostTheme ? document.documentElement.classList.contains('dark') : manualDark ?? systemDark.matches;
    const background=hostTheme ? getComputedStyle(document.body).backgroundColor : '';
    const theme=`${dark}|${background}`;
    if(theme===applied)return;
    applied=theme;
    root.classList.toggle('lm-dark',dark);
    // Only an opaque host color replaces the map's own background.
    if(/^rgb\(/.test(background))root.style.setProperty('--bg',background);else root.style.removeProperty('--bg');
    onChange();
  }
  apply();
  if(hostTheme)new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  else systemDark.addEventListener('change',apply);
  return {toggle(){manualDark=!root.classList.contains('lm-dark');apply();}};
}
