import { useMemo, useState } from "react";
import { COMPLEXITY_DATA } from "../data/complexity";

const CATEGORIES = ["All", "Sorting", "Searching", "Graph", "Pathfinding"];

export default function ComplexityPanel() {
  const [category, setCategory] = useState("All");

  const rows = useMemo(
    () => COMPLEXITY_DATA.filter((r) => category === "All" || r.category === category),
    [category]
  );

  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={category === c ? "btn-primary" : "btn-ghost"}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-1">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="px-3 py-2">Algorithm</th>
              <th className="px-3 py-2">Best</th>
              <th className="px-3 py-2">Average</th>
              <th className="px-3 py-2">Worst</th>
              <th className="px-3 py-2">Space</th>
              <th className="px-3 py-2">Stable</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="bg-base-800 font-mono">
                <td className="px-3 py-2 rounded-l-xl font-sans font-medium text-slate-100">{r.name}</td>
                <td className="px-3 py-2 text-accent-bright">{r.best}</td>
                <td className="px-3 py-2 text-warn">{r.average}</td>
                <td className="px-3 py-2 text-danger">{r.worst}</td>
                <td className="px-3 py-2 text-slate-300">{r.space}</td>
                <td className="px-3 py-2 rounded-r-xl font-sans">
                  {r.stable === null ? "—" : r.stable ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
