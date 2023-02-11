import './App.css';

import {
  Route,
  Routes
} from "react-router-dom";

import BankSelector from "./BankSelector/BankSelector"

function App() {
  return (
    <Routes>
      <Route exact path='/' element={< BankSelector />}>
      </Route>
    </Routes>
  );
}

export default App;
