import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WebSocketProvider } from "./context/WebSocketContext";
import { CustomThemeProvider } from "./context/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CustomThemeProvider>
  <WebSocketProvider>
    <App />
  </WebSocketProvider>
  </CustomThemeProvider>
);
