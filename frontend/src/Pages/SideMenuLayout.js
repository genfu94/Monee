import React from "react";
import NavBar from "../Components/NavBar/Navbar.js";
import "./style.css";


class SideMenuLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <NavBar/>
        <div className="main-container">
          <div className="side-menu">
            <div className="side-menu-title">
              {this.props.sideMenuTitle}
            </div>
            <div className="side-menu-content">
              {this.props.sideMenuContent}
            </div>
          </div>
          <div className="content">
            {this.props.content}
          </div>
        </div>
      </>
    );
  }
}

export default SideMenuLayout;