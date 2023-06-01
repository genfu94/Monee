import React from "react";

import { Route, Routes } from "react-router-dom";
import { Dashboard, Transactions, Accounts } from "./pages";

function Router({ accounts }) {
  return (
    <Routes>
      <Route exact path="/" element={<Dashboard accounts={accounts} />} />
      <Route
        exact
        path="/transactions"
        element={<Transactions accounts={accounts} />}
      />
      <Route
        exact
        path="/accounts"
        element={<Accounts accounts={accounts} />}
      />
    </Routes>
  );
}

export default Router;
