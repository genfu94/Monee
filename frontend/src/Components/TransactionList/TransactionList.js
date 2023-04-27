import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import TransactionItem from "./TransactionItem/TransactionItem.js";
import TransactionForm from "../TransactionForm/TransactionForm.js";
import { Tree } from "../NestedSelector/Tree";
import { category_tree } from "../categories";

export default class TransactionList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transactionSelected: null
    };

    this.tree = new Tree(category_tree);
  }

  render() {
    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 500,
      height: 500,
      bgcolor: "background.paper",
      borderRadius: "10px",
      boxShadow: 24,
      p: 3,
    };
    return (
      <>
        <List>
          {Object.keys(this.props.transactions).map((sectionId) => (
            <li key={`section-${sectionId}`}>
              <ul style={{ margin: "0", padding: "0" }}>
                <ListSubheader
                  style={{
                    backgroundColor: "#eff0f2",
                    fontSize: "12px",
                    fontWeight: "900",
                  }}
                >
                  {sectionId}
                </ListSubheader>
                {this.props.transactions[sectionId].map((item) => {
                  return (
                    <ListItem key={`item-${item.transaction_id}`}>
                      <TransactionItem tree={this.tree} transaction={item} onItemClick={() => this.setState({"transactionSelected": item})}/>
                    </ListItem>
                  );
                })}
              </ul>
            </li>
          ))}
        </List>

        <Modal
          disableAutoFocus={true}
          open={this.state.transactionSelected != null}
          onClose={() => this.setState({ transactionSelected: null })}
        >
          <Box sx={style}>
            <TransactionForm transaction={this.state.transactionSelected}/>
          </Box>
        </Modal>
      </>
    );
  }
}
