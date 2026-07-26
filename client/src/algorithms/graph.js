// Sample undirected weighted graph used by BFS / DFS / Dijkstra / Floyd-Warshall demos.
// nodes: [{ id, x, y }]   edges: [{ from, to, weight }]  (undirected: traversable both ways)

export function generateSampleGraph() {
  const nodes = [
    { id: "A", x: 80, y: 60 },
    { id: "B", x: 260, y: 40 },
    { id: "C", x: 440, y: 60 },
    { id: "D", x: 80, y: 220 },
    { id: "E", x: 260, y: 200 },
    { id: "F", x: 440, y: 220 },
    { id: "G", x: 620, y: 120 },
  ];
  const edges = [
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "D", weight: 2 },
    { from: "B", to: "C", weight: 3 },
    { from: "B", to: "E", weight: 5 },
    { from: "C", to: "G", weight: 6 },
    { from: "D", to: "E", weight: 1 },
    { from: "E", to: "F", weight: 2 },
    { from: "F", to: "G", weight: 3 },
    { from: "C", to: "F", weight: 7 },
  ];
  return { nodes, edges };
}

function buildAdjacency({ nodes, edges }) {
  const adj = Object.fromEntries(nodes.map((n) => [n.id, []]));
  for (const { from, to, weight } of edges) {
    adj[from].push({ to, weight });
    adj[to].push({ to: from, weight });
  }
  return adj;
}

// ── BFS ──────────────────────────────────────────────────────────
export function* bfs(graph, start) {
  const adj = buildAdjacency(graph);
  const visited = new Set([start]);
  const queue = [start];

  yield { visiting: start, visited: [...visited], frontier: [...queue], edge: null };

  while (queue.length) {
    const current = queue.shift();
    for (const { to } of adj[current] || []) {
      if (!visited.has(to)) {
        visited.add(to);
        queue.push(to);
        yield { visiting: to, visited: [...visited], frontier: [...queue], edge: [current, to] };
      }
    }
  }
}

// ── DFS ──────────────────────────────────────────────────────────
export function* dfs(graph, start) {
  const adj = buildAdjacency(graph);
  const visited = new Set();

  function* visit(node, parent) {
    visited.add(node);
    yield { visiting: node, visited: [...visited], frontier: [], edge: parent ? [parent, node] : null };
    for (const { to } of adj[node] || []) {
      if (!visited.has(to)) {
        yield* visit(to, node);
      }
    }
  }

  yield* visit(start, null);
}

// ── Dijkstra ─────────────────────────────────────────────────────
export function* dijkstra(graph, start) {
  const adj = buildAdjacency(graph);
  const distances = Object.fromEntries(graph.nodes.map((n) => [n.id, Infinity]));
  distances[start] = 0;
  const visited = new Set();
  const prev = {};

  while (visited.size < graph.nodes.length) {
    let current = null;
    let best = Infinity;
    for (const n of graph.nodes) {
      if (!visited.has(n.id) && distances[n.id] < best) {
        best = distances[n.id];
        current = n.id;
      }
    }
    if (current === null) break;

    visited.add(current);
    yield {
      visiting: current,
      visited: [...visited],
      distances: { ...distances },
      edge: prev[current] ? [prev[current], current] : null,
    };

    for (const { to, weight } of adj[current] || []) {
      const alt = distances[current] + weight;
      if (alt < distances[to]) {
        distances[to] = alt;
        prev[to] = current;
        yield { visiting: current, visited: [...visited], distances: { ...distances }, edge: [current, to] };
      }
    }
  }

  const path = {};
  for (const n of graph.nodes) {
    const route = [];
    let cur = n.id;
    while (cur) {
      route.unshift(cur);
      cur = prev[cur];
    }
    path[n.id] = route[0] === start ? route : [];
  }
  yield { visiting: null, visited: [...visited], distances: { ...distances }, edge: null, done: true, path };
}

// ── Floyd-Warshall (all-pairs shortest path) ────────────────────
export function* floydWarshall(graph) {
  const ids = graph.nodes.map((n) => n.id);
  const idx = Object.fromEntries(ids.map((id, i) => [id, i]));
  const n = ids.length;
  const INF = Infinity;

  const dist = Array.from({ length: n }, () => Array(n).fill(INF));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const { from, to, weight } of graph.edges) {
    dist[idx[from]][idx[to]] = weight;
    dist[idx[to]][idx[from]] = weight;
  }

  yield { k: null, i: null, j: null, dist: dist.map((r) => [...r]), ids, updated: false };

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const through = dist[i][k] + dist[k][j];
        const improved = through < dist[i][j];
        if (improved) dist[i][j] = through;
        yield { k, i, j, dist: dist.map((r) => [...r]), ids, updated: improved };
      }
    }
  }
}

export const GRAPH_ALGOS = { bfs, dfs, dijkstra, floyd_warshall: floydWarshall };
