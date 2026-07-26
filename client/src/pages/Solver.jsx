import { useState } from "react";
import { solveProblem } from "../api/solver";

const SECTION_LABELS = ["Algorithm", "Why", "Complexity", "Example"];

function parseSections(text) {
  const pattern = new RegExp(`(?:^|\\n)(${SECTION_LABELS.join("|")}):\\s*`, "g");
  const matches = [...text.matchAll(pattern)];
  if (matches.length === 0) return null;

  return matches.map((m, i) => {
    const contentStart = m.index + m[0].length;
    const contentEnd = i + 1 < matches.length ? matches[i + 1].index : text.length;
    return { label: m[1], content: text.slice(contentStart, contentEnd).trim() };
  });
}

export default function Solver() {
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!problem.trim() || loading) return;
    setLoading(true);
    setError("");
    setAnswer(null);
    try {
      const res = await solveProblem(problem.trim());
      setAnswer(res.answer);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong talking to Gemini.");
    } finally {
      setLoading(false);
    }
  };

  const sections = answer ? parseSections(answer) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Algorithm Solver</h1>
        <p className="text-slate-400 text-sm mt-1">
          Describe your problem in plain language — Gemini will suggest the best algorithm, explain
          why, and give its time/space complexity with an example tailored to your case.
        </p>
      </div>

      <form onSubmit={submit} className="card p-6 flex flex-col gap-3">
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="e.g. I have 10,000 unsorted product prices and need to repeatedly find whether a specific price exists as new prices stream in..."
          rows={5}
          maxLength={4000}
          className="input resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">{problem.length}/4000</span>
          <button className="btn-primary" type="submit" disabled={loading || !problem.trim()}>
            {loading ? "Thinking..." : "Solve It"}
          </button>
        </div>
      </form>

      {error && <p className="text-danger text-sm">{error}</p>}

      {answer && (
        <div className="flex flex-col gap-3">
          {sections ? (
            sections.map((s) => (
              <div key={s.label} className="card p-5">
                <p className="text-xs uppercase tracking-wide text-accent-bright font-semibold mb-2">
                  {s.label}
                </p>
                <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {s.content}
                </p>
              </div>
            ))
          ) : (
            <div className="card p-5">
              <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
