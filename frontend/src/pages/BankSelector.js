import React from "react"
import Select from 'react-select'
import Button from '@mui/material/Button';

class BankSelector extends React.Component {
    constructor(props) {
        super(props);

        this.countries = [
            { value: 'IT', label: 'Italia' },
            { value: 'US', label: 'United States' }
        ]

        this.state = {
            institutions: [],
            selected_institution: null
        }
    }
    
    onCountrySelect(selected_country) {
        fetch(`http://localhost:8000/get_available_institutions?country_code=${selected_country.value}`)
            .then((res) => res.json())
            .then((data) => {
                data.forEach((institution) => {this.state.institutions.push({'value': institution['id'], 'label': institution['name']})})
            });
    }

    bankConnect() {
        let institution = {
            'id': this.state.selected_institution['value'],
            'name': this.state.selected_institution['label'],
        };
        console.log("Institution selected", institution);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(institution)
        };
        fetch(`http://localhost:8000/bank_connect?username=user`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                let bank_connection_link = data.link;
                window.location.replace(bank_connection_link);
            });
    }

    render() {
        return (
            <div style={{'background-color': '#eff0f2'}}>
                <Select options={this.countries} onChange={this.onCountrySelect.bind(this)}/>
                <Select options={this.state.institutions} onChange={(selected_institution) => {this.setState({selected_institution: selected_institution})}}/>
                <Button variant='outlined' onClick={this.bankConnect.bind(this)}>Connect</Button>
            </div>
        );
    }
}

export default BankSelector;