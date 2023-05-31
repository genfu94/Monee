import React from "react";
import { useFormik } from "formik";
import { Box, TextField, Typography, Button, Divider } from "@mui/material";

import "./TransactionForm.style.css";
import { update_transaction } from "./api";
import {
  AmountTextField,
  defaultFormValues,
  formValuesToTransactionObject,
} from "./constants.js";
import LabeledInput from "../LabeledInput/LabeledInput.js";
import ToggleButtonSelector from "./ToggleButtonSelector.js";
import DatetimePicker from "./DateTimePicker.js";
import NestedSelector from "../NestedSelector/NestedSelector.js";
import {
  CATEGORIES_TREE,
  CATEGORIES_ICON_ENUM,
} from "../../Pages/Transactions/categories.js";

function TransactionForm({ transaction, onChange }) {
  const data = CATEGORIES_TREE;

  const formik = useFormik({
    initialValues: defaultFormValues(transaction),
    onSubmit: (values) => {
      const newTransaction = formValuesToTransactionObject(values);
      update_transaction(newTransaction, transaction);
      onChange(newTransaction);
    },
  });

  const renderValue = (value) => (
    <Box style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      <Box
        style={{
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          flexShrink: 0,
          background: CATEGORIES_ICON_ENUM[value].color,
        }}
      >
        {CATEGORIES_ICON_ENUM[value].icon}
      </Box>
      &nbsp;{" "}
      <Typography style={{ float: "right", fontSize: "13px" }}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <form
      className="transaction-editor__container"
      onSubmit={formik.handleSubmit}
    >
      <Typography className="transaction-editor__header">
        Edit transaction
      </Typography>

      <Box className="transaction-editor__main-info-container">
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
            renderValue={renderValue}
            value={formik.values.category}
            onChange={(c) => formik.setFieldValue("category", c)}
            sx={{ Button: { height: "3rem" } }}
            data={data}
          />
        </LabeledInput>
      </Box>

      <Divider style={{ margin: "0.45rem 0px 0.45rem 0px" }} />

      <Box className="transaction-editor__general-info-container">
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
      </Box>

      <Button type="submit">Submit</Button>
    </form>
  );
}

export default TransactionForm;
