"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

function getThemeSnapshot() {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  } catch {
    return "light";
  }
}

function getThemeServerSnapshot() {
  return "light";
}

const themeListeners = new Set();
function subscribeTheme(callback) {
  themeListeners.add(callback);
  return () => themeListeners.delete(callback);
}

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // In case localStorage is blocked
    }

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-theme", "light");
    }

    themeListeners.forEach((listener) => listener());
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

