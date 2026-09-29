import { createContext, useContext, useMemo, useState } from "react";
import { clearAuth, getStoredUser, hasValidSession, saveAuth } from "./storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (hasValidSession() ? getStoredUser() : null));

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user && hasValidSession()),
    login: (session) => {
      saveAuth(session);
      setUser(session.user);
    },
    logout: () => {
      clearAuth();
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
