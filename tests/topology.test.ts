import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify, deviceName, lateralOffsets, LOAD_COLORS, metric, normalizeLinks, topology } from '../frontend/topology';
import type { Config, Link, Snapshot } from '../frontend/types';
const config: Config = { prefixes: ['hk-'], staleAfter: 900, overrides: {} };
const link = (source: string, target: string, sourcePortId = '1', targetPortId = '2'): Link => ({ id: `${source}-${target}-${sourcePortId}`, source, target, sourcePortId, targetPortId, sourcePort: 'eth1', targetPort: 'eth2', speedBps: 1e9, inBps: 2e8, outBps: 5e8, sampledAt: 1000, status: 'up' });
test('naming handles prefixes, domains, peer roots and overrides', () => {
  assert.deepEqual(classify({ id:'1', hostname:'HK-ROSSA1AGG2.example.net', status:'up' }, config), { role:'AGG', site:'rossa1' });
  assert.equal(classify({ id:'1', hostname:'rossa1er1', status:'up' }, config).role, 'ER');
  assert.equal(classify({ id:'1', hostname:'server01', status:'up' }, config).role, 'OTHER');
  assert.deepEqual(classify({ id:'1', hostname:'server01', status:'up' }, { ...config, overrides: { '1': { role:'agg', site:'manual' } } }), { role:'AGG', site:'manual' });
});
test('reciprocal observations deduplicate but parallel physical links survive', () => {
  const links = normalizeLinks([link('a','b'), link('b','a','2','1'), link('a','b','3','4')], new Set(['a','b']));
  assert.equal(links.length, 2);
  assert.equal(normalizeLinks([link('a','private')], new Set(['a'])).length, 0);
});

test('lateral arcs remain separate and stable with reversed observations and input ordering', () => {
  const graph=topology({config,generatedAt:1000,devices:[
    {id:'1',hostname:'site1agg1',status:'up'}, {id:'2',hostname:'site1agg2',status:'up'},
  ],links:[link('1','2'),link('2','1','4','3'),link('1','2','5','6')]});
  const offsets=lateralOffsets(graph);
  const physical=graph.links.map(l=>offsets.get(l.id)!*(l.source<=l.target?1:-1));
  assert.deepEqual(physical,[-80,-170,-260]);
  assert.deepEqual(lateralOffsets({...graph,links:[...graph.links].reverse()}),offsets);
});
test('paired AGGs stay roots, dual-homed ER appears once, cycles terminate, orphans remain', () => {
  const snapshot: Snapshot = { config, generatedAt:1000, devices: ['rossa1agg1','rossa1agg2','rossa1er1','rossa1er2','rossa1er3','orphan'].map((hostname,i) => ({ id:String(i), hostname, status:'up' })), links:[link('0','1'),link('0','2'),link('1','2'),link('2','3'),link('3','4'),link('4','2')] };
  const graph = topology(snapshot);
  assert.equal(graph.nodes.length, 6);
  assert.deepEqual(graph.nodes.filter(n => n.role === 'AGG').map(n => n.tier), [0,0]);
  assert.equal(graph.nodes.find(n => n.id === '2')!.tier, 1);
  assert.equal(graph.nodes.find(n => n.id === '3')!.tier, 2);
  assert.equal(graph.nodes.find(n => n.id === '5')!.reachable, false);
  assert.equal(graph.links.length, 6);
});
test('utilization uses directional maximum, preserves zero, and distinguishes stale/down/unknown', () => {
  assert.equal(metric(link('a','b'), 1100, 900).label, '50%');
  assert.equal(metric({ ...link('a','b'), inBps:0, outBps:0 }, 1100, 900).label, '0%');
  assert.equal(metric({ ...link('a','b'), speedBps:0 }, 1100, 900).label, 'N/A');
  assert.equal(metric({ ...link('a','b'), inBps:null }, 1100, 900).label, 'N/A');
  assert.equal(metric(link('a','b'), 2000, 900).label, 'STALE');
  assert.equal(metric({ ...link('a','b'), status:'down' }, 2000, 900).label, 'DOWN');
  assert.equal(metric({ ...link('a','b'), outBps:1.2e9 }, 1100, 900).label, '120%');
});
test('load colors are blue under 50%, yellow from 50% and red above 70%, following the rounded label', () => {
  const at = (inBps: number) => metric({ ...link('a','b'), inBps, outBps: 0 }, 1100, 900);
  assert.deepEqual([at(4.94e8).label, at(4.94e8).color], ['49%', LOAD_COLORS.normal]);
  assert.deepEqual([at(4.96e8).label, at(4.96e8).color], ['50%', LOAD_COLORS.warning]);
  assert.deepEqual([at(7.04e8).label, at(7.04e8).color], ['70%', LOAD_COLORS.warning]);
  assert.deepEqual([at(7.06e8).label, at(7.06e8).color], ['71%', LOAD_COLORS.high]);
  assert.equal(at(1.2e9).color, LOAD_COLORS.high);
});
test('an IP-address hostname falls back to sysName and malformed config entries are ignored', () => {
  assert.deepEqual(classify({ id:'1', hostname:'10.20.30.40', sysName:'HK-ROSSA1ER2.example.net', status:'up' }, config), { role:'ER', site:'rossa1' });
  assert.deepEqual(classify({ id:'1', hostname:'rossa1agg1', sysName:'heiane1er1', status:'up' }, config), { role:'AGG', site:'rossa1' });
  assert.equal(classify({ id:'1', hostname:'10.20.30.40', sysName:null, status:'up' }, config).site, 'Unclassified');
  const malformed: Config = { ...config, prefixes:['hk-', 7 as unknown as string], overrides:{ '1':{ role:5 as unknown as string, site:'manual' } } };
  assert.deepEqual(classify({ id:'1', hostname:'hk-rossa1agg1', status:'up' }, malformed), { role:'AGG', site:'manual' });
});
test('labels prefer the server display name, fall back to the hostname and order nodes by label', () => {
  assert.equal(deviceName({ id:'1', hostname:'10.20.30.40', displayName:'Core AGG 1', status:'up' }), 'Core AGG 1');
  assert.equal(deviceName({ id:'1', hostname:'10.20.30.40', displayName:'  ', status:'up' }), '10.20.30.40');
  assert.equal(deviceName({ id:'1', hostname:'rossa1agg1', displayName:null, status:'up' }), 'rossa1agg1');
  const graph = topology({ config, generatedAt:1000, links:[], devices:[
    { id:'1', hostname:'10.0.0.1', displayName:'rossa1agg2', status:'up' }, { id:'2', hostname:'10.0.0.2', displayName:'rossa1agg1', status:'up' },
  ] });
  assert.deepEqual(graph.nodes.map(n => n.id), ['2','1']);
});
