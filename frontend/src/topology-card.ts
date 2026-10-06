import { css, html, nothing, svg, type PropertyDeclarations, type PropertyValues, type TemplateResult } from "lit";
import { RuleDevices } from "./data";
import { frontPanelStyles, portSummary, renderFrontPanel, usedPorts } from "./ports";
import {
  CmrEntryCard,
  ENTRY_FIELD,
  STATUS_LABEL,
  baseStyles,
  deepLinkParams,
  deviceStatus,
  deviceVisual,
  deviceMatches,
  formatDuration,
  labelsFrom,
  modelCode,
  modelName,
  moreInfo,
  navigate,
  pairingHint,
  viewPath,
  type Status,
} from "./shared";
import type { CmrDevice, CmrEntry, CmrLink, CmrNode, PortEnd } from "./types";

interface TopologyConfig {
  type: string;
  entry_id?: string;
  layout?: string;
  title?: string;
  /** Minimum map height in px; the map grows to fit the layout's shape. */
  height?: number;
  /** Upper bound for that growth in px (default: 85 % of the window). */
  max_height?: number;
  show_ports?: boolean;
  show_comments?: boolean;
  /** Icons for layout (building) nodes by name, e.g. { House: "mdi:home" }. */
  icons?: Record<string, string>;
  /** Dashboard views to link into (the strategy sets `devices`). */
  views?: { devices?: string };
}

// Level of detail by zoom: status dots below DOTS_BELOW, names only below
// NAMES_BELOW, full cards above. A click waits CLICK_DELAY ms for a double-click.
const DOTS_BELOW = 0.4;
const NAMES_BELOW = 0.7;
const CLICK_DELAY = 250;

const NODE_W = 184;
const NODE_H = 62;
const PAD = 48;
const AUTO = "__auto__";

interface PlacedNode {
  id: string;
  name: string;
  x: number;
  y: number;
  kind: "device" | "site" | "unknown";
  device?: CmrDevice;
  target?: string;
  site?: { online: number; total: number; status: Status; comment: string | null };
}

interface Scene {
  layout: string;
  nodes: PlacedNode[];
  links: CmrLink[];
  width: number;
  height: number;
}

const DEFAULT_SITE_ICON = "mdi:map-marker-radius-outline";

type Medium = "fiber" | "copper" | "wireless" | "logical";
type LinkKind = Medium | "uplink" | "unknown";

const KIND_LABEL: Record<LinkKind, string> = {
  fiber: "Fiber (SFP)",
  copper: "Ethernet",
  wireless: "Wireless",
  logical: "Logical interface",
  uplink: "Link between layouts",
  unknown: "No ports detected",
};
const LEGEND_KINDS: LinkKind[] = ["copper", "fiber", "wireless", "unknown"];

/**
 * Medium of an interface, from the router's default interface names. A
 * renamed port falls back to "logical" and is drawn dashed.
 */
function portMedium(name: string): Medium {
  if (/^q?sfp/i.test(name)) return "fiber";
  if (/^(ether|combo)/i.test(name)) return "copper";
  if (/^(wifi|wlan|wl\d)/i.test(name)) return "wireless";
  return "logical";
}

type PortPair = { a: PortEnd; b: PortEnd };

/** The device cable that joins two layouts, oriented from the first. */
type Cable = { ports: PortPair[]; names: [string, string] };

interface LinkInfo {
  link: CmrLink;
  a: PlacedNode;
  b: PlacedNode;
  state: "up" | "down" | "unknown";
  kind: LinkKind;
  // Detected ports oriented a -> b; for a link between two layouts, those of
  // the device cable that joins them.
  ports: PortPair[];
  // Names to show for each end's ports (devices, also for layout links).
  endNames: [string, string];
  // PoE: the node whose port supplies power, and the node it powers.
  poe?: { from: PlacedNode; to: PlacedNode; port: string };
}

/** Everything derived from one snapshot for one layout, reused until either changes. */
interface SceneMemo {
  entry: CmrEntry;
  path: string;
  byKey: Map<string, CmrDevice>;
  devicesIn: Map<string, CmrDevice[]>;
  cables: Map<string, Cable | undefined>;
  scene?: Scene;
}

type Box = { x0: number; y0: number; x1: number; y1: number };

function boxesOverlap(a: Box, b: Box, margin = 3): boolean {
  return a.x0 < b.x1 + margin && b.x0 < a.x1 + margin && a.y0 < b.y1 + margin && b.y0 < a.y1 + margin;
}

/** Where a ray from a node's centre leaves its box, pushed out by `gap`. */
function edgePoint(cx: number, cy: number, dx: number, dy: number, gap: number) {
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const t = Math.min(
    ux ? NODE_W / 2 / Math.abs(ux) : Infinity,
    uy ? NODE_H / 2 / Math.abs(uy) : Infinity,
  );
  return { x: cx + ux * (t + gap), y: cy + uy * (t + gap), ux, uy };
}

export class CmrTopologyCard extends CmrEntryCard<TopologyConfig> {
  static properties: PropertyDeclarations = {
    _path: { state: true },
    _hover: { state: true },
    _hoverLink: { state: true },
    _view: { state: true },
    _autoHeight: { state: true },
    _alert: { state: true },
    _rebuild: { state: true },
    _pinned: { state: true },
    _find: { state: true },
    _copied: { state: true },
  };

  declare _path: string[];
  declare _hover?: { node: PlacedNode; x: number; y: number };
  declare _hoverLink?: { info: LinkInfo; x: number; y: number };
  declare _view: { x: number; y: number; k: number };
  /** Height that shows the layout at full width, within height … max_height. */
  declare _autoHeight?: number;
  /** Alert rule id from the page URL: its devices stay lit, the rest dim. */
  declare _alert: string;
  /** The device popover opened by a click or tap; stays until closed. */
  declare _pinned?: { node: PlacedNode; x: number; y: number };
  /** Find on map: matching nodes stay lit, the rest dim. */
  declare _find: string;
  declare _copied: boolean;
  private _openTimer?: number;
  private _pointers = new Map<number, { x: number; y: number }>();
  private _pinch?: { dist: number; k: number; wx: number; wy: number };
  /** The last pointer was a finger: no hover tooltips, a tap opens the popover. */
  private _touch = false;
  /** The Rebuild links bar for one layout: asking, running, or its outcome. */
  declare _rebuild?: { layout: string; state: "confirm" | "busy" | "done" | "error"; text?: string };
  private _ruleDevices = new RuleDevices(() => this.requestUpdate());

  private _memo?: SceneMemo;
  private _userMoved = false;
  private _drag?: { id: number; x: number; y: number; vx: number; vy: number; moved: boolean };
  private _resize?: ResizeObserver;
  private _fittedFor = "";
  /** Scale at which the whole layout fits; zooming out stops a little below it. */
  private _fitK = 1;

  constructor() {
    super();
    this._path = [];
    this._view = { x: 0, y: 0, k: 1 };
    this._alert = "";
    this._find = "";
    this._copied = false;
  }

  /** Keys of the devices the highlighted rule is active on, set during render. */
  private _lit?: Set<string>;
  /** Ids of the nodes Find on map matches, set during render. */
  private _found?: Set<string>;

  private _nodeMatches(node: PlacedNode, needle: string): boolean {
    return node.name.toLowerCase().includes(needle) || (!!node.device && deviceMatches(node.device, needle));
  }

  private _onLocation = (): void => {
    const alert = deepLinkParams().alert;
    if (alert) this._alert = alert;
  };

  setConfig(config: TopologyConfig): void {
    this._config = { height: 440, show_ports: true, show_comments: true, ...config };
    this._path = config.layout ? [config.layout] : [];
    this._userMoved = false;
  }

  static getConfigForm() {
    return {
      schema: [
        ENTRY_FIELD,
        { name: "title", selector: { text: {} } },
        { name: "layout", selector: { text: {} } },
        {
          name: "height",
          selector: { number: { min: 200, max: 1400, step: 20, mode: "box", unit_of_measurement: "px" } },
        },
        {
          name: "max_height",
          selector: { number: { min: 200, max: 3000, step: 20, mode: "box", unit_of_measurement: "px" } },
        },
        { name: "show_ports", selector: { boolean: {} } },
        { name: "show_comments", selector: { boolean: {} } },
      ],
      computeLabel: labelsFrom({
        entry_id: "Controller",
        title: "Title",
        layout: "Start at layout (empty: the top layout)",
        height: "Height",
        show_ports: "Show port names on cables",
        show_comments: "Show link comments",
      }),
    };
  }

  getGridOptions() {
    // Height follows the content (the map's `height`); if the card is given
    // more rows, the map grows to fill them instead of leaving a gap.
    return { columns: "full", rows: "auto", min_columns: 6, min_rows: 4 };
  }

  getCardSize(): number {
    return Math.round((this._config?.height ?? 440) / 50) + 1;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._onKey);
    window.addEventListener("location-changed", this._onLocation);
    this._onLocation();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._onKey);
    window.removeEventListener("location-changed", this._onLocation);
    this._resize?.disconnect();
    this._resize = undefined;
  }

  // ---------------------------------------------------------------- scene

  /** The memo for the current snapshot and layout path, built on first use. */
  private _memoFor(entry: CmrEntry): SceneMemo {
    const path = this._path.join("/");
    if (this._memo?.entry !== entry || this._memo.path !== path) {
      this._memo = {
        entry,
        path,
        byKey: new Map(entry.devices.map((d) => [d.key, d])),
        devicesIn: new Map(),
        cables: new Map(),
      };
    }
    return this._memo;
  }

  private _rootLayouts(entry: CmrEntry): string[] {
    const targets = new Set(entry.nodes.map((n) => n.target_layout).filter(Boolean));
    const used = new Set(entry.nodes.map((n) => n.layout));
    const roots = entry.layouts.map((l) => l.name).filter((name) => !targets.has(name) && used.has(name));
    return roots.length ? roots : entry.layouts.map((l) => l.name).filter((name) => used.has(name));
  }

  private _currentLayout(entry: CmrEntry): string {
    if (this._path.length) return this._path[this._path.length - 1];
    return this._rootLayouts(entry)[0] ?? AUTO;
  }

  /** Devices on a layout, including those on the layouts it links to. */
  private _devicesIn(entry: CmrEntry, layout: string, seen = new Set<string>()): CmrDevice[] {
    const memo = this._memoFor(entry);
    const cached = memo.devicesIn.get(layout);
    if (cached) return cached;
    if (seen.has(layout)) return [];
    seen.add(layout);
    const out = new Map<string, CmrDevice>();
    for (const node of entry.nodes) {
      if (node.layout !== layout) continue;
      const device = node.device_key ? memo.byKey.get(node.device_key) : undefined;
      if (device) out.set(device.key, device);
      if (node.target_layout) this._devicesIn(entry, node.target_layout, seen).forEach((d) => out.set(d.key, d));
    }
    const devices = [...out.values()];
    memo.devicesIn.set(layout, devices);
    return devices;
  }

  private _scene(entry: CmrEntry): Scene {
    const memo = this._memoFor(entry);
    if (!memo.scene) memo.scene = this._buildScene(entry, memo.byKey);
    return memo.scene;
  }

  private _buildScene(entry: CmrEntry, byKey: Map<string, CmrDevice>): Scene {
    const layout = this._currentLayout(entry);
    let nodes: PlacedNode[];
    let links: CmrLink[];

    if (layout === AUTO) {
      ({ nodes, links } = this._autoLayout(entry));
    } else {
      const raw = entry.nodes.filter((n) => n.layout === layout);
      const placed = raw.filter((n) => n.x != null && n.y != null);
      const maxY = placed.length ? Math.max(...placed.map((n) => n.y!)) : 0;
      const minX = placed.length ? Math.min(...placed.map((n) => n.x!)) : 0;
      let spare = 0;
      nodes = raw.map((n: CmrNode) => {
        // Nodes never placed in the layout editor have no coordinates: park them in a row below.
        const unplaced = n.x == null || n.y == null;
        const x = unplaced ? minX + spare * (NODE_W + 40) : n.x!;
        const y = unplaced ? maxY + NODE_H * 2.4 : n.y!;
        if (unplaced) spare += 1;
        if (n.target_layout) {
          const devices = this._devicesIn(entry, n.target_layout);
          const online = devices.filter((d) => d.connected).length;
          const statuses = devices.map(deviceStatus);
          const status: Status = statuses.includes("offline")
            ? "offline"
            : statuses.includes("alert")
              ? "alert"
              : statuses.includes("update")
                ? "update"
                : "ok";
          const comment = entry.layouts.find((l) => l.name === n.target_layout)?.comment ?? null;
          return {
            id: n.name, name: n.name, x, y, kind: "site", target: n.target_layout,
            site: { online, total: devices.length, status, comment },
          };
        }
        const device = n.device_key ? byKey.get(n.device_key) : undefined;
        return { id: n.name, name: device?.identity ?? n.name, x, y, kind: device ? "device" : "unknown", device };
      });
      links = entry.links.filter((l) => l.layout === layout);
    }

    const xs = nodes.map((n) => n.x);
    const ys = nodes.map((n) => n.y);
    const minX = Math.min(...xs, 0) - NODE_W / 2 - PAD;
    const minY = Math.min(...ys, 0) - NODE_H / 2 - PAD;
    for (const node of nodes) {
      node.x -= minX;
      node.y -= minY;
    }
    const width = Math.max(...nodes.map((n) => n.x), 0) + NODE_W / 2 + PAD;
    const height = Math.max(...nodes.map((n) => n.y), 0) + NODE_H / 2 + PAD;
    return { layout, nodes, links, width, height };
  }

  /** No CMR layouts: the controller on top, every other device in a row below. */
  private _autoLayout(entry: CmrEntry): { nodes: PlacedNode[]; links: CmrLink[] } {
    const tierOf = (d: CmrDevice) => (d.controller ? 0 : 1);
    const tiers = new Map<number, CmrDevice[]>();
    for (const device of entry.devices) {
      const tier = tierOf(device);
      tiers.set(tier, [...(tiers.get(tier) ?? []), device]);
    }
    // Wrap long rows into a block about twice as wide as tall.
    const perRow = Math.max(4, Math.ceil(Math.sqrt(entry.devices.length * 2.2)));
    const nodes: PlacedNode[] = [];
    let row = 0;
    for (const tier of [...tiers.keys()].sort()) {
      const devices = tiers.get(tier)!.sort((a, b) => a.identity.localeCompare(b.identity));
      for (let start = 0; start < devices.length; start += perRow, row += 1) {
        const line = devices.slice(start, start + perRow);
        const offset = ((Math.min(perRow, entry.devices.length) - line.length) * (NODE_W + 48)) / 2;
        line.forEach((device, i) =>
          nodes.push({
            id: device.key, name: device.identity, kind: "device", device,
            x: offset + i * (NODE_W + 48), y: row * (NODE_H + 90),
          }),
        );
      }
    }
    const controller = entry.devices.find((d) => d.controller);
    const links: CmrLink[] = controller
      ? entry.devices
          .filter((d) => !d.controller)
          .map((d) => ({ id: d.key, layout: AUTO, node1: controller.key, node2: d.key, comment: null, ports: [] }))
      : [];
    return { nodes, links };
  }

  // ------------------------------------------------------------ viewport

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (changed.has("_entry")) this._ruleDevices.invalidate();
  }

  protected updated(): void {
    const viewport = this.renderRoot.querySelector<HTMLElement>(".viewport");
    if (viewport && !this._resize) {
      this._resize = new ResizeObserver(() => {
        this._sizeToLayout();
        if (!this._userMoved) this._fit();
      });
      this._resize.observe(viewport);
    }
    this._sizeToLayout();
    const key = `${this._entry?.entry_id}|${this._path.join("/")}|${this._entry ? this._scene(this._entry).nodes.length : 0}`;
    if (this._entry && key !== this._fittedFor) {
      this._fittedFor = key;
      this._userMoved = false;
      this._fit();
    }
  }

  /**
   * Grow the map to the height the layout needs at the card's width, so a
   * large layout isn't squeezed into a letterbox. Never below `height`,
   * never above `max_height`.
   */
  private _sizeToLayout(): void {
    const viewport = this.renderRoot.querySelector<HTMLElement>(".viewport");
    if (!viewport || !this._entry) return;
    const { width, height } = this._scene(this._entry);
    const vw = viewport.clientWidth;
    if (!vw || !width) return;
    // On a phone the configured height would fill the screen: 240 px to 60 % of it.
    const phone = vw < 600;
    const min = phone ? 240 : (this._config?.height ?? 440);
    const max = phone
      ? Math.max(min, Math.round(window.innerHeight * 0.6))
      : Math.max(min, this._config?.max_height ?? Math.round(window.innerHeight * 0.85));
    const wanted = Math.round(Math.min(max, Math.max(min, (vw * height) / width)));
    if (this._autoHeight === undefined || Math.abs(wanted - this._autoHeight) > 4) this._autoHeight = wanted;
  }

  private _fit(): void {
    const viewport = this.renderRoot.querySelector<HTMLElement>(".viewport");
    if (!viewport || !this._entry) return;
    const { width, height } = this._scene(this._entry);
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    if (!vw || !vh) return;
    const fitAll = Math.min(vw / width, vh / height, 1.2);
    // On a phone a wide layout fitted whole is unreadable: show it as tall as
    // the map allows, at most at full-card size, from its left edge, and pan.
    const k = vw < 600 ? Math.max(fitAll, Math.min(vh / height, NAMES_BELOW)) : fitAll;
    this._fitK = k;
    const next = { k, x: width * k > vw ? 0 : (vw - width * k) / 2, y: (vh - height * k) / 2 };
    if (Math.abs(next.k - this._view.k) > 0.001 || Math.abs(next.x - this._view.x) > 0.5 || Math.abs(next.y - this._view.y) > 0.5) {
      this._view = next;
    }
  }

  private _onWheel(ev: WheelEvent): void {
    // Plain wheel scrolls the dashboard; pinch (ctrl+wheel) or cmd+wheel zooms.
    if (!ev.ctrlKey && !ev.metaKey) return;
    ev.preventDefault();
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    this._zoomAt(ev.clientX - rect.left, ev.clientY - rect.top, Math.exp(-ev.deltaY * 0.0018));
  }

  /** Scale the view by `factor`, keeping the viewport point (px, py) fixed. */
  private _zoomAt(px: number, py: number, factor: number): void {
    const { x, y, k } = this._view;
    const nk = Math.min(4, Math.max(this._minK(), k * factor));
    this._view = { k: nk, x: px - ((px - x) * nk) / k, y: py - ((py - y) * nk) / k };
    this._userMoved = true;
    this._clearHover();
    this._pinned = undefined;
  }

  private _minK(): number {
    return Math.min(0.25, this._fitK * 0.8);
  }

  /** Show these nodes as large as fits (Find on map, Zoom to problems). */
  private _zoomTo(nodes: PlacedNode[]): void {
    const viewport = this.renderRoot.querySelector<HTMLElement>(".viewport");
    if (!viewport || !nodes.length) return;
    const margin = 40;
    const x0 = Math.min(...nodes.map((n) => n.x)) - NODE_W / 2 - margin;
    const x1 = Math.max(...nodes.map((n) => n.x)) + NODE_W / 2 + margin;
    const y0 = Math.min(...nodes.map((n) => n.y)) - NODE_H / 2 - margin;
    const y1 = Math.max(...nodes.map((n) => n.y)) + NODE_H / 2 + margin;
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const k = Math.max(this._minK(), Math.min(vw / (x1 - x0), vh / (y1 - y0), 1.2));
    this._view = { k, x: vw / 2 - ((x0 + x1) / 2) * k, y: vh / 2 - ((y0 + y1) / 2) * k };
    this._userMoved = true;
    this._clearHover();
    this._pinned = undefined;
  }

  /** Point (px, py) in viewport coordinates of a pointer event. */
  private _local(ev: PointerEvent): { x: number; y: number } {
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
  }

  private _onPointerDown(ev: PointerEvent): void {
    if (ev.pointerType === "mouse" && ev.button !== 0) return;
    this._touch = ev.pointerType === "touch";
    // The popover is a control of its own; elsewhere a press closes it.
    if ((ev.target as HTMLElement).closest(".tooltip.pinned, .controls, .find")) return;
    this._clearHover();
    this._pointers.set(ev.pointerId, this._local(ev));
    if (this._pointers.size === 2) {
      // Two fingers: pinch around the point between them.
      const [a, b] = [...this._pointers.values()];
      const { x, y, k } = this._view;
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      this._pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, k, wx: (mid.x - x) / k, wy: (mid.y - y) / k };
      if (this._drag) this._drag.moved = true; // no click at the end of a pinch
      (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
      return;
    }
    this._drag = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, vx: this._view.x, vy: this._view.y, moved: false };
  }

  private _onPointerMove(ev: PointerEvent): void {
    if (ev.pointerType === "mouse") this._touch = false;
    if (this._pointers.has(ev.pointerId)) this._pointers.set(ev.pointerId, this._local(ev));
    const pinch = this._pinch;
    if (pinch && this._pointers.size >= 2) {
      const [a, b] = [...this._pointers.values()];
      const k = Math.min(4, Math.max(this._minK(), (pinch.k * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.dist));
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      // The world point first under the fingers stays under them.
      this._view = { k, x: mid.x - pinch.wx * k, y: mid.y - pinch.wy * k };
      this._userMoved = true;
      this._pinned = undefined;
      return;
    }
    const drag = this._drag;
    if (!drag || drag.id !== ev.pointerId) return;
    const dx = ev.clientX - drag.x;
    const dy = ev.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    if (!drag.moved) (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    drag.moved = true;
    this._userMoved = true;
    this._hover = undefined;
    this._pinned = undefined;
    this._view = { ...this._view, x: drag.vx + dx, y: drag.vy + dy };
  }

  private _onPointerUp(ev: PointerEvent): void {
    this._pointers.delete(ev.pointerId);
    if (this._pinch) {
      if (this._pointers.size < 2) {
        this._pinch = undefined;
        // The finger still down pans on from where it is now.
        const [rest] = [...this._pointers.entries()];
        const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
        this._drag = rest
          ? { id: rest[0], x: rest[1].x + rect.left, y: rest[1].y + rect.top, vx: this._view.x, vy: this._view.y, moved: true }
          : undefined;
      }
      return;
    }
    if (this._drag?.moved && ev.type === "pointerup") {
      // Swallow the click that ends a drag (a cancelled pointer fires no click).
      ev.currentTarget?.addEventListener("click", (e) => e.stopPropagation(), { capture: true, once: true });
    } else if (!this._drag?.moved && ev.type === "pointerup" && !(ev.target as HTMLElement).closest(".node, .tooltip.pinned, .controls, .find")) {
      this._pinned = undefined; // a tap on the empty map closes the popover
    }
    this._drag = undefined;
  }

  private _zoom(factor: number): void {
    const viewport = this.renderRoot.querySelector<HTMLElement>(".viewport");
    if (viewport) this._zoomAt(viewport.clientWidth / 2, viewport.clientHeight / 2, factor);
  }

  /** Double-click: zoom in on that spot (the fit button shows everything again). */
  private _onDoubleClick(ev: MouseEvent): void {
    window.clearTimeout(this._openTimer); // a double-click on a node zooms, it doesn't open it
    if ((ev.target as HTMLElement).closest(".controls, .tooltip.pinned, .find")) return;
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    this._zoomAt(ev.clientX - rect.left, ev.clientY - rect.top, 2);
  }

  private _resetView(): void {
    this._userMoved = false;
    this._fit();
  }

  // ------------------------------------------------------------- actions

  /** A click on a node acts after CLICK_DELAY, unless a double-click (zoom) follows. */
  private _click(node: PlacedNode, ev: MouseEvent): void {
    ev.stopPropagation();
    window.clearTimeout(this._openTimer);
    this._openTimer = window.setTimeout(() => this._open(node), CLICK_DELAY);
  }

  private _open(node: PlacedNode): void {
    if (node.kind === "site" && node.target) {
      this._path = [...(this._path.length ? this._path : [this._currentLayout(this._entry!)]), node.target];
      this._hover = undefined;
      this._pinned = undefined;
    } else if (node.device) {
      this._pinned = { node, ...this._placeBeside(node, 56) };
      this._hover = undefined;
      this._copied = false;
    }
  }

  private _goTo(index: number): void {
    this._path = this._path.slice(0, index + 1);
    this._hover = undefined;
  }

  private _selectRoot(layout: string): void {
    this._path = [layout];
    this._hover = undefined;
  }

  private _onKey = (ev: KeyboardEvent): void => {
    if (ev.key !== "Escape") return;
    this._clearHover();
    this._pinned = undefined;
  };

  private _clearHover = (): void => {
    this._hover = undefined;
    this._hoverLink = undefined;
  };

  private _onNodeKey(ev: KeyboardEvent, node: PlacedNode): void {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      this._open(node);
    }
  }

  private _showHover(node: PlacedNode, ev: Event): void {
    // A finger has no hover: a tap opens the popover instead.
    if (this._drag?.moved || this._touch || this._pinned) return;
    if (!this.renderRoot.querySelector(".viewport")) return;
    this._hover = { node, ...this._placeBeside(node) };
    ev.stopPropagation();
  }

  /** Where a card about `node` goes: beside it, inside the viewport (`extra`: the popover's actions). */
  private _placeBeside(node: PlacedNode, extra = 0): { x: number; y: number } {
    const viewport = this.renderRoot.querySelector<HTMLElement>(".viewport")!;
    const { x, y, k } = this._view;
    // Beside the node (the map is wider than tall), kept inside the viewport.
    const width = 300;
    const product = node.device?.product;
    const links = node.device ? Math.min(9, usedPorts(this._entry!, node.device, this._memoFor(this._entry!).byKey).length) : 0;
    const height = (product?.image_large ? 340 : 230) + (product?.ports ? 70 : 0) + links * 18 + extra;
    const right = (node.x + NODE_W / 2) * k + x + 12;
    const left = (node.x - NODE_W / 2) * k + x - 12 - width;
    const fitsRight = right + width <= viewport.clientWidth - 8;
    const top = (node.y * k + y) - height / 2;
    return {
      x: Math.max(8, fitsRight || left < 8 ? Math.min(right, viewport.clientWidth - width - 8) : left),
      y: Math.max(8, Math.min(top, viewport.clientHeight - height - 8)),
    };
  }

  // -------------------------------------------------------------- render

  protected render(): TemplateResult {
    const entry = this._entry;
    const height = this._config?.height ?? 440;
    if (!entry) return this.renderWaiting(`height:${height}px`);
    const scene = this._scene(entry);
    const roots = this._rootLayouts(entry);
    const crumbs = this._path.length ? this._path : [scene.layout];
    const nodeById = new Map(scene.nodes.map((n) => [n.id, n]));
    const links = scene.links
      .map((link) => this._linkInfo(link, nodeById))
      .filter((info): info is LinkInfo => info !== undefined);
    const legendKinds = LEGEND_KINDS.filter((kind) => links.some((l) => l.kind === kind));
    const { x, y, k } = this._view;
    const layoutInfo = entry.layouts.find((l) => l.name === scene.layout);
    // Highlight from "Show on map": where the rule's state alert is active stays lit, the rest dims.
    const rule = this._alert ? entry.alerts.find((r) => r.id === this._alert) : undefined;
    const ruleState = rule ? (rule.devices_on > 0 ? this._ruleDevices.get(this.hass, entry.entry_id, rule.id) : []) : undefined;
    this._lit = Array.isArray(ruleState) ? new Set(ruleState) : undefined;
    const needle = this._find.trim().toLowerCase();
    const found = needle ? scene.nodes.filter((node) => this._nodeMatches(node, needle)) : [];
    this._found = needle ? new Set(found.map((node) => node.id)) : undefined;
    const problems = scene.nodes.filter((node) =>
      node.device ? deviceStatus(node.device) !== "ok" : node.site ? node.site.status !== "ok" : false,
    );
    const lod = k < DOTS_BELOW ? "lod-dot" : k < NAMES_BELOW ? "lod-text" : "lod-full";

    return html`
      <ha-card>
        <div class="card-header">
          <ha-icon icon="mdi:sitemap-outline"></ha-icon>
          <div class="crumbs">
            ${this._config.title ? html`<span class="title">${this._config.title}</span>` : nothing}
            ${crumbs.map(
              (name, i) => html`
                ${i ? html`<ha-icon class="sep" icon="mdi:chevron-right"></ha-icon>` : nothing}
                <button class="crumb ${i === crumbs.length - 1 ? "current" : ""}" @click=${() => this._goTo(i)}>
                  ${name === AUTO ? "All devices" : name}
                </button>
              `,
            )}
          </div>
          <div class="spacer"></div>
          ${this._canRebuild(entry, scene)
            ? html`<button class="tool" title="Rebuild links from detected ports" aria-label="Rebuild links"
                @click=${() => (this._rebuild = { layout: scene.layout, state: "confirm" })}>
                <ha-icon icon="mdi:cable-data"></ha-icon></button>`
            : nothing}
          ${roots.length > 1
            ? html`<div class="roots">
                ${roots.map(
                  (name) => html`<button class="pill ${crumbs[0] === name ? "on" : ""}" @click=${() => this._selectRoot(name)}>${name}</button>`,
                )}
              </div>`
            : nothing}
        </div>
        ${layoutInfo?.comment ? html`<div class="subtitle">${layoutInfo.comment}</div>` : nothing}
        ${rule
          ? html`<div class="hl">
              <ha-icon icon="mdi:bell-alert-outline"></ha-icon>
              <span>${Array.isArray(ruleState)
                ? `${ruleState.length} device${ruleState.length === 1 ? "" : "s"} where "${rule.name}" is active`
                : ruleState === "loading"
                  ? `Finding the devices where "${rule.name}" is active…`
                  : `The devices where "${rule.name}" is active can't be listed (console access)`}</span>
              <span class="spacer"></span>
              <button class="hl-close" title="Show every device" @click=${() => (this._alert = "")}><ha-icon icon="mdi:close"></ha-icon></button>
            </div>`
          : nothing}
        ${this._rebuild?.layout === scene.layout ? this._renderRebuild(this._rebuild) : nothing}
        ${this.renderStale(entry)}
        <div
          class="viewport"
          style="min-height:${this._autoHeight ?? height}px"
          @wheel=${this._onWheel}
          @pointerdown=${this._onPointerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
          @dblclick=${this._onDoubleClick}
          @mouseleave=${this._clearHover}
        >
          <div
            class="world ${lod}"
            style="width:${scene.width}px;height:${scene.height}px;transform:translate(${x}px,${y}px) scale(${k});--inv:${1 / k}"
          >
            <svg class="wires" width=${scene.width} height=${scene.height}>
              ${links.map((info) => this._renderLink(info))}
            </svg>
            ${this._config.show_ports ? links.map((info) => this._renderPorts(info)) : nothing}
            ${this._config.show_comments ? links.map((info) => this._renderComment(info)) : nothing}
            ${scene.nodes.map((node) => this._renderNode(node))}
          </div>
          ${scene.nodes.length
            ? nothing
            : html`<div class="nothing">${scene.layout === AUTO ? "No devices on the controller yet." : "This layout has no nodes yet."}</div>`}
          ${this._pinned ? this._renderTooltip(this._pinned, true) : nothing}
          ${this._hover && !this._pinned ? this._renderTooltip(this._hover) : nothing}
          ${this._hoverLink && !this._hover && !this._pinned ? this._renderLinkTooltip(this._hoverLink) : nothing}
          ${scene.nodes.length > 1
            ? html`<div class="find">
                <ha-icon icon="mdi:magnify"></ha-icon>
                <input type="search" placeholder="Find on map" aria-label="Find on map" .value=${this._find}
                  @input=${(e: Event) => (this._find = (e.target as HTMLInputElement).value)}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === "Enter") this._zoomTo(found);
                    if (e.key === "Escape") this._find = "";
                  }} />
                ${needle ? html`<span class="hits">${found.length}</span>` : nothing}
              </div>`
            : nothing}
          <div class="controls">
            <button title="Zoom in (or double-click the map)" @click=${() => this._zoom(1.6)}><ha-icon icon="mdi:plus"></ha-icon></button>
            <button title="Zoom out" @click=${() => this._zoom(1 / 1.6)}><ha-icon icon="mdi:minus"></ha-icon></button>
            <button title="Show the whole map" @click=${this._resetView}><ha-icon icon="mdi:fit-to-screen-outline"></ha-icon></button>
            ${problems.length
              ? html`<button class="problems" title="Zoom to what needs attention (${problems.length})" @click=${() => this._zoomTo(problems)}>
                  <ha-icon icon="mdi:alert-circle-outline"></ha-icon></button>`
              : nothing}
          </div>
          <div class="legend">
            ${(["ok", "update", "alert", "offline"] as Status[]).map(
              (s) => html`<span class="status-${s}"><i class="dot"></i>${STATUS_LABEL[s]}</span>`,
            )}
            ${legendKinds.map(
              (kind) => html`<span><i class="wire-sample k-${kind}"></i>${KIND_LABEL[kind]}</span>`,
            )}
            ${links.some((l) => l.poe) ? html`<span><i class="poe-sample"></i>PoE power</span>` : nothing}
          </div>
        </div>
      </ha-card>
    `;
  }

  /** Rebuild links needs actions, an administrator and two devices on a real layout. */
  private _canRebuild(entry: CmrEntry, scene: Scene): boolean {
    return entry.actions && !!this.hass.user?.is_admin && scene.layout !== AUTO
      && scene.nodes.filter((n) => n.kind === "device").length > 1;
  }

  private _renderRebuild(bar: NonNullable<CmrTopologyCard["_rebuild"]>): TemplateResult {
    const close = html`<button class="hl-close" title="Close" @click=${() => (this._rebuild = undefined)}>
      <ha-icon icon="mdi:close"></ha-icon></button>`;
    if (bar.state === "confirm") {
      return html`<div class="hl rebuild">
        <ha-icon icon="mdi:cable-data"></ha-icon>
        <span>Create the links of <b>${bar.layout}</b> from the ports the controller detected between its devices?</span>
        <span class="spacer"></span>
        <button class="pill on" @click=${() => this._rebuildLinks(bar.layout)}>Rebuild links</button>
        ${close}
      </div>`;
    }
    return html`<div class="hl rebuild ${bar.state}">
      <ha-icon icon=${bar.state === "error" ? "mdi:alert-circle-outline" : "mdi:cable-data"}></ha-icon>
      <span>${bar.state === "busy" ? `Rebuilding the links of ${bar.layout}…` : bar.text}</span>
      <span class="spacer"></span>
      ${bar.state === "busy" ? nothing : close}
    </div>`;
  }

  private async _rebuildLinks(layout: string): Promise<void> {
    this._rebuild = { layout, state: "busy" };
    try {
      await this.hass.connection.sendMessagePromise({ type: "cmr/rebuild_links", entry_id: this._entry!.entry_id, layout });
      this._rebuild = {
        layout, state: "done",
        text: "Links rebuilt. Connections the controller can't see (a VPN, a switch it doesn't manage) stay yours to draw.",
      };
    } catch (err) {
      this._rebuild = { layout, state: "error", text: (err as { message?: string })?.message ?? String(err) };
    }
  }

  private _linkState(a?: PlacedNode, b?: PlacedNode): "up" | "down" | "unknown" {
    const ok = (n?: PlacedNode) =>
      n?.kind === "device" ? n.device!.connected : n?.kind === "site" ? n.site!.online > 0 : undefined;
    const sa = ok(a);
    const sb = ok(b);
    if (sa === false || sb === false) return "down";
    if (sa === undefined || sb === undefined) return "unknown";
    return "up";
  }

  private _linkInfo(link: CmrLink, nodes: Map<string, PlacedNode>): LinkInfo | undefined {
    const a = nodes.get(link.node1);
    const b = nodes.get(link.node2);
    if (!a || !b) return undefined;
    let ports: PortPair[] = link.ports;
    let endNames: [string, string] = [a.name, b.name];
    let siteLink = false;
    let via: Cable | undefined;
    if (!ports.length && a.kind === "site" && b.kind === "site") {
      // A link between two layouts: use the device cable that joins them.
      siteLink = true;
      via = this._cableBetween(a.target!, b.target!);
      if (via) {
        ports = via.ports;
        endNames = via.names;
      }
    }
    const pair = ports[0];
    let kind: LinkKind;
    if (pair) {
      const media = [portMedium(pair.a.interface), portMedium(pair.b.interface)];
      kind = media.includes("fiber")
        ? "fiber"
        : media.includes("wireless")
          ? "wireless"
          : media.every((m) => m === "copper")
            ? "copper"
            : "logical";
    } else {
      kind = siteLink && !via ? "uplink" : "unknown";
    }
    let poe: LinkInfo["poe"];
    if (pair?.a.poe === "powered-on") poe = { from: a, to: b, port: pair.a.interface };
    else if (pair?.b.poe === "powered-on") poe = { from: b, to: a, port: pair.b.interface };
    return { link, a, b, state: this._linkState(a, b), kind, ports, endNames, poe };
  }

  /** The device-to-device link joining two layouts, oriented from the first. */
  private _cableBetween(layoutA: string, layoutB: string): Cable | undefined {
    const entry = this._entry!;
    const memo = this._memoFor(entry);
    const cacheKey = `${layoutA}\u0000${layoutB}`;
    if (memo.cables.has(cacheKey)) return memo.cables.get(cacheKey);
    const inA = new Set(this._devicesIn(entry, layoutA).map((d) => d.key));
    const inB = new Set(this._devicesIn(entry, layoutB).map((d) => d.key));
    const nodeKey = new Map(entry.nodes.map((n) => [`${n.layout}\u0000${n.name}`, n.device_key]));
    const byKey = memo.byKey;
    let best: Cable | undefined;
    for (const link of entry.links) {
      const k1 = nodeKey.get(`${link.layout}\u0000${link.node1}`);
      const k2 = nodeKey.get(`${link.layout}\u0000${link.node2}`);
      if (!k1 || !k2) continue;
      const forward = inA.has(k1) && inB.has(k2);
      if (!forward && !(inA.has(k2) && inB.has(k1))) continue;
      const [ka, kb] = forward ? [k1, k2] : [k2, k1];
      const ports = forward ? link.ports : link.ports.map((p) => ({ a: p.b, b: p.a }));
      const candidate = {
        ports,
        names: [byKey.get(ka)?.identity ?? ka, byKey.get(kb)?.identity ?? kb] as [string, string],
      };
      if (!best || (ports.length && !best.ports.length)) best = candidate;
    }
    memo.cables.set(cacheKey, best);
    return best;
  }

  private _renderLink(info: LinkInfo) {
    const { a, b, state, kind, poe } = info;
    const d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
    // A steady flow marks a live, detected cable; the counters the controller
    // reports are totals since boot, not rates, so they don't set the speed.
    const moving = state === "up" && kind !== "unknown" && kind !== "logical";
    return svg`
      <g class="link ${state} k-${kind}"
         @mouseenter=${(e: MouseEvent) => this._showLinkHover(info, e)}
         @mouseleave=${() => (this._hoverLink = undefined)}>
        <path class="hit" d=${d}></path>
        <path class="wire" d=${d}></path>
        ${kind === "fiber" ? svg`<path class="core" d=${d}></path>` : nothing}
        ${moving ? svg`<path class="flow" d=${d}></path>` : nothing}
        ${poe && state === "up"
          ? svg`<circle class="power" r="3.6">
              <animateMotion dur="2.2s" repeatCount="indefinite"
                path=${`M ${poe.from.x} ${poe.from.y} L ${poe.to.x} ${poe.to.y}`}></animateMotion>
            </circle>`
          : nothing}
      </g>
    `;
  }

  private _renderPorts(info: LinkInfo) {
    const pair = info.ports[0];
    if (!pair) return nothing;
    const { a, b } = info;
    let chips = [
      this._chip(a, b, pair.a, info.poe?.from === a),
      this._chip(b, a, pair.b, info.poe?.from === b),
    ];
    // A short cable has no room for both names in line: move them to opposite
    // sides of it, each still next to its own device.
    if (boxesOverlap(chips[0].box, chips[1].box)) {
      chips = [
        this._chip(a, b, pair.a, info.poe?.from === a, -1),
        this._chip(b, a, pair.b, info.poe?.from === b, 1),
      ];
    }
    return html`${chips.map((chip) => chip.html)}`;
  }

  /**
   * A port name chip where the cable leaves `from`. With `side`, the chip sits
   * beside the cable (-1 above/left, 1 below/right) instead of on it.
   */
  private _chip(from: PlacedNode, to: PlacedNode, end: PortEnd, poeOut: boolean, side?: -1 | 1) {
    const p = edgePoint(from.x, from.y, to.x - from.x, to.y - from.y, side ? 4 : 8);
    const w = end.interface.length * 6.6 + 12 + (poeOut ? 13 : 0);
    const h = 18;
    const horizontal = Math.abs(p.ux) >= Math.abs(p.uy);
    // Fractions of the chip's own size to shift by, like text-anchor.
    let fx = Math.abs(p.ux) < 0.35 ? -0.5 : p.ux > 0 ? 0 : -1;
    let fy = Math.abs(p.uy) < 0.35 ? -0.5 : p.uy > 0 ? 0 : -1;
    let dx = 0;
    let dy = 0;
    if (side) {
      if (horizontal) {
        fy = side < 0 ? -1 : 0;
        dy = side * 3;
      } else {
        fx = side < 0 ? -1 : 0;
        dx = side * 4;
      }
    }
    const x0 = p.x + fx * w + dx;
    const y0 = p.y + fy * h + dy;
    return {
      box: { x0, y0, x1: x0 + w, y1: y0 + h },
      html: html`<div class="port m-${portMedium(end.interface)} ${poeOut ? "poe" : ""}"
        style="left:${p.x + dx}px;top:${p.y + dy}px;transform:translate(${fx * 100}%,${fy * 100}%)"
        title=${poeOut ? `${end.interface}: PoE out, powers ${to.name}` : `${end.interface} (${from.name})`}>
        ${poeOut ? html`<ha-icon icon="mdi:flash"></ha-icon>` : nothing}${end.interface}
      </div>`,
    };
  }

  private _renderComment(info: LinkInfo) {
    const { a, b, link } = info;
    // Detected ports say more than a comment; it stays in the hover details.
    if (!link.comment || (info.ports.length && this._config.show_ports)) return nothing;
    return html`<div class="comment" style="left:${(a.x + b.x) / 2}px;top:${(a.y + b.y) / 2}px" title=${link.comment}>
      ${link.comment}
    </div>`;
  }

  private _showLinkHover(info: LinkInfo, ev: MouseEvent): void {
    if (this._drag?.moved) return;
    const viewport = this.renderRoot.querySelector<HTMLElement>(".viewport");
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    this._hoverLink = { info, x: ev.clientX - rect.left, y: ev.clientY - rect.top + 14 };
  }

  private _renderLinkTooltip(hover: { info: LinkInfo; x: number; y: number }): TemplateResult {
    const { info } = hover;
    const { a, b, link, poe, ports, endNames } = info;
    const traffic = (end: PortEnd) =>
      end.tx || end.rx ? html`<span class="mono">↑ ${end.tx ?? "–"} · ↓ ${end.rx ?? "–"}</span>` : "–";
    return html`<div class="tooltip" style="left:${Math.max(8, hover.x - 150)}px;top:${hover.y}px">
      <div class="tt-title">${a.name} ↔ ${b.name}</div>
      ${link.comment ? html`<div class="muted">${link.comment}</div>` : nothing}
      <table>
        <tr><td>Medium</td><td>${KIND_LABEL[info.kind]}</td></tr>
        ${ports.map(
          (pair) => html`
            <tr><td>${endNames[0]}</td><td class="mono">${pair.a.interface}</td></tr>
            <tr><td>${endNames[1]}</td><td class="mono">${pair.b.interface}</td></tr>
          `,
        )}
        ${poe
          ? html`<tr><td>Power</td><td><ha-icon class="inline poe" icon="mdi:flash"></ha-icon>
              ${poe.from === a ? endNames[0] : endNames[1]} <span class="mono">${poe.port}</span>
              powers ${poe.to === a ? endNames[0] : endNames[1]}</td></tr>`
          : nothing}
        ${ports[0]
          ? html`<tr><td>Traffic</td><td>${endNames[0]}: ${traffic(ports[0].a)}<br />${endNames[1]}: ${traffic(ports[0].b)}</td></tr>`
          : nothing}
      </table>
    </div>`;
  }

  private _renderNode(node: PlacedNode): TemplateResult {
    const style = `left:${node.x - NODE_W / 2}px;top:${node.y - NODE_H / 2}px;width:${NODE_W}px;height:${NODE_H}px`;
    if (node.kind === "site") {
      const site = node.site!;
      return html`
        <div class="node site status-${site.status} ${this._found && !this._found.has(node.id) ? "dim" : ""}" style=${style}
             role="button" tabindex="0" aria-label="${node.name}, ${site.online} of ${site.total} online, open layout"
             @click=${(e: MouseEvent) => this._click(node, e)} @keydown=${(e: KeyboardEvent) => this._onNodeKey(e, node)}
             @mouseenter=${(e: MouseEvent) => this._showHover(node, e)} @mouseleave=${this._clearHover}
             @focus=${(e: Event) => this._showHover(node, e)} @blur=${this._clearHover}>
          <i class="pin"></i>
          <div class="badge"><ha-icon icon=${this._config.icons?.[node.name] ?? DEFAULT_SITE_ICON}></ha-icon></div>
          <div class="text">
            <div class="name">${node.name}</div>
            <div class="sub"><i class="dot"></i>${site.online}/${site.total} online</div>
          </div>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        </div>
      `;
    }
    if (node.kind === "unknown" || !node.device) {
      return html`
        <div class="node unknown ${this._found && !this._found.has(node.id) ? "dim" : ""}" style=${style} title="Not a CMR-managed device">
          <i class="pin"></i>
          <div class="badge"><ha-icon icon="mdi:help-network-outline"></ha-icon></div>
          <div class="text"><div class="name">${node.name}</div><div class="sub">Not managed</div></div>
        </div>
      `;
    }
    const device = node.device;
    const status = deviceStatus(device);
    const dim = (this._lit && !this._lit.has(device.key)) || (this._found && !this._found.has(node.id));
    return html`
      <div class="node device status-${status} ${device.controller ? "controller" : ""} ${dim ? "dim" : ""}" style=${style}
           role="button" tabindex="0" aria-label="${device.identity}, ${STATUS_LABEL[status]}"
           @click=${(e: MouseEvent) => this._click(node, e)} @keydown=${(e: KeyboardEvent) => this._onNodeKey(e, node)}
           @mouseenter=${(e: MouseEvent) => this._showHover(node, e)} @mouseleave=${this._clearHover}
           @focus=${(e: Event) => this._showHover(node, e)} @blur=${this._clearHover}>
        <i class="pin"></i>
        ${deviceVisual(device)}
        <div class="text">
          <div class="name">${device.identity}</div>
          <div class="sub">${modelName(device)}</div>
          <div class="ver mono" title=${device.update_available ? `${device.version} → ${device.available_version}` : ""}>
            ${device.update_available
              ? html`<span class="up"><ha-icon icon="mdi:arrow-up-circle"></ha-icon>${device.available_version}</span>`
              : (device.version ?? "–")}
          </div>
        </div>
        ${device.controller
          ? html`<span class="crown" title="CMR controller"><ha-icon icon="mdi:crown-outline"></ha-icon></span>`
          : nothing}
        ${device.alerts?.on ? html`<span class="count" title="Active alerts">${device.alerts.on}</span>` : nothing}
      </div>
    `;
  }

  /**
   * A node's card: on hover a read-only tooltip; `pinned` (after a click or
   * tap) the device popover, with the address to copy and onward links.
   */
  private _renderTooltip(hover: { node: PlacedNode; x: number; y: number }, pinned = false): TemplateResult {
    const { node } = hover;
    let body: TemplateResult;
    if (node.kind === "site") {
      const site = node.site!;
      body = html`
        <div class="tt-title">${node.name}</div>
        ${site.comment ? html`<div class="muted">${site.comment}</div>` : nothing}
        <div>${site.online} of ${site.total} devices online</div>
        <div class="muted">Click to open this layout</div>
      `;
    } else if (node.device) {
      const d = node.device;
      const entry = this._entry!;
      const used = usedPorts(entry, d, this._memoFor(entry).byKey);
      body = html`
        <div class="tt-title">${d.identity}${d.controller ? html` <span class="chip">controller</span>` : nothing}</div>
        ${d.product?.image_large
          ? html`<div class="tt-photo"><img src=${d.product.image_large} alt="" referrerpolicy="no-referrer" /></div>`
          : nothing}
        <div class="muted">${[modelName(d), modelCode(d), d.arch].filter(Boolean).join(" · ")}</div>
        ${d.product?.ports
          ? html`${renderFrontPanel(d.product, used)}<div class="muted tt-ports">${portSummary(d.product.ports)}</div>`
          : nothing}
        <table>
          <tr><td>Status</td><td class="status-${deviceStatus(d)}"><i class="dot"></i> ${STATUS_LABEL[deviceStatus(d)]}${pairingHint(d) ? ` (${pairingHint(d)})` : ""}${d.stale ? " · stale data" : ""}</td></tr>
          ${d.connected && d.connected_time != null ? html`<tr><td>Connected</td><td>for ${formatDuration(d.connected_time)}</td></tr>` : nothing}
          <tr><td>Version</td><td class="mono">${d.version ?? "–"}</td></tr>
          <tr><td>Channel</td><td>${d.channel ?? "–"}${d.available_version && d.available_version !== d.version
            ? html` <span class="muted">(${d.update_available ? "update to" : "offers"} <span class="mono">${d.available_version}</span>)</span>`
            : nothing}</td></tr>
          ${d.address
            ? html`<tr><td>Address</td><td><span class="mono">${d.address}</span>${pinned && navigator.clipboard
                ? html`<button class="copy" title="Copy the address" @click=${() => this._copy(d.address!)}>
                    ${this._copied ? "copied" : html`<ha-icon icon="mdi:content-copy"></ha-icon>`}</button>`
                : nothing}</td></tr>`
            : nothing}
          <tr><td>Uptime</td><td>${formatDuration(d.uptime)}</td></tr>
          ${d.labels.length ? html`<tr><td>Labels</td><td>${d.labels.map((l) => html`<span class="chip">${l}</span> `)}</td></tr>` : nothing}
          ${d.alerts ? html`<tr><td>Alerts</td><td>${d.alerts.on} active of ${d.alerts.total} rules</td></tr>` : nothing}
          ${used.length
            ? html`<tr><td>Links</td><td>
                ${used.slice(0, 8).map(
                  (p) => html`<div>
                    <span class="mono">${p.interface}</span>${p.poe
                      ? html` <ha-icon class="inline poe" icon="mdi:flash"></ha-icon>`
                      : nothing}
                    → ${p.peer}${p.up === false ? html` <span class="muted">(down)</span>` : nothing}
                  </div>`,
                )}
                ${used.length > 8 ? html`<div class="muted">and ${used.length - 8} more</div>` : nothing}
              </td></tr>`
            : nothing}
        </table>
        ${pinned ? this._popoverActions(d) : nothing}
      `;
    } else {
      return html``;
    }
    // The popover scrolls inside the room below its top edge.
    const room = pinned ? `;max-height:calc(100% - ${hover.y + 8}px)` : "";
    return html`<div class="tooltip ${pinned ? "pinned" : ""}" style="left:${Math.max(8, hover.x)}px;top:${hover.y}px${room}"
        role=${pinned ? "dialog" : nothing} aria-label=${pinned ? node.name : nothing}>
      ${pinned
        ? html`<button class="pop-close" title="Close" @click=${() => (this._pinned = undefined)}><ha-icon icon="mdi:close"></ha-icon></button>`
        : nothing}
      ${body}
    </div>`;
  }

  /** Onward from the popover: install the update, the device in Home Assistant, the device table. */
  private _popoverActions(d: CmrDevice): TemplateResult {
    const devicesView = this._config.views?.devices;
    const e = d.entities;
    return html`<div class="pop-actions">
      ${d.update_available && e.update
        ? html`<button class="pill on" @click=${() => moreInfo(this, e.update)}><ha-icon icon="mdi:arrow-up-circle"></ha-icon>Update</button>`
        : nothing}
      ${d.device_id
        ? html`<button class="pill" @click=${() => navigate(`/config/devices/device/${d.device_id}`)}>Device page</button>`
        : nothing}
      ${devicesView
        ? html`<button class="pill" @click=${() => navigate(viewPath(devicesView, { cmr_search: d.identity }))}>In Devices</button>`
        : nothing}
      ${e.connected
        ? html`<button class="pill" @click=${() => moreInfo(this, e.connected)}>History</button>`
        : nothing}
    </div>`;
  }

  private async _copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this._copied = true;
    } catch {
      this._copied = false;
    }
  }

  static styles = [
    baseStyles,
    frontPanelStyles,
    css`
      .card-header { padding-bottom: 4px; flex-wrap: wrap; }
      .crumbs { display: flex; align-items: center; gap: 2px; min-width: 0; flex-wrap: wrap; }
      .title { margin-right: 8px; }
      .crumb {
        all: unset; cursor: pointer; padding: 2px 6px; border-radius: 6px;
        color: var(--cmr-muted); font-size: 15px;
      }
      .crumb:hover { background: var(--cmr-surface-2); color: var(--primary-text-color); }
      .crumb.current { color: var(--primary-text-color); font-weight: 500; }
      .sep { --mdc-icon-size: 16px; color: var(--cmr-muted); }
      .roots { display: flex; gap: 4px; flex-wrap: wrap; }
      .subtitle { padding: 0 16px 6px; font-size: 12px; color: var(--cmr-muted); }
      .nothing { position: absolute; inset: 0; display: grid; place-items: center; color: var(--cmr-muted); pointer-events: none; }

      ha-card { display: flex; flex-direction: column; }
      .viewport {
        flex: 1 1 auto;
        /* One finger pans the map and two zoom it, as in Home Assistant's own map card. */
        position: relative; overflow: hidden; cursor: grab; touch-action: none;
        background:
          radial-gradient(circle, var(--cmr-line) 1px, transparent 1.2px) 0 0 / 22px 22px;
        border-top: 1px solid var(--cmr-line);
      }
      .viewport:active { cursor: grabbing; }
      .world { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
      .wires { position: absolute; inset: 0; overflow: visible; }

      .wires { pointer-events: none; }
      .link .hit { stroke: transparent; stroke-width: 16; fill: none; pointer-events: stroke; cursor: help; }
      .link .wire { stroke: var(--cmr-muted); stroke-width: 3; fill: none; opacity: 0.45; stroke-linecap: round; }
      .link.k-fiber .wire { stroke: var(--cmr-fiber); stroke-width: 5; opacity: 0.8; }
      .link .core { stroke: var(--cmr-surface); stroke-width: 1.4; fill: none; opacity: 0.9; }
      .link.k-wireless .wire { stroke: var(--cmr-update); stroke-dasharray: 1 6; stroke-width: 3; opacity: 0.7; }
      .link.k-unknown .wire, .link.k-logical .wire { stroke-dasharray: 2 7; stroke-width: 2.4; }
      .link.down .wire { stroke: var(--cmr-offline); opacity: 0.75; }
      .link .flow {
        stroke: var(--cmr-ok); stroke-width: 3; fill: none; stroke-dasharray: 5 19; stroke-linecap: round;
        animation: flow 1.6s linear infinite; opacity: 0.9;
      }
      .link.k-fiber .flow { stroke: var(--cmr-surface); stroke-width: 2; opacity: 1; }
      @keyframes flow { to { stroke-dashoffset: -24; } }
      .link .power { fill: var(--cmr-poe); filter: drop-shadow(0 0 3px var(--cmr-poe)); }
      @media (prefers-reduced-motion: reduce) {
        .link .flow { animation: none; }
        .link .power { display: none; }
      }
      .port {
        position: absolute; display: inline-flex; align-items: center; gap: 2px; white-space: nowrap;
        font: 600 10.5px/16px var(--cmr-mono); padding: 0 5px; border-radius: 6px;
        background: var(--cmr-surface); border: 1px solid var(--cmr-line); color: var(--cmr-muted);
        --mdc-icon-size: 12px;
      }
      .port.m-fiber { border-color: color-mix(in srgb, var(--cmr-fiber) 60%, transparent); color: var(--primary-text-color); }
      .port.poe { border-color: color-mix(in srgb, var(--cmr-poe) 70%, transparent); color: var(--primary-text-color); }
      .port.poe ha-icon, ha-icon.poe { color: var(--cmr-poe); }
      ha-icon.inline { --mdc-icon-size: 14px; vertical-align: -2px; }
      .comment {
        position: absolute; transform: translate(-50%, -50%); max-width: 170px;
        padding: 2px 8px; border-radius: 999px; font-size: 10.5px; line-height: 15px;
        background: var(--cmr-surface); border: 1px solid var(--cmr-line); color: var(--cmr-muted);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: auto;
      }

      .node {
        position: absolute; box-sizing: border-box; display: flex; align-items: center; gap: 10px;
        padding: 8px 10px; border-radius: 14px; cursor: pointer; user-select: none;
        background: var(--cmr-surface); border: 1px solid var(--cmr-line);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 14px rgba(0, 0, 0, 0.06);
        transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
      }
      .node:hover { transform: translateY(-1px); border-color: var(--status, var(--primary-color)); box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
      .node:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
      .node .badge {
        position: relative; flex: none; width: 42px; height: 42px; border-radius: 11px;
        display: grid; place-items: center;
        background: color-mix(in srgb, var(--status, var(--cmr-muted)) 14%, transparent);
        color: var(--status, var(--cmr-muted));
      }
      .node .badge.photo { overflow: visible; }
      .node .badge.photo img { border-radius: 11px; }
      .node .badge::after {
        content: ""; position: absolute; right: -3px; bottom: -3px; width: 11px; height: 11px;
        border-radius: 50%; background: var(--status, var(--cmr-muted)); border: 2px solid var(--cmr-surface);
      }
      .node.status-alert .badge::after, .node.status-offline .badge::after { animation: pulse 1.8s ease-out infinite; }
      /* An offline device also loses its colour, so red-dot-offline and amber-dot-alert never look alike. */
      .node.status-offline .badge img, .node.status-offline .badge ha-icon { filter: grayscale(1); opacity: 0.55; }
      .node.status-offline .name { color: var(--cmr-muted); }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--status) 60%, transparent); }
        100% { box-shadow: 0 0 0 9px transparent; }
      }
      .node .text { min-width: 0; flex: 1; }
      .node .name { font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .node .sub { font-size: 11px; color: var(--cmr-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 5px; }
      .node .ver { font-size: 10.5px; color: var(--cmr-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .node .ver .up { color: var(--cmr-update); font-weight: 600; display: inline-flex; align-items: center; gap: 2px; --mdc-icon-size: 12px; }
      .node.controller { border-color: color-mix(in srgb, var(--primary-color) 50%, var(--cmr-line)); }
      .node .crown { position: absolute; top: -10px; right: 10px; color: var(--primary-color); background: var(--cmr-surface); border-radius: 50%; padding: 1px; --mdc-icon-size: 16px; line-height: 0; }
      .node .count {
        position: absolute; top: -8px; left: 32px; min-width: 18px; height: 18px; border-radius: 9px;
        background: var(--cmr-alert); color: #fff; font-size: 11px; font-weight: 700; display: grid; place-items: center; padding: 0 4px;
      }
      .node.site { border-style: dashed; border-width: 1.5px; }

      /* Level of detail: zoomed far out a node is a status dot of constant
         screen size (--inv is 1/zoom), then its name only, then the card. */
      .node .pin { display: none; }
      .lod-dot .node { background: none; border-color: transparent; box-shadow: none; }
      .lod-dot .node > :not(.pin) { visibility: hidden; }
      .lod-dot .node .pin {
        display: block; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
        width: calc(12px * var(--inv)); height: calc(12px * var(--inv)); border-radius: 50%;
        background: var(--status, var(--cmr-muted)); box-shadow: 0 0 0 calc(2px * var(--inv)) var(--cmr-surface);
      }
      .lod-dot .port, .lod-dot .comment, .lod-text .port, .lod-text .comment { display: none; }
      .lod-text .node .badge, .lod-text .node .sub, .lod-text .node .ver, .lod-text .node .chev,
      .lod-text .node .crown, .lod-text .node .count { display: none; }
      /* Names only: the status dot (the same one the far zoom draws) leads the name. */
      .lod-text .node { justify-content: center; border-color: color-mix(in srgb, var(--status, var(--cmr-line)) 45%, var(--cmr-line)); }
      .lod-text .node .pin {
        display: block; flex: none; width: 14px; height: 14px; border-radius: 50%;
        background: var(--status, var(--cmr-muted));
      }
      .lod-text .node .name { font-size: 18px; text-align: center; }

      .find {
        position: absolute; left: 10px; top: 10px; z-index: 2; display: flex; align-items: center; gap: 6px;
        padding: 4px 8px; border-radius: 10px; background: var(--cmr-surface); border: 1px solid var(--cmr-line);
        color: var(--cmr-muted); --mdc-icon-size: 16px; cursor: auto;
      }
      .find input { all: unset; width: 130px; font-size: 13px; color: var(--primary-text-color); }
      .find .hits { font-size: 11px; font-variant-numeric: tabular-nums; }
      .controls .problems { color: var(--cmr-alert); }

      .tooltip.pinned { pointer-events: auto; z-index: 4; overflow: auto; cursor: auto; box-sizing: border-box; }
      .pop-close {
        all: unset; cursor: pointer; position: absolute; top: 6px; right: 6px; line-height: 0; padding: 3px;
        border-radius: 50%; color: var(--cmr-muted); --mdc-icon-size: 18px;
      }
      .pop-close:hover { color: var(--primary-text-color); background: var(--cmr-surface-2); }
      .pop-actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; --mdc-icon-size: 16px; }
      .copy {
        all: unset; cursor: pointer; margin-left: 6px; color: var(--cmr-muted); font-size: 11px;
        --mdc-icon-size: 14px; vertical-align: -2px;
      }
      .copy:hover { color: var(--primary-text-color); }
      .node.site .chev { color: var(--cmr-muted); --mdc-icon-size: 20px; }
      .node.unknown { opacity: 0.6; cursor: default; }
      .node.dim { opacity: 0.18; filter: grayscale(1); }
      .node.dim .badge::after { animation: none; }
      .hl {
        display: flex; align-items: center; gap: 8px; margin: 0 16px 8px; padding: 6px 10px; border-radius: 10px;
        font-size: 13px; background: color-mix(in srgb, var(--cmr-alert) 10%, transparent); --mdc-icon-size: 18px;
      }
      .hl > ha-icon { color: var(--cmr-alert); }
      .hl-close { all: unset; cursor: pointer; line-height: 0; color: var(--cmr-muted); border-radius: 50%; padding: 2px; }
      .hl-close:hover { color: var(--primary-text-color); background: var(--cmr-surface-2); }
      .hl.rebuild { background: var(--cmr-surface-2); }
      .hl.rebuild > ha-icon { color: var(--cmr-muted); }
      .hl.rebuild.error > ha-icon { color: var(--cmr-offline); }
      .tool {
        all: unset; cursor: pointer; line-height: 0; padding: 5px; border-radius: 8px;
        color: var(--cmr-muted); --mdc-icon-size: 18px;
      }
      .tool:hover { color: var(--primary-text-color); background: var(--cmr-surface-2); }

      .tooltip {
        position: absolute; z-index: 3; width: 300px; padding: 10px 12px; border-radius: 12px;
        background: var(--cmr-surface); border: 1px solid var(--cmr-line);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18); font-size: 12px; pointer-events: none;
      }
      .tooltip .tt-title { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
      .tt-photo {
        height: 110px; margin: -2px -4px 8px; border-radius: 9px; display: grid; place-items: center;
        background: var(--cmr-pedestal);
      }
      .tt-photo img { max-width: 88%; max-height: 92px; object-fit: contain; mix-blend-mode: multiply; }
      .tooltip table { width: 100%; border-collapse: collapse; margin-top: 6px; }
      .tooltip td { padding: 2px 0; vertical-align: top; }
      .tooltip td:first-child { color: var(--cmr-muted); width: 1%; white-space: nowrap; padding-right: 12px; }
      .tooltip td i.dot { display: inline-block; }
      .tt-ports { text-align: center; font-size: 11px; }

      .controls { position: absolute; right: 10px; top: 10px; display: flex; flex-direction: column; gap: 4px; }
      .controls button {
        all: unset; cursor: pointer; width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center;
        background: var(--cmr-surface); border: 1px solid var(--cmr-line); color: var(--cmr-muted); --mdc-icon-size: 18px;
      }
      .controls button:hover { color: var(--primary-text-color); }
      .legend {
        position: absolute; left: 10px; bottom: 8px; display: flex; flex-wrap: wrap; gap: 4px 12px;
        font-size: 11px; color: var(--cmr-muted); background: color-mix(in srgb, var(--cmr-surface) 85%, transparent);
        padding: 4px 8px; border-radius: 8px; pointer-events: none;
      }
      .legend span { display: inline-flex; align-items: center; gap: 5px; }
      .wire-sample { display: inline-block; width: 18px; height: 0; border-top: 3px solid var(--cmr-muted); opacity: 0.8; }
      .wire-sample.k-fiber { border-top: 4px solid var(--cmr-fiber); }
      .wire-sample.k-wireless { border-top: 3px dotted var(--cmr-update); }
      .wire-sample.k-unknown { border-top: 2.5px dashed var(--cmr-muted); }
      .poe-sample { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--cmr-poe); box-shadow: 0 0 4px var(--cmr-poe); }
      @media (max-width: 600px) {
        .legend { font-size: 10px; gap: 2px 8px; max-width: calc(100% - 64px); }
        .find input { width: 84px; }
      }
    `,
  ];
}
