export type Status = 'up' | 'down' | 'unknown' | 'disabled';
export interface Device { id: string; hostname: string; sysName?: string | null; displayName?: string | null; status: Status; url?: string }
export interface Link {
  id: string; source: string; target: string; sourcePort: string; targetPort: string;
  sourcePortId: string; targetPortId: string; speedBps: number | null;
  inBps: number | null; outBps: number | null; sampledAt: number | null; status: Status;
}
export interface Config { prefixes: string[]; staleAfter: number; overrides: Record<string, { role?: string; site?: string }> }
export interface DeviceGroup { id: string; name: string; deviceIds: string[] }
export interface Snapshot { devices: Device[]; links: Link[]; deviceGroups?: DeviceGroup[]; generatedAt: number; config: Config }
export interface MapNode extends Device { role: string; site: string; tier: number; reachable: boolean }
export interface Topology { nodes: MapNode[]; links: Link[]; deviceGroups: DeviceGroup[] }
export type Position = { x: number; y: number };
export interface ViewState {
  rootId: string | null;
  deviceGroupId: string | null;
  site: string;
  search: string;
  backbone: boolean;
  showOther: boolean;
  hops: number;
  positions: Record<string, Position>;
  pinned: string[];
  zoom: number;
  pan: Position;
}
export interface SavedView { id: string; name: string; revision: number; state: ViewState; updatedAt: string }

// Custom maps: positions are card centres in model coordinates.
export interface CustomDevice { key: string; deviceId: string; x: number; y: number }
export interface CustomShape { key: string; kind: 'text' | 'box'; x: number; y: number; width: number; height: number; text: string }
export interface CustomLink { key: string; source: string; target: string; label: string; portId: string | null }
export interface CustomDocument { devices: CustomDevice[]; shapes: CustomShape[]; links: CustomLink[]; zoom: number; pan: Position }
export interface CustomMapSummary { id: string; name: string; shared: boolean; owned: boolean; ownerName: string | null; revision: number; updatedAt: string }
export interface LivePort { id: string; deviceId: string; name: string; speedBps: number | null; inBps: number | null; outBps: number | null; sampledAt: number | null; status: Status }
export interface CustomMapSnapshot {
  map: CustomMapSummary & { document: CustomDocument };
  live: { devices: Record<string, Device>; ports: Record<string, LivePort> };
  generatedAt: number;
  config: { staleAfter: number };
}
