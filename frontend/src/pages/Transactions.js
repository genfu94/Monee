import React from "react";
import NavBar from "../components/NavBar/navbar.js";
import AccountManager from "../components/AccountManager/AccountManager.js";
import TransactionList from "../components/TransactionList/TransactionList.js";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts: [],
    };

    fetch(
      `http://localhost:8000/fetch_linked_accounts?username=user`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setState({
          "accounts": data
        })
      });
  }

  render() {
    return (
      <>
        <NavBar />
        <TransactionList />
      </>
    );
  }
}

export default Home;
