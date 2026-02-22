import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { RunProvider } from "./context/RunContext";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RunProvider>
      <App />
    </RunProvider>
  </React.StrictMode>
);
