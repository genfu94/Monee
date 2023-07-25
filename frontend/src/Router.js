import React from "react";

import { Route, Routes, Navigate } from "react-router-dom";
import { Dashboard, Transactions, Accounts } from "./pages";
import LoginPage from "./Login";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace={true} />
  );
};

function Router({ isAuthenticated, accounts }) {
  return (
    <Routes>
      <Route exact path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard accounts={accounts} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Transactions accounts={accounts} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Accounts accounts={accounts} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default Router;
