import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
//import { ReactKeycloakProvider } from '@react-keycloak/web'

const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//       <ReactKeycloakProvider authClient={keycloak} initOptions={{onLoad: 'login-required'}}>
//         <BrowserRouter>
//           <App />
//         </BrowserRouter>
//       </ReactKeycloakProvider>
// );

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
