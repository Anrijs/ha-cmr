import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSync } from "esbuild";

function load(path) {
  const result = buildSync({ entryPoints: [path], bundle: true, write: false, format: "esm", platform: "node" });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);
}
const { OrthogonalRouter, pathData, pathMiddle } = await load("src/routing.ts");
const { LayoutDraft } = await load("src/layout-edit.ts");

function orthogonal(points) {
  assert.ok(points.length >= 2);
  for (let i = 1; i < points.length; i++) {
    assert.ok(points[i].x === points[i - 1].x || points[i].y === points[i - 1].y, "no diagonal segments");
    assert.ok(Number.isFinite(points[i].x) && Number.isFinite(points[i].y));
  }
}
function avoids(points, node, w = 184, h = 62) {
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    const intersects = a.x === b.x
      ? a.x > node.x - w / 2 && a.x < node.x + w / 2 && Math.max(a.y, b.y) > node.y - h / 2 && Math.min(a.y, b.y) < node.y + h / 2
      : a.y > node.y - h / 2 && a.y < node.y + h / 2 && Math.max(a.x, b.x) > node.x - w / 2 && Math.min(a.x, b.x) < node.x + w / 2;
    assert.equal(intersects, false, `route intersects ${node.id}`);
  }
}

test("elbow routes avoid intervening nodes and enter the endpoint edges", () => {
  const nodes = [{ id: "a", x: 180, y: 180 }, { id: "obstacle", x: 440, y: 180 }, { id: "b", x: 700, y: 220 }];
  const points = new OrthogonalRouter(nodes).route(nodes[0], nodes[2]);
  orthogonal(points); avoids(points, nodes[1]);
  assert.ok(Math.abs(points[0].x - nodes[0].x) === 92 || Math.abs(points[0].y - nodes[0].y) === 31);
  const end = points.at(-1);
  assert.ok(Math.abs(end.x - nodes[2].x) === 92 || Math.abs(end.y - nodes[2].y) === 31);
  assert.equal(pathData(points).split("M").length, 2);
});

test("aligned, close, overlapping, and negative positions remain finite and orthogonal", () => {
  for (const [x, y] of [[0, 300], [300, 0], [1, 1], [-400, -200]]) {
    const a = { id: "a", x: 0, y: 0 }, b = { id: "b", x, y };
    orthogonal(new OrthogonalRouter([a, b]).route(a, b));
  }
});

test("many cables stay deterministic and do not pass through unrelated nodes", () => {
  const nodes = Array.from({ length: 120 }, (_, i) => ({ id: String(i), x: 180 + (i % 12) * 260, y: 140 + Math.floor(i / 12) * 150 }));
  const edges = nodes.slice(1).map((n, i) => ({ id: n.id, node1: nodes[Math.floor(i / 2)].id, node2: n.id }));
  const paths = new OrthogonalRouter(nodes).routeAll(edges);
  const again = new OrthogonalRouter(nodes).routeAll([...edges].reverse());
  for (let i = 1; i < nodes.length; i++) {
    const a = nodes[Math.floor((i - 1) / 2)], b = nodes[i];
    const points = paths.get(b.id);
    orthogonal(points);
    for (const n of nodes) if (n !== a && n !== b) avoids(points, n);
    assert.deepEqual(points, again.get(b.id));
  }
});

test("near-aligned cables attach along the card edge without a tiny zigzag or moving nodes", () => {
  const a = { id: "a", x: 300, y: 100 };
  for (const x of [300, 304]) {
    const b = { id: "b", x, y: 400 };
    const route = new OrthogonalRouter([a, b]).route(a, b);
    orthogonal(route);
    assert.equal(route.length, 2);
    avoids(route, a); avoids(route, b);
    assert.deepEqual(a, { id: "a", x: 300, y: 100 });
    assert.deepEqual(b, { id: "b", x, y: 400 });
  }
});

test("links from one side share a branch lane in either endpoint order", () => {
  const nodes = [{ id: "hub", x: 600, y: 300 }, { id: "top", x: 160, y: 100 },
    { id: "middle", x: 160, y: 300 }, { id: "bottom", x: 160, y: 900 }];
  const edges = [{ id: "a", node1: "hub", node2: "top" }, { id: "b", node1: "middle", node2: "hub" },
    { id: "c", node1: "hub", node2: "bottom" }];
  const paths = new OrthogonalRouter(nodes).routeAll(edges);
  const top = paths.get("a"), middle = [...paths.get("b")].reverse(), bottom = paths.get("c");
  assert.deepEqual(top[0], middle[0]);
  assert.deepEqual(top[0], bottom[0]);
  assert.equal(top[1].x, bottom[1].x);
  assert.equal(top[2].x, bottom[2].x);
  for (const edge of edges) {
    const route = paths.get(edge.id);
    orthogonal(route);
    for (const node of nodes) avoids(route, node);
  }
});

test("branch lanes keep clear of obstacles and fall back for an obstructed branch", () => {
  const nodes = [{ id: "hub", x: 500, y: 100 }, { id: "left", x: 200, y: 500 },
    { id: "middle", x: 500, y: 500 }, { id: "right", x: 800, y: 500 }, { id: "obstacle", x: 200, y: 290 }];
  const edges = nodes.slice(1, 4).map(n => ({ id: n.id, node1: "hub", node2: n.id }));
  const paths = new OrthogonalRouter(nodes).routeAll(edges);
  for (const route of paths.values()) {
    orthogonal(route);
    for (const node of nodes) avoids(route, node);
  }
});

test("rounded corners keep a symmetric animation path and put comments on the curve", () => {
  const points = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }];
  assert.equal(pathData(points, 10), "M 0 0 L 90 0 Q 100 0 100 10 L 100 100");
  assert.equal(pathData([...points].reverse(), 10), "M 100 100 L 100 10 Q 100 0 90 0 L 0 0");
  const middle = pathMiddle(points, 10);
  assert.ok(Math.abs(middle.x - 97.5) < 0.001 && Math.abs(middle.y - 2.5) < 0.001);
  const reversed = pathMiddle([...points].reverse(), 10);
  assert.ok(Math.hypot(middle.x - reversed.x, middle.y - reversed.y) < 0.001);
  assert.equal(pathData([{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 4 }], 10),
    "M 0 0 L 2 0 Q 4 0 4 2 L 4 4");
});

test("comment midpoint and reversed PoE path follow cable length", () => {
  const points = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 300 }];
  assert.deepEqual(pathMiddle(points), { x: 100, y: 100 });
  assert.deepEqual(pathMiddle([...points].reverse()), pathMiddle(points));
  assert.equal(pathData([...points].reverse()), "M 100 300 L 100 0 L 0 0");
});

function draft() {
  const nodes = [{ id: "*1", name: "Router", revision: "abc", layout: "Site", x: -20, y: 0 },
    { id: "*2", name: "Unplaced", revision: "def", layout: "Site", x: null, y: null }];
  const edit = new LayoutDraft("entry", "Site", { x: -200, y: -100 }, nodes,
    [{ restId: "*1", x: 180, y: 100 }, { restId: "*2", x: 400, y: 300 }]);
  return { nodes, edit };
}

test("draft preserves signed controller coordinates and leaves live data untouched", () => {
  const { nodes, edit } = draft();
  assert.deepEqual(edit.positions.get("*1"), { x: -20, y: 0 });
  edit.move("*1", -67, 54, 20);
  assert.deepEqual(edit.changes(), [{ id: "*1", revision: "abc", x: -60, y: 60 }]);
  assert.equal(nodes[0].x, -20);
  edit.move("*1", -20, 0);
  assert.deepEqual(edit.changes(), []);
});

test("unplaced nodes only get coordinates after a move; partial saves retain failed changes", () => {
  const { edit } = draft();
  assert.deepEqual(edit.changes(), []);
  edit.move("*2", 210, 201);
  edit.move("*2", 200, 200); // A cancelled drag must leave an unplaced node unplaced.
  assert.deepEqual(edit.changes(), []);
  edit.move("*2", 210, 201);
  edit.move("*1", 30, 50);
  edit.acknowledge([{ id: "*1", revision: "new", x: 30, y: 50 }]);
  assert.deepEqual(edit.changes(), [{ id: "*2", revision: "def", x: 210, y: 201 }]);
  edit.move("*1", 40, 50);
  assert.equal(edit.changes().find(n => n.id === "*1").revision, "new");
});

test("draft rejects nonfinite moves and clamps to signed coordinate limits", () => {
  const { edit } = draft();
  edit.move("*1", NaN, Infinity);
  edit.move("unknown", 1, 2);
  assert.deepEqual(edit.changes(), []);
  edit.move("*1", -(2 ** 40), 2 ** 40);
  assert.deepEqual(edit.positions.get("*1"), { x: -(2 ** 31), y: 2 ** 31 - 1 });
});
