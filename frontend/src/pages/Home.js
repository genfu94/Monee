import React from "react";
import NavBar from "../components/NavBar/navbar.js";
import AccountManager from "../components/AccountManager/AccountManager.js";
import TransactionList from "../components/TransactionList/TransactionList.js"

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.accounts = [
      {
        account_id: "34634dgsd-52352asdgw3",
        account_name: "Conto corrente principale",
        bank_linking_details: {
          client: "Nordigen",
          requisition_id: "346363-235235dfs563-12124",
          institution: {
            name: "N26 Bank",
            id: "N26_NTSBDEB1",
          },
          link: "https://ob.nordigen.com/psd2/start/346363-235235dfs563-12124/N26_NTSBDEB1",
          status: 1,
        },
        balances: [
          {
            currency: "EUR",
            amount: 435.85,
          },
        ],
        transactions: [],
      },
      {
        account_id: "34634dgsd-52352asdgw3",
        account_name: "Principale",
        bank_linking_details: {
          client: "Nordigen",
          requisition_id: "346363-235235dfs563-12124",
          institution: {
            name: "Hype",
            id: "N26_NTSBDEB1",
          },
          link: "https://ob.nordigen.com/psd2/start/346363-235235dfs563-12124/N26_NTSBDEB1",
          status: 1,
        },
        balances: [
          {
            currency: "EUR",
            amount: 435.85,
          },
        ],
        transactions: [],
      }
    ];
  }

  render() {
    return (
      <>
        <NavBar />
        <AccountManager account_list={this.accounts} />
        <TransactionList/>
      </>
    );
  }
}

export default Home;
