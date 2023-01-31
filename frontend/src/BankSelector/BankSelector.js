import React from "react"
import Select from 'react-select'


class BankSelector extends React.Component {
    constructor(props) {
        super(props);

        this.countries = [
            { value: 'IT', label: 'Italia' },
            { value: 'US', label: 'United States' }
        ]

        this.state = {
            institutions: []
        }
    }

    onCountrySelect(selected_country) {
        fetch(`http://localhost:8000/${selected_country.value}`)
            .then((res) => res.json())
            .then((data) => {
                data.forEach((institution) => {this.state.institutions.push({'value': institution['id'], 'label': institution['name']})})
            });
    }

    render() {
        return (
            <div>
                <Select options={this.countries} onChange={this.onCountrySelect.bind(this)}/>
                <Select options={this.state.institutions}/>
            </div>
        );
    }
}

export default BankSelector;