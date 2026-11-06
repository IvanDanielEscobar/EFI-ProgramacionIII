"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  useCallback,
} from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
  mounted: false,
});

function subscribe(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener("home-deco-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("home-deco-theme-change", callback);
  };
}

function getThemeSnapshot() {
  try {
    const saved = localStorage.getItem("home-deco-theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

function getServerThemeSnapshot() {
  return "light";
}

export function ThemeProvider({ children }) {
  // useSyncExternalStore garantiza que en SSR y en el paso de hidratación
  // se use getServerThemeSnapshot ('light'), evitando discrepancias con el DOM
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    if (newTheme !== "light" && newTheme !== "dark") return;
    try {
      localStorage.setItem("home-deco-theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      window.dispatchEvent(new Event("home-deco-theme-change"));
    } catch {
      // no-op
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const current = getThemeSnapshot();
    const nextTheme = current === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }, [setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
}
