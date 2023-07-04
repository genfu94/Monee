from keycloak import KeycloakAdmin
from keycloak.exceptions import KeycloakGetError
import time
import os

if __name__ == "__main__":
    FRONTEND_URL = os.environ['FRONTEND_URL']
    KEYCLOAK_SERVER_URL = os.environ['KEYCLOAK_SERVER_URL']
    KEYCLOAK_ADMIN = os.environ['KEYCLOAK_ADMIN']
    KEYCLOAK_PASSWORD = os.environ['KEYCLOAK_PASSWORD']
    REALM = 'monee'
    # TODO: use more robust approach to wait for keycloak initialization
    time.sleep(40)
    keycloak_admin = KeycloakAdmin(server_url=KEYCLOAK_SERVER_URL,
                                    username=KEYCLOAK_ADMIN,
                                    password=KEYCLOAK_PASSWORD,
                                    realm_name="master",
                                    verify=True)
    keycloak_admin.create_realm({
            "realm": REALM,
            "enabled": True,
            "registrationAllowed": True
        }, skip_exists=True)
    keycloak_admin.realm_name = REALM

    keycloak_admin.create_client({
            "name": REALM,
            "clientId": REALM,
            "rootUrl": FRONTEND_URL,
            "redirectUris": [f"{FRONTEND_URL}/*"],
            "webOrigins": [FRONTEND_URL],
            "adminUrl": FRONTEND_URL,
            "standardFlowEnabled": True,
            "enabled": True,
            "publicClient": True
        }, skip_exists=True)

    keycloak_admin.create_user({
        "username": "user",
        "enabled": True,
        "credentials": [{
            "temporary": False,
            "type": "Password",
            "value": "user"
        }]
    }, exist_ok=True)
