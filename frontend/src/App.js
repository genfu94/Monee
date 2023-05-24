import { Route, Routes } from "react-router-dom";
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import WebFont from "webfontloader";

import Home from "./Pages/Home.js";
import Transactions from "./Pages/Transactions/Transactions.js";
import budget_logo from "./budget.png";
import Accounts from "./Pages/Accounts/Accounts.js";
import { keycloak, setUserInfo, userInfo } from "./keycloak.js";
import urlJoin from "url-join";
import { GET_request } from "./Utils/network.js";

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
          const endpoint = urlJoin(
            process.env.REACT_APP_BACKEND_ENDPOINT,
            "update_bank_links"
          );
          GET_request(endpoint, { username: userInfo.username }).then(
            (data) => {
              this.handleLoadingComplete();
            }
          );
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
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
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
        <ClipLoader size="2rem" />
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
          <Route exact path="/transactions" element={<Transactions />}></Route>
          <Route exact path="/accounts" element={<Accounts />}></Route>
        </Routes>
      );
    }
  }
}

export default App;
