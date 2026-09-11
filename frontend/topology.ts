import type { Config, Device, Link, MapNode, Snapshot, Topology } from './types';

// The numbered site boundary avoids false positives such as "server01".
const ROLE_NAME = /^(?<site>.+?\d)(?<role>agg|er)(?<number>\d+)$/;
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

// Unknown remote ports are not guessed or merged with known physical ports.
export function normalizeLinks(links: Link[], ids: Set<string>): Link[] {
  const result = new Map<string, Link>();
  for (const link of links) {
    if (!ids.has(link.source) || !ids.has(link.target)) continue;
    const ends = [[link.source, link.sourcePortId], [link.target, link.targetPortId]];
    const reversed = JSON.stringify(ends[0]) > JSON.stringify(ends[1]);
    const key = link.sourcePortId && link.targetPortId
      ? JSON.stringify(reversed ? ends.reverse() : ends) : `unresolved:${link.id}`;
    const existing = result.get(key);
    // Prefer the canonical endpoint's observation, then the freshest sample.
    const canonical = !reversed;
    const existingCanonical = existing && JSON.stringify([existing.source, existing.sourcePortId]) <= JSON.stringify([existing.target, existing.targetPortId]);
    if (!existing || (canonical && !existingCanonical) || (canonical === existingCanonical && (link.sampledAt ?? 0) > (existing.sampledAt ?? 0))) {
      result.set(key, { ...link, id: key });
    }
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

export function metric(link: Link, now: number, staleAfter: number) {
  if (link.status === 'down') return { label: 'DOWN', color: '#e05b65', state: 'down', utilization: null };
  if (link.status === 'disabled') return { label: 'DISABLED', color: '#8a96a9', state: 'unknown', utilization: null };
  if (link.sampledAt === null || now - link.sampledAt > staleAfter || link.sampledAt > now + 60)
    return { label: 'STALE', color: '#8a96a9', state: 'stale', utilization: null };
  if (link.status !== 'up' || !link.speedBps || link.speedBps <= 0 || link.inBps === null || link.outBps === null || link.inBps < 0 || link.outBps < 0 || ![link.speedBps, link.inBps, link.outBps].every(Number.isFinite))
    return { label: 'N/A', color: '#8a96a9', state: 'unknown', utilization: null };
  const utilization = Math.max(link.inBps, link.outBps) / link.speedBps * 100;
  return { label: `${Math.round(utilization)}%`, color: utilization >= 90 ? '#e78636' : utilization >= 75 ? '#cb9a28' : utilization >= 50 ? '#299e9b' : '#6485b6', state: 'up', utilization };
}
