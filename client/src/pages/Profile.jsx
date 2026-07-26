import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listSessions, deleteSession } from "../api/sessions";
import { ALGO_NAME } from "../data/algorithms";

export default function Profile() {
  const { user, loading } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    setError("");
    listSessions()
      .then(setSessions)
      .catch(() => setError("Could not load your saved sessions. Try refreshing the page."))
      .finally(() => setBusy(false));
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const remove = async (id) => {
    setDeletingId(id);
    setError("");
    try {
      await deleteSession(id);
      setSessions((s) => s.filter((x) => x.id !== id));
    } catch {
      setError("Could not delete that session. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Hi, {user.username}</h1>
      <p className="text-slate-400 text-sm">Your saved visualizer sessions.</p>

      {error && <p className="text-danger text-sm">{error}</p>}
      {busy && <p className="text-slate-400">Loading…</p>}
      {!busy && sessions.length === 0 && !error && (
        <p className="text-slate-400">No saved sessions yet — save progress from any visualizer page.</p>
      )}

      <div className="flex flex-col gap-2">
        {sessions.map((s) => (
          <div key={s.id} className="card p-4 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium truncate">{s.title || ALGO_NAME[s.algorithm] || s.algorithm}</p>
              <p className="text-xs text-slate-500">
                {ALGO_NAME[s.algorithm] || s.algorithm} · saved {new Date(s.updated_at).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link to={`/visualizer/${s.algorithm}`} className="btn-ghost">Open</Link>
              <button
                className="btn-ghost text-danger"
                onClick={() => remove(s.id)}
                disabled={deletingId === s.id}
              >
                {deletingId === s.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
