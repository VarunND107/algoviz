import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Binary, LogOut, Menu, User, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/visualizer/bubble_sort", label: "Visualizers" },
  { to: "/pathfinding", label: "Pathfinding" },
  { to: "/complexity", label: "Complexity" },
  { to: "/solver", label: "Solver" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive ? "bg-base-800 text-accent-bright" : "text-slate-300 hover:text-white hover:bg-base-800"
    }`;

  return (
    <nav className="sticky top-0 z-20 backdrop-blur bg-base-950/80 border-b border-base-700">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-lg shrink-0" onClick={() => setMenuOpen(false)}>
          <Binary className="text-accent" />
          AlgoViz
        </NavLink>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <NavLink to="/profile" className="btn-ghost flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                <User size={16} /> <span className="max-w-[100px] truncate">{user.username}</span>
              </NavLink>
              <button onClick={logout} className="btn-ghost flex items-center gap-2" aria-label="Log out">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-ghost" onClick={() => setMenuOpen(false)}>Log in</NavLink>
              <NavLink to="/register" className="btn-primary hidden sm:inline-block" onClick={() => setMenuOpen(false)}>
                Sign up
              </NavLink>
            </>
          )}

          <button
            className="btn-ghost p-2 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-base-700 px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={() => setMenuOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          {!user && (
            <NavLink
              to="/register"
              className="px-3 py-2 rounded-lg text-sm text-accent-bright sm:hidden"
              onClick={() => setMenuOpen(false)}
            >
              Sign up
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
