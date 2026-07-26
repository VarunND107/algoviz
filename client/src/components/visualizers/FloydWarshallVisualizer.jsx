export default function FloydWarshallVisualizer({ step }) {
  if (!step) return null;
  const { ids, dist, i, j, k, updated } = step;

  return (
    <div className="card p-4 overflow-x-auto">
      <p className="text-xs text-slate-400 mb-3">
        {k === null ? "Initial distance matrix" : (
          <>
            Considering vertex <span className="text-warn font-mono">{ids[k]}</span> as intermediate —
            checking <span className="text-accent-bright font-mono">{ids[i]} → {ids[j]}</span>
            {updated && <span className="text-success ml-1">(improved!)</span>}
          </>
        )}
      </p>
      <table className="border-collapse mx-auto text-sm font-mono">
        <thead>
          <tr>
            <th className="w-10 h-10" />
            {ids.map((id) => (
              <th key={id} className="w-14 h-10 text-slate-400">{id}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dist.map((row, r) => (
            <tr key={ids[r]}>
              <th className="text-slate-400">{ids[r]}</th>
              {row.map((val, c) => {
                const isActive = r === i && c === j;
                return (
                  <td
                    key={c}
                    className={`w-14 h-10 text-center rounded-md ${
                      isActive ? (updated ? "bg-success/40" : "bg-accent/40") : "bg-base-800"
                    } ${r === c ? "text-slate-600" : "text-slate-200"}`}
                  >
                    {val === Infinity ? "∞" : val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
