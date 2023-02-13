import React from "react"
import './navbar.css'
import budget_logo from  './budget.png'

class NavBar  extends React.Component {
    render() {
        return (
            <div className="nav-bar">
                <div className="nav-bar-content">
                    <img className="logo" src={budget_logo} />
                    <div className="nav-bar-link">Home</div>
                    <div className="nav-bar-link">Account</div>
                    <div className="nav-bar-link">Transazioni</div>
                </div>
            </div>
        );
    }
}

export default NavBar;