import React from "react";
import AccountManager from "../components/AccountManager/AccountManager.js";
import "./style.css";
import SideMenuLayout from "./SideMenuLayout.js";
import Modal from "@mui/material/Modal";
import Box from '@mui/material/Box';

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
      border: "2px solid #000",
      boxShadow: 24,
      p: 4,
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
          <Box sx={style}>Asd</Box>
        </Modal>
      </>
    );
  }
}

export default Home;
