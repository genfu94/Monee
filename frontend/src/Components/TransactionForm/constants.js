import TextField from "@mui/material/TextField";
import {styled} from "@mui/material/styles";
import dayjs from "dayjs";

export const buttonToggleStyle = {
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

export const AmountTextField = styled(TextField)({
  display: "inline-block",
  width: "100px",
  input: {
    height: "14px",
    fontSize: "20px",
    color: "#c6d065",
    fontWeight: "700",
    fontFamily: "Montserrat",
  }
});

export const defaultFormValues = (transaction) => {
  return {
    account_id: transaction.account_id,
    transaction_id: transaction.transaction_id,
    amount: transaction.transaction_amount.amount,
    type: transaction.type,
    datetime: dayjs(transaction.booking_date),
    origin: transaction.origin,
    reason: transaction.text,
    category: transaction.category,
  };
}

export const formValuesToTransactionObject = (formValues) => {
  return {
    "booking_date": formValues.datetime.format('YYYY-MM-DD HH:mm:ss'),
    "transaction_amount": {
      "amount": formValues.amount,
      "currency": "EUR"
    },
    "origin": formValues.origin,
    "category": formValues.category,
    "type": formValues.type,
    "text": formValues.reason,
    "account_id": formValues.account_id,
    "transaction_id": formValues.transaction_id
  };
}
