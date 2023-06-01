import React, { useState } from "react";
import "./Navbar.style.css";
import budget_logo from "../../assets/imgs/logo.png";
import UserProfile from "./UserProfile.js";
import { Typography, Box, Button } from "@mui/material";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function LinkTab(props) {
  return (
    <Link to={props.href}>
      <Tab component="a" {...props} />
    </Link>
  );
}

const NavBarLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
}));

const NavBarItem = styled(Typography)(({ theme }) => ({
  listStyle: "none",
  cursor: "pointer",
  textTransform: "uppercase",
  "&:hover": {
    color: theme.palette.primary.main,
    textShadow: ".25px 0px .1px, -.25px 0px .1px",
  },
}));

const NavBarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  boxShadow: theme.shadows.elevation_1,
  padding: "1rem",
  alignItems: "center",
  justifyContent: "center",
  background: theme.palette.primary.background,
}));

const AddRecordBtn = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  borderRadius: "2em",
  padding: "0.5rem 0.9rem",
  fontSize: "0.8rem",
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const LogoTypography = styled(Typography)(({ theme }) => ({
  display: "inline",
  textAlign: "center",
  fontSize: "1.8rem",
  marginLeft: "0.7rem",
  color: theme.palette.primary.main,
}));

const PAGE_TO_TAB = {
  Dashboard: 0,
  Accounts: 1,
  Transactions: 2,
};

function NavBar({ page, onLogout }) {
  const [tab, setTab] = useState(PAGE_TO_TAB[page]);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <NavBarContainer>
      <Box className="flex-centered nav-bar-content">
        <Box style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <img className="nav-bar-logo nav-bar-link" src={budget_logo} />
          <LogoTypography variant='logo'>Monee</LogoTypography>
        </Box>
        <Box className="flex-centered nav-bar-menu">
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <Tabs
              value={tab}
              onChange={handleChange}
              aria-label="nav tabs example"
            >
              <LinkTab label="Dashboard" href="/" />
              <LinkTab label="Accounts" href="/accounts" />
              <LinkTab label="Transactions" href="/transactions" />
            </Tabs>
          </Box>
        </Box>
        <Box className="flex-centered" style={{ marginLeft: "auto" }}>
          {/*<AddRecordBtn>+Record</AddRecordBtn>*/}
          <UserProfile onLogout={onLogout} />
        </Box>
      </Box>
    </NavBarContainer>
  );
}

export default NavBar;
