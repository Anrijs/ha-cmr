import { css, html, nothing, svg, type PropertyDeclarations, type TemplateResult } from "lit";
import {
  CmrEntryCard,
  ENTRY_FIELD,
  STATUS_LABEL,
  baseStyles,
  deviceStatus,
  deviceVisual,
  formatDuration,
  labelsFrom,
  modelCode,
  modelName,
  moreInfo,
  type Status,
} from "./shared";
import type { CmrDevice, CmrEntry, CmrLink, CmrNode, PortEnd } from "./types";

interface TopologyConfig {
  type: string;
  entry_id?: string;
  layout?: string;
  title?: string;
  height?: number;
  show_ports?: boolean;
  show_comments?: boolean;
  /** Icons for layout (building) nodes by name, e.g. { House: "mdi:home" }. */
  icons?: Record<string, string>;
}

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
  };

  declare _path: string[];
  declare _hover?: { node: PlacedNode; x: number; y: number };
  declare _hoverLink?: { info: LinkInfo; x: number; y: number };
  declare _view: { x: number; y: number; k: number };

  private _memo?: SceneMemo;
  private _userMoved = false;
  private _drag?: { id: number; x: number; y: number; vx: number; vy: number; moved: boolean };
  private _resize?: ResizeObserver;
  private _fittedFor = "";

  constructor() {
    super();
    this._path = [];
    this._view = { x: 0, y: 0, k: 1 };
  }

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
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._onKey);
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
    const widest = Math.max(...[...tiers.values()].map((t) => t.length), 1);
    const nodes: PlacedNode[] = [];
    [...tiers.keys()].sort().forEach((tier, row) => {
      const devices = tiers.get(tier)!.sort((a, b) => a.identity.localeCompare(b.identity));
      const offset = ((widest - devices.length) * (NODE_W + 48)) / 2;
      devices.forEach((device, i) =>
        nodes.push({
          id: device.key, name: device.identity, kind: "device", device,
          x: offset + i * (NODE_W + 48), y: row * (NODE_H + 90),
        }),
      );
    });
    const controller = entry.devices.find((d) => d.controller);
    const links: CmrLink[] = controller
      ? entry.devices
          .filter((d) => !d.controller)
          .map((d) => ({ id: d.key, layout: AUTO, node1: controller.key, node2: d.key, comment: null, ports: [] }))
      : [];
    return { nodes, links };
  }

  // ------------------------------------------------------------ viewport

  protected updated(): void {
    const viewport = this.renderRoot.querySelector<HTMLElement>(".viewport");
    if (viewport && !this._resize) {
      this._resize = new ResizeObserver(() => {
        if (!this._userMoved) this._fit();
      });
      this._resize.observe(viewport);
    }
    const key = `${this._entry?.entry_id}|${this._path.join("/")}|${this._entry ? this._scene(this._entry).nodes.length : 0}`;
    if (this._entry && key !== this._fittedFor) {
      this._fittedFor = key;
      this._userMoved = false;
      this._fit();
    }
  }

  private _fit(): void {
    const viewport = this.renderRoot.querySelector<HTMLElement>(".viewport");
    if (!viewport || !this._entry) return;
    const { width, height } = this._scene(this._entry);
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    if (!vw || !vh) return;
    const k = Math.min(vw / width, vh / height, 1.2);
    const next = { k, x: (vw - width * k) / 2, y: (vh - height * k) / 2 };
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
    const nk = Math.min(2.5, Math.max(0.25, k * factor));
    this._view = { k: nk, x: px - ((px - x) * nk) / k, y: py - ((py - y) * nk) / k };
    this._userMoved = true;
    this._clearHover();
  }

  private _onPointerDown(ev: PointerEvent): void {
    if (ev.pointerType === "touch" || ev.button !== 0) return;
    this._clearHover();
    this._drag = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, vx: this._view.x, vy: this._view.y, moved: false };
  }

  private _onPointerMove(ev: PointerEvent): void {
    const drag = this._drag;
    if (!drag || drag.id !== ev.pointerId) return;
    const dx = ev.clientX - drag.x;
    const dy = ev.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    if (!drag.moved) (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    drag.moved = true;
    this._userMoved = true;
    this._hover = undefined;
    this._view = { ...this._view, x: drag.vx + dx, y: drag.vy + dy };
  }

  private _onPointerUp(ev: PointerEvent): void {
    if (this._drag?.moved && ev.type === "pointerup") {
      // Swallow the click that ends a drag (a cancelled pointer fires no click).
      ev.currentTarget?.addEventListener("click", (e) => e.stopPropagation(), { capture: true, once: true });
    }
    this._drag = undefined;
  }

  private _zoom(factor: number): void {
    const viewport = this.renderRoot.querySelector<HTMLElement>(".viewport");
    if (viewport) this._zoomAt(viewport.clientWidth / 2, viewport.clientHeight / 2, factor);
  }

  private _resetView(): void {
    this._userMoved = false;
    this._fit();
  }

  // ------------------------------------------------------------- actions

  private _open(node: PlacedNode): void {
    if (node.kind === "site" && node.target) {
      this._path = [...(this._path.length ? this._path : [this._currentLayout(this._entry!)]), node.target];
      this._hover = undefined;
    } else if (node.device) {
      moreInfo(this, node.device.entities.connected ?? node.device.entities.update);
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
    if (ev.key === "Escape") this._clearHover();
  };

  private _clearHover = (): void => {
    this._hover = undefined;
    this._hoverLink = undefined;
  };

  private _showHover(node: PlacedNode, ev: MouseEvent): void {
    if (this._drag?.moved) return;
    const viewport = this.renderRoot.querySelector<HTMLElement>(".viewport");
    if (!viewport) return;
    const { x, y, k } = this._view;
    // Beside the node (the map is wider than tall), kept inside the viewport.
    const width = 300;
    const height = node.device?.product?.image_large ? 340 : 230;
    const right = (node.x + NODE_W / 2) * k + x + 12;
    const left = (node.x - NODE_W / 2) * k + x - 12 - width;
    const fitsRight = right + width <= viewport.clientWidth - 8;
    const top = (node.y * k + y) - height / 2;
    this._hover = {
      node,
      x: fitsRight || left < 8 ? Math.min(right, viewport.clientWidth - width - 8) : left,
      y: Math.max(8, Math.min(top, viewport.clientHeight - height - 8)),
    };
    ev.stopPropagation();
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
          ${roots.length > 1
            ? html`<div class="roots">
                ${roots.map(
                  (name) => html`<button class="pill ${crumbs[0] === name ? "on" : ""}" @click=${() => this._selectRoot(name)}>${name}</button>`,
                )}
              </div>`
            : nothing}
        </div>
        ${layoutInfo?.comment ? html`<div class="subtitle">${layoutInfo.comment}</div>` : nothing}
        ${this.renderStale(entry)}
        <div
          class="viewport"
          style="min-height:${height}px"
          @wheel=${this._onWheel}
          @pointerdown=${this._onPointerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
          @dblclick=${this._resetView}
          @mouseleave=${this._clearHover}
        >
          <div
            class="world"
            style="width:${scene.width}px;height:${scene.height}px;transform:translate(${x}px,${y}px) scale(${k})"
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
          ${this._hover ? this._renderTooltip(this._hover) : nothing}
          ${this._hoverLink && !this._hover ? this._renderLinkTooltip(this._hoverLink) : nothing}
          <div class="controls">
            <button title="Zoom in" @click=${() => this._zoom(1.25)}><ha-icon icon="mdi:plus"></ha-icon></button>
            <button title="Zoom out" @click=${() => this._zoom(0.8)}><ha-icon icon="mdi:minus"></ha-icon></button>
            <button title="Fit" @click=${this._resetView}><ha-icon icon="mdi:fit-to-screen-outline"></ha-icon></button>
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
        <div class="node site status-${site.status}" style=${style} @click=${() => this._open(node)}
             @mouseenter=${(e: MouseEvent) => this._showHover(node, e)} @mouseleave=${this._clearHover}>
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
        <div class="node unknown" style=${style} title="Not a CMR-managed device">
          <div class="badge"><ha-icon icon="mdi:help-network-outline"></ha-icon></div>
          <div class="text"><div class="name">${node.name}</div><div class="sub">Not managed</div></div>
        </div>
      `;
    }
    const device = node.device;
    const status = deviceStatus(device);
    return html`
      <div class="node device status-${status} ${device.controller ? "controller" : ""}" style=${style}
           @click=${() => this._open(node)} @mouseenter=${(e: MouseEvent) => this._showHover(node, e)}
           @mouseleave=${this._clearHover}>
        ${deviceVisual(device)}
        <div class="text">
          <div class="name">${device.identity}</div>
          <div class="sub">${modelName(device)}</div>
          <div class="ver mono">
            ${device.version ?? "–"}${device.update_available
              ? html`<span class="up"> → ${device.available_version}</span>`
              : nothing}
          </div>
        </div>
        ${device.controller
          ? html`<span class="crown" title="CMR controller"><ha-icon icon="mdi:crown-outline"></ha-icon></span>`
          : nothing}
        ${device.alerts?.on ? html`<span class="count" title="Alerts firing">${device.alerts.on}</span>` : nothing}
      </div>
    `;
  }

  private _renderTooltip(hover: { node: PlacedNode; x: number; y: number }): TemplateResult {
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
      body = html`
        <div class="tt-title">${d.identity}${d.controller ? html` <span class="chip">controller</span>` : nothing}</div>
        ${d.product?.image_large
          ? html`<div class="tt-photo"><img src=${d.product.image_large} alt="" referrerpolicy="no-referrer" /></div>`
          : nothing}
        <div class="muted">${[modelName(d), modelCode(d), d.arch].filter(Boolean).join(" · ")}</div>
        <table>
          <tr><td>Status</td><td class="status-${deviceStatus(d)}"><i class="dot"></i> ${STATUS_LABEL[deviceStatus(d)]}</td></tr>
          <tr><td>Version</td><td class="mono">${d.version ?? "–"}${d.prerelease ? " (pre-release)" : ""}</td></tr>
          <tr><td>Channel</td><td>${d.channel ?? "–"}${d.available_version && d.available_version !== d.version
            ? html` <span class="muted">(${d.update_available ? "update to" : "offers"} <span class="mono">${d.available_version}</span>)</span>`
            : nothing}</td></tr>
          ${d.address ? html`<tr><td>Address</td><td class="mono">${d.address}</td></tr>` : nothing}
          <tr><td>Uptime</td><td>${formatDuration(d.uptime)}</td></tr>
          ${d.labels.length ? html`<tr><td>Labels</td><td>${d.labels.map((l) => html`<span class="chip">${l}</span> `)}</td></tr>` : nothing}
          ${d.alerts ? html`<tr><td>Alerts</td><td>${d.alerts.on} firing of ${d.alerts.total} rules</td></tr>` : nothing}
        </table>
      `;
    } else {
      return html``;
    }
    return html`<div class="tooltip" style="left:${Math.max(8, hover.x)}px;top:${hover.y}px">${body}</div>`;
  }

  static styles = [
    baseStyles,
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
        position: relative; overflow: hidden; cursor: grab; touch-action: pan-y pinch-zoom;
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
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--status) 60%, transparent); }
        100% { box-shadow: 0 0 0 9px transparent; }
      }
      .node .text { min-width: 0; flex: 1; }
      .node .name { font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .node .sub { font-size: 11px; color: var(--cmr-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 5px; }
      .node .ver { font-size: 10.5px; color: var(--cmr-muted); white-space: nowrap; }
      .node .ver .up { color: var(--cmr-update); font-weight: 600; }
      .node.controller { border-color: color-mix(in srgb, var(--primary-color) 50%, var(--cmr-line)); }
      .node .crown { position: absolute; top: -10px; right: 10px; color: var(--primary-color); background: var(--cmr-surface); border-radius: 50%; padding: 1px; --mdc-icon-size: 16px; line-height: 0; }
      .node .count {
        position: absolute; top: -8px; left: 32px; min-width: 18px; height: 18px; border-radius: 9px;
        background: var(--cmr-alert); color: #fff; font-size: 11px; font-weight: 700; display: grid; place-items: center; padding: 0 4px;
      }
      .node.site { border-style: dashed; border-width: 1.5px; }
      .node.site .chev { color: var(--cmr-muted); --mdc-icon-size: 20px; }
      .node.unknown { opacity: 0.6; cursor: default; }

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
      @media (max-width: 600px) { .legend { display: none; } }
    `,
  ];
}
