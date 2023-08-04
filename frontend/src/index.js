import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppInitializer from "./AppInitializer";
import { AuthProvider } from "./AuthProvider";
import { theme } from "./theme";
import { ThemeProvider } from "@emotion/react";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <AppInitializer>
          <App />
        </AppInitializer>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
