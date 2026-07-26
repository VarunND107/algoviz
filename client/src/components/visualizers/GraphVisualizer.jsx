import { useRef, useState } from "react";

// Doubles as the read-only step visualizer (colors nodes by BFS/DFS/Dijkstra
// progress) and, when `editable`, an interactive node/edge builder: click empty
// canvas to add a node, click two nodes to connect them (prompting for a
// weight when `weighted`).
export default function GraphVisualizer({
  graph,
  step,
  start,
  editable = false,
  weighted = false,
  onAddNode,
  onAddEdge,
  onClear,
  onLoadExample,
}) {
  const svgRef = useRef(null);
  const [pendingFrom, setPendingFrom] = useState(null);
  const [pendingEdge, setPendingEdge] = useState(null);
  const [weightInput, setWeightInput] = useState("1");

  const visiting = step?.visiting ?? null;
  const visited = step?.visited || [];
  const frontier = step?.frontier || [];
  const edge = step?.edge || null;
  const distances = step?.distances || null;
  const path = step?.path || null;

  const visitedSet = new Set(visited);
  const frontierSet = new Set(frontier);
  const finalPathIds = path && path.length ? new Set(path) : null;

  const nodeById = Object.fromEntries(graph.nodes.map((n) => [n.id, n]));

  const isPathEdge = (a, b) => {
    if (!path || path.length < 2) return false;
    for (let i = 0; i < path.length - 1; i++) {
      if ((path[i] === a && path[i + 1] === b) || (path[i] === b && path[i + 1] === a)) return true;
    }
    return false;
  };

  const toSvgPoint = (clientX, clientY) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = pt.matrixTransform(ctm.inverse());
    return { x: Math.round(p.x), y: Math.round(p.y) };
  };

  const handleBackgroundClick = (e) => {
    if (!editable || pendingEdge) return;
    const { x, y } = toSvgPoint(e.clientX, e.clientY);
    onAddNode?.(x, y);
  };

  const handleNodeClick = (e, nodeId) => {
    e.stopPropagation();
    if (!editable || pendingEdge) return;

    if (pendingFrom === null) {
      setPendingFrom(nodeId);
      return;
    }
    if (pendingFrom === nodeId) {
      setPendingFrom(null);
      return;
    }
    if (weighted) {
      setPendingEdge({ from: pendingFrom, to: nodeId });
      setWeightInput("1");
    } else {
      onAddEdge?.(pendingFrom, nodeId, 1);
    }
    setPendingFrom(null);
  };

  const confirmEdgeWeight = () => {
    const w = Math.max(1, parseInt(weightInput, 10) || 1);
    onAddEdge?.(pendingEdge.from, pendingEdge.to, w);
    setPendingEdge(null);
  };

  return (
    <div className="card p-4 flex flex-col gap-3">
      {editable && (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-slate-400">
            Click empty space to add a node. Click two nodes to connect them
            {weighted ? ", then set a weight." : "."}
          </p>
          <button className="btn-ghost ml-auto" onClick={onLoadExample}>Load Example Graph</button>
          <button className="btn-ghost" onClick={onClear}>Clear Graph</button>
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox="0 0 700 280"
        className={`w-full h-72 ${editable ? "cursor-crosshair" : ""}`}
        onClick={handleBackgroundClick}
      >
        <rect x="0" y="0" width="700" height="280" fill="transparent" />

        {graph.edges.map(({ from, to, weight }) => {
          const a = nodeById[from];
          const b = nodeById[to];
          if (!a || !b) return null;
          const active =
            (edge && ((edge[0] === from && edge[1] === to) || (edge[0] === to && edge[1] === from))) ||
            isPathEdge(from, to);
          return (
            <g key={`${from}-${to}`}>
              <line
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={active ? "#a5b4fc" : "#333a4f"}
                strokeWidth={active ? 3 : 2}
              />
              {weighted && (
                <text
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2 - 6}
                  fill="#94a3b8"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {weight}
                </text>
              )}
            </g>
          );
        })}

        {graph.nodes.map((n) => {
          let fill = "#232838";
          if (n.id === start) fill = "#fbbf24";
          if (frontierSet.has(n.id)) fill = "#818cf8";
          if (visitedSet.has(n.id)) fill = "#34d399";
          if (finalPathIds && finalPathIds.has(n.id)) fill = "#34d399";
          if (n.id === visiting) fill = "#f87171";
          if (pendingFrom === n.id) fill = "#f472b6";

          return (
            <g
              key={n.id}
              onClick={(e) => handleNodeClick(e, n.id)}
              className={editable ? "cursor-pointer" : ""}
            >
              <circle cx={n.x} cy={n.y} r={22} fill={fill} stroke="#0d0f14" strokeWidth={2} />
              <text x={n.x} y={n.y + 5} fill="#0d0f14" fontSize="14" fontWeight="700" textAnchor="middle">
                {n.id}
              </text>
              {distances && Number.isFinite(distances[n.id]) && (
                <text x={n.x} y={n.y + 38} fill="#a5b4fc" fontSize="12" textAnchor="middle">
                  d={distances[n.id]}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {pendingEdge && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-300">
            Edge {pendingEdge.from} → {pendingEdge.to}: weight
          </span>
          <input
            type="number"
            min="1"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmEdgeWeight()}
            className="input w-20 py-1"
            autoFocus
          />
          <button className="btn-primary py-1" onClick={confirmEdgeWeight}>Add Edge</button>
          <button className="btn-ghost py-1" onClick={() => setPendingEdge(null)}>Cancel</button>
        </div>
      )}

      {editable && graph.nodes.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-4">
          No nodes yet — click anywhere on the canvas to add one, or load the example graph.
        </p>
      )}

      <div className="flex flex-wrap gap-4 text-xs text-slate-400">
        <Legend color="#fbbf24" label="Start" />
        {editable && <Legend color="#f472b6" label="Selected (click another node to connect)" />}
        <Legend color="#f87171" label="Visiting now" />
        <Legend color="#818cf8" label="Frontier" />
        <Legend color="#34d399" label="Visited / Path" />
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
      {label}
    </span>
  );
}
