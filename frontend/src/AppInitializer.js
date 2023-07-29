import React, { useState, useEffect } from "react";
import { verifyAuthentication } from "./apis";
import { useAuth } from "./AuthProvider";

const AppInitializer = ({ children }) => {
  const { authenticated, setAuthenticated } = useAuth();
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
  }, [setAuthenticated, setLoading]);

  if (loading) {
    return;
  }

  return children;
};

export default AppInitializer;
