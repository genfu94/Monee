import React, { useState, useEffect } from "react";
import WebFont from "webfontloader";

import { LoadingScreen } from "./components";
import { synchronizeAndFetchAccounts } from "./apis";
import budget_logo from "./assets/imgs/logo.png";
import { theme } from "./theme";
import { ThemeProvider } from "@emotion/react";
import Router from "./Router";
import "./styles/globals.style.css";

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

    synchronizeAndFetchAccounts()
      .then((data) => {
        setAccounts(data);
        handleLoadingComplete();
      })
      .catch((errorCode) => {
        if (errorCode === 401) {
          console.log("Unauthorized");
        }
      });
  }, []);

  return (
    <LoadingScreen
      loading={loading}
      content={
        <>
          <img className="logo" src={budget_logo} />
          <div style={{ fontFamily: "Montserrat" }}>Budget App</div>
        </>
      }
    >
      <ThemeProvider theme={theme}>
        <Router accounts={accounts} />
      </ThemeProvider>
    </LoadingScreen>
  );
}

export default App;
