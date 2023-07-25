import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppInitializer from "./AppInitializer";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AppInitializer>
      {(authenticated) => <App isAuthenticated={authenticated} />}
    </AppInitializer>
  </BrowserRouter>
);
