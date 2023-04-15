import React from "react";
import NavBar from "../components/NavBar/Navbar.js";
import AccountManager from "../components/AccountManager/AccountManager.js";
import TransactionList from "../components/TransactionList/TransactionList.js";
import "./style.css";
import SideMenuLayout from "./SideMenuLayout.js";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts: [],
    };

    fetch(`http://localhost:8000/fetch_linked_accounts?username=user`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setState({
          accounts: data,
        });
      });
  }

  render() {
    return (
      <>
        <SideMenuLayout
          sideMenuTitle="Accounts"
          content={<AccountManager account_list={this.state.accounts} />}
        />
      </>
    );
  }
}

export default Home;
