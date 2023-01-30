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
                console.log(data);
            });
    }

    render() {
        return (
            <div>
                <Select options={this.countries} onChange={this.onCountrySelect}/>
            </div>
        );
    }
}

export default BankSelector;