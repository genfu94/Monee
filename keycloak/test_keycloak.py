from keycloak import KeycloakAdmin
from keycloak.exceptions import KeycloakGetError
import time
import os

if __name__ == "__main__":
    # TODO: use more robust approach to wait for keycloak initialization
    time.sleep(30)
    keycloak_admin = KeycloakAdmin(server_url="http://budget_app_keycloak:8080",
                                    username='admin',
                                    password='admin',
                                    realm_name="master",
                                    verify=True)
    keycloak_admin.create_realm({
            "realm": "budget_app",
            "enabled": True,
            "registrationAllowed": True
        }, skip_exists=True)
    keycloak_admin.realm_name = "budget_app"

    keycloak_admin.create_client({
            "name": "budget_app",
            "clientId": "budget_app",
            "rootUrl": os.environ['frontend'],
            "redirectUris": [f"{os.environ['frontend']}/*"],
            "webOrigins": [os.environ['frontend']],
            "adminUrl": os.environ['frontend'],
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
