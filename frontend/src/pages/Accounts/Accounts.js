import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { AiFillBank } from "react-icons/ai";

import "./style.css";
import { dialogStyle } from "./Accounts.style";
import SideMenuLayout from "../SideMenuLayout";
import BankSelector from "./BankSelector/BankSelector.js";

function renderAccountItem(item) {
  return (
    <div className="account-item selectable-item" key={item._id}>
      <AiFillBank className="account-icon"/>
      <div className="account-name">
        {item.account.institution_name} - {item.account.name}
      </div>
      <div className="account-type">Bank Account</div>
      <div className="account-balance">
        {item.account.balances[0].currency} {item.account.balances[0].amount}
      </div>
    </div>
  );
}

function Accounts({accounts = []}) {
  const [dialog, setDialog] = useState(false);
  const showDialog = () => setDialog(true);
  const closeDialog = () => setDialog(false);

  return (
    <>
      <SideMenuLayout
        page="Accounts"
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
