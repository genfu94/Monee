import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { LoginLayout } from "../layouts/LoginLayout.js";

const LoginPage = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(username, password);
  };

  return (
    <LoginLayout>
      <h1 style={{ fontFamily: "Noto Serif", color: "#333" }}>Welcome Back</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          variant="outlined"
        />
        <TextField
          type={"password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          label="Password"
          variant="outlined"
        />
        <Button variant="contained" onClick={handleSubmit}>
          Login
        </Button>
        <div
          style={{
            fontFamily: "Noto Serif",
            fontWeight: 200,
            textAlign: "right",
          }}
        >
          Not a user? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </LoginLayout>
  );
};

export default LoginPage;
