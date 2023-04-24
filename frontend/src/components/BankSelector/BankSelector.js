import React from "react";
import Select from "react-select";
import Button from "@mui/material/Button";
import { BsBank } from "react-icons/bs";

import "./BankSelector.style.css";
import { userInfo } from "../../keycloak.js";
import { COUNTRY_CODES, selectStyle } from "./constants.js";
import useBankSelector from "./hook.js";
import {bankConnect} from "./utility.js";

function BankSelector() {
  const [
    institutions,
    setInstitutionsByCountry,
    selectedInstitution,
    setSelectedInstitution,
  ] = useBankSelector();

  return (
    <div className="bank-selector-container">
      <div className="bank-selector-header">SEARCH YOUR BANK</div>

      <div className="bank-icon">
        <BsBank style={{ fontSize: "100px", color: "white" }} />
      </div>
      <div className="select-label">Select your Country</div>

      <Select
        styles={selectStyle}
        options={COUNTRY_CODES}
        onChange={(c) => setInstitutionsByCountry(c.value)}
      />
      <div className="select-label">Select your Bank</div>
      <Select
        styles={selectStyle}
        options={institutions}
        onChange={setSelectedInstitution}
      />

      <Button
        variant="outlined"
        disabled={selectedInstitution ? false : true}
        onClick={() =>
          bankConnect(selectedInstitution, userInfo.username)
        }
      >
        Connect
      </Button>
    </div>
  );
}

export default BankSelector;
