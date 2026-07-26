import { motion } from "framer-motion";

export default function SortingVisualizer({ step, maxValue }) {
  if (!step) return null;
  const { array, comparing, swapping, sorted, pivot } = step;

  const colorFor = (i) => {
    if (sorted.includes(i)) return "bg-success";
    if (swapping.includes(i)) return "bg-danger";
    if (i === pivot) return "bg-warn";
    if (comparing.includes(i)) return "bg-accent-bright";
    return "bg-accent/40";
  };

  return (
    <div className="card p-6 h-80 flex items-end gap-1 overflow-hidden">
      {array.map((value, i) => (
        <motion.div
          key={i}
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`flex-1 rounded-t-md ${colorFor(i)} flex items-start justify-center text-[10px] text-slate-950 font-semibold`}
          style={{ height: `${(value / maxValue) * 100}%` }}
        >
          <span className="mt-1 hidden sm:block text-slate-100/80">{value}</span>
        </motion.div>
      ))}
    </div>
  );
}
