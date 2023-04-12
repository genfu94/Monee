import React from "react";
import "./Navbar.style.css";
import budget_logo from "./budget.png";
import UserProfile from "./UserProfile/UserProfile.js";

function NavBar() {
  return (
    <div className="flex-centered nav-bar elevation-1">
      <div className="flex-centered nav-bar-content">
        <ul className="flex-centered nav-bar-menu">
          <img className="nav-bar-logo nav-bar-link" src={budget_logo} />
          <li className="nav-bar-link">Dashboard</li>
          <li className="nav-bar-link">Account</li>
          <li className="nav-bar-link">Records</li>
          <li className="nav-bar-link">Analytics</li>
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
