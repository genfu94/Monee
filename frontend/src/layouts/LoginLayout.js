import React from "react";
import { Box } from "@mui/material";
import { AppLogo } from "../components/AppLogo/AppLogo.js";

export function LoginLayout({ children }) {
  return (
    <Box className="equal-columns full-page login-page">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }}
      >
        <div style={{ width: "70%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <AppLogo />
          </div>
          {children}
        </div>
      </div>
      <Box>
        <Box className="hero-image" />
      </Box>
    </Box>
  );
}
