/** Orthogonal cable routing. One obstacle grid is shared by a whole layout. */
export interface Point { x: number; y: number }
export interface RouteNode extends Point { id: string }
type Box = { x0: number; x1: number; y0: number; y1: number };
type Exit = { cell: number; points: Point[]; direction: number };

export const LINK_STYLE_FIELD = {
  name: "link_style",
  selector: { select: { options: [
    { value: "straight", label: "Straight" }, { value: "elbow", label: "Elbow (right angles)" },
  ] } },
};

export function pathData(points: Point[]): string {
  return points.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");
}

export function pathMiddle(points: Point[]): Point {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
  let remaining = lengths.reduce((a, b) => a + b, 0) / 2;
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i] && lengths[i]) {
      const t = remaining / lengths[i];
      return { x: points[i].x + t * (points[i + 1].x - points[i].x), y: points[i].y + t * (points[i + 1].y - points[i].y) };
    }
    remaining -= lengths[i];
  }
  return points[0];
}

function simplify(points: Point[]): Point[] {
  const out: Point[] = [];
  for (const p of points) {
    const last = out.at(-1);
    if (last?.x === p.x && last.y === p.y) continue;
    const before = out.at(-2);
    if (before && last && ((before.x === last.x && last.x === p.x) || (before.y === last.y && last.y === p.y))) out.pop();
    out.push(p);
  }
  return out;
}

function crosses(p: Point, q: Point, box: Box): boolean {
  return p.x === q.x
    ? p.x > box.x0 && p.x < box.x1 && Math.max(p.y, q.y) > box.y0 && Math.min(p.y, q.y) < box.y1
    : p.y > box.y0 && p.y < box.y1 && Math.max(p.x, q.x) > box.x0 && Math.min(p.x, q.x) < box.x1;
}

/** A tiny priority queue keeps routing proportional to the area searched. */
class Queue {
  private items: { key: number; cost: number; rank: number }[] = [];
  push(item: { key: number; cost: number; rank: number }) {
    const a = this.items;
    a.push(item);
    let i = a.length - 1;
    while (i) {
      const p = (i - 1) >> 1;
      if (a[p].rank <= item.rank) break;
      a[i] = a[p]; i = p;
    }
    a[i] = item;
  }
  pop() {
    const a = this.items;
    const first = a[0], last = a.pop();
    if (a.length && last) {
      let i = 0;
      while (i * 2 + 1 < a.length) {
        let c = i * 2 + 1;
        if (c + 1 < a.length && a[c + 1].rank < a[c].rank) c++;
        if (a[c].rank >= last.rank) break;
        a[i] = a[c]; i = c;
      }
      a[i] = last;
    }
    return first;
  }
}

export class OrthogonalRouter {
  private step: number;
  private x0: number;
  private y0: number;
  private cols: number;
  private rows: number;
  private blocked: Uint8Array;
  private used = new Map<number, number>();
  private boxes: Map<string, Box>;

  constructor(nodes: RouteNode[], private nodeWidth = 184, private nodeHeight = 62) {
    const left = Math.min(0, ...nodes.map(n => n.x - nodeWidth / 2)) - 96;
    const top = Math.min(0, ...nodes.map(n => n.y - nodeHeight / 2)) - 96;
    const right = Math.max(0, ...nodes.map(n => n.x + nodeWidth / 2)) + 96;
    const bottom = Math.max(0, ...nodes.map(n => n.y + nodeHeight / 2)) + 96;
    // Bound memory even for unusually spread-out controller coordinates.
    this.step = Math.max(24, Math.ceil(Math.sqrt((right - left) * (bottom - top) / 120000)),
      Math.ceil((right - left) / 4096), Math.ceil((bottom - top) / 4096));
    this.x0 = Math.floor(left / this.step) * this.step;
    this.y0 = Math.floor(top / this.step) * this.step;
    this.cols = Math.ceil((right - this.x0) / this.step) + 1;
    this.rows = Math.ceil((bottom - this.y0) / this.step) + 1;
    this.blocked = new Uint8Array(this.cols * this.rows);
    this.boxes = new Map(nodes.map(n => [n.id, {
      x0: n.x - nodeWidth / 2 - 10, x1: n.x + nodeWidth / 2 + 10,
      y0: n.y - nodeHeight / 2 - 10, y1: n.y + nodeHeight / 2 + 10,
    }]));
    for (const b of this.boxes.values()) {
      // Expand by half a cell, so a free grid edge cannot cut through a box.
      const c0 = Math.max(0, Math.ceil((b.x0 - this.step / 2 - this.x0) / this.step));
      const c1 = Math.min(this.cols - 1, Math.floor((b.x1 + this.step / 2 - this.x0) / this.step));
      const r0 = Math.max(0, Math.ceil((b.y0 - this.step / 2 - this.y0) / this.step));
      const r1 = Math.min(this.rows - 1, Math.floor((b.y1 + this.step / 2 - this.y0) / this.step));
      for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) this.blocked[r * this.cols + c] = 1;
    }
  }

  private point(cell: number): Point {
    return { x: this.x0 + (cell % this.cols) * this.step, y: this.y0 + Math.floor(cell / this.cols) * this.step };
  }

  private exits(n: RouteNode): Exit[] {
    const out: Exit[] = [];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const anchor = { x: n.x + dx * this.nodeWidth / 2, y: n.y + dy * this.nodeHeight / 2 };
      const round = (v: number, direction: number) => direction > 0 ? Math.ceil(v) : direction < 0 ? Math.floor(v) : Math.round(v);
      const c = round((anchor.x + dx * (12 + this.step) - this.x0) / this.step, dx);
      const r = round((anchor.y + dy * (12 + this.step) - this.y0) / this.step, dy);
      if (c < 0 || c >= this.cols || r < 0 || r >= this.rows) continue;
      const cell = r * this.cols + c;
      if (this.blocked[cell]) continue;
      const p = this.point(cell);
      const points = simplify([anchor, dx ? { x: p.x, y: anchor.y } : { x: anchor.x, y: p.y }, p]);
      const clear = [...this.boxes].every(([id, box]) => id === n.id || points.slice(1).every((q, i) => !crosses(points[i], q, box)));
      if (clear) {
        const prev = points.at(-2)!;
        out.push({ cell, points, direction: prev.x === p.x ? 1 : 0 });
      }
    }
    return out;
  }

  /** Prefer a clear one- or two-bend cable; the obstacle grid is for detours. */
  private simpleRoute(a: RouteNode, b: RouteNode): Point[] | undefined {
    const anchors = (n: RouteNode) => [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => ({
      x: n.x + dx * this.nodeWidth / 2, y: n.y + dy * this.nodeHeight / 2, dx, dy,
    }));
    let best: Point[] | undefined, score = Infinity;
    const boxes = [...this.boxes].map(([id, box]) => id === a.id || id === b.id
      ? { x0: box.x0 + 10, x1: box.x1 - 10, y0: box.y0 + 10, y1: box.y1 - 10 } : box);
    for (const start of anchors(a)) for (const end of anchors(b)) {
      const mx = (start.x + end.x) / 2, my = (start.y + end.y) / 2;
      for (const middle of [
        [{ x: start.x, y: end.y }], [{ x: end.x, y: start.y }],
        [{ x: mx, y: start.y }, { x: mx, y: end.y }],
        [{ x: start.x, y: my }, { x: end.x, y: my }],
      ]) {
        const points = simplify([start, ...middle, end]);
        if (points.length < 2) continue;
        const next = points[1], prev = points.at(-2)!;
        // Both ends must leave the card normally, not travel along its border.
        if (start.dx ? next.y !== start.y || (next.x - start.x) * start.dx <= 0
          : next.x !== start.x || (next.y - start.y) * start.dy <= 0) continue;
        if (end.dx ? prev.y !== end.y || (prev.x - end.x) * end.dx <= 0
          : prev.x !== end.x || (prev.y - end.y) * end.dy <= 0) continue;
        const cost = points.slice(1).reduce((sum, p, i) => sum + Math.abs(p.x - points[i].x) + Math.abs(p.y - points[i].y), 0)
          + (points.length - 2) * 20;
        if (cost >= score || boxes.some(box => points.slice(1).some((p, i) => crosses(points[i], p, box)))) continue;
        best = points; score = cost;
      }
    }
    return best;
  }

  route(a: RouteNode, b: RouteNode): Point[] {
    const simple = this.simpleRoute(a, b);
    if (simple) return simple;
    const starts = this.exits(a), ends = this.exits(b);
    const goals = new Map(ends.map(e => [e.cell, e]));
    const queue = new Queue(), costs = new Map<number, number>(), parents = new Map<number, number>();
    const roots = new Map<number, Exit>();
    const heuristic = (cell: number) => {
      const p = this.point(cell);
      return Math.min(...ends.map(e => { const q = this.point(e.cell); return Math.abs(p.x - q.x) + Math.abs(p.y - q.y); }));
    };
    for (const start of starts) {
      const key = start.cell * 2 + start.direction;
      const cost = Math.abs(a.x - this.point(start.cell).x) + Math.abs(a.y - this.point(start.cell).y);
      costs.set(key, cost); roots.set(key, start);
      queue.push({ key, cost, rank: cost + heuristic(start.cell) });
    }
    // A hard search bound keeps a pathological layout from freezing the UI.
    for (let visited = 0; ends.length && visited < 30000; visited++) {
      const item = queue.pop();
      if (!item) break;
      if (costs.get(item.key) !== item.cost) continue;
      const cell = Math.floor(item.key / 2), dir = item.key % 2;
      const end = goals.get(cell);
      if (end) {
        const cells = [cell];
        let key = item.key;
        while (parents.has(key)) { key = parents.get(key)!; cells.push(Math.floor(key / 2)); }
        const start = roots.get(key)!;
        cells.reverse();
        for (const c of cells) this.used.set(c, (this.used.get(c) ?? 0) + 1);
        return simplify([...start.points, ...cells.map(c => this.point(c)), ...[...end.points].reverse()]);
      }
      const c = cell % this.cols, r = Math.floor(cell / this.cols);
      for (const [dc, dr, direction] of [[1, 0, 0], [-1, 0, 0], [0, 1, 1], [0, -1, 1]]) {
        if (c + dc < 0 || c + dc >= this.cols || r + dr < 0 || r + dr >= this.rows) continue;
        const next = cell + dc + dr * this.cols;
        if (this.blocked[next]) continue;
        const key = next * 2 + direction;
        const cost = item.cost + this.step + (direction === dir ? 0 : 20) + (this.used.get(next) ?? 0) * 4;
        if (cost >= (costs.get(key) ?? Infinity)) continue;
        costs.set(key, cost); parents.set(key, item.key);
        queue.push({ key, cost, rank: cost + heuristic(next) });
      }
    }
    // Overlapping/enclosed nodes have no free exit. Still keep right angles.
    const mid = (a.x + b.x) / 2;
    return simplify([a, { x: mid, y: a.y }, { x: mid, y: b.y }, b]);
  }
}
