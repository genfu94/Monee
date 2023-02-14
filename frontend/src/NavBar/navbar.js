import React from "react"
import './navbar.css'
import budget_logo from  './budget.png'

class NavBar  extends React.Component {
    render() {
        return (
            <div className="nav-bar">
                <ul className="nav-bar-content">
                    <img className="logo" src={budget_logo} />
                    <li className="nav-bar-link">Home</li>
                    <li className="nav-bar-link">Account</li>
                    <li className="nav-bar-link">Transazioni</li>
                </ul>
            </div>
        );
    }
}

export default NavBar;