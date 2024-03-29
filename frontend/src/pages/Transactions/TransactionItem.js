import React from "react";
import { BsCircleFill } from "react-icons/bs";
import { CATEGORIES_ICON_ENUM } from "./categories";
import { Box, Typography, ListItemButton } from "@mui/material";

import "./TransactionItem.style.css";
import styled from "@emotion/styled";

const CategoryIcon = styled(Box)(({ theme }) => ({
  width: "2rem",
  height: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  flexShrink: 0,
}));

export default function TransactionItem({ transaction, onItemClick }) {
  return (
    <ListItemButton onClick={onItemClick}>
      <div className="info-container">
        <input type="checkbox" />

        <div style={{ flexBasis: "30%" }}>
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <CategoryIcon
              sx={{
                background: CATEGORIES_ICON_ENUM[transaction.category].color,
              }}
            >
              {CATEGORIES_ICON_ENUM[transaction.category].icon}
            </CategoryIcon>
            &nbsp;{" "}
            <Box>
              <Typography variant="h5">{transaction.origin}</Typography>
              <Typography variant="h6">
                {CATEGORIES_ICON_ENUM[transaction.category].text}
              </Typography>
            </Box>
          </div>
        </div>

        <div className="transaction-info-description">
          {transaction.account}
        </div>

        <div
          className={`${
            transaction.amount.amount > 0
              ? "transaction-income"
              : "target-currency-transaction-amount"
          }`}
        >
          {new Intl.NumberFormat("it-IT", {
            style: "currency",
            currency: transaction.amount.currency,
          }).format(transaction.amount.amount)}
        </div>
      </div>
    </ListItemButton>
  );
}
