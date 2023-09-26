import unittest
import mongomock
from .database_crud import MongoBankCRUD
from models.bank import InstitutionInfo, NordigenBankLink, Account


class TestMongoBankCRUD(unittest.TestCase):
    def setUp(self):
        self.mongo_client = mongomock.MongoClient().db.collection
        self.bank_crud = MongoBankCRUD(self.mongo_client)
        self.mongo_client["banks"].insert_one(
            {
                "_id": "20463938-6035-407f-aeb2-e50026d8af0e",
                "user": "user",
                "link": {
                    "client": "Nordigen",
                    "requisition_id": "70da0d10-a428-4ccb-9535-d3134a1a9238",
                    "url": "http://bank-url",
                    "status": 0,
                },
                "institution": {
                    "id": "953d05fe-fb03-4629-9fee-24a6843d2ffa",
                    "name": "N26 Bank",
                    "logo": "http://logo.png",
                },
                "accounts": [],
            }
        )

    def test_add(self):
        institution = InstitutionInfo(
            id="953d05fe-fb03-4629-9fee-24a6843d2ffa",
            name="N26 Bank",
            logo="http://logo.png",
        )
        bank_link = NordigenBankLink(
            client="Nordigen",
            requisition_id="70da0d10-a428-4ccb-9535-d3134a1a9238",
            url="http://bank-url",
            status=0,
        )
        self.bank_crud.add("user", institution, bank_link)
        assert len(list(self.mongo_client["banks"].find({}))) == 2

    def test_find_by_id(self):
        assert self.bank_crud.find_by_id("20463938-6035-407f-aeb2-e50026d8af0e") != None
        assert self.bank_crud.find_by_id("non-existing") == None

    def test_find_by_user(self):
        assert self.bank_crud.find_by_user("user") != None
        assert self.bank_crud.find_by_user("non-existing") == []

    def test_delete_many(self):
        self.mongo_client["banks"].insert_one(
            {
                "_id": "30163938-6035-407f-aeb2-e50026d8af0e",
                "user": "user_test",
                "link": {
                    "client": "Nordigen",
                    "requisition_id": "70da0d10-a428-4ccb-9535-d3134a1a9238",
                    "url": "http://bank-url",
                    "status": 0,
                },
                "institution": {
                    "id": "953d05fe-fb03-4629-9fee-24a6843d2ffa",
                    "name": "N26 Bank",
                    "logo": "http://logo.png",
                },
                "accounts": [],
            }
        )
        self.bank_crud.delete_unauthorized("user_test")
        assert len(list(self.mongo_client["banks"].find({"user": "user_test"}))) == 0

    def test_add_account(self):
        self.bank_crud.add_account(
            "20463938-6035-407f-aeb2-e50026d8af0e",
            Account(id="2891938-6035-407f-aeb2-e50026d8af0e", name="Account"),
        )
        # assert len(self.bank_crud.find_by_id('20463938-6035-407f-aeb2-e50026d8af0e')['accounts']) == 1


if __name__ == "__main__":
    unittest.main()
