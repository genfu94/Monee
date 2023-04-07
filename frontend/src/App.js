import {
  Route,
  Routes
} from "react-router-dom";

import React from "react";
import Home from "./pages/Home.js"
import WebFont from 'webfontloader';
import BankSelector from "./pages/BankSelector.js";


class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    WebFont.load({
      google: {
        families: ['Montserrat']
      }
    });
  }

  render() {
    return (
      <Routes>
        <Route exact path='/' element={< Home />}>
        </Route>
        <Route exact path='/connect' element={< BankSelector />}>
        </Route>
      </Routes>
    );
  }
}

export default App;
