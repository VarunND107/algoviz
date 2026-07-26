import PathfindingGrid from "../components/visualizers/PathfindingGrid";

export default function PathfindingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Grid Pathfinding</h1>
        <p className="text-slate-400 text-sm mt-1">
          Choose a tool, draw walls on the grid, then run Dijkstra or A* to watch the search unfold.
        </p>
      </div>
      <PathfindingGrid />
    </div>
  );
}
