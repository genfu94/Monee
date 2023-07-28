import React, { useState, useEffect } from "react";
import { verifyAuthentication, authenticate } from "./apis";
import { LoginPage } from "./pages";

const AppInitializer = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      verifyAuthentication()
        .then((response) => {
          setAuthenticated(true);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    };

    initializeApp();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await authenticate(username, password);
      localStorage.setItem("token", response.access_token);
      console.log("Login successful. Redirecting...", response.access_token);
      setAuthenticated(true);
    } catch (error_code) {
      console.error("Token request responded with", error_code);
    }
  };

  if (loading) {
    return;
  }

  return authenticated ? children : <LoginPage handleLogin={handleLogin} />;
};

export default AppInitializer;
