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

export interface CmrDevice {
  key: string;
  identity: string;
  board: string | null;
  model_code: string | null;
  arch: string | null;
  version: string | null;
  available_version: string | null;
  update_available: boolean;
  channel: string | null;
  upgrade_rule: string | null;
  address: string | null;
  labels: string[];
  uptime: number | null;
  connected_time: number | null;
  /** Controller local time, e.g. "2026-10-04 20:55:21", while disconnected. */
  disconnected_since: string | null;
  controller: boolean;
  connected: boolean;
  /** Pairing waits for approval on the controller (P flag). */
  pending: boolean;
  /** Pairing waits for approval on the device itself (p flag). */
  remote_pending: boolean;
  stale: boolean;
  alerts: AlertCounts | null;
  device_id: string | null;
  /** A wifi package is installed: the device has radios. */
  wifi: boolean;
  entities: Record<string, string | null>;
  /** From the product catalog, when it lists the device. */
  product?: CmrProduct | null;
}

export interface CmrProduct {
  code: string;
  name: string;
  status: string | null;
  url: string | null;
  image: string;
  image_large: string;
  /** Several catalog variants match: the photo fits, the name is a guess. */
  ambiguous?: boolean;
  /** Front-panel ports from the catalog's specifications (models.port_spec). */
  ports?: CmrPorts | null;
}

export type CageKind = "sfp" | "sfp+" | "combo" | "sfp28" | "sfp56" | "qsfp+" | "qsfp28" | "qsfp56" | "qsfp56-dd";

export interface CmrPorts {
  /** [speed, count] groups in ether-number order (ether1 first). */
  ether: [string, number][];
  /** 1 when a 10/100 management port is numbered after the others. */
  mgmt: number;
  /** SFP/QSFP groups in front-panel order. */
  cages: [CageKind, number][];
  /** Ether numbers that can power a device, as [first, last] ranges. */
  poe_out: [number, number][];
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
  /** state: stays active while it matches (counts in devices_on); event: fires per occurrence, never active. */
  kind: "state" | "event";
  /** system: about the controller as a whole (a finished upgrade job), not a device. */
  scope: "device" | "system";
  disabled: boolean;
  /** Has any HTTP action. */
  webhook: boolean;
  /** Its HTTP action points at this Home Assistant's webhook. */
  webhook_ha: boolean;
  /** Pushes to this Home Assistant with an older body; Push alerts again updates it. */
  webhook_outdated: boolean;
  entity_id: string | null;
}

export interface CmrLayout {
  name: string;
  comment: string | null;
}

export interface CmrNode {
  id: string;
  name: string;
  layout: string;
  x: number | null;
  y: number | null;
  target_layout: string | null;
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
  controller_url: string;
  last_update: string | null;
  available: boolean;
  /** Home Assistant may act on the controller (pair, upgrade). */
  actions: boolean;
  /** The REST user may run console commands (per-rule device lists need them). */
  console: boolean;
  fleet_entities: Record<string, string | null>;
  devices: CmrDevice[];
  alerts: CmrAlertRule[];
  upgrade_rules: Record<string, string>[];
  upgrade_jobs: Record<string, string>[];
  /** Changes when layouts or nodes do; they are only sent then (data.ts fills them in). */
  topology_version: string;
  layouts: CmrLayout[];
  nodes: CmrNode[];
  links: CmrLink[];
  /** CMR's WiFi provisioning; null on a controller build without the menu. */
  wifi: { networks: CmrWifiNetwork[]; radios: CmrWifiRadio[] } | null;
}

/** Fields shared by CMR WiFi networks and radio items. */
interface CmrWifiItem {
  id: string;
  comment: string | null;
  disabled: boolean;
  /** Device labels of the item's selector (band labels split off). */
  selector: string[];
  /** Bands its band labels select ("2.4", "5", "6"); empty = every band. */
  bands: string[];
  /** Keys of the devices its labels select. */
  devices: string[];
}

export interface CmrWifiNetwork extends CmrWifiItem {
  ssid: string | null;
  mode: string | null;
  vlan_id: number | null;
  hidden: boolean;
  authentication: string[];
  encryption: string[];
  fast_roaming: boolean;
  mlo: boolean;
  max_clients: number | null;
}

export interface CmrWifiRadio extends CmrWifiItem {
  /** RouterOS channel band, e.g. "5ghz-ax". */
  band: string | null;
  frequency: string | null;
  width: string | null;
  country: string | null;
  chains: string | null;
  tx_power: number | null;
}

// Minimal view of the frontend's hass object used by the cards.
export interface HassLike {
  states: Record<string, { state: string; attributes: Record<string, unknown>; last_changed: string }>;
  user?: { is_admin: boolean };
  /** Entity and device registry views the frontend keeps (used before the first snapshot). */
  entities?: Record<string, { platform?: string; translation_key?: string; device_id?: string }>;
  devices?: Record<string, { name?: string | null; name_by_user?: string | null; config_entries?: string[] }>;
  language?: string;
  themes?: { darkMode?: boolean };
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
  connection: {
    subscribeMessage<T>(
      callback: (message: T) => void,
      message: Record<string, unknown>,
    ): Promise<() => Promise<void>>;
    sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
  };
}
