import React, { useState } from "react";
import { Modal, Box, Card } from "@mui/material";
import "./style.css";
import { dialogStyle } from "./Accounts.style";
import BankSelector from "./BankSelector/BankSelector.js";
import SideMenuLayout from "../SideMenuLayout";
import randomColor from "randomcolor";

const generateColors = (numColors) => {
  const hue = Math.floor(81 + Math.random() * 60); // Random hue value between 81 and 141
  const newColors = randomColor({
    count: numColors,
    hue: hue,
    luminosity: "dark",
  });
  return newColors;
};

function renderAccountCard(item, color) {
  console.log(item, color);
  return (
    <Card sx={{ width: "15rem", padding: "0.7rem", position: "relative" }}>
      <img
        src={item.institution.logo}
        style={{
          position: "absolute",
          opacity: "0.05",
          width: "25%",
          top: "40%",
          left: "60%",
        }}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          style={{ height: "2rem", marginRight: "0.4rem" }}
          src={item.institution.logo}
        />
        <span
          style={{
            fontFamily: "Montserrat",
            fontWeight: 600,
            fontSize: "0.8rem",
          }}
        >
          {item.institution.name}
          <div
            style={{
              fontFamily: "Montserrat",
              fontWeight: 300,
              fontSize: "0.8rem",
            }}
          >
            {item.name}
          </div>
        </span>
      </div>
      <div
        style={{
          fontFamily: "REM",
          fontWeight: 600,
          fontSize: "1.6rem",
          margin: "1rem",
          color: color,
        }}
      >
        {Intl.NumberFormat("en-US", {
          style: "currency",
          currency: item.balances[0].currency,
        }).format(item.balances[0].amount)}
      </div>
    </Card>
  );
}

function addBankCard(onClick) {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: "10rem",
        padding: "0.7rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "5rem",
          width: "5rem",
          borderRadius: "50%",
          background: "#248d1299",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "4rem", color: "white" }}>+</span>
      </div>
    </Card>
  );
}

function Accounts({ accounts = [] }) {
  const [dialog, setDialog] = useState(false);
  const showDialog = () => setDialog(true);
  const closeDialog = () => setDialog(false);
  const colors = generateColors(accounts.length);
  return (
    <>
      <SideMenuLayout
        page="Accounts"
        content={
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {accounts.map((account, i) =>
              renderAccountCard(account, colors[i])
            )}
            {addBankCard(showDialog)}
          </div>
        }
      />
      <Modal disableAutoFocus={true} open={dialog} onClose={closeDialog}>
        <Box sx={dialogStyle}>
          <BankSelector />
        </Box>
      </Modal>
    </>
  );
}

export default Accounts;
