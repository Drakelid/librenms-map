import type { Position, Topology } from './types';

const NORMAL_COLUMN_GAP = 238;
const NORMAL_ROW_GAP = 135;
const FOCUSED_COLUMN_GAP = 228;
const FOCUSED_ROW_GAP = 112;
const MIN_COLUMNS = 8;
const FOCUSED_MIN_COLUMNS = 4;
const LEGACY_WIDE_RATIO = 4;

/** Preserve ordinary manual layouts, but migrate the old single-row output. */
export function compactWideRestore(positions:Record<string,Position>, pinned:ReadonlySet<string>):Record<string,Position> {
  const entries=Object.entries(positions);
  if(entries.length<=MIN_COLUMNS)return positions;
  const xs=entries.map(([,position])=>position.x),ys=entries.map(([,position])=>position.y);
  const width=Math.max(...xs)-Math.min(...xs)+210;
  const height=Math.max(...ys)-Math.min(...ys)+76;
  if(width/height<=LEGACY_WIDE_RATIO)return positions;
  return Object.fromEntries(entries.filter(([id])=>pinned.has(id)));
}

/**
 * Keep topology tiers ordered from top to bottom, but wrap large tiers so one
 * populous access layer cannot make the entire map hundreds of screens wide.
 */
export function packTierPositions(graph:Topology, horizontalOrder:ReadonlyMap<string,number>, focused=false):Record<string,Position> {
  const tiers=new Map<number,typeof graph.nodes>();
  for(const node of graph.nodes)tiers.set(node.tier,[...(tiers.get(node.tier) ?? []),node]);
  const columnGap=focused ? FOCUSED_COLUMN_GAP : NORMAL_COLUMN_GAP;
  const rowGap=focused ? FOCUSED_ROW_GAP : NORMAL_ROW_GAP;
  const targetAspect=focused ? 1.2 : 1.4;
  // Include actual card spacing in the column count instead of assuming square
  // cells. Focused scopes use fewer columns to keep neighboring nodes together.
  const columns=Math.max(focused ? FOCUSED_MIN_COLUMNS : MIN_COLUMNS,Math.ceil(Math.sqrt(graph.nodes.length*targetAspect*rowGap/columnGap)));
  const positions:Record<string,Position>={};
  let outputRow=0;
  for(const tier of [...tiers.keys()].sort((a,b)=>a-b)){
    const nodes=tiers.get(tier)!;
    nodes.sort((a,b)=>a.site.localeCompare(b.site) || (horizontalOrder.get(a.id) ?? 0)-(horizontalOrder.get(b.id) ?? 0) || a.id.localeCompare(b.id));
    for(let start=0;start<nodes.length;start+=columns){
      const row=nodes.slice(start,start+columns);
      row.forEach((node,index)=>{positions[node.id]={x:(index-(row.length-1)/2)*columnGap,y:outputRow*rowGap};});
      outputRow++;
    }
  }
  return positions;
}
