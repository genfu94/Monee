import React from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { TextField } from "@mui/material";
import { AiOutlineQuestion } from "react-icons/ai";
import { MdRestaurant } from "react-icons/md";

import "./TransactionForm.style.css";
import { AmountTextField } from "./constants.js";
import LabeledInput from "./LabeledInput.js";
import ToggleButtonSelector from "./ToggleButtonSelector.js";
import DatetimePicker from "./DateTimePicker.js";
import dayjs from "dayjs";
import NestedSelector from "./NestedSelector/NestedSelector.js";
import { build_categories_tree } from "../categories.js";

function formatDate(v) {
  return `${v["$y"]}-${(v["$M"] + 1).toString().padStart(2, "0")}-${v["$D"]
    .toString()
    .padStart(2, "0")}`;
}

function TransactionForm(props) {
  const { transaction_amount, origin, text, booking_date } = props.transaction;

  const formik = useFormik({
    initialValues: {
      amount: transaction_amount.amount,
      type: transaction_amount.amount < 0 ? "expense" : "income",
      datetime: dayjs(booking_date + " 00:00:00"),
      origin: origin,
      reason: text,
    },
    onSubmit: (values) => {
      values["datetime"] = formatDate(values["datetime"]);
      console.log(values);
    },
  });

  // const data = [
  //   {
  //     value: 0,
  //     text: "Unknown",
  //     icon: (
  //       <div style={{ backgroundColor: "#454545" }} className="circle">
  //         <AiOutlineQuestion style={{ color: "white" }} />
  //       </div>
  //     ),
  //   },
  //   {
  //     value: 1,
  //     text: "Food&Drink",
  //     icon: (
  //       <div style={{ backgroundColor: "red" }} className="circle">
  //         <MdRestaurant style={{ color: "white" }} />
  //       </div>
  //     ),
  //     submenu: (
  //       <div>SubMenu</div>
  //     )
  //   },
  // ];

  const data = build_categories_tree();

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
        <LabeledInput style={{ flexBasis: "100%" }} label="Category">
          <NestedSelector sx={{ Button: { height: "50px" } }} data={data} />
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
