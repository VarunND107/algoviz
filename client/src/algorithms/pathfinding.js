// Grid pathfinding: cells are { row, col }. `grid` is a 2D array of cell types:
// 'empty' | 'wall' | 'start' | 'end'
// Step shape: { visiting: [r,c]|null, visited: [[r,c],...], frontier: [[r,c],...], path: [[r,c],...]|null, done }

const key = (r, c) => `${r},${c}`;

function neighbors(row, col, rows, cols) {
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ].filter(([r, c]) => r >= 0 && r < rows && c >= 0 && c < cols);
}

function reconstructPath(cameFrom, endKey) {
  const path = [];
  let cur = endKey;
  while (cur && cameFrom.has(cur)) {
    path.unshift(cur.split(",").map(Number));
    cur = cameFrom.get(cur);
  }
  if (cur) path.unshift(cur.split(",").map(Number));
  return path;
}

function popMin(openSet, score) {
  let bestKey = null;
  let bestVal = Infinity;
  for (const k of openSet) {
    const v = score.get(k) ?? Infinity;
    if (v < bestVal) {
      bestVal = v;
      bestKey = k;
    }
  }
  openSet.delete(bestKey);
  return bestKey;
}

export function* gridDijkstra(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const startKey = key(...start);
  const endKey = key(...end);

  const dist = new Map([[startKey, 0]]);
  const cameFrom = new Map();
  const openSet = new Set([startKey]);
  const visited = new Set();

  while (openSet.size) {
    const currentKey = popMin(openSet, dist);
    if (currentKey === undefined || currentKey === null) break;
    const [row, col] = currentKey.split(",").map(Number);
    visited.add(currentKey);

    yield {
      visiting: [row, col],
      visited: [...visited].map((k) => k.split(",").map(Number)),
      frontier: [...openSet].map((k) => k.split(",").map(Number)),
      path: null,
      done: false,
    };

    if (currentKey === endKey) {
      const path = reconstructPath(cameFrom, endKey);
      yield { visiting: null, visited: [...visited].map((k) => k.split(",").map(Number)), frontier: [], path, done: true };
      return;
    }

    for (const [nr, nc] of neighbors(row, col, rows, cols)) {
      if (grid[nr][nc] === "wall") continue;
      const nKey = key(nr, nc);
      if (visited.has(nKey)) continue;
      const alt = dist.get(currentKey) + 1;
      if (alt < (dist.get(nKey) ?? Infinity)) {
        dist.set(nKey, alt);
        cameFrom.set(nKey, currentKey);
        openSet.add(nKey);
      }
    }
  }

  yield { visiting: null, visited: [...visited].map((k) => k.split(",").map(Number)), frontier: [], path: [], done: true };
}

export function* gridAStar(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const startKey = key(...start);
  const endKey = key(...end);

  const heuristic = (r, c) => Math.abs(r - end[0]) + Math.abs(c - end[1]);

  const gScore = new Map([[startKey, 0]]);
  const fScore = new Map([[startKey, heuristic(...start)]]);
  const cameFrom = new Map();
  const openSet = new Set([startKey]);
  const visited = new Set();

  while (openSet.size) {
    const currentKey = popMin(openSet, fScore);
    if (currentKey === undefined || currentKey === null) break;
    const [row, col] = currentKey.split(",").map(Number);
    visited.add(currentKey);

    yield {
      visiting: [row, col],
      visited: [...visited].map((k) => k.split(",").map(Number)),
      frontier: [...openSet].map((k) => k.split(",").map(Number)),
      path: null,
      done: false,
    };

    if (currentKey === endKey) {
      const path = reconstructPath(cameFrom, endKey);
      yield { visiting: null, visited: [...visited].map((k) => k.split(",").map(Number)), frontier: [], path, done: true };
      return;
    }

    for (const [nr, nc] of neighbors(row, col, rows, cols)) {
      if (grid[nr][nc] === "wall") continue;
      const nKey = key(nr, nc);
      if (visited.has(nKey)) continue;
      const tentativeG = gScore.get(currentKey) + 1;
      if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
        cameFrom.set(nKey, currentKey);
        gScore.set(nKey, tentativeG);
        fScore.set(nKey, tentativeG + heuristic(nr, nc));
        openSet.add(nKey);
      }
    }
  }

  yield { visiting: null, visited: [...visited].map((k) => k.split(",").map(Number)), frontier: [], path: [], done: true };
}

export const PATHFINDERS = { dijkstra: gridDijkstra, astar: gridAStar };
