import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
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
      await register(username, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <form onSubmit={onSubmit} className="card p-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Create account</h1>
        {error && <p className="text-danger text-sm">{error}</p>}
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          required
        />
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
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
          minLength={6}
        />
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
        <p className="text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-accent-bright">Log in</Link>
        </p>
      </form>
    </div>
  );
}
