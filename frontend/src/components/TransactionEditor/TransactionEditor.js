import React, { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TransactionEditorLayout from "./TransactionEditorLayout.js";

function TransactionTypeSelector() {
  const TRANSACTION_TYPES = ["expense", "income", "transfer"];

  const [type, setType] = useState(TRANSACTION_TYPES[0]);
  const updateSelection = (_, type) => setType(type);

  const toggleStyle = {
    "&": {
      textTransform: "none",
      fontFamily: "Montserrat",
      color: "rgb(150, 150, 150)",
      borderColor: "blue",
      height: "47px",
    },
    "&.Mui-selected": {
      backgroundColor: "blue !important",
      color: "white",
      fontWeight: "bold",
    },
    "&.Mui-hover": {
      backgroundColor: "rgb(255, 255, 255 \0.1)",
    },
  };

  return (
    <ToggleButtonGroup
      value={type}
      exclusive
      onChange={updateSelection}
      style={{ display: "block" }}
    >
      {TRANSACTION_TYPES.map((item) => (
        <ToggleButton
          key={item}
          selected={type === item}
          sx={toggleStyle}
          value={item}
        >
          {item[0].toUpperCase() + item.substring(1)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

class TransactionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionType: "expense",
      amount: "",
    };

    this.handleChange = (e) => this.setState({ amount: e.target.value });
  }

  render() {
    return (
      <div className="transaction-editor__container">
        <div className="transaction-editor__header">Edit transaction</div>
        <div className="transaction-editor__main-info-container">
          <div className="transaction-editor__amount">
            <div
              style={{
                fontFamily: "Montserrat",
                fontSize: "12px",
                marginBottom: "7px",
                color: "rgb(150, 150, 150)",
              }}
            >
              Amount
            </div>
            <TextField
              InputLabelProps={{ shrink: false }}
              value={this.state.amount}
              onChange={this.handleChange}
              sx={{
                display: "inline-block",
                width: "100px",
                input: {
                  height: "30px",
                  fontSize: "20px",
                  color: "#c6d065",
                  fontWeight: "700",
                  fontFamily: "Montserrat",
                },
              }}
              size="small"
              label={this.state.amount === "" ? "Amount" : ""}
              variant="outlined"
            />
          </div>
          <div className="transaction-editor__type">
            <div>
              <div
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "12px",
                  marginBottom: "7px",
                  color: "rgb(150, 150, 150)",
                }}
              >
                Type
              </div>
              <TransactionTypeSelector />
            </div>
          </div>
        </div>
        <Divider />
        <div className="transaction-editor__general-info-container">
          <div className="transaction-editor__datetime">
            <div>
              <div
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  fontWeight: "600",
                  margin: "7px 0px 7px 0px",
                }}
              >
                Date
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker size="small" />
              </LocalizationProvider>
            </div>
          </div>
          <div className="transaction-editor__payee">
            <div>
              <div
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  fontWeight: "600",
                  margin: "7px 0px 7px 0px",
                }}
              >
                Payee
              </div>
              <TextField
                sx={{
                  marginBottom: "10px",
                  input: {
                    color: "#c6d065",
                    fontWeight: "700",
                    fontFamily: "Montserrat",
                  },
                }}
                label="Payee of the transaction"
                variant="outlined"
              />
            </div>
          </div>
          <div className="transaction-editor__reason">
            <div>
              <div
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  fontWeight: "600",
                  margin: "7px 0px 7px 0px",
                }}
              >
                Reason
              </div>
              <TextField
                sx={{
                  marginBottom: "10px",
                  input: {
                    color: "#c6d065",
                    fontWeight: "700",
                    fontFamily: "Montserrat",
                  },
                }}
                fullWidth={true}
                label="Reason of the transaction"
                variant="outlined"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TransactionEditor;
