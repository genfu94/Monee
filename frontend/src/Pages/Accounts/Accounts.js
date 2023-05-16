import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { AiFillBank } from "react-icons/ai";

import "./style.css";
import { dialogStyle } from "./Accounts.style";
import { GET_request } from "../../Utils/network";
import SideMenuLayout from "../SideMenuLayout.js";
import BankSelector from "./BankSelector/BankSelector.js";

function renderAccountItem(item) {
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

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [dialog, setDialog] = useState(false);
  const showDialog = () => setDialog(true);
  const closeDialog = () => setDialog(false);

  useEffect(() => {
    const endpoint = "http://localhost:8000/fetch_linked_accounts";
    const params = {
      username: "user",
    };
    GET_request(endpoint, params).then((data) => setAccounts(data));
  }, []);

  return (
    <>
      <SideMenuLayout
        sideMenuTitle="Accounts"
        sideMenuContent={
          <div onClick={showDialog} className="add-account-btn">
            +Add
          </div>
        }
        content={accounts.map(item => renderAccountItem(item))}
      />

      <Modal disableAutoFocus={true} open={dialog} onClose={closeDialog}>
        <Box sx={dialogStyle}>
          <BankSelector />
        </Box>
      </Modal>
    </>
  );
}

export default Accounts;
