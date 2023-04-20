import React from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { TextField } from "@mui/material";
import Select, { components } from "react-select";
import { AiOutlineQuestion } from "react-icons/ai";
import { MdRestaurant } from "react-icons/md";

import "./TransactionForm.style.css";
import { AmountTextField } from "./constants.js";
import LabeledInput from "./LabeledInput.js";
import ToggleButtonSelector from "./ToggleButtonSelector.js";
import DatetimePicker from "./DateTimePicker.js";
import dayjs from "dayjs";

function formatDate(v) {
  return `${v["$y"]}-${v["$M"].toString().padStart(2, "0")}-${v["$D"]
    .toString()
    .padStart(2, "0")}`;
}

function TransactionForm() {
  const formik = useFormik({
    initialValues: {
      amount: "",
      type: "expense",
      datetime: dayjs("2023-04-15 00:00:00"),
      origin: "",
      reason: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const data = [
    {
      value: 0,
      text: "Unknown",
      icon: (
        <div style={{ backgroundColor: "#454545" }} className="circle">
          <AiOutlineQuestion style={{ color: "white" }} />
        </div>
      ),
    },
    {
      value: 1,
      text: "Food&Drink",
      icon: (
        <div style={{ backgroundColor: "red" }} className="circle">
          <MdRestaurant style={{ color: "white" }} />
        </div>
      ),
    },
  ];

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
            labels={["Expense", "Income", "Transfer"]}
            value={formik.values.type}
            onChange={(v) => formik.setFieldValue("type", v)}
          />
        </LabeledInput>
        <LabeledInput style={{flexBasis: "100%"}} label="Category">
          <Select
            placeholder="Select Option"
            options={data}
            fullWidth
            getOptionLabel={(e) => (
              <div style={{ display: "flex", alignItems: "center" }}>
                {e.icon}
                <span style={{ marginLeft: 5 }}>{e.text}</span>
              </div>
            )}
          />
        </LabeledInput>
      </div>

      <Divider />

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
