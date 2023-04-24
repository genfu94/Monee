import React from "react";
import "./Navbar.style.css";
import budget_logo from "../../budget.png";
import UserProfile from "./UserProfile/UserProfile.js";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div className="flex-centered nav-bar elevation-1">
      <div className="flex-centered nav-bar-content">
        <ul className="flex-centered nav-bar-menu">
          <img className="nav-bar-logo nav-bar-link" src={budget_logo} />
          <Link to="/" className="nav-bar-link">Dashboard</Link>
          <Link to="/accounts" className="nav-bar-link">Account</Link>
          <Link to="/transactions" className="nav-bar-link">Transactions</Link>
          <Link className="nav-bar-link">Analytics</Link>
        </ul>
        <div className="flex-centered">
          <div id="add-record-btn">+Record</div>
          <UserProfile />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
