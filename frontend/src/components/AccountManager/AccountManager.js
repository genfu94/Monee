import React from "react";
import "./style.css";
import { AiFillBank } from "react-icons/ai"

class AccountManager extends React.Component {
  constructor(props) {
    super(props);

    const { account_list } = props;

    this.state = {
      account_list: account_list,
    };
  }

  #renderAccountItem(item) {
    const iconStyle = {"borderRadius": "50%", padding: "10px", "backgroundColor": "green", color: "white", fontSize: "30px"};

    return (
        <li className="account-item" key={item.account_id}>
          <AiFillBank style={iconStyle}/>
          <div className="account-name">
            {item.bank_linking_details.institution.name} - {item.account_name}
          </div>
          <div>{item.balances[0].amount}</div>
        </li>
      )
  }

  render() {
    return (
      <ul className="account-list">
        {this.state.account_list.map((item) => this.#renderAccountItem(item))}
      </ul>
    );
  }
}

export default AccountManager;
