import React from "react";
import Modal from "@mui/material/Modal";
import Box from '@mui/material/Box';

import "./style.css";
import AccountManager from "../Components/AccountManager/AccountManager.js";
import SideMenuLayout from "./SideMenuLayout.js";
import BankSelector from "../Components/BankSelector/BankSelector.js";


class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts: [],
      showNewAccountDialog: false,
    };

    fetch(`http://localhost:8000/fetch_linked_accounts?username=user`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setState({
          accounts: data,
        });
      });

    this.openNewAccountDialog = () => this.setState({ showNewAccountDialog: true });
    this.closeNewAccountDialog = () => this.setState({ showNewAccountDialog: false });
  }

  render() {
    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      borderRadius: "10px",
      boxShadow: 24,
      p: 1
    };

    return (
      <>
        <SideMenuLayout
          sideMenuTitle="Accounts"
          sideMenuContent={
            <div onClick={this.openNewAccountDialog} className="add-account-btn">
              +Add
            </div>
          }
          content={<AccountManager account_list={this.state.accounts} />}
        />

        <Modal disableAutoFocus={true} open={this.state.showNewAccountDialog} onClose={this.closeNewAccountDialog}>
          <Box sx={style}>
            <BankSelector/>
          </Box>
        </Modal>
      </>
    );
  }
}

export default Home;
