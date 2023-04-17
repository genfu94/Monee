import React from "react";
import "./style.css";
import { AiFillBank } from "react-icons/ai";

class AccountManager extends React.Component {
  constructor(props) {
    super(props);
  }

  #renderAccountItem(item) {
    return (
      <div className="account-item selectable-item" key={item._id}>
        <AiFillBank className="account-icon"/>
        <div className="account-name">
          {item.institution_name} - {item.name}
        </div>
        <div className="account-type">Bank Account</div>
        <div className="account-balance">
          {item.balances[0].currency} {item.balances[0].amount}
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        {this.props.account_list.map((item) => this.#renderAccountItem(item))}
      </>
    );
  }
}

export default AccountManager;
