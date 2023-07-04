import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
    url: process.env.REACT_APP_KEYCLOAK_SERVER_URL,
    realm: process.env.REACT_APP_KEYCLOAK_REALM,
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT,
});

export function keycloakLogin() {
  return new Promise((resolve, reject) => {
    keycloak
      .init({
        onLoad: "login-required",
      })
      .then((authenticated) => {
        keycloak.loadUserProfile().then((value) => {
          resolve({...value, token: keycloak.token});
        });
      })
      .catch((reason) => {
        reject(reason);
      });
  });
}

export function keycloakLogout() {
  keycloak.logout()
}