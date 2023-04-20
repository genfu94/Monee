import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import TransactionForm from "../TransactionForm/TransactionForm.js";


class TransactionEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {transaction_amount, origin, text, booking_date} = this.props.transaction;
    return (
      <TransactionForm />
    );
  }
}

export default TransactionEditor;
