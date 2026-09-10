export type Status = 'up' | 'down' | 'unknown' | 'disabled';
export interface Device { id: string; hostname: string; sysName?: string | null; status: Status; url?: string }
export interface Link {
  id: string; source: string; target: string; sourcePort: string; targetPort: string;
  sourcePortId: string; targetPortId: string; speedBps: number | null;
  inBps: number | null; outBps: number | null; sampledAt: number | null; status: Status;
}
export interface Config { prefixes: string[]; staleAfter: number; overrides: Record<string, { role?: string; site?: string }> }
export interface Snapshot { devices: Device[]; links: Link[]; generatedAt: number; config: Config }
export interface MapNode extends Device { role: string; site: string; tier: number; reachable: boolean }
export interface Topology { nodes: MapNode[]; links: Link[] }
export type Position = { x: number; y: number };
export interface ViewState {
  rootId: string | null;
  site: string;
  search: string;
  backbone: boolean;
  positions: Record<string, Position>;
  pinned: string[];
  zoom: number;
  pan: Position;
}
export interface SavedView { id: string; name: string; revision: number; state: ViewState; updatedAt: string }
