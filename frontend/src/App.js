import { Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import WebFont from "webfontloader";

import { Dashboard, Transactions, Accounts } from "./pages";
import budget_logo from "./assets/imgs/logo.png";
import { keycloak } from "./keycloak.js";
import urlJoin from "url-join";
import { GET_request } from "./utils/network.js";
import { theme } from "./theme";
import { ThemeProvider } from "@emotion/react";

function initKeycloak() {
  return new Promise((resolve, reject) => {
    keycloak
      .init({
        onLoad: "login-required",
      })
      .then((authenticated) => {
        keycloak.loadUserProfile().then((value) => {
          resolve(value);
        });
      })
      .catch((reason) => {
        reject(reason);
      });
  });
}

function renderLoadingPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img className="nav-bar-logo nav-bar-link" src={budget_logo} />
        <div style={{ fontFamily: "Montserrat" }}>Budget App</div>
      </div>
      <ClipLoader size="2rem" />
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const handleLoadingComplete = () => setLoading(false);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Montserrat:300,400,500,600,700,800,900", "Kalam:400"],
      },
    });

    initKeycloak().then((keycloakProfile) => {
      localStorage.setItem("userInfo", JSON.stringify(keycloakProfile));
      const endpoint = urlJoin(
        process.env.REACT_APP_BACKEND_ENDPOINT,
        "synchronize_account"
      );
      GET_request(endpoint, { username: keycloakProfile["username"] }).then(
        (data) => {
          setAccounts(data);
          handleLoadingComplete();
        }
      );
    });
  }, []);

  if (loading) {
    return renderLoadingPage();
  } else {
    return (
      <ThemeProvider theme={theme}>
        <Routes>
          <Route
            exact
            path="/"
            element={<Dashboard accounts={accounts} />}
          ></Route>
          <Route
            exact
            path="/transactions"
            element={<Transactions accounts={accounts} />}
          ></Route>
          <Route
            exact
            path="/accounts"
            element={<Accounts accounts={accounts} />}
          ></Route>
        </Routes>
      </ThemeProvider>
    );
  }
}

export default App;
