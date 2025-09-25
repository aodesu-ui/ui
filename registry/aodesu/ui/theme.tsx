"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Definimos el tipo para cada elemento del array styles
type StyleConfig = {
  style: string;
  theme: string[];
};

// Tipo para el tema, que será una combinación de style y theme
type Theme<T extends StyleConfig> = `${T["style"]}-${T["theme"][number]}`;

// Tipo para el contexto
type ThemeContextType<T extends StyleConfig> = {
  theme: Theme<T>;
  style: string;
  setTheme: (t: Theme<T>) => void;
  setStyle: (s: T["style"]) => void;
};

// Creamos el contexto con un tipo genérico
const ThemeContext = createContext<ThemeContextType<any> | undefined>(undefined);

export function ThemeProvider<T extends StyleConfig>({
  children,
  defaultTheme,
  styles,
}: {
  children: React.ReactNode;
  defaultTheme?: Theme<T>;
  styles: T[];
}) {
  const [theme, setTheme] = useState<Theme<T>>();
  const [style, setStyle] = useState<string>();

  // Validar que los estilos pasados sean válidos
  const validStyles = styles.map((s) => s.style);
  const validThemes = styles.reduce(
    (acc, s) => ({
      ...acc,
      [s.style]: s.theme,
    }),
    {} as Record<string, string[]>
  );

  // Leer localStorage solo en cliente
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme<T> | null;
    if (storedTheme && isValidTheme(storedTheme)) {
      setTheme(storedTheme);
      setStyle(storedTheme.split("-")[0]);
    } else {
      const fallbackTheme = defaultTheme || `${styles[0].style}-${styles[0].theme[0]}` as Theme<T>;
      setTheme(fallbackTheme);
      setStyle(fallbackTheme.split("-")[0]);
    }
  }, []);

  // Validar si un tema es válido según los estilos proporcionados
  const isValidTheme = (theme: string): theme is Theme<T> => {
    const [style, themePart] = theme.split("-");
    return validStyles.includes(style) && validThemes[style]?.includes(themePart);
  };

  // Aplicar efectos cuando hay theme definido
  useEffect(() => {
    if (defaultTheme) {
      setTheme(defaultTheme);
      setStyle(defaultTheme.split("-")[0]);
      return;
    }

    if (!theme || !style) return;

    const html = document.documentElement;
    const isDark = theme.includes("dark");
    html.style.colorScheme = isDark ? "dark" : "light";
    html.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
  }, [theme, style, defaultTheme]);

  // Cambiar el estilo y ajustar el tema si es necesario
  const handleSetStyle = (newStyle: T["style"]) => {
    if (!validStyles.includes(newStyle)) return;
    setStyle(newStyle);
    const validThemeForStyle = validThemes[newStyle][0];
    setTheme(`${newStyle}-${validThemeForStyle}` as Theme<T>);
  };

  if (!theme || !style) {
    // Evitar renderizado que cause mismatch
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, style, setTheme, setStyle: handleSetStyle }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useThemeContext<T extends StyleConfig>() {
  const ctx = useContext(ThemeContext) as ThemeContextType<T> | undefined;
  if (!ctx) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return ctx;
}