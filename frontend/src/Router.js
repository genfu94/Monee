import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import {
  Dashboard,
  Transactions,
  Accounts,
  LoginPage,
  RegistrationPage,
} from "./pages";
import { useAuth } from "./AuthProvider";
import { authenticate, register } from "./apis";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ route, children }) {
  const { authenticated, setAuthenticated } = useAuth();
  return authenticated ? children : <Navigate to="/login" replace />;
}

function Router({ banks }) {
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
            <Dashboard banks={banks} />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions banks={banks} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default Router;
