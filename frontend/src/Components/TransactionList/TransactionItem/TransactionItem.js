import React from "react";
import "./TransactionItem.style.css";
import { HiOutlineLightBulb } from "react-icons/hi";
import { BsCircleFill } from "react-icons/bs";
import { category_tree, findCategoryByValue } from "../../categories";

export default function TransactionItem(props) {
  let transaction = props.transaction;
  let onItemClick = props.onItemClick;
  return (
    <div
      className="flex-centered selectable-item transaction"
      onClick={onItemClick}
    >
      <input type="checkbox" />
      <div className="flex-centered transaction-info">
        <div className="flex-centered transaction-info-category">
          {
            findCategoryByValue(category_tree, "", transaction.category)[2]
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