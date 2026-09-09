import type { Snapshot } from './types';

export function demoSnapshot(): Snapshot {
  const now = Math.floor(Date.now() / 1000);
  const names = ['hk-rossa1agg1','hk-rossa1agg2','hk-heiane1agg1','hk-heiane1agg2','hk-rossa1er1','hk-rossa1er2','hk-rossa1er3','hk-rossa1er4','hk-heiane1er1','hk-heiane1er2','hk-kvala1er1','hk-solvang1er1','hk-flotmyr1er1','hk-bandadalen1er2','hk-se1er1','unclassified-switch'];
  const connections = [[0,1,12],[1,2,34],[2,3,8],[0,4,19],[1,4,22],[0,5,5],[1,6,81],[1,7,52],[2,8,7],[3,9,94],[4,10,14],[10,11,4],[11,5,8],[6,12,27],[8,13,0],[13,14,3],[14,9,11],[0,4,6]];
  return {
    generatedAt: now,
    config: { prefixes: ['hk-'], staleAfter: 900, overrides: {} },
    devices: names.map((hostname, i) => ({ id:String(i), hostname, status:i === 14 ? 'down' : i === 15 ? 'unknown' : 'up' })),
    links: connections.map(([source,target,percent], i) => ({ id:`demo-${i}`, source:String(source), target:String(target), sourcePortId:String(i*2+1), targetPortId:String(i*2+2), sourcePort:`xe-0/0/${i}`, targetPort:'xe-0/0/0', speedBps:1e10, inBps:percent*1e8, outBps:percent*6e7, sampledAt:i === 15 ? now-1800 : now, status:target === 14 || source === 14 ? 'down' : 'up' })),
  };
}
