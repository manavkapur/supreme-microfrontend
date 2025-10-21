// src/context/ThemeContext.js
import React, { createContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  // 🌓 Load saved theme or system preference
  const getInitialTheme = () => {
    const saved = localStorage.getItem("themeMode");
    if (saved) return saved;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };

  const [mode, setMode] = useState(getInitialTheme);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  // 🌍 Keep all browser tabs in sync
  useEffect(() => {
    const listener = (e) => {
      if (e.key === "themeMode") setMode(e.newValue);
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  // 🎨 Smooth transition between modes
  useEffect(() => {
    document.body.style.transition = "background-color 0.4s ease, color 0.4s ease";
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#1976d2" },
                background: { default: "#f5f6fa", paper: "#ffffff" },
              }
            : {
                primary: { main: "#90caf9" },
                background: { default: "#121212", paper: "#1e1e1e" },
              }),
        },
        typography: {
          fontFamily: "'Inter', 'Roboto', sans-serif",
        },
        shape: { borderRadius: 10 },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
