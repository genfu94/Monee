import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import "../style.css";
import { dialogStyle } from "./Accounts.style";
import { GET_request } from "../../Utils/network";
import AccountManager from "../../Components/AccountManager/AccountManager.js";
import SideMenuLayout from "../SideMenuLayout.js";
import BankSelector from "../../Components/BankSelector/BankSelector.js";

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
        content={<AccountManager account_list={accounts} />}
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
