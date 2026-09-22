import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Analyze from "./pages/Analyze";
import History from "./pages/History";

export default function App() {
  return (
    <div className="app-shell">
      <header className="navbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark">CP</span>
          CareerPilot <span>AI</span>
        </NavLink>

        <nav>
          <NavLink to="/" end>
            Analyze
          </NavLink>

          <NavLink to="/history">
            History
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Analyze />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>

      <footer>CareerPilot AI · MERN + Gemini project</footer>
    </div>
  );
}