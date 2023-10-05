import unittest
import mongomock
from services.authentication import (
    MongoAuthenticationEngine,
)


class TestAuthentication(unittest.TestCase):
    def setUp(self):
        SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
        mongo_client = mongomock.MongoClient().db.collection
        self.authentication_engine = MongoAuthenticationEngine(SECRET_KEY, mongo_client)

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
