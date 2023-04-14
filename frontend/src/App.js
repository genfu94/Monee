import { Route, Routes } from "react-router-dom";

import React, { useState, useEffect } from "react";
import Home from "./pages/Home.js";
import WebFont from "webfontloader";
import BankSelector from "./pages/BankSelector.js";
import Transactions from "./pages/Transactions.js";
import budget_logo from "./budget.png";
import ClipLoader from "react-spinners/ClipLoader";
import Accounts from "./pages/Accounts.js"
import { keycloak, setUserInfo, userInfo } from "./keycloak.js";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };

    this.initKeycloak();

    this.handleLoadingComplete = () => this.setState({ loading: false });
  }

  initKeycloak() {
    keycloak
      .init({
        onLoad: "login-required",
      })
      .then((authenticated) => {
        keycloak.loadUserProfile().then((value) => {
          setUserInfo(value);
          fetch(
            `http://localhost:8000/update_bank_links?username=${userInfo.username}`
          )
            .then((res) => res.json())
            .then((data) => {
              this.handleLoadingComplete();
            });
        });
      })
      .catch(function () {
        console.log("Not authenticated");
      });
  }

  componentDidMount() {
    WebFont.load({
      google: {
        families: ["Montserrat:300,400,500,600,700,800,900"],
      },
    });
  }

  renderLoadingPage() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img className="nav-bar-logo nav-bar-link" src={budget_logo} />
          <div style={{ fontFamily: "Montserrat" }}>Budget App</div>
        </div>
        <ClipLoader size="20" />
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return this.renderLoadingPage();
    } else {
      return (
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/connect" element={<BankSelector />}></Route>
          <Route exact path="/transactions" element={<Transactions />}></Route>
          <Route exact path="/accounts" element={<Accounts />}></Route>
        </Routes>
      );
    }
  }
}

export default App;
