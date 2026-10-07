import type { CmrNode } from "./types";
import type { Point } from "./routing";

export interface NodeMove extends Point { id: string; revision: string }
export interface MoveResult {
  saved: NodeMove[];
  failed: { id: string; message: string }[];
  scale?: number;
  scale_error?: string;
}

const bounded = (n: number, grid = 1) => Math.max(-(2 ** 31), Math.min(2 ** 31 - 1, Math.round(n / grid) * grid));

/**
 * A local draft never mutates the live controller snapshot.
 *
 * Positions are in the controller's coordinates as they were when editing
 * began. CMR always centres a layout's picture on (0, 0), so moving the
 * picture is kept as an offset here and saved by moving every node the
 * other way: the controller's own GUI then shows the same map.
 */
export class LayoutDraft {
  readonly originals: Map<string, CmrNode>;
  readonly positions: Map<string, Point>;
  /** Where the picture's centre is, relative to where CMR has it. */
  offset: Point = { x: 0, y: 0 };
  /** The picture's scale in percent, as edited. */
  scale?: number;
  private savedScale?: number;
  private initialPositions: Map<string, Point>;
  private moved = new Set<string>();
  constructor(readonly entryId: string, readonly layout: string, readonly origin: Point,
    nodes: CmrNode[], displayed: { restId?: string; x: number; y: number }[], scale?: number) {
    this.originals = new Map(nodes.filter(n => n.layout === layout).map(n => [n.id, { ...n }]));
    // Controller coordinates are whole numbers; a picture's edge can make the origin fractional.
    this.positions = new Map(displayed.filter(n => n.restId).map(n => [n.restId!, { x: Math.round(n.x + origin.x), y: Math.round(n.y + origin.y) }]));
    this.initialPositions = new Map(this.positions);
    this.scale = this.savedScale = scale;
  }
  move(id: string, x: number, y: number, grid = 1): void {
    if (!this.originals.has(id) || !Number.isFinite(x) || !Number.isFinite(y)) return;
    this.positions.set(id, { x: bounded(x, grid), y: bounded(y, grid) });
    this.moved.add(id);
  }
  /** Move several nodes by the same distance from where each started. */
  moveBy(starts: Map<string, Point>, dx: number, dy: number): void {
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
    for (const [id, start] of starts) this.move(id, start.x + dx, start.y + dy);
  }
  moveOffset(x: number, y: number, grid = 1): void {
    if (Number.isFinite(x) && Number.isFinite(y)) this.offset = { x: bounded(x, grid), y: bounded(y, grid) };
  }
  setScale(scale: number): void {
    if (Number.isFinite(scale)) this.scale = Math.min(1000, Math.max(10, Math.round(scale)));
  }
  /** The scale to save, if it changed. */
  scaleChange(): number | undefined {
    return this.scale !== undefined && this.scale !== this.savedScale ? this.scale : undefined;
  }
  changes(): NodeMove[] {
    const { x: ox, y: oy } = this.offset;
    // A moved picture moves every placed node the other way when saved.
    const ids = ox || oy ? [...this.originals.keys()] : [...this.moved];
    return ids.flatMap(id => {
      const original = this.originals.get(id)!, p = this.positions.get(id);
      if (!p) return [];
      const initial = this.initialPositions.get(id);
      // Nodes never placed stay unplaced unless they were moved somewhere else.
      if ((original.x == null || original.y == null) && (!this.moved.has(id) || (p.x === initial?.x && p.y === initial.y))) return [];
      const x = bounded(p.x - ox), y = bounded(p.y - oy);
      return original.x === x && original.y === y ? [] : [{ id, revision: original.revision, x, y }];
    });
  }
  acknowledge(saved: NodeMove[]): void {
    for (const node of saved) {
      const original = this.originals.get(node.id);
      if (original) this.originals.set(node.id, { ...original, ...node });
      this.positions.set(node.id, { x: node.x + this.offset.x, y: node.y + this.offset.y });
      this.moved.delete(node.id);
    }
  }
  acknowledgeScale(scale: number): void {
    this.savedScale = scale;
  }
}
