import React from "react";

import { Navigate, Route, Routes, redirect } from "react-router-dom";
import { Dashboard, Transactions, Accounts, LoginPage } from "./pages";
import { useAuth } from "./AuthProvider";
import { authenticate } from "./apis";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ route, children }) {
  const { authenticated, setAuthenticated } = useAuth();
  console.log("Going to", route, authenticated);
  return authenticated ? children : <Navigate to="/login" replace />;
}

function Router({ accounts }) {
  const navigate = useNavigate();
  const { authenticated, setAuthenticated } = useAuth();

  const handleLogin = async (username, password) => {
    try {
      const response = await authenticate(username, password);
      localStorage.setItem("token", response.access_token);
      console.log("Login successful. Redirecting...", response.access_token);
      setAuthenticated(true);
      console.log("Set authenticated to true");
      navigate("/");
    } catch (error_code) {
      console.error("Token request responded with", error_code);
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
      <Route
        exact
        path="/"
        element={
          <ProtectedRoute route="Main">
            <Dashboard accounts={accounts} />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions accounts={accounts} />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/accounts"
        element={
          <ProtectedRoute>
            <Accounts accounts={accounts} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default Router;
