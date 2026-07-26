import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, ALGO_NAME, SORTING_IDS, SEARCH_IDS, GRAPH_IDS } from "../data/algorithms";
import { COMPLEXITY_DATA } from "../data/complexity";
import { SORTERS } from "../algorithms/sorting";
import { SEARCHERS } from "../algorithms/searching";
import { GRAPH_ALGOS, generateSampleGraph } from "../algorithms/graph";
import { useAnimationPlayer } from "../hooks/useAnimationPlayer";
import { useAuth } from "../context/AuthContext";
import { createSession } from "../api/sessions";
import SortingVisualizer from "../components/visualizers/SortingVisualizer";
import SearchVisualizer from "../components/visualizers/SearchVisualizer";
import GraphVisualizer from "../components/visualizers/GraphVisualizer";
import FloydWarshallVisualizer from "../components/visualizers/FloydWarshallVisualizer";
import PlaybackControls from "../components/controls/PlaybackControls";

function randomArray(size, max = 100) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 5);
}

function parseArrayInput(text) {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => parseInt(s, 10))
    .filter((n) => Number.isInteger(n) && n >= 0);
}

function nextNodeId(existingIds) {
  for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(65 + i);
    if (!existingIds.includes(c)) return c;
  }
  return `N${existingIds.length}`;
}

// Converts the adjacency-list state into the { nodes, edges } shape the
// existing graph algorithms and visualizer already expect.
function adjacencyToGraph(adjacency, positions) {
  const ids = Object.keys(adjacency);
  const nodes = ids.map((id) => ({ id, x: positions[id]?.x ?? 0, y: positions[id]?.y ?? 0 }));
  const edges = [];
  const seen = new Set();
  for (const from of ids) {
    for (const { to, weight } of adjacency[from]) {
      const key = [from, to].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ from, to, weight });
    }
  }
  return { nodes, edges };
}

export default function VisualizerPage() {
  const { algorithm } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [size, setSize] = useState(20);
  const [maxValue, setMaxValue] = useState(100);
  const [array, setArray] = useState(() => randomArray(20));
  const [arrayText, setArrayText] = useState(() => array.join(", "));
  const [arrayError, setArrayError] = useState("");
  const [target, setTarget] = useState(null);
  const [startNode, setStartNode] = useState("A");
  const [saveMsg, setSaveMsg] = useState("");

  // The graph itself lives as an adjacency list: { [nodeId]: [{ to, weight }] }.
  // `positions` is presentation-only metadata (where each node sits on the canvas).
  const [adjacency, setAdjacency] = useState({});
  const [positions, setPositions] = useState({});

  const graph = useMemo(() => adjacencyToGraph(adjacency, positions), [adjacency, positions]);

  const isSorting = SORTING_IDS.has(algorithm);
  const isSearch = SEARCH_IDS.has(algorithm);
  const isGraph = GRAPH_IDS.has(algorithm);
  const isFloyd = algorithm === "floyd_warshall";

  // Switching into a search algorithm shouldn't reset a user-typed array,
  // but it does need a valid target to search for.
  useEffect(() => {
    if (isSearch && (target === null || !array.includes(target))) {
      setTarget(array[Math.floor(Math.random() * array.length)]);
    }
  }, [algorithm]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the selected start node valid as the graph is built/edited.
  useEffect(() => {
    if (isGraph && graph.nodes.length > 0 && !graph.nodes.some((n) => n.id === startNode)) {
      setStartNode(graph.nodes[0].id);
    }
  }, [graph, isGraph]); // eslint-disable-line react-hooks/exhaustive-deps

  const addNode = (x, y) => {
    const id = nextNodeId(Object.keys(adjacency));
    setAdjacency((prev) => ({ ...prev, [id]: [] }));
    setPositions((prev) => ({ ...prev, [id]: { x, y } }));
  };

  const addEdge = (from, to, weight) => {
    if (from === to) return;
    setAdjacency((prev) => {
      const alreadyConnected = (prev[from] || []).some((e) => e.to === to);
      if (alreadyConnected) return prev;
      return {
        ...prev,
        [from]: [...(prev[from] || []), { to, weight }],
        [to]: [...(prev[to] || []), { to: from, weight }],
      };
    });
  };

  const clearGraph = () => {
    setAdjacency({});
    setPositions({});
  };

  const loadExampleGraph = () => {
    const sample = generateSampleGraph();
    const adj = {};
    sample.nodes.forEach((n) => {
      adj[n.id] = [];
    });
    sample.edges.forEach(({ from, to, weight }) => {
      adj[from].push({ to, weight });
      adj[to].push({ to: from, weight });
    });
    const pos = {};
    sample.nodes.forEach((n) => {
      pos[n.id] = { x: n.x, y: n.y };
    });
    setAdjacency(adj);
    setPositions(pos);
  };

  const applyArrayInput = () => {
    const parsed = parseArrayInput(arrayText);
    if (parsed.length === 0) {
      setArrayError("Enter at least one non-negative integer, separated by commas.");
      return;
    }
    setArrayError("");

    if (isSearch) {
      const sorted = [...parsed].sort((a, b) => a - b);
      setArray(sorted);
      setArrayText(sorted.join(", "));
      setTarget(sorted[Math.floor(Math.random() * sorted.length)]);
    } else {
      setArray(parsed);
      setArrayText(parsed.join(", "));
    }
  };

  const generateRandom = () => {
    const len = Math.min(Math.max(size, 3), 60);
    const max = Math.max(maxValue, 5);
    setArrayError("");

    if (isSearch) {
      const arr = randomArray(len, max).sort((a, b) => a - b);
      setArray(arr);
      setArrayText(arr.join(", "));
      setTarget(arr[Math.floor(Math.random() * arr.length)]);
    } else {
      const arr = randomArray(len, max);
      setArray(arr);
      setArrayText(arr.join(", "));
    }
  };

  const steps = useMemo(() => {
    if (isSorting) return Array.from(SORTERS[algorithm](array));
    if (isSearch) return Array.from(SEARCHERS[algorithm](array, target));
    if (isGraph && graph.nodes.length === 0) return [];
    if (isGraph && !isFloyd) return Array.from(GRAPH_ALGOS[algorithm](graph, startNode));
    if (isFloyd) return Array.from(GRAPH_ALGOS.floyd_warshall(graph));
    return [];
  }, [algorithm, array, target, startNode, graph, isSorting, isSearch, isGraph, isFloyd]);

  const player = useAnimationPlayer(steps);

  const info = COMPLEXITY_DATA.find((c) => c.id === algorithm);

  const saveProgress = async () => {
    if (!user) return;
    setSaveMsg("Saving...");
    try {
      await createSession({
        algorithm,
        title: `${ALGO_NAME[algorithm]} — ${new Date().toLocaleString()}`,
        input_data: isGraph ? { graph, startNode } : { array, target },
        settings: { size, speed: player.speed },
      });
      setSaveMsg("Saved!");
    } catch {
      setSaveMsg("Failed to save");
    }
    setTimeout(() => setSaveMsg(""), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="card p-3 sticky top-20 flex flex-col gap-3">
          {CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <p className="text-xs uppercase text-slate-500 px-2 mb-1">{cat.label}</p>
              {cat.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/visualizer/${item.id}`)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-sm ${
                    item.id === algorithm ? "bg-accent/20 text-accent-bright" : "hover:bg-base-800 text-slate-300"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col gap-4">
        <div className="lg:hidden">
          <select
            value={algorithm}
            onChange={(e) => navigate(`/visualizer/${e.target.value}`)}
            className="input w-full"
          >
            {CATEGORIES.map((cat) => (
              <optgroup label={cat.label} key={cat.label}>
                {cat.items.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold">{ALGO_NAME[algorithm] || algorithm}</h1>
          {info && (
            <div className="flex gap-3 text-xs font-mono text-slate-400">
              <span>avg: <span className="text-warn">{info.average}</span></span>
              <span>worst: <span className="text-danger">{info.worst}</span></span>
              <span>space: <span className="text-slate-200">{info.space}</span></span>
            </div>
          )}
        </div>

        <div className="card p-4 flex flex-col gap-2">
          {(isSorting || isSearch) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 whitespace-nowrap">Array (comma-separated)</span>
              <input
                type="text"
                value={arrayText}
                onChange={(e) => setArrayText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyArrayInput()}
                placeholder="e.g. 5, 3, 8, 1, 9"
                className="input flex-1 min-w-[200px] font-mono text-sm"
              />
              <button className="btn-ghost" onClick={applyArrayInput}>Apply</button>
              <input
                type="number" min="3" max="60" value={size}
                onChange={(e) => setSize(Number(e.target.value) || 3)}
                title="Random array length"
                className="input w-16 text-sm"
              />
              <input
                type="number" min="5" max="9999" value={maxValue}
                onChange={(e) => setMaxValue(Number(e.target.value) || 5)}
                title="Max random value"
                className="input w-20 text-sm"
              />
              <button className="btn-ghost" onClick={generateRandom}>Generate Random</button>
            </div>
          )}
          {isSearch && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 whitespace-nowrap">Target</span>
              <input
                type="number"
                value={target ?? ""}
                onChange={(e) => setTarget(e.target.value === "" ? null : Number(e.target.value))}
                className="input w-24 text-sm"
              />
            </div>
          )}
          {arrayError && <p className="text-xs text-danger">{arrayError}</p>}
          {isGraph && !isFloyd && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Start node</span>
              <select value={startNode} onChange={(e) => setStartNode(e.target.value)} className="input py-1">
                {graph.nodes.map((n) => <option key={n.id} value={n.id}>{n.id}</option>)}
              </select>
            </div>
          )}
          {user && (
            <button className="btn-ghost ml-auto" onClick={saveProgress}>
              {saveMsg || "Save Progress"}
            </button>
          )}
        </div>

        {isSorting && <SortingVisualizer step={player.current} maxValue={Math.max(...array, 1)} />}
        {isSearch && <SearchVisualizer step={player.current} target={target} />}
        {isGraph && !isFloyd && (
          <GraphVisualizer
            graph={graph}
            step={player.current}
            start={startNode}
            editable
            weighted={algorithm === "dijkstra"}
            onAddNode={addNode}
            onAddEdge={addEdge}
            onClear={clearGraph}
            onLoadExample={loadExampleGraph}
          />
        )}
        {isFloyd && (
          <>
            <GraphVisualizer
              graph={graph}
              editable
              weighted
              onAddNode={addNode}
              onAddEdge={addEdge}
              onClear={clearGraph}
              onLoadExample={loadExampleGraph}
            />
            <FloydWarshallVisualizer step={player.current} />
          </>
        )}

        <PlaybackControls player={player} />
      </main>
    </div>
  );
}
