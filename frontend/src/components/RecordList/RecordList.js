import React from "react";
import "./style.css";
import { HiOutlineLightBulb } from "react-icons/hi";
import { BsCircleFill } from "react-icons/bs";

export default function RecordList() {
  return (
    <div className="record-entry">
      <div className="record-selector">
        <input style={{margin: "5px"}} type="checkbox" />
      </div>
      <div className="record-info-container">
        <div className="record-info-category">
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
        <div className="record-info-account">
          <BsCircleFill
            style={{ fontSize: "0.5em", color: "rgb(255, 160, 0)" }}
          />
          &nbsp; N26 - Conto corrente principale
        </div>
        <div className="record-info-entity">
          IT52V0200874130000400611684
        </div>
        <div className="record-info-description">
          Luce & Gas 02/23
        </div>
      </div>
    </div>
  );
}
