import React from "react";
import Select from "react-select";
import Button from "@mui/material/Button";
import { BsBank } from "react-icons/bs";

import "./BankSelector.style.css";
import { COUNTRY_CODES, selectStyle } from "./constants.js";
import useBankSelector from "./hook.js";
import { bankConnect } from "./utility.js";
import LabeledInput from "../../../components/LabeledInput/LabeledInput";

function BankSelector() {
  const [
    institutions,
    setInstitutionsByCountry,
    selectedInstitution,
    setSelectedInstitution,
  ] = useBankSelector();

  const onCountrySelected = (c) => setInstitutionsByCountry(c.value);
  const onClickConnect = () => bankConnect(selectedInstitution);
  const isInstitutionSelected = selectedInstitution ? false : true;

  return (
    <div className="bank-selector-container">
      <div className="bank-selector-header">SEARCH YOUR BANK</div>

      <div className="bank-icon">
        <BsBank />
      </div>

      <LabeledInput label="Select your country">
        <Select
          styles={selectStyle}
          options={COUNTRY_CODES}
          onChange={onCountrySelected}
        />
      </LabeledInput>

      <LabeledInput label="Select your bank">
        <Select
          styles={selectStyle}
          options={institutions}
          onChange={setSelectedInstitution}
        />
      </LabeledInput>

      <Button
        variant="outlined"
        disabled={isInstitutionSelected}
        onClick={onClickConnect}
      >
        Connect
      </Button>
    </div>
  );
}

export default BankSelector;
