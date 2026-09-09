import ELK from 'elkjs/lib/elk-api.js';
import ElkWorker from 'elkjs/lib/elk-worker.min.js?worker';
import type { Topology, Position } from './types';
const elk = new ELK({ workerFactory: () => new ElkWorker() });
export async function layoutGraph(graph:Topology):Promise<Record<string,Position>> {
    const nodes = new Map(graph.nodes.map(n => [n.id, n]));
    // Only layout edges are oriented. Displayed physical links are never modified.
    const edges = graph.links.filter(e => nodes.get(e.source)!.tier !== nodes.get(e.target)!.tier).map((e,i) => {
      const forwards = nodes.get(e.source)!.tier < nodes.get(e.target)!.tier;
      return { id:String(i), sources:[forwards ? e.source : e.target], targets:[forwards ? e.target : e.source] };
    });
    const result = await elk.layout({ id:'root', layoutOptions: {
      'elk.algorithm':'layered', 'elk.direction':'DOWN', 'elk.spacing.nodeNode':'60',
      'elk.layered.spacing.nodeNodeBetweenLayers':'120', 'elk.layered.considerModelOrder.strategy':'NODES_AND_EDGES',
    }, children:graph.nodes.map(n => ({ id:n.id, width:210, height:76 })), edges });
    const order = new Map(result.children!.map(n => [n.id, n.x ?? 0]));
    const rows = new Map<number, typeof graph.nodes>();
    for (const node of graph.nodes) rows.set(node.tier, [...(rows.get(node.tier) ?? []), node]);
    const positions:Record<string,Position> = {};
    for (const [tier,row] of rows) {
      row.sort((a,b) => a.site.localeCompare(b.site) || order.get(a.id)!-order.get(b.id)! || a.id.localeCompare(b.id));
      row.forEach((node,i) => { positions[node.id] = { x:(i-(row.length-1)/2)*260, y:tier*210 }; });
    }
    return positions;
}
