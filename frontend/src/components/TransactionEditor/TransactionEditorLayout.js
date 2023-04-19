import React from "react";
import "./TransactionEditorLayout.style.css";
import Divider from "@mui/material/Divider";


function TransactionEditorLayout({title, amount_field, type_selector, datetime_selector, payee_field, reason_field}) {
  return (
    <div className="transaction-editor__container">
      <div className="transaction-editor__header">{title}</div>
      <div className="transaction-editor__main-info-container">
        <div className="transaction-editor__amount">{amount_field}</div>
        <div className="transaction-editor__type">{type_selector}</div>
      </div>
      <Divider />
      <div className="transaction-editor__general-info-container">
        <div className="transaction-editor__datetime">{datetime_selector}</div>
        <div className="transaction-editor__payee">{payee_field}</div>
        <div className="transaction-editor__reason">{reason_field}</div>
      </div>
    </div>
  );
}

export default TransactionEditorLayout;
