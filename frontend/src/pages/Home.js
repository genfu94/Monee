import React from "react"
import NavBar from "../components/NavBar/navbar.js"

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <NavBar /> 
            </>
        )
    }
}

export default Home;