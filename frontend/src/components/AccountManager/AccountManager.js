import React from "react";
import "./style.css";
import { AiFillBank } from "react-icons/ai";

class AccountManager extends React.Component {
  constructor(props) {
    super(props);
  }

  #renderAccountItem(item) {
    const iconStyle = {
      borderRadius: "50%",
      padding: "10px",
      backgroundColor: "green",
      color: "white",
      fontSize: "30px",
    };

    return (
      <li className="account-item" key={item._id}>
        <AiFillBank fontSize="30px" />
        <div className="account-info-container">
          <div className="account-name">
            {item.institution_name} - {item.name}
          </div>
          <div className="account-balance">
            {item.balances[0].currency}: {item.balances[0].amount}
          </div>
        </div>
      </li>
    );
  }

  render() {
    return (
      <div className="account-list-container ">
        <div id="account-label">ACCOUNTS</div>
        <ul className="account-list">
          {this.props.account_list.map((item) => this.#renderAccountItem(item))}
        </ul>
      </div>
    );
  }
}

export default AccountManager;
