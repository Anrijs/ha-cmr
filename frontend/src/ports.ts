// A device's front panel drawn from the product catalog's port counts, with
// the ports that layout links use lit up. The catalog lists how many ports
// of each kind a product has, not where they sit, so the arrangement follows
// how MikroTik devices are usually built.

import { css, html, nothing, svg, type TemplateResult } from "lit";
import type { CageKind, CmrDevice, CmrEntry, CmrPorts, CmrProduct } from "./types";

/** A port of a device that a layout link uses. */
export interface UsedPort {
  interface: string;
  /** The device (or layout node) at the other end. */
  peer: string;
  /** False when either end is offline; undefined when the far end is not a device. */
  up: boolean | undefined;
  /** This port powers the far end. */
  poe: boolean;
}

/** The ports of `device` that links in any layout use, one entry per interface. */
export function usedPorts(entry: CmrEntry, device: CmrDevice, byKey: Map<string, CmrDevice>): UsedPort[] {
  const nodeKey = new Map(entry.nodes.map((n) => [`${n.layout}\u0000${n.name}`, n.device_key]));
  const found = new Map<string, UsedPort>();
  for (const link of entry.links) {
    const k1 = nodeKey.get(`${link.layout}\u0000${link.node1}`);
    const k2 = nodeKey.get(`${link.layout}\u0000${link.node2}`);
    const side = k1 === device.key ? "a" : k2 === device.key ? "b" : undefined;
    if (!side) continue;
    const peerKey = side === "a" ? k2 : k1;
    const peerDevice = peerKey ? byKey.get(peerKey) : undefined;
    for (const pair of link.ports) {
      const end = side === "a" ? pair.a : pair.b;
      // The same cable is usually on several layouts; one with a device at the far end wins.
      if (found.get(end.interface)?.up !== undefined) continue;
      found.set(end.interface, {
        interface: end.interface,
        peer: peerDevice?.identity ?? (side === "a" ? link.node2 : link.node1),
        up: peerDevice ? device.connected && peerDevice.connected : undefined,
        poe: end.poe === "powered-on",
      });
    }
  }
  return [...found.values()].sort((x, y) => x.interface.localeCompare(y.interface, undefined, { numeric: true }));
}

// Default interface names → the panel's port kinds. Breakout lanes
// (qsfpplus1-2) belong to their cage (1).
const NAME_KIND: [RegExp, CageKind | "ether"][] = [
  [/^ether(\d+)/, "ether"],
  [/^combo(\d+)/, "combo"],
  [/^sfp-sfpplus(\d+)/, "sfp+"],
  [/^sfp28-(\d+)/, "sfp28"],
  [/^sfp56-(\d+)/, "sfp56"],
  [/^qsfpplus(\d+)/, "qsfp+"],
  [/^qsfp28-(\d+)/, "qsfp28"],
  [/^qsfp56-dd-(\d+)/, "qsfp56-dd"],
  [/^qsfp56-(\d+)/, "qsfp56"],
  [/^sfp(\d+)/, "sfp"],
];

/** The panel cell an interface name belongs to; renamed ports have none. */
function portKey(name: string, spec: CmrPorts): string | undefined {
  const lower = name.toLowerCase();
  for (const [re, kind] of NAME_KIND) {
    const m = re.exec(lower);
    if (!m) continue;
    if (kind === "ether") return `ether:${m[1]}`;
    const kinds = spec.cages.map(([k]) => k);
    if (kinds.includes(kind)) return `${kind}:${m[1]}`;
    // A single SFP cage named the other way (sfp1 on an SFP+ device, or back).
    const alt = kind === "sfp" ? "sfp+" : kind === "sfp+" ? "sfp" : undefined;
    return alt && kinds.includes(alt) ? `${alt}:${m[1]}` : undefined;
  }
  return undefined;
}

const CAGE_LABEL: Record<CageKind, string> = {
  sfp: "SFP",
  "sfp+": "SFP+",
  combo: "combo",
  sfp28: "SFP28",
  sfp56: "SFP56",
  "qsfp+": "QSFP+",
  qsfp28: "QSFP28",
  qsfp56: "QSFP56",
  "qsfp56-dd": "QSFP56-DD",
};
const WIDE = new Set<CageKind>(["qsfp+", "qsfp28", "qsfp56", "qsfp56-dd"]);

// Panel units: a port is 10 × 8, two rows are 10 apart.
const CELL_W = 10;
const WIDE_W = 15;
const CELL_H = 8;
const STEP = 2;
const ROW = 10;
const GROUP_GAP = 7;

interface Cell {
  key: string;
  label: string;
  cage: boolean;
  x: number;
  y: number;
  w: number;
  /** Bottom row of a stacked pair: drawn upside down, latch at the bottom. */
  flip: boolean;
  poeOut: boolean;
}

/**
 * Where each port sits. Stacked groups keep port 1 at the bottom left and go
 * up then right: Ethernet from 14 ports (8 on desktop CRS switches), SFP
 * cages from three, in blocks of four. QSFP cages stay in one row.
 */
export function panelCells(spec: CmrPorts, code: string): { cells: Cell[]; width: number; rows: 1 | 2 } {
  const etherCount = spec.ether.reduce((n, [, count]) => n + count, 0);
  const canPower = (n: number) => spec.poe_out.some(([a, b]) => n >= a && n <= b);
  const stackEther = etherCount >= 14 || (/^CRS/i.test(code) && /-IN$/i.test(code) && etherCount >= 8);
  const stackCages = (kind: CageKind, count: number) => !WIDE.has(kind) && count > 2;
  const rows = stackEther || spec.cages.some(([kind, count]) => stackCages(kind, count)) ? 2 : 1;
  const middle = rows === 2 ? ROW / 2 : 0;
  const cells: Cell[] = [];
  let x = 0;

  const ether = (n: number, cx: number, row: number) =>
    cells.push({
      key: `ether:${n}`, label: String(n), cage: false, x: cx, y: row < 0 ? middle : row * ROW,
      w: CELL_W, flip: row === 1, poeOut: canPower(n),
    });
  const endGroup = (right: number) => {
    x = right + GROUP_GAP;
  };

  // A management port, and the odd port out of a stacked block, stand alone on the left.
  let main = etherCount;
  const lone: number[] = [];
  if (stackEther && etherCount % 2) lone.push(main--);
  if (spec.mgmt) lone.push(etherCount + 1);
  if (lone.length) {
    lone.sort((a, b) => a - b).forEach((n, i) => ether(n, x + i * (CELL_W + STEP), -1));
    endGroup(x + lone.length * (CELL_W + STEP) - STEP);
  }
  if (main) {
    for (let i = 0; i < main; i++) {
      if (stackEther) ether(i + 1, x + Math.floor(i / 2) * (CELL_W + STEP), i % 2 ? 0 : 1);
      else ether(i + 1, x + i * (CELL_W + STEP), -1);
    }
    const columns = stackEther ? Math.ceil(main / 2) : main;
    endGroup(x + columns * (CELL_W + STEP) - STEP);
  }
  for (const [kind, count] of spec.cages) {
    const w = WIDE.has(kind) ? WIDE_W : CELL_W;
    let right = x;
    for (let i = 0; i < count; i++) {
      let cx: number;
      let row: number;
      if (stackCages(kind, count)) {
        const block = Math.floor(i / 4);
        cx = x + (block * 2 + Math.floor((i % 4) / 2)) * (w + STEP) + block * STEP;
        row = i % 2 ? 0 : 1;
      } else {
        cx = x + i * (w + STEP);
        row = -1;
      }
      cells.push({
        key: `${kind}:${i + 1}`, label: String(i + 1), cage: true, x: cx, y: row < 0 ? middle : row * ROW,
        w, flip: row === 1, poeOut: false,
      });
      right = Math.max(right, cx + w);
    }
    endGroup(right);
  }
  return { cells, width: Math.max(0, x - GROUP_GAP), rows };
}

/** "1× 2.5G + 7× 1G Ethernet · 1× SFP+ · PoE out ether1–8". */
export function portSummary(spec: CmrPorts): string {
  const parts: string[] = [];
  if (spec.ether.length) parts.push(`${spec.ether.map(([speed, n]) => `${n}× ${speed}`).join(" + ")} Ethernet`);
  if (spec.mgmt) parts.push("management port");
  for (const [kind, n] of spec.cages) parts.push(`${n}× ${CAGE_LABEL[kind]}`);
  if (spec.poe_out.length) {
    const ranges = spec.poe_out.map(([a, b]) => (a === b ? `ether${a}` : `ether${a}–${b}`));
    parts.push(`PoE out ${ranges.join(", ")}`);
  }
  return parts.join(" · ");
}

// A lightning bolt in a 3.6 × 5 box.
const BOLT = "M2.2 0 L0 2.9 H1.5 L1.1 5 L3.6 1.9 H2 Z";
// Width the tooltip gives the drawing, in px.
const ROOM = 276;

/** The product's front panel, or nothing when the catalog lists no ports. */
export function renderFrontPanel(product: CmrProduct, used: UsedPort[]): TemplateResult | typeof nothing {
  const spec = product.ports;
  if (!spec) return nothing;
  const { cells, width, rows } = panelCells(spec, product.code);
  if (!cells.length) return nothing;
  const byCell = new Map<string, UsedPort>();
  for (const port of used) {
    const key = portKey(port.interface, spec);
    if (key) byCell.set(key, port);
  }
  const rack = /RM$/i.test(product.code);
  const pad = 3;
  const ear = rack ? 8 : 0;
  const left = -pad - ear;
  const viewW = width + 2 * (pad + ear);
  const viewH = (rows === 2 ? ROW : 0) + CELL_H + 2 * pad;
  const scale = Math.min(2.4, ROOM / viewW);
  const numbers = scale >= 1.9;
  const bolts = scale >= 0.9;
  const face = width + 2 * pad;
  return html`<svg class="front" viewBox="${left} ${-pad} ${viewW} ${viewH}" width=${viewW * scale} height=${viewH * scale}
      role="img" aria-label="Front panel: ${portSummary(spec)}">
    ${rack
      ? svg`<rect class="ear" x=${left} y=${-pad} width=${ear + 1} height=${viewH} rx="1.5"></rect>
          <rect class="ear" x=${width + pad - 1} y=${-pad} width=${ear + 1} height=${viewH} rx="1.5"></rect>
          <circle class="hole" cx=${left + ear / 2} cy=${viewH / 2 - pad} r="1.3"></circle>
          <circle class="hole" cx=${width + pad + ear / 2} cy=${viewH / 2 - pad} r="1.3"></circle>`
      : nothing}
    <rect class="face" x=${-pad} y=${-pad} width=${face} height=${viewH} rx="2.5"></rect>
    ${cells.map((cell) => {
      const port = byCell.get(cell.key);
      const state = port ? (port.up === false ? "down" : "on") : "";
      const flip = cell.flip;
      return svg`<g class="p ${cell.cage ? "cage" : "rj"} ${state} ${port?.poe ? "poe" : ""}"
          transform="translate(${cell.x} ${cell.y})">
        <rect class="body" width=${cell.w} height=${CELL_H} rx="1.2"></rect>
        ${cell.cage
          ? svg`<rect class="slot" x="2" y=${CELL_H / 2 - 1.2} width=${cell.w - 4} height="2.4" rx="0.6"></rect>`
          : svg`<rect class="latch" x="1" y=${flip ? CELL_H - 1.8 : 0.4} width="3.4" height="1.4" rx="0.4"></rect>`}
        ${bolts && (cell.poeOut || port?.poe)
          ? svg`<path class="bolt" d=${BOLT} transform="translate(${cell.w - 4.4} ${flip ? CELL_H - 5.6 : 0.6})"></path>`
          : nothing}
        ${numbers ? svg`<text class="num" x="1.1" y=${flip ? 4.4 : CELL_H - 1.1}>${cell.label}</text>` : nothing}
      </g>`;
    })}
  </svg>`;
}

export const frontPanelStyles = css`
  .front { display: block; margin: 8px auto 4px; overflow: visible; }
  .front .face, .front .ear { fill: var(--cmr-surface-2); stroke: var(--cmr-line); stroke-width: 0.6; }
  .front .hole { fill: var(--cmr-surface); stroke: var(--cmr-line); stroke-width: 0.4; }
  .front .p .body {
    fill: color-mix(in srgb, var(--cmr-muted) 18%, var(--cmr-surface));
    stroke: color-mix(in srgb, var(--cmr-muted) 45%, transparent); stroke-width: 0.4;
  }
  .front .p.cage .body {
    fill: color-mix(in srgb, var(--cmr-fiber) 16%, var(--cmr-surface));
    stroke: color-mix(in srgb, var(--cmr-fiber) 60%, transparent);
  }
  .front .p.on .body { fill: var(--cmr-ok); stroke: none; }
  .front .p.down .body { fill: var(--cmr-offline); stroke: none; }
  .front .latch, .front .slot { fill: rgba(0, 0, 0, 0.3); }
  .front .bolt { fill: color-mix(in srgb, var(--cmr-muted) 75%, transparent); }
  .front .p.on .bolt, .front .p.down .bolt { fill: rgba(255, 255, 255, 0.75); }
  .front .p.poe .bolt { fill: var(--cmr-poe); stroke: rgba(0, 0, 0, 0.55); stroke-width: 0.3; }
  .front .num { font: 600 3.9px var(--cmr-mono); fill: var(--primary-text-color); opacity: 0.65; }
  .front .p.on .num, .front .p.down .num { fill: #fff; opacity: 0.95; }
`;
