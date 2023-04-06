import React from "react";
import "./style.css";
import { HiOutlineLightBulb } from "react-icons/hi";
import { BsCircleFill } from "react-icons/bs";

export default function RecordList() {
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
            &nbsp; N26 - Conto corrente principale
          </div>
          <div className="transaction-info-entity">IT52V0200874130000400611684</div>
          <div className="transaction-info-description">Luce & Gas 02/23</div>
        </div>
        <div className="transaction-amount-section">
          <div className="target-currency-transaction-amount">
            - €42.15
          </div>
          <div className="original-currency-transaction-amount">
            - €42.15
          </div>
        </div>
      </div>
    </div>
  );
}
