import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import { Dashboard, Transactions, LoginPage, RegistrationPage } from "./pages";
import { authenticate, register } from "./apis";
import { useNavigate } from "react-router-dom";
import jwt from "jwt-decode";
import { useAuth } from "./AuthProvider";

function isTokenValid() {
  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  const expirationTimestamp = jwt(token).exp * 1000; // Convert to milliseconds
  return expirationTimestamp > Date.now() + 60 * 60 * 1000; // Check if expired (1 hour tolerance)
}

function ProtectedRoute({ route, children }) {
  const { authenticated, setAuthenticated } = useAuth();
  const isAuthenticated = isTokenValid();
  if (isAuthenticated) setAuthenticated(true);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function Router({ accounts }) {
  const navigate = useNavigate();
  const { authenticated, setAuthenticated } = useAuth();

  const handleLogin = async (username, password) => {
    try {
      const response = await authenticate(username, password);
      localStorage.setItem("token", response.access_token);
      setAuthenticated(true);
      console.log("Login successful. Redirecting...", response.access_token);
      navigate("/");
    } catch (error_code) {
      console.error("Token request responded with", error_code);
    }
  };

  const handleRegistration = async (username, password) => {
    try {
      const response = await register(username, password);
      console.log("Registration successful. Redirecting to Login");
      navigate("/login");
    } catch (error_code) {
      console.error("Registration request responded with", error_code);
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
      <Route
        path="/register"
        element={<RegistrationPage handleRegistration={handleRegistration} />}
      />
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
          <ProtectedRoute route="Transactions">
            <Transactions accounts={accounts} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default Router;
