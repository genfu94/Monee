import React from "react";
import "./TransactionList.style.css";
import TransactionItem from "./TransactionItem/TransactionItem.js";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";

export default class TransactionList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <List>
        {Object.keys(this.props.transactions).map((sectionId) => (
          <li key={`section-${sectionId}`}>
              <ListSubheader style={{ backgroundColor: "#eff0f2", fontSize: "12px", fontWeight: "900" }}>
                  {sectionId}
              </ListSubheader>
              {this.props.transactions[sectionId].map((item) => {
                return (
                  <ListItem key={`item-${item.transaction_id}`}>
                    <TransactionItem transaction={item} />
                  </ListItem>
                );
              })}
          </li>
        ))}
      </List>
    );
  }
}
