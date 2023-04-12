import React from "react";
import "./style.css";
import { HiOutlineLightBulb } from "react-icons/hi";
import { AiFillEye } from "react-icons/ai";
import Checkbox from "@mui/material/Checkbox";
import { BsCircleFill } from "react-icons/bs";

export default class TransactionList extends React.Component {
  constructor(props) {
    super(props);
  }

  #renderTransactionItem(transaction) {
    return (
      <div className="transaction">
        <div className="transaction-select-box">
          <input type="checkbox" />
        </div>
        <div className="transaction-info-container">
          <div className="transaction-info">
            <div className="transaction-info-category">
              <span className="circle">
                <HiOutlineLightBulb style={{ color: "#fff" }} />
              </span>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "0.8em",
                  fontFamily: "Montserrat",
                }}
              >
                &nbsp;Energy, utilities
              </span>
            </div>
            <div className="transaction-info-account">
              <BsCircleFill
                style={{ fontSize: "0.5em", color: "rgb(255, 160, 0)" }}
              />
              &nbsp; N26 - Conto Corrente Principale
            </div>
            <div className="transaction-info-entity">
              {transaction.origin}
            </div>
            <div className="transaction-info-description">{transaction.text}</div>
          </div>
          <div className="transaction-amount-section">
            <div className={`target-currency-transaction-amount ${transaction.transaction_amount.amount > 0 ? "transaction-income":""}`}>{transaction.transaction_amount.currency}&nbsp;{transaction.transaction_amount.amount}</div>
            <div className="original-currency-transaction-amount">{transaction.transaction_amount.currency}&nbsp;{transaction.transaction_amount.amount}</div>
          </div>
        </div>
      </div>
    );
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
            Object.keys(this.props.transactions).map((transaction_id) => this.#renderTransactionItem(this.props.transactions[transaction_id]))
          }
        </div>
      </div>
    );
  }
}
