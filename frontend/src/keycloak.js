import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
    url: "http://localhost:8080/",
    realm: "budget_app",
    clientId: "budget_app",
});

export {keycloak};
