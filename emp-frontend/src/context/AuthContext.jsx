import { createContext, useCallback, useContext, useEffect, useState } from "react";
import client, { authStorage, buildBasicToken } from "../api/axiosClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => authStorage.get());

  // Verifies credentials against the backend, then saves them for this tab
  const login = useCallback(async (username, password) => {
    const token = buildBasicToken(username, password);

    // Any protected endpoint works as a credential check
    await client.get("/api/employees", {
      params: { page: 0, size: 1 },
      headers: { Authorization: `Basic ${token}` },
      skipAuthRedirect: true, // a 401 here means "wrong password", not "session expired"
    });

    const value = { username, token };
    authStorage.set(value);
    setAuth(value);
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    setAuth(null);
  }, []);

  // The axios interceptor fires this event when the server returns 401
  useEffect(() => {
    const onForcedLogout = () => setAuth(null);
    window.addEventListener("auth:logout", onForcedLogout);
    return () => window.removeEventListener("auth:logout", onForcedLogout);
  }, []);

  const value = {
    username: auth?.username ?? null,
    isAuthenticated: Boolean(auth?.token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
