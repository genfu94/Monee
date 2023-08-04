import React from "react";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import budget_logo from "../../assets/imgs/logo.png";

const LogoTypography = styled(Typography)(({ theme }) => ({
  display: "inline",
  textAlign: "center",
  fontSize: "1.8rem",
  marginLeft: "0.7rem",
  color: theme.palette.primary.main,
}));

export function AppLogo() {
  return (
    <>
      <img className="logo nav-bar-link" src={budget_logo} />
      <LogoTypography variant="logo">Monee</LogoTypography>
    </>
  );
}
