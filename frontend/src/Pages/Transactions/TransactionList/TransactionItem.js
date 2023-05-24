import React from "react";
import { BsCircleFill } from "react-icons/bs";
import { CATEGORIES_ICON_ENUM } from "../categories";

import "../../../Styles/globals.style.css";
import "./TransactionItem.style.css";

const renderValue = (value) => (
  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
    <div
      style={{
        width: "2rem",
        height: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        flexShrink: 0,
        background: CATEGORIES_ICON_ENUM[value].color,
      }}
    >
      {CATEGORIES_ICON_ENUM[value].icon}
    </div>
    &nbsp; <div style={{ float: "right", fontSize: "0.8rem" }}>{value}</div>
  </div>
);

export default function TransactionItem({ transaction, onItemClick }) {
  return (
    <div className="selectable-item transaction" onClick={onItemClick}>
      <div className="info-container">
        <input type="checkbox" />

        <div style={{flexBasis: "30%"}}>{renderValue(transaction.category)}</div>

        <div style={{fontSize: '12px'}}>
          <BsCircleFill
            style={{ fontSize: "0.5em", color: "rgb(255, 160, 0)" }}
          />
          &nbsp; N26 - Conto Corrente Principale
        </div>

        <div className="transaction-info-entity">{transaction.origin}</div>
        <div className="transaction-info-description">{transaction.text}</div>

        <div className="flex-centered-vertical transaction-amount-section">
          <div
            className={`${
              transaction.transaction_amount.amount > 0
                ? "transaction-income"
                : "target-currency-transaction-amount"
            }`}
          >
            {transaction.transaction_amount.currency}&nbsp;
            {transaction.transaction_amount.amount}
          </div>
          <div className="original-currency-transaction-amount">
            {transaction.transaction_amount.currency}&nbsp;
            {transaction.transaction_amount.amount}
          </div>
        </div>
      </div>
    </div>
  );
}
