import {
  Route,
  Routes
} from "react-router-dom";

import Home from "./pages/Home.js"

function App() {
  return (
    <Routes>
      <Route exact path='/' element={< Home />}>
      </Route>
    </Routes>
  );
}


export default App;
