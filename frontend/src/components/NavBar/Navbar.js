import React, { useState } from "react";
import "./Navbar.style.css";
import UserProfile from "./UserProfile.js";
import { Box, Button } from "@mui/material";
import styled from "@emotion/styled";
import { NavLink, useLocation } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "../../styles/globals.style.css";
import { AppLogo } from "../AppLogo/AppLogo";

function LinkTab(props) {
  return (
    <NavLink to={props.href}>
      <Tab component="a" {...props} />
    </NavLink>
  );
}

const NavBarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  boxShadow: theme.shadows.elevation_1,
  padding: "1rem",
  alignItems: "center",
  justifyContent: "center",
  background: theme.palette.primary.background,
}));

const URL_TO_PAGE = {
  "/": "Dashboard",
  "/accounts": "Accounts",
  "/transactions": "Transactions",
};

const PAGE_TO_TAB = {
  Dashboard: 0,
  Accounts: 1,
  Transactions: 2,
};

function NavBar({ onLogout }) {
  const { pathname } = useLocation();
  const base = `/${pathname.slice(1).split("/").shift()}`;
  const page = URL_TO_PAGE[base];
  const [tab, setTab] = useState(PAGE_TO_TAB[page]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <NavBarContainer>
      <Box className="flex-centered nav-bar-content">
        <Box style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <AppLogo />
        </Box>
        <Box className="flex-centered nav-bar-menu">
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <Tabs value={tab} onChange={handleChange}>
              <LinkTab label="Dashboard" href="/" />
              <LinkTab label="Accounts" href="/accounts" />
              <LinkTab label="Transactions" href="/transactions" />
            </Tabs>
          </Box>
        </Box>
        <Box className="flex-centered" style={{ marginLeft: "auto" }}>
          <UserProfile onLogout={onLogout} />
        </Box>
      </Box>
    </NavBarContainer>
  );
}

export default NavBar;
