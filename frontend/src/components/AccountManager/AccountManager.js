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
      <div style={{display: "flex", width:"100%", justifyContent: "center"}}>
        <div className="account-item selectable-item" key={item._id}>
          <div style={{ display: "flex", flexBasis: "7%" }}>
            <div
              style={{
                borderRadius: "7px",
                backgroundColor: "rgb(255, 160, 0)",
                margin: "5px",
                padding: "3px 5px",
              }}
            >
              <AiFillBank fontSize="20px" color="#ffffff" />
            </div>
          </div>
          <div className="account-info-container account-name">
            {item.institution_name} - {item.name}
          </div>
          <div className="account-type">Bank Account</div>
          <div className="account-balance">
            {item.balances[0].currency} {item.balances[0].amount}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="account-list-container">
        {this.props.account_list.map((item) => this.#renderAccountItem(item))}
      </div>
    );
  }
}

export default AccountManager;
