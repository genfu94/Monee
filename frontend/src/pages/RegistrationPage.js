import React, { useState } from "react";
import login_hero from "../assets/imgs/login_hero.jpeg";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const RegistrationPage = ({ handleRegistration }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegistration(username, password);
  };

  return (
    <div className="equal-columns full-page login-page">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "70%" }}>
          <h1 style={{ fontFamily: "Noto Serif", color: "#333" }}>
            Create Monee Account
          </h1>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
          >
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
        </div>
      </div>
      <div style={{ margin: 0, padding: 0 }}>
        <img src={login_hero} className="hero-image"></img>
      </div>
    </div>
  );
};

export default RegistrationPage;
