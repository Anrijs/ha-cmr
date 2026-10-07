import type { CmrNode } from "./types";
import type { Point } from "./routing";

export interface NodeMove extends Point { id: string; revision: string }
export interface MoveResult { saved: NodeMove[]; failed: { id: string; message: string }[] }

/** A local draft never mutates the live controller snapshot. */
export class LayoutDraft {
  readonly originals: Map<string, CmrNode>;
  readonly positions: Map<string, Point>;
  private initialPositions: Map<string, Point>;
  private moved = new Set<string>();
  constructor(readonly entryId: string, readonly layout: string, readonly origin: Point,
    nodes: CmrNode[], displayed: { restId?: string; x: number; y: number }[]) {
    this.originals = new Map(nodes.filter(n => n.layout === layout).map(n => [n.id, { ...n }]));
    this.positions = new Map(displayed.filter(n => n.restId).map(n => [n.restId!, { x: n.x + origin.x, y: n.y + origin.y }]));
    this.initialPositions = new Map(this.positions);
  }
  move(id: string, x: number, y: number, grid = 1): void {
    if (!this.originals.has(id) || !Number.isFinite(x) || !Number.isFinite(y)) return;
    const bounded = (n: number) => Math.max(-(2 ** 31), Math.min(2 ** 31 - 1, Math.round(n / grid) * grid));
    this.positions.set(id, { x: bounded(x), y: bounded(y) });
    this.moved.add(id);
  }
  changes(): NodeMove[] {
    return [...this.moved].flatMap(id => {
      const original = this.originals.get(id)!, p = this.positions.get(id)!;
      const initial = this.initialPositions.get(id);
      if ((original.x == null || original.y == null) && p.x === initial?.x && p.y === initial.y) return [];
      return original.x === p.x && original.y === p.y ? [] : [{ id, revision: original.revision, ...p }];
    });
  }
  acknowledge(saved: NodeMove[]): void {
    for (const node of saved) {
      const original = this.originals.get(node.id);
      if (original) this.originals.set(node.id, { ...original, ...node });
      this.positions.set(node.id, { x: node.x, y: node.y });
      this.moved.delete(node.id);
    }
  }
}
