// Shapes sent by the integration's `cmr/subscribe` websocket command
// (see custom_components/cmr/websocket.py).

export interface AlertCounts {
  on: number;
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export type Role = "gateway" | "router" | "switch" | "ap" | "lte" | "device";

export interface CmrDevice {
  key: string;
  identity: string;
  serial: string | null;
  board: string | null;
  model_code: string | null;
  arch: string | null;
  role: Role;
  version: string | null;
  prerelease: boolean;
  available_version: string | null;
  update_available: boolean;
  minimum_version: string | null;
  channel: string | null;
  upgrade_rule: string | null;
  address: string | null;
  labels: string[];
  packages: string[];
  uptime: number | null;
  connected_time: number | null;
  controller: boolean;
  connected: boolean;
  pending: boolean;
  stale: boolean;
  alerts: AlertCounts | null;
  device_id: string | null;
  entities: Record<string, string | null>;
}

export interface CmrAlertRule {
  id: string;
  name: string;
  comment: string | null;
  severity: "critical" | "high" | "medium" | "low";
  categories: string[];
  labels: string[];
  devices: number;
  devices_on: number;
  fired: number;
  action_failures: number;
  disabled: boolean;
  webhook: boolean;
  entity_id: string | null;
}

export interface CmrLayout {
  rest_id: string;
  name: string;
  comment: string | null;
  background: string | null;
  scale: string | null;
}

export interface CmrNode {
  id: string;
  name: string;
  layout: string;
  x: number | null;
  y: number | null;
  target_layout: string | null;
  device_ref: string | null;
  device_key: string | null;
}

export interface PortEnd {
  interface: string;
  detected: boolean;
  poe: string | null;
  tx: string | null;
  rx: string | null;
}

export interface CmrLink {
  id: string;
  layout: string;
  node1: string;
  node2: string;
  comment: string | null;
  ports: { a: PortEnd; b: PortEnd }[];
}

export interface CmrEntry {
  entry_id: string;
  title: string;
  controller_key: string;
  controller_url: string;
  last_update: string | null;
  available: boolean;
  fleet_entities: Record<string, string | null>;
  devices: CmrDevice[];
  alerts: CmrAlertRule[];
  upgrade_rules: Record<string, string>[];
  upgrade_jobs: Record<string, string>[];
  layouts: CmrLayout[];
  nodes: CmrNode[];
  links: CmrLink[];
}

// Minimal view of the frontend's hass object used by the cards.
export interface HassLike {
  states: Record<string, { state: string; attributes: Record<string, unknown>; last_changed: string }>;
  user?: { is_admin: boolean };
  language?: string;
  themes?: { darkMode?: boolean };
  connection: {
    subscribeMessage<T>(
      callback: (message: T) => void,
      message: Record<string, unknown>,
    ): Promise<() => Promise<void>>;
    sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
  };
}
