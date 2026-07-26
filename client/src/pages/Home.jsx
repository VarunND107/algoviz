import { Link } from "react-router-dom";
import { Gauge, Grid3x3, Save, Sparkles } from "lucide-react";
import { CATEGORIES } from "../data/algorithms";

const FEATURES = [
  { icon: Gauge, label: "11 Algorithms", desc: "Sorting, searching, graph & pathfinding" },
  { icon: Grid3x3, label: "Interactive Grid", desc: "Draw walls, set start/end, watch it solve" },
  { icon: Sparkles, label: "AI Solver", desc: "Describe a problem, get the right algorithm" },
  { icon: Save, label: "Save Progress", desc: "Pick up where you left off, any time" },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-12">
      <section className="text-center flex flex-col gap-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Watch algorithms <span className="text-accent-bright">think</span>.
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Step through sorting, searching, graph traversal, and pathfinding algorithms
          one operation at a time. Play, pause, and rewind at your own pace.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/visualizer/bubble_sort" className="btn-primary">Start Visualizing</Link>
          <Link to="/pathfinding" className="btn-ghost">Try Pathfinding Grid</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="card p-4 flex flex-col items-center gap-2 text-center">
              <Icon className="text-accent-bright" size={22} />
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {CATEGORIES.map((cat) => (
        <section key={cat.label}>
          <h2 className="text-xl font-semibold mb-4">{cat.label}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.items.map((item) => (
              <Link
                key={item.id}
                to={`/visualizer/${item.id}`}
                className="card p-5 hover:border-accent hover:shadow-glow transition-all duration-200"
              >
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-slate-500 mt-1">Step-by-step visualization</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
