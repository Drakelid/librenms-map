import type { Position, Topology } from './types';

// Gaps leave room between cards for the link load labels.
const NORMAL_COLUMN_GAP = 256;
const NORMAL_ROW_GAP = 180;
const FOCUSED_COLUMN_GAP = 246;
const FOCUSED_ROW_GAP = 155;
const MIN_COLUMNS = 8;
const FOCUSED_MIN_COLUMNS = 4;
const LEGACY_WIDE_RATIO = 4;
// Earlier automatic grids: the original 260x210 one and the tighter 238x135 one.
const FORMER_GRIDS = [{ column:260, row:210 }, { column:238, row:135 }];
const LEGACY_GRID_TOLERANCE = 2;

function nearLegacyMultiple(distance:number,gap:number):boolean {
  if(distance<=0)return false;
  const multiple=Math.max(1,Math.round(distance/gap));
  return Math.abs(distance-multiple*gap)<=LEGACY_GRID_TOLERANCE;
}

/** Match a former automatic grid without treating arbitrary manual layouts as stale. */
function looksLikeFormerGrid(entries:[string,Position][], grid:{column:number;row:number}):boolean {
  if(entries.length<=MIN_COLUMNS)return false;
  const rows=new Map<number,number[]>();
  for(const [,position] of entries){
    const row=Math.round(position.y);
    rows.set(row,[...(rows.get(row) ?? []),position.x]);
  }
  const rowYs=[...rows.keys()].sort((a,b)=>a-b);
  const verticalGaps=rowYs.slice(1).map((y,index)=>y-rowYs[index]).filter(gap=>gap>0);
  const horizontalGaps=[...rows.values()].flatMap(xs=>{
    const sorted=[...xs].sort((a,b)=>a-b);
    return sorted.slice(1).map((x,index)=>x-sorted[index]).filter(gap=>gap>0);
  });
  if(verticalGaps.length===0 || horizontalGaps.length<2)return false;
  const verticalMatches=verticalGaps.filter(gap=>nearLegacyMultiple(gap,grid.row)).length;
  const horizontalMatches=horizontalGaps.filter(gap=>nearLegacyMultiple(gap,grid.column)).length;
  return verticalMatches/verticalGaps.length>=.75 && horizontalMatches/horizontalGaps.length>=.75;
}

/** Preserve ordinary manual layouts, but migrate former automatic layouts. */
export function compactWideRestore(positions:Record<string,Position>, pinned:ReadonlySet<string>):Record<string,Position> {
  const entries=Object.entries(positions);
  if(entries.length<=MIN_COLUMNS)return positions;
  const xs=entries.map(([,position])=>position.x),ys=entries.map(([,position])=>position.y);
  const width=Math.max(...xs)-Math.min(...xs)+210;
  const height=Math.max(...ys)-Math.min(...ys)+76;
  const automaticEntries=entries.filter(([id])=>!pinned.has(id));
  if(width/height<=LEGACY_WIDE_RATIO && !FORMER_GRIDS.some(grid=>looksLikeFormerGrid(automaticEntries,grid)))return positions;
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
