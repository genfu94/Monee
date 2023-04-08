import { Route, Routes } from "react-router-dom";

import React from "react";
import Home from "./pages/Home.js";
import WebFont from "webfontloader";
import BankSelector from "./pages/BankSelector.js";

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

  render() {
    if (!this.state.loading) {
      return (
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/connect" element={<BankSelector />}></Route>
        </Routes>
      );
    }
  }
}

export default App;
