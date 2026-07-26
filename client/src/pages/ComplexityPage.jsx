import ComplexityPanel from "../components/ComplexityPanel";

export default function ComplexityPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Complexity Comparison</h1>
        <p className="text-slate-400 text-sm mt-1">
          Time and space complexity for every algorithm covered in AlgoViz.
        </p>
      </div>
      <ComplexityPanel />
    </div>
  );
}
