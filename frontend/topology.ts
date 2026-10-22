import type { Config, Device, Link, MapNode, Snapshot, Topology } from './types';

// The numbered site boundary avoids false positives such as "server01".
// A numbered site, the role and its number, optionally separated by "-" or "_":
// rossa1agg1, rossa1-agg1, rossa1_er2, rossa1-agg-1. The site must end in its
// number, so names that merely contain the letters (server01, router2) are not roles.
const ROLE_NAME = /^(?<site>.+?\d)[-_]?(?<role>agg|er)[-_]?(?<number>\d+)$/;
export const PARALLEL_CONNECTION_GAP = 90;

function nameParts(name: string, prefixes: string[]) {
  let short = name.toLowerCase().split('.')[0];
  for (const prefix of prefixes) {
    if (short.startsWith(prefix)) { short = short.slice(prefix.length); break; }
  }
  return ROLE_NAME.exec(short)?.groups;
}

/** The label the server resolved from LibreNMS's display name, else the hostname. */
export function deviceName(device: Device): string {
  return typeof device.displayName === 'string' && device.displayName.trim() !== '' ? device.displayName.trim() : device.hostname;
}

export function classify(device: Device, config: Config): Pick<MapNode, 'role' | 'site'> {
  // Config is admin-edited; ignore entries of the wrong type instead of failing the map.
  const prefixes = config.prefixes.filter(p => typeof p === 'string' && p !== '').map(p => p.toLowerCase()).sort((a, b) => b.length - a.length);
  // Devices added by IP address have no role in their hostname; sysName usually does.
  const match = nameParts(device.hostname, prefixes) ?? (typeof device.sysName === 'string' ? nameParts(device.sysName, prefixes) : undefined);
  const override = config.overrides[device.id];
  const role = typeof override?.role === 'string' ? override.role : match?.role ?? 'other';
  const site = typeof override?.site === 'string' ? override.site : match?.site ?? 'Unclassified';
  return { role: role.toUpperCase(), site };
}

const portKey = (device: string, port: string) => JSON.stringify([device, port]);

/**
 * One link per physical connection. LibreNMS records a connection from each
 * end; reciprocal records with both ports resolved merge by port pair. When
 * LibreNMS matched the neighbor device but not its port, the record is kept:
 * it is dropped only when the other end's record already resolves that same
 * port, and two such records facing each other become one connection.
 */
export function normalizeLinks(links: Link[], ids: Set<string>): Link[] {
  const result = new Map<string, Link>();
  const keep = (key: string, link: Link, canonical: boolean) => {
    const existing = result.get(key);
    // Prefer the canonical endpoint's observation, then the freshest sample.
    const existingCanonical = existing && portKey(existing.source, existing.sourcePortId) <= portKey(existing.target, existing.targetPortId);
    if (!existing || (canonical && !existingCanonical) || (canonical === existingCanonical && (link.sampledAt ?? 0) > (existing.sampledAt ?? 0))) {
      result.set(key, { ...link, id: key });
    }
  };
  const pairKey = (link: Link) => {
    const ends = [[link.source, link.sourcePortId], [link.target, link.targetPortId]];
    const reversed = JSON.stringify(ends[0]) > JSON.stringify(ends[1]);
    return { key: JSON.stringify(reversed ? ends.reverse() : ends), canonical: !reversed };
  };
  const unresolved: Link[] = [];
  for (const link of links) {
    if (!ids.has(link.source) || !ids.has(link.target)) continue;
    if (!link.sourcePortId || !link.targetPortId) { unresolved.push(link); continue; }
    const { key, canonical } = pairKey(link);
    keep(key, link, canonical);
  }
  const resolvedPorts = new Set([...result.values()].flatMap(l => [portKey(l.source, l.sourcePortId), portKey(l.target, l.targetPortId)]));
  const open = new Map<string, Link[]>();
  for (const link of unresolved) {
    // The far end's own record already describes this connection.
    if (link.sourcePortId && resolvedPorts.has(portKey(link.source, link.sourcePortId))) continue;
    const devices = JSON.stringify([link.source, link.target].sort());
    open.set(devices, [...(open.get(devices) ?? []), link]);
  }
  for (const group of open.values()) {
    const forward = group.filter(l => l.source < l.target), backward = group.filter(l => l.source > l.target);
    // One unmatched record from each end: the same cable, seen from both sides.
    if (forward.length === 1 && backward.length === 1 && forward[0].sourcePortId && backward[0].sourcePortId) {
      const [a, b] = [forward[0], backward[0]];
      const merged = { ...a, targetPortId: b.sourcePortId, targetPort: b.sourcePort };
      const { key, canonical } = pairKey(merged);
      keep(key, merged, canonical);
      continue;
    }
    for (const link of group) result.set(`unresolved:${link.id}`, { ...link, id: `unresolved:${link.id}` });
  }
  return [...result.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export function topology(snapshot: Snapshot): Topology {
  const nodes: MapNode[] = snapshot.devices.map(d => ({ ...d, ...classify(d, snapshot.config), tier: -1, reachable: false }));
  const byId = new Map(nodes.map(n => [n.id, n]));
  const deviceGroups = (Array.isArray(snapshot.deviceGroups) ? snapshot.deviceGroups : []).flatMap(group => {
    if (!group || typeof group.id !== 'string' || !/^[1-9]\d{0,9}$/.test(group.id) || typeof group.name !== 'string' || group.name.trim() === '' || !Array.isArray(group.deviceIds)) return [];
    const deviceIds = [...new Set(group.deviceIds.filter((id): id is string => typeof id === 'string' && byId.has(id)))];
    return deviceIds.length ? [{ id:group.id, name:group.name, deviceIds }] : [];
  }).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}) || a.id.localeCompare(b.id));
  const links = normalizeLinks(snapshot.links, new Set(byId.keys()));
  const neighbors = new Map(nodes.map(n => [n.id, new Set<string>()]));
  for (const l of links) { neighbors.get(l.source)!.add(l.target); neighbors.get(l.target)!.add(l.source); }
  const queue = nodes.filter(n => n.role === 'AGG');
  for (const root of queue) { root.tier = 0; root.reachable = true; }
  for (let i = 0; i < queue.length; i++) {
    for (const id of neighbors.get(queue[i].id)!) {
      const node = byId.get(id)!;
      if (node.tier < 0) { node.tier = queue[i].tier + 1; node.reachable = true; queue.push(node); }
    }
  }
  const disconnectedTier = Math.max(0, ...nodes.map(n => n.tier)) + 1;
  for (const n of nodes) if (n.tier < 0) n.tier = disconnectedTier;
  nodes.sort((a, b) => a.tier - b.tier || a.site.localeCompare(b.site) || deviceName(a).localeCompare(deviceName(b), undefined, { numeric: true }));
  return { nodes, links, deviceGroups };
}

/** Give same-tier physical links separate arcs, independent of observation order. */
export function lateralOffsets(graph: Topology): Map<string, number> {
  const tiers = new Map(graph.nodes.map(node => [node.id, node.tier]));
  const groups = new Map<string, Link[]>();
  for (const link of graph.links) {
    if (tiers.get(link.source) !== tiers.get(link.target)) continue;
    const key = JSON.stringify([link.source, link.target].sort());
    const group = groups.get(key) ?? [];
    group.push(link);
    groups.set(key, group);
  }
  const offsets = new Map<string, number>();
  for (const group of groups.values()) {
    group.sort((a, b) => a.id.localeCompare(b.id)).forEach((link, index) => {
      // Reverse the sign for reverse observations so each offset describes the
      // same physical side of the pair, regardless of the measuring endpoint.
      offsets.set(link.id, (-80 - index * PARALLEL_CONNECTION_GAP) * (link.source <= link.target ? 1 : -1));
    });
  }
  return offsets;
}

/** Link load bands: below 50%, 50–70%, and above 70%. */
export const LOAD_COLORS = { normal: '#6485b6', warning: '#cb9a28', high: '#e03131' } as const;

/** "950 kb/s", "12.3 Mb/s", "1.2 Gb/s" (SI units, as LibreNMS shows interface rates). */
export function formatBps(bps: number): string {
  const units = ['b/s', 'kb/s', 'Mb/s', 'Gb/s', 'Tb/s'];
  let value = Math.max(0, bps), unit = 0;
  while (value >= 1000 && unit < units.length - 1) { value /= 1000; unit++; }
  return `${value >= 100 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`;
}

/**
 * Load in each direction of a link, measured at its source port: out is
 * source → target, in is target → source. Null when `metric` has no load to
 * show (down, disabled, stale or unknown); the label then says why.
 */
export function directions(link: Link, now: number, staleAfter: number) {
  const m = metric(link, now, staleAfter);
  if (m.state !== 'up') return null;
  const one = (bps: number) => {
    const percent = Math.round(bps / link.speedBps! * 100);
    return { bps, percent, color: percent > 70 ? LOAD_COLORS.high : percent >= 50 ? LOAD_COLORS.warning : LOAD_COLORS.normal };
  };
  return { out: one(link.outBps!), in: one(link.inBps!), speedBps: link.speedBps! };
}

export function metric(link: Link, now: number, staleAfter: number) {
  if (link.status === 'down') return { label: 'DOWN', color: '#e05b65', state: 'down', utilization: null };
  if (link.status === 'disabled') return { label: 'DISABLED', color: '#8a96a9', state: 'unknown', utilization: null };
  if (link.sampledAt === null || now - link.sampledAt > staleAfter || link.sampledAt > now + 60)
    return { label: 'STALE', color: '#8a96a9', state: 'stale', utilization: null };
  if (link.status !== 'up' || !link.speedBps || link.speedBps <= 0 || link.inBps === null || link.outBps === null || link.inBps < 0 || link.outBps < 0 || ![link.speedBps, link.inBps, link.outBps].every(Number.isFinite))
    return { label: 'N/A', color: '#8a96a9', state: 'unknown', utilization: null };
  const utilization = Math.max(link.inBps, link.outBps) / link.speedBps * 100;
  // Band on the rounded label, so a link reading "70%" is never drawn as overloaded.
  const percent = Math.round(utilization);
  return { label: `${percent}%`, color: percent > 70 ? LOAD_COLORS.high : percent >= 50 ? LOAD_COLORS.warning : LOAD_COLORS.normal, state: 'up', utilization };
}
