import React from "react";
import Select from "react-select";
import Button from "@mui/material/Button";
import "./BankSelector.style.css";
import { BsBank } from "react-icons/bs";
import { userInfo } from "../../keycloak.js";
import { bankConnect } from "./utility";
import { onCountrySelect } from "./utility.js";

class BankSelector extends React.Component {
  constructor(props) {
    super(props);

    this.countries = [
      { value: "IT", label: "Italia" },
      { value: "US", label: "United States" },
    ];

    this.state = {
      institutions: [],
      selected_institution: null,
    };
  }

  render() {
    const selectStyle = {
      container: (base) => ({
        ...base,
        flex: 1,
        marginBottom: "20px",
      }),
    };

    return (
      <div className="bank-selector-container">
        <div className="bank-selector-header">SEARCH YOUR BANK</div>

        <div className="bank-icon">
          <BsBank style={{ fontSize: "100px", color: "white" }} />
        </div>
        <div className="select-label">Select your Country</div>
        <Select
          styles={selectStyle}
          options={this.countries}
          onChange={(c) => {this.setState({"institutions": onCountrySelect(c.value)})}}
        />
        <div className="select-label">Select your Bank</div>
        <Select
          styles={selectStyle}
          options={this.state.institutions}
          onChange={(selected_institution) => {
            this.setState({ selected_institution: selected_institution });
          }}
        />

        <Button
          variant="outlined"
          disabled={this.state.selected_institution ? false : true}
          onClick={() => bankConnect(this.state.selected_institution, userInfo.username)}
        >
          Connect
        </Button>
      </div>
    );
  }
}

export default BankSelector;
