import React, { useState, useEffect } from "react";
import { verifyAuthentication } from "./apis";


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

  if (loading) {
    return <div>Loading...</div>;
  }

  return children(authenticated);
};

export default AppInitializer;
