// The layout hierarchy behind site nodes: which layouts sit inside which.

/**
 * Each layout's sub-layouts, breadth-first from the top layouts: a layout
 * belongs to the first layout that links to it. A node that links back to a
 * parent or across to a sibling (CMR layouts may link both ways) is
 * navigation, not containment, so a site node never counts the layouts it
 * was reached from. Layouts the top layouts don't reach start trees of their
 * own, in layout order, so every layout ends up in exactly one place.
 */
export function layoutChildren(
  layouts: string[],
  nodes: { layout: string; target_layout: string | null }[],
  roots: string[],
): Map<string, string[]> {
  const children = new Map<string, string[]>();
  const placed = new Set<string>();
  for (const root of [...roots, ...layouts]) {
    if (placed.has(root)) continue;
    placed.add(root);
    const queue = [root];
    while (queue.length) {
      const layout = queue.shift()!;
      for (const node of nodes) {
        const target = node.target_layout;
        if (node.layout !== layout || !target || placed.has(target)) continue;
        placed.add(target);
        children.set(layout, [...(children.get(layout) ?? []), target]);
        queue.push(target);
      }
    }
  }
  return children;
}
