import React from "react";
import { NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Analyze from "./pages/Analyze";
import History from "./pages/History";
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

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
        {user && (
          <div className="user-menu">
            {user.picture && <img src={user.picture} alt="" referrerPolicy="no-referrer" />}
            <span title={user.email}>{user.name}</span>
            <button type="button" onClick={handleLogout}>Log out</button>
          </div>
        )}
      </header>

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Analyze />} />
            <Route path="/history" element={<History />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer>CareerPilot AI · MERN + Gemini project</footer>
    </div>
  );
}
