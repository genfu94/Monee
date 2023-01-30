import './App.css';

import {
    Route,
    Routes
  } from "react-router-dom";

function App() {
  return (
      <Routes>
        <Route exact path='/' element={< Home />}></Route>
      </Routes>
  );
}

function Home() {
  return <h2>Home</h2>;
}

export default App;
