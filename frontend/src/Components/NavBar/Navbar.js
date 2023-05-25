import React from "react";
import "./Navbar.style.css";
import budget_logo from "../../budget.png";
import UserProfile from "./UserProfile.js";
import { Typography, Box, Button } from "@mui/material";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const NavBarLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
}));

const NavBarItem = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.light,
  listStyle: "none",
  fontSize: "1rem",
  textTransform: "uppercase",
  cursor: "pointer",
  "&:hover": {
    color: theme.palette.primary.main,
    textShadow: ".25px 0px .1px, -.25px 0px .1px",
  },
}));

const NavBarContainer = styled(Box)(({theme}) => ({
  display: 'flex',
  boxShadow: theme.shadows.elevation_1,
  padding: '1rem',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.primary.background
}));

const AddRecordBtn = styled(Button)(({theme}) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  borderRadius: '2em',
  padding: '0.5rem 0.9rem',
  fontSize: '0.8rem',
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  }
}));

function NavBar() {
  return (
    <NavBarContainer>
      <Box className="flex-centered nav-bar-content">
        <Box className="flex-centered nav-bar-menu">
          <img className="nav-bar-logo nav-bar-link" src={budget_logo} />
          <NavBarLink to="/">
            <NavBarItem>Dashboard</NavBarItem>
          </NavBarLink>
          <NavBarLink to="/accounts">
            <NavBarItem>Accounts</NavBarItem>
          </NavBarLink>
          <NavBarLink to="/transactions">
            <NavBarItem>Transactions</NavBarItem>
          </NavBarLink>
          <NavBarLink to="/">
            <NavBarItem>Analytics</NavBarItem>
          </NavBarLink>
        </Box>
        <Box className="flex-centered">
          <AddRecordBtn >+Record</AddRecordBtn>
          <UserProfile />
        </Box>
      </Box>
    </NavBarContainer>
  );
}

export default NavBar;
