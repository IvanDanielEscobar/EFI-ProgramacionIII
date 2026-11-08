"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService } from "@/services/api";

const AuthContext = createContext({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  logout: () => {},
  refreshAccessToken: async () => {},
});

function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const storedAccess = localStorage.getItem("home-deco-access-token");
      if (!storedAccess) return null;
      const decoded = decodeJwt(storedAccess);
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("home-deco-access-token");
        return null;
      }
      return storedAccess;
    } catch {
      return null;
    }
  });

  const [refreshToken, setRefreshToken] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem("home-deco-refresh-token");
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const storedUser = localStorage.getItem("home-deco-user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sincronizar cookies para el middleware
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (token && user) {
        document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax;`;
        document.cookie = `user_role=${user.rol || "CLIENTE"}; path=/; max-age=86400; SameSite=Lax;`;
      }
    }
  }, [token, user]);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.login(username, password);

      const decoded = decodeJwt(data.access);
      const userData = {
        id: decoded?.user_id,
        username: username,
        // Los roles pueden inferirse por username de prueba o datos del payload
        rol: username === "admin" ? "ADMIN" : username.startsWith("vendedor") ? "EMPLEADO" : "CLIENTE",
        es_empleado: username === "admin" || username.startsWith("vendedor"),
      };

      setToken(data.access);
      setRefreshToken(data.refresh);
      setUser(userData);
      setError(null);

      // Persistir en localStorage y Cookie para middleware de Next.js
      localStorage.setItem("home-deco-access-token", data.access);
      if (data.refresh) {
        localStorage.setItem("home-deco-refresh-token", data.refresh);
      }
      localStorage.setItem("home-deco-user", JSON.stringify(userData));
      document.cookie = `auth_token=${data.access}; path=/; max-age=86400; SameSite=Lax;`;
      document.cookie = `user_role=${userData.rol}; path=/; max-age=86400; SameSite=Lax;`;

      setIsLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.message || "Usuario o contraseña incorrectos.";
      setError(msg);
      setIsLoading(false);
      return { success: false, error: msg };
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    setError(null);

    try {
      localStorage.removeItem("home-deco-access-token");
      localStorage.removeItem("home-deco-refresh-token");
      localStorage.removeItem("home-deco-user");
      document.cookie = "auth_token=; path=/; max-age=0;";
      document.cookie = "user_role=; path=/; max-age=0;";
    } catch {
      // no-op
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const data = await authService.refreshToken(refreshToken);

      if (data?.access) {
        setToken(data.access);
        localStorage.setItem("home-deco-access-token", data.access);
        document.cookie = `auth_token=${data.access}; path=/; max-age=86400; SameSite=Lax;`;
        return data.access;
      } else {
        logout();
        return null;
      }
    } catch {
      logout();
      return null;
    }
  }, [refreshToken, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isAuthenticated: Boolean(token && user),
        isLoading,
        error,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}

