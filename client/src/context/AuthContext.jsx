import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("algoviz_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .fetchMe()
      .then(setUser)
      .catch(() => localStorage.removeItem("algoviz_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, user } = await authApi.login(email, password);
    localStorage.setItem("algoviz_token", token);
    setUser(user);
  };

  const register = async (username, email, password) => {
    const { token, user } = await authApi.register(username, email, password);
    localStorage.setItem("algoviz_token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("algoviz_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
