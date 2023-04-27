import React from "react";
import "./TransactionItem.style.css";
import { BsCircleFill } from "react-icons/bs";

export default function TransactionItem(props) {
  let transaction = props.transaction;
  let onItemClick = props.onItemClick;
  let tree = props.tree;

  return (
    <div
      className="flex-centered selectable-item transaction"
      onClick={onItemClick}
    >
      <input type="checkbox" />
      <div className="flex-centered transaction-info">
        <div className="flex-centered transaction-info-category">
          {
            tree.find(transaction.category).attributes.label
          }
        </div>
        <div className="flex-centered transaction-info-account">
          <BsCircleFill
            style={{ fontSize: "0.5em", color: "rgb(255, 160, 0)" }}
          />
          &nbsp; N26 - Conto Corrente Principale
        </div>
        <div className="flex-centered transaction-info-entity">
          {transaction.origin}
        </div>
        <div className="flex-centered transaction-info-description">
          {transaction.text}
        </div>
      </div>

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
  );
}
