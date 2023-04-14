import Keycloak from 'keycloak-js'

var userInfo = null;

function setUserInfo(value) {
    userInfo = value;
}

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = new Keycloak({
    url: "http://localhost:8080/",
    realm: "budget_app",
    clientId: "budget_app",
});

export {keycloak, userInfo, setUserInfo};
