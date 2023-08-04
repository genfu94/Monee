import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { LoginLayout } from "../layouts/LoginLayout";

const RegistrationPage = ({ handleRegistration }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegistration(username, password);
  };

  return (
    <LoginLayout>
      <h1 style={{ fontFamily: "Noto Serif", color: "#333" }}>
        Create Monee Account
      </h1>
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
          Sign Up
        </Button>
        <div
          style={{
            fontFamily: "Noto Serif",
            fontWeight: 200,
            textAlign: "right",
          }}
        >
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </LoginLayout>
  );
};

export default RegistrationPage;
