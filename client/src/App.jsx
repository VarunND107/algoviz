import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import VisualizerPage from "./pages/VisualizerPage";
import PathfindingPage from "./pages/PathfindingPage";
import ComplexityPage from "./pages/ComplexityPage";
import Solver from "./pages/Solver";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visualizer/:algorithm" element={<VisualizerPage />} />
          <Route path="/pathfinding" element={<PathfindingPage />} />
          <Route path="/complexity" element={<ComplexityPage />} />
          <Route path="/solver" element={<Solver />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}
