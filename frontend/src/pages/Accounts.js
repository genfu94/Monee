import React from "react";
import NavBar from "../components/NavBar/Navbar.js";
import AccountManager from "../components/AccountManager/AccountManager.js";
import TransactionList from "../components/TransactionList/TransactionList.js";
import "./style.css";

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
      <div className="main-container">
        <NavBar />
        <div style={{display:"flex", flexDirection:"column", flex: "1 1 auto"}}>
          <AccountManager account_list={this.state.accounts} />
        </div>
      </div>
    );
  }
}

export default Home;
