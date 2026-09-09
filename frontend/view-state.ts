import type { Position, Topology, ViewState } from './types';

export const emptyView = (): ViewState => ({ rootId:null, site:'', search:'', backbone:false, positions:{}, pinned:[], zoom:1, pan:{x:0,y:0} });
const object = (value:unknown): value is Record<string, unknown> => !!value && typeof value==='object' && !Array.isArray(value);
const coordinate = (n:unknown): n is number => typeof n==='number' && Number.isFinite(n) && Math.abs(n)<=1_000_000;
const point = (p:unknown): p is Position => object(p) && coordinate(p.x) && coordinate(p.y);

// Treat browser storage and saved HTTP responses as untrusted input.
export function normalizeView(value:unknown, graph?:Topology):ViewState {
  const state=emptyView();
  if(!object(value)) return state;
  const allowed=graph ? new Set(graph.nodes.map(n=>n.id)) : undefined;
  const validId=(id:string) => /^\d+$/.test(id) && (!allowed || allowed.has(id));
  if(typeof value.rootId==='string' && validId(value.rootId) && (!graph || graph.nodes.some(n=>n.id===value.rootId && n.role==='AGG'))) state.rootId=value.rootId;
  if(typeof value.site==='string' && value.site.length<=128 && (!graph || graph.nodes.some(n=>n.site===value.site))) state.site=value.site;
  if(typeof value.search==='string') state.search=value.search.slice(0,128);
  state.backbone=value.backbone===true;
  if(object(value.positions)) for(const [id,p] of Object.entries(value.positions).slice(0,2000)) if(validId(id) && point(p)) state.positions[id]={x:p.x,y:p.y};
  if(Array.isArray(value.pinned)) state.pinned=[...new Set(value.pinned.filter((id):id is string=>typeof id==='string' && validId(id) && Object.hasOwn(state.positions,id)))].slice(0,2000);
  if(typeof value.zoom==='number' && Number.isFinite(value.zoom)) state.zoom=Math.min(2.5,Math.max(0.15,value.zoom));
  if(point(value.pan)) state.pan={x:value.pan.x,y:value.pan.y};
  return state;
}

/** Discover a root group's branch without walking through a neighboring AGG site. */
export function branchNodes(graph:Topology, rootId:string|null):Set<string> {
  const root=graph.nodes.find(n=>n.id===rootId && n.role==='AGG');
  if(!root) return new Set(graph.nodes.map(n=>n.id));
  const nodes=new Map(graph.nodes.map(n=>[n.id,n]));
  const adjacency=new Map(graph.nodes.map(n=>[n.id,[] as string[]]));
  for(const link of graph.links){adjacency.get(link.source)?.push(link.target);adjacency.get(link.target)?.push(link.source);}
  const queue=graph.nodes.filter(n=>n.role==='AGG' && n.site===root.site).map(n=>n.id);
  const visited=new Set(queue);
  for(let i=0;i<queue.length;i++) for(const id of adjacency.get(queue[i]) ?? []) {
    if(visited.has(id)) continue;
    visited.add(id);
    const neighbor=nodes.get(id)!;
    if(neighbor.role!=='AGG' || neighbor.site===root.site) queue.push(id);
  }
  return visited;
}

export function visibleNodes(graph:Topology, state:Pick<ViewState,'rootId'|'site'|'search'|'backbone'>):Set<string> {
  const branch=branchNodes(graph,state.rootId);
  const scope=new Set(graph.nodes.filter(n=>branch.has(n.id) && (!state.site || n.site===state.site) && (!state.backbone || n.role==='AGG')).map(n=>n.id));
  const matching=new Set(graph.nodes.filter(n=>scope.has(n.id) && n.hostname.toLowerCase().includes(state.search.toLowerCase())).map(n=>n.id));
  const visible=new Set(matching);
  if(state.search) for(const l of graph.links){
    if(matching.has(l.source) && scope.has(l.target)) visible.add(l.target);
    if(matching.has(l.target) && scope.has(l.source)) visible.add(l.source);
  }
  return visible;
}

/** Keep pins fixed and move automatic nodes clear of them, including new devices. */
const CARD_W=246, CARD_H=105;
export function arrangePositions(graph:Topology, automatic:Record<string,Position>, restore:Record<string,Position>, pins:Set<string>):Record<string,Position> {
  const result:Record<string,Position>={};
  // Bucket reserved coordinates by card-sized cell. Two points can only overlap
  // when their cells are adjacent, so each test stays local instead of scanning
  // every placed node, which kept re-layout quadratic at the device cap.
  const grid=new Map<string,Position[]>();
  const key=(x:number,y:number)=>`${x}:${y}`;
  const reserve=(p:Position)=>{
    const k=key(Math.floor(p.x/CARD_W),Math.floor(p.y/CARD_H));
    const bucket=grid.get(k);
    if(bucket) bucket.push(p); else grid.set(k,[p]);
  };
  const overlap=(candidate:Position)=>{
    const cx=Math.floor(candidate.x/CARD_W), cy=Math.floor(candidate.y/CARD_H);
    for(let i=-1;i<=1;i++) for(let j=-1;j<=1;j++)
      for(const q of grid.get(key(cx+i,cy+j)) ?? [])
        if(Math.abs(q.x-candidate.x)<CARD_W && Math.abs(q.y-candidate.y)<CARD_H) return true;
    return false;
  };
  for(const n of graph.nodes) if(point(restore[n.id])) {result[n.id]={...restore[n.id]};reserve(result[n.id]);}
  // Restored coordinates belong to the operator; never move them to resolve overlap.
  for(const n of graph.nodes) if(!result[n.id]) {
    const p={...(automatic[n.id] ?? {x:0,y:n.tier*210})};
    const origin=p.x;
    for(let step=1;overlap(p) && step<=graph.nodes.length*2+1;step++) p.x=origin+Math.ceil(step/2)*260*(step%2 ? 1 : -1);
    result[n.id]=p;reserve(p);
  }
  // Pins without valid stored coordinates are ignored by normalizeView.
  for(const id of pins) if(result[id] && point(restore[id])) result[id]={...restore[id]};
  return result;
}
