"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
  mounted: false,
});

const emptySubscribe = () => () => {};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    try {
      const savedTheme = localStorage.getItem("home-deco-theme");
      if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("home-deco-theme", nextTheme);
    } catch {
      // no-op
    }
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const changeTheme = (newTheme) => {
    if (newTheme !== "light" && newTheme !== "dark") return;
    setTheme(newTheme);
    try {
      localStorage.setItem("home-deco-theme", newTheme);
    } catch {
      // no-op
    }
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme: changeTheme,
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

