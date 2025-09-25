"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define available themes for each style
export type Theme = "dark" | "light";
export type StyleConfig = { style: string; themes: readonly Theme[] }[];
export type Style<T extends StyleConfig> = T[number]["style"];
export type ThemeContextType<T extends StyleConfig> = {
  style: Style<T>;
  theme: Theme;
  setStyle: (s: Style<T>) => void;
  setTheme: (t: Theme) => void;
  availableStyles: Style<T>[];
  availableThemes: Theme[];
};

const ThemeContext = createContext<ThemeContextType<any> | undefined>(undefined);

export function ThemeProvider<T extends StyleConfig>({
  children,
  defaultStyle = "aodesu" as Style<T>,
  defaultTheme = "dark",
  styleConfig,
  isRoot = false,
}: {
  children: React.ReactNode;
  defaultStyle?: Style<T>;
  defaultTheme?: Theme;
  styleConfig: T;
  isRoot?: boolean;
}) {
  const [style, setStyleState] = useState<Style<T>>(defaultStyle);
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // Extract available styles and validate config
  const availableStyles = styleConfig.map((config) => config.style) as Style<T>[];
  const availableThemes = (style: Style<T>) =>
    styleConfig.find((config) => config.style === style)?.themes || [defaultTheme];

  // Initialize from localStorage on client-side
  useEffect(() => {
    const storedStyle = localStorage.getItem("style") as Style<T> | null;
    const storedTheme = localStorage.getItem("theme") as Theme | null;

    let initialStyle = storedStyle || defaultStyle;
    let initialTheme = storedTheme || defaultTheme;

    // Validate initial style and theme
    if (!availableStyles.includes(initialStyle)) {
      initialStyle = defaultStyle;
    }
    if (!availableThemes(initialStyle).includes(initialTheme)) {
      initialTheme = availableThemes(initialStyle)[0] || defaultTheme;
    }

    setStyleState(initialStyle);
    setThemeState(initialTheme);
  }, [defaultStyle, defaultTheme, styleConfig]);

  // Apply theme, style effects, and data attributes
  useEffect(() => {
    const html = document.documentElement;
    html.style.colorScheme = theme === "dark" ? "dark" : "light";
    html.classList.toggle("dark", theme === "dark");

    // Apply data attributes to html if isRoot is true
    if (isRoot) {
      html.setAttribute("data-style", style);
      html.setAttribute("data-theme", theme);
    } else {
      // Clean up data attributes from html if isRoot is false
      html.removeAttribute("data-style");
      html.removeAttribute("data-theme");
    }

    localStorage.setItem("style", style);
    localStorage.setItem("theme", theme);
  }, [style, theme, isRoot]);

  // Handle style change with theme fallback
  const setStyle = (newStyle: Style<T>) => {
    if (!availableStyles.includes(newStyle)) return;

    const newAvailableThemes = availableThemes(newStyle);
    let newTheme = theme;

    // Fallback if current theme is not available in new style
    if (!newAvailableThemes.includes(theme)) {
      newTheme = newAvailableThemes[0] || defaultTheme;
      setThemeState(newTheme);
    }

    setStyleState(newStyle);
  };

  // Handle theme change, only allow themes available for current style
  const setTheme = (newTheme: Theme) => {
    if (availableThemes(style).includes(newTheme)) {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        style,
        theme,
        setStyle,
        setTheme,
        availableStyles,
        availableThemes: availableThemes(style) as Theme[],
      }}
    >
      {isRoot ? (
        children
      ) : (
        <div data-style={style} data-theme={theme}>
          {children}
        </div>
      )}
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