// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRouter from "./router/AppRouter";
import { ThemeProvider } from "./contexts/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  </React.StrictMode>
);
