import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppInitializer from "./AppInitializer";
import { AuthProvider } from "./AuthProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <AppInitializer>
        <App />
      </AppInitializer>
    </AuthProvider>
  </BrowserRouter>
);
