import React from "react";
import Select from "react-select";
import Button from "@mui/material/Button";
import "./BankSelector.style.css";
import { BsBank } from "react-icons/bs";
import {userInfo} from "../../keycloak.js"

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

  onCountrySelect(selected_country) {
    fetch(
      `http://localhost:8000/get_available_institutions?country_code=${selected_country.value}`
    )
      .then((res) => res.json())
      .then((data) => {
        data.forEach((institution) => {
          this.state.institutions.push({
            value: institution["id"],
            label: institution["name"],
          });
        });
      });
  }

  bankConnect() {
    let institution = {
      id: this.state.selected_institution["value"],
      name: this.state.selected_institution["label"],
    };
    console.log("Institution selected", institution);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(institution),
    };
    fetch(`http://localhost:8000/bank_connect?username=${userInfo.username}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        let bank_connection_link = data.link;
        window.location.replace(bank_connection_link);
      });
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: "1",
        }}
      >
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          <div className="bank-selector-header">SEARCH YOUR BANK</div>
        </div>

        <div className="bank-icon">
          <BsBank style={{ fontSize: "100px", color: "white" }} />
        </div>
        <div style={{display: "flex", width:"100%", justifyContent: "left", fontFamily:'Montserrat', paddingLeft: '10px', marginBottom: '5px', fontSize: '13px'}}>
            Select your Country
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "left",
          }}
        >
          <Select
            textFieldProps={{
                label: 'Label',
                InputLabelProps: {
                  shrink: true,
                },
              }}
            styles={{
              container: (base) => ({
                ...base,
                flex: 1,
                marginBottom: "20px"
              }),
            }}
            options={this.countries}
            onChange={this.onCountrySelect.bind(this)}
          />
        </div>
        <div style={{display: "flex", width:"100%", justifyContent: "left", fontFamily:'Montserrat', paddingLeft: '10px', marginBottom: '5px', fontSize: '13px'}}>
            Select your Bank
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Select
            styles={{
              container: (base) => ({
                ...base,
                flex: 1,
                marginBottom: "20px"
              }),
            }}
            options={this.state.institutions}
            onChange={(selected_institution) => {
              this.setState({ selected_institution: selected_institution });
            }}
          />
        </div>
        <Button variant="outlined" disabled={this.state.selected_institution ? false : true} onClick={this.bankConnect.bind(this)}>
          Connect
        </Button>
      </div>
    );
  }
}

export default BankSelector;
