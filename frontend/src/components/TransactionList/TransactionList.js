import React from "react";
import "./style.css";
import { AiFillEye } from "react-icons/ai";
import Checkbox from "@mui/material/Checkbox";
import TransactionItem from "../TransactionItem/TransactionItem.js"

export default class TransactionList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="transaction-view-container">
        <ul className="transaction-selector">
          <li>
            <Checkbox
              icon={<AiFillEye style={{ color: "#292929" }} />}
              checkedIcon={<AiFillEye style={{ color: "blue" }} />}
            />
            N26 - Conto corrente principale
          </li>
        </ul>
        <div>
          {
            Object.keys(this.props.transactions).map((transaction_id) => TransactionItem(this.props.transactions[transaction_id]))
          }
        </div>
      </div>
    );
  }
}
