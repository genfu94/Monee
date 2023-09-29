import unittest
import mongomock
import jwt
from backend.services.authentication import (
    MongoAuthenticationEngine,
    SECRET_KEY,
    ALGORITHM,
)


class TestAuthentication(unittest.TestCase):
    def setUp(self):
        mongo_client = mongomock.MongoClient().db.collection
        self.authentication_engine = MongoAuthenticationEngine(mongo_client)

    def test_user_registration(self):
        self.authentication_engine.register_user("user", "pass")
        self.assertRaises(
            Exception, self.authentication_engine.register_user, "user", "new_pass"
        )

    def test_user_authentication(self):
        self.authentication_engine.register_user("user", "pass")

        user = self.authentication_engine.authenticate_user("user", "pass")
        self.assertNotEqual(user, None)
        user = self.authentication_engine.authenticate_user("non_existing", "pass")
        self.assertEqual(user, False)

    def test_token_creation(self):
        token_payload = {"sub": "user"}
        token = self.authentication_engine.create_access_token(token_payload)
        payload = self.authentication_engine.validate_token(token)

        self.assertEqual(payload["sub"], "user")
