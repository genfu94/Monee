from keycloak import KeycloakAdmin
from keycloak.exceptions import KeycloakGetError


class KeycloakConfigurator:
    def __init__(self):
        pass

    def connect(self):
        self.keycloak_admin = KeycloakAdmin(server_url="http://localhost:8080",
                                    username='admin',
                                    password='admin',
                                    realm_name="master",
                                    verify=True)
    
    def _create_realm(self):
        self.keycloak_admin.create_realm({
            "realm": "budget_app",
            "enabled": True
        }, skip_exists=True)

    def _create_client(self):
        self.keycloak_admin.realm_name = "budget_app"
        self.keycloak_admin.create_client({
            "name": "budget_app",
            "clientId": "budget_app",
            "rootUrl": "http://localhost:3000"
        }, skip_exists=True)

    def set_configuration(self):
        self._create_realm()
        self._create_client()


if __name__ == "__main__":
    keycloak_configurator = KeycloakConfigurator()
    keycloak_configurator.connect()
    keycloak_configurator.set_configuration()
    



