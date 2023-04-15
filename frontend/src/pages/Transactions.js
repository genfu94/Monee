import React from "react";
import SideMenuLayout from "./SideMenuLayout.js";
import "./style.css";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: {},
      accounts: [],
    };

    fetch(`http://localhost:8000/fetch_linked_accounts?username=user`)
      .then((res) => res.json())
      .then((data) => {
        let all_transactions = {};
        let all_accounts = [];
        for (const account of data) {
          all_transactions = Object.assign(
            all_transactions,
            account.transactions
          );
          all_accounts.push(account.institution_name + " - " + account.name);
        }
        this.setState({
          transactions: all_transactions,
          accounts: all_accounts,
        });
      });
  }

  render() {
    //<TransactionList transactions={this.state.transactions} />
    return (
      <>
        <SideMenuLayout sideMenuTitle="Transactions"/>
      </>
    );
  }
}

export default Home;
