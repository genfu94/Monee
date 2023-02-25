import {
  Route,
  Routes
} from "react-router-dom";

import React from "react";
import Home from "./pages/Home.js"
import WebFont from 'webfontloader';


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
      </Routes>
    );
  }
}

export default App;
