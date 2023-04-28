import React from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { TextField } from "@mui/material";

import "./TransactionForm.style.css";
import { update_transaction } from "./api";
import {
  AmountTextField,
  defaultFormValues,
  formValuesToTransactionObject,
} from "./constants.js";
import LabeledInput from "./LabeledInput.js";
import ToggleButtonSelector from "./ToggleButtonSelector.js";
import DatetimePicker from "./DateTimePicker.js";
import NestedSelector from "../NestedSelector/NestedSelector.js";
import { category_tree } from "../categories.js";

function TransactionForm({ transaction }) {
  const data = category_tree;

  const formik = useFormik({
    initialValues: defaultFormValues(transaction),
    onSubmit: (values) => {
      const newTransaction = formValuesToTransactionObject(values);
      update_transaction(newTransaction);
    },
  });

  return (
    <form
      className="transaction-editor__container"
      onSubmit={formik.handleSubmit}
    >
      <div className="transaction-editor__header">Edit transaction</div>

      <div className="transaction-editor__main-info-container">
        <LabeledInput label="Amount">
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
            defaultValue={formik.values.category}
            onChange={(c) => formik.setFieldValue("category", c)}
            sx={{ Button: { height: "50px" } }}
            data={data}
          />
        </LabeledInput>
      </div>

      <Divider style={{ margin: "7px 0px 7px 0px" }} />

      <div className="transaction-editor__general-info-container">
        <LabeledInput label="Datetime">
          <DatetimePicker
            id="datetime-selector"
            value={formik.values.datetime}
            onChange={(v) => formik.setFieldValue("datetime", v)}
          />
        </LabeledInput>

        <LabeledInput label="Payee">
          <TextField
            id="origin"
            value={formik.values.origin}
            onChange={formik.handleChange}
          />
        </LabeledInput>

        <LabeledInput label="Reason">
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
