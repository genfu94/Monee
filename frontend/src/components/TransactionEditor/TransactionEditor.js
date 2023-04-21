import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import TransactionForm from "../TransactionForm/TransactionForm.js";


class TransactionEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TransactionForm {...this.props}/>
    );
  }
}

export default TransactionEditor;
