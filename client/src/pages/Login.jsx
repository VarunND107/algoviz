import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <form onSubmit={onSubmit} className="card p-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Log in</h1>
        {error && <p className="text-danger text-sm">{error}</p>}
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p className="text-sm text-slate-400">
          No account? <Link to="/register" className="text-accent-bright">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
