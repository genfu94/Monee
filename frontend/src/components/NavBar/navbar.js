import React from "react";
import "./navbar.css";
import budget_logo from "./budget.png";
import UserProfile from '../UserProfile/UserProfile.js';

function NavBar() {
  return (
    <div className="nav-bar">
      <ul className="nav-bar-content">
        <img className="logo" src={budget_logo} />
        <li className="nav-bar-link">Dashboard</li>
        <li className="nav-bar-link">Account</li>
        <li className="nav-bar-link">Records</li>
        <li className="nav-bar-link">Analytics</li>
      </ul>
      <div id="add-record-btn">+Add Record</div>
      <UserProfile/>
    </div>
  );
}

export default NavBar;
