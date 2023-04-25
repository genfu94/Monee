import React from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { TextField } from "@mui/material";

import { formatDate } from "./helpers.js";
import "./TransactionForm.style.css";
import { AmountTextField } from "./constants.js";
import LabeledInput from "./LabeledInput.js";
import ToggleButtonSelector from "./ToggleButtonSelector.js";
import DatetimePicker from "./DateTimePicker.js";
import dayjs from "dayjs";
import NestedSelector from "./NestedSelector/NestedSelector.js";
import { category_tree } from "../categories.js";

function update_transaction(transaction) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  };

  fetch(
    `http://localhost:8000/update_transaction?account_id=${transaction.account_id}`,
    requestOptions
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("Transaction updated");
    });
}

function TransactionForm(props) {
  const { transaction_id, account_id, category, type, transaction_amount, origin, text, booking_date } =
    props.transaction;
  const data = category_tree;

  const formik = useFormik({
    initialValues: {
      amount: transaction_amount.amount,
      type: type,
      datetime: dayjs(booking_date),
      origin: origin,
      reason: text,
      category: category,
    },
    onSubmit: (values) => {
      values["booking_date"] = formatDate(values["datetime"])
      values["transaction_amount"] = {
        "amount": transaction_amount.amount,
        "currency": "EUR"
      };
      values["text"] = values["reason"];
      values["account_id"] = account_id;
      values["transaction_id"] = transaction_id;
      console.log(values);
      update_transaction(values);
    },
  });

  return (
    <form
      className="transaction-editor__container"
      onSubmit={formik.handleSubmit}
    >
      <div className="transaction-editor__header">Edit transaction</div>

      <div className="transaction-editor__main-info-container">
        <LabeledInput style={{ marginRight: "50px" }} label="Amount">
          <AmountTextField
            id="amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
          />
        </LabeledInput>

        <LabeledInput label="Type">
          <ToggleButtonSelector
            id="type-selector"
            values={["expense", "income", "transfer"]}
            value={formik.values.type}
            onChange={(v) => formik.setFieldValue("type", v)}
          />
        </LabeledInput>
        <LabeledInput style={{ flexBasis: "100%" }} label="Category">
          <NestedSelector
            value={formik.values.category}
            onChange={(c) => formik.setFieldValue("category", c)}
            sx={{ Button: { height: "50px" } }}
            data={data}
          />
        </LabeledInput>
      </div>

      <Divider style={{ margin: "7px 0px 7px 0px" }} />

      <div className="transaction-editor__general-info-container">
        <LabeledInput style={{ flexBasis: "45%" }} label="Datetime">
          <DatetimePicker
            id="datetime-selector"
            value={formik.values.datetime}
            onChange={(v) => formik.setFieldValue("datetime", v)}
          />
        </LabeledInput>

        <LabeledInput style={{ flexBasis: "45%" }} label="Payee">
          <TextField
            id="origin"
            value={formik.values.origin}
            onChange={formik.handleChange}
          />
        </LabeledInput>

        <LabeledInput style={{ flexBasis: "100%" }} label="Reason">
          <TextField
            id="reason"
            fullWidth
            value={formik.values.reason}
            onChange={formik.handleChange}
          />
        </LabeledInput>
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}

export default TransactionForm;
