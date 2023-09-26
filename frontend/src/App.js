import React, { useState, useEffect } from "react";
import WebFont from "webfontloader";

import { LoadingScreen, NavBar } from "./components";
import { synchronizeAndFetchAccounts } from "./apis";
import Router from "./Router";
import { useAuth } from "./AuthProvider";
import { AppLogo } from "./components/AppLogo/AppLogo";

function App() {
  const { authenticated, setAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const handleLoadingComplete = () => setLoading(false);

  useEffect(() => {
    WebFont.load({
      google: {
        families: [
          "Montserrat:300,400,500,600,700,800,900",
          "Kalam:400",
          "Ultra:400",
          "Noto Serif:200,600",
          "REM",
        ],
      },
    });
  }, []);

  useEffect(() => {
    if (authenticated) {
      setLoading(true);
      synchronizeAndFetchAccounts()
        .then((data) => {
          setBanks(data);
          handleLoadingComplete();
        })
        .catch((errorCode) => {
          if (errorCode === 401) {
            console.log("Unauthorized");
          }
        });
    }
  }, [authenticated]);

  return (
    <LoadingScreen loading={loading} content={<AppLogo />}>
      <NavBar />
      <Router banks={banks} />
    </LoadingScreen>
  );
}

export default App;
