import { motion } from "framer-motion";

export default function SearchVisualizer({ step, target }) {
  if (!step) return null;
  const { array, checking, range, found, eliminated } = step;

  const colorFor = (i) => {
    if (found === i) return "bg-success";
    if (found === -1) return "bg-danger/30";
    if (checking === i) return "bg-warn";
    if (eliminated.includes(i)) return "bg-base-700 opacity-40";
    if (i < range[0] || i > range[1]) return "bg-base-700 opacity-30";
    return "bg-accent/50";
  };

  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {array.map((value, i) => (
          <motion.div
            key={i}
            layout
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-semibold text-sm ${colorFor(i)}`}
          >
            {value}
          </motion.div>
        ))}
      </div>
      <p className="text-center text-sm text-slate-400">
        Target: <span className="text-accent-bright font-mono">{target}</span>
        {found === -1 && <span className="text-danger ml-2">Not found</span>}
        {found !== null && found >= 0 && <span className="text-success ml-2">Found at index {found}</span>}
      </p>
    </div>
  );
}
