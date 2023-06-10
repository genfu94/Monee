import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
    url: "http://localhost:8080/",
    realm: "budget_app",
    clientId: "budget_app",
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