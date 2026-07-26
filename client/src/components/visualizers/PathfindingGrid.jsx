import { useState } from "react";
import { gridAStar, gridDijkstra } from "../../algorithms/pathfinding";
import PlaybackControls from "../controls/PlaybackControls";
import { useAnimationPlayer } from "../../hooks/useAnimationPlayer";

const DEFAULT_ROWS = 15;
const DEFAULT_COLS = 28;

function emptyGrid(rows, cols) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => "empty"));
}

export default function PathfindingGrid() {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [grid, setGrid] = useState(() => emptyGrid(DEFAULT_ROWS, DEFAULT_COLS));
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [algorithm, setAlgorithm] = useState("dijkstra");
  const [steps, setSteps] = useState([]);

  const player = useAnimationPlayer(steps);

  // Click sequence: 1st click sets Start, 2nd click sets End, every click after toggles a wall.
  const handleCellClick = (r, c) => {
    if (!start) {
      setStart([r, c]);
      return;
    }
    if (!end) {
      if (r === start[0] && c === start[1]) return;
      setEnd([r, c]);
      return;
    }
    if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1])) return;
    setGrid((g) => {
      const next = g.map((row) => [...row]);
      next[r][c] = next[r][c] === "wall" ? "empty" : "wall";
      return next;
    });
  };

  const run = () => {
    if (!start || !end) return;
    const runner = algorithm === "astar" ? gridAStar : gridDijkstra;
    setSteps(Array.from(runner(grid, start, end)));
  };

  const reset = () => {
    setGrid(emptyGrid(rows, cols));
    setStart(null);
    setEnd(null);
    setSteps([]);
  };

  const resizeGrid = () => {
    const nextRows = Math.min(Math.max(rows, 5), 40);
    const nextCols = Math.min(Math.max(cols, 5), 60);
    setRows(nextRows);
    setCols(nextCols);
    setGrid(emptyGrid(nextRows, nextCols));
    setStart(null);
    setEnd(null);
    setSteps([]);
  };

  let helpText = "Click a cell to place the Start node.";
  if (start && !end) helpText = "Click a cell to place the End node.";
  if (start && end) helpText = "Click any other cell to toggle a wall.";

  const current = player.current;
  const visitedSet = new Set((current?.visited || []).map(([r, c]) => `${r},${c}`));
  const frontierSet = new Set((current?.frontier || []).map(([r, c]) => `${r},${c}`));
  const pathSet = new Set((current?.path || []).map(([r, c]) => `${r},${c}`));

  return (
    <div className="flex flex-col gap-4">
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <span className="text-sm text-slate-400">{helpText}</span>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-slate-400">Rows</span>
          <input
            type="number" min="5" max="40" value={rows}
            onChange={(e) => setRows(Number(e.target.value) || 5)}
            className="input w-16 text-sm"
          />
          <span className="text-xs text-slate-400">Cols</span>
          <input
            type="number" min="5" max="60" value={cols}
            onChange={(e) => setCols(Number(e.target.value) || 5)}
            className="input w-16 text-sm"
          />
          <button className="btn-ghost" onClick={resizeGrid}>Resize Grid</button>
        </div>

        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="input"
        >
          <option value="dijkstra">Dijkstra</option>
          <option value="astar">A*</option>
        </select>
        <button className="btn-primary" onClick={run} disabled={!start || !end}>Run</button>
        <button className="btn-ghost" onClick={reset}>Reset</button>
      </div>

      <div className="card p-4 overflow-x-auto select-none">
        <div
          className="grid gap-[2px] mx-auto w-fit"
          style={{ gridTemplateColumns: `repeat(${cols}, 22px)` }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const k = `${r},${c}`;
              const isStart = start && r === start[0] && c === start[1];
              const isEnd = end && r === end[0] && c === end[1];
              let cls = "bg-base-800";
              if (cell === "wall") cls = "bg-base-600";
              if (frontierSet.has(k)) cls = "bg-accent/40";
              if (visitedSet.has(k)) cls = "bg-accent/70";
              if (pathSet.has(k)) cls = "bg-warn";
              if (isStart) cls = "bg-success";
              if (isEnd) cls = "bg-danger";

              return (
                <div
                  key={k}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-[22px] h-[22px] rounded-sm cursor-pointer transition-colors duration-150 ${cls}`}
                />
              );
            })
          )}
        </div>
      </div>

      <PlaybackControls player={player} />
    </div>
  );
}
