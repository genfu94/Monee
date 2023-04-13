import { Route, Routes } from "react-router-dom";

import React from "react";
import Home from "./pages/Home.js";
import WebFont from "webfontloader";
import BankSelector from "./pages/BankSelector.js";
import Transactions from "./pages/Transactions.js";
import budget_logo from "./budget.png";
import ClipLoader from "react-spinners/ClipLoader";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };

    fetch(
      `http://localhost:8000/update_bank_links?username=user`
    )
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          "loading": false
        })
      });
  }

  async componentDidMount() {
    WebFont.load({
      google: {
        families: ["Montserrat"],
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
          height: "100vh"
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
          <div style={{fontFamily: "Montserrat"}}>
            Budget App
          </div>
        </div>
        <ClipLoader size="20"/>
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return this.renderLoadingPage();
    }
    return (
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/connect" element={<BankSelector />}></Route>
        <Route exact path="/transactions" element={<Transactions />}></Route>
      </Routes>
    );
  }
}

export default App;
