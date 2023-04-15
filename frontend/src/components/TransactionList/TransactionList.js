import React from "react";
import "./TransactionList.style.css";
import { AiFillEye } from "react-icons/ai";
import Checkbox from "@mui/material/Checkbox";
import TransactionItem from "./TransactionItem/TransactionItem.js";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

export default class TransactionList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          flex: 1,
        }}
      >
        <div className="side-menu">
          <li>
            <Checkbox
              icon={<AiFillEye style={{ color: "#292929" }} />}
              checkedIcon={<AiFillEye style={{ color: "blue" }} />}
            />
            N26 - Conto corrente principale
          </li>
        </div>
        <div className="transaction-list-container">
          <List
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {Object.keys(this.props.transactions).map((sectionId) => (
              <li key={`section-${sectionId}`}>
                <ul>
                  <ListSubheader style={{ backgroundColor: "#eff0f2" }}>
                    <div style={{ fontSize: "12px", fontWeight: "900" }}>
                      {sectionId}
                    </div>
                  </ListSubheader>
                  {this.props.transactions[sectionId].map((item) => {
                    return (
                      <ListItem key={`item-${item.id}`}>
                        <TransactionItem transaction={item} />
                      </ListItem>
                    );
                  })}
                </ul>
              </li>
            ))}
          </List>
        </div>
      </div>
    );
  }
}
