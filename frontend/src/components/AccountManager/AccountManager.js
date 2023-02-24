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

  render() {
    return (
      <ul className="account-list">
        {this.state.account_list.map((item) => (
          <li className="account-item" key={item.account_id}>
            <div>
              <AiFillBank style={{ "border-radius": "50%", padding: "10px", "background-color": "green", color: "white", fontSize: "30px" }}/>
            </div>
            <div className="account-name">
              {item.bank_linking_details.institution.name} - {item.account_name}
            </div>
            <div>{item.balances[0].amount}</div>
          </li>
        ))}
      </ul>
    );
  }
}

export default AccountManager;
