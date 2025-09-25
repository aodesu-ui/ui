"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "aodesu-dark" | "aodesu-light" | "dark-dark" | "dark-light";
type ThemeContextType = { theme: Theme; setTheme: (t: Theme) => void };

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme,
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>();

  // Leer localStorage solo en cliente
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    setTheme(stored || "aodesu-dark");
  }, []);

  // Aplicar efectos cuando hay theme definido
  useEffect(() => {
    if (defaultTheme) {
      setTheme(defaultTheme);
      return;
    }

    if (!theme) return;
    const html = document.documentElement;
    html.style.colorScheme = theme.includes("dark") ? "dark" : "light";
    html.classList.toggle("dark", theme.includes("dark"));
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (!theme) {
    // Opcional: mientras carga, evitar renderizado que cause mismatch
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useThemeContext must be used within a ThemeProvider");
  return ctx;
}
