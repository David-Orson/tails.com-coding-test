import unittest
from app import app
from utils import haversine
from rate_limit import last_request_time
from cache import update_cache
import json


class TestApp(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.testing = True
        cls.client = app.test_client()
        with open("stores.json") as f:
            cls.stores = json.load(f)
        update_cache(cls.stores)  # Ensure cache is updated before testing

    def setUp(self):
        last_request_time.clear()

    def test_haversine(self):
        # London (51.5074, -0.1278) to Heathrow (51.4700, -0.4543) ~14.3 miles
        distance = haversine(-0.1278, 51.5074, -0.4543, 51.4700)
        self.assertAlmostEqual(distance, 14.3, places=1)

    def test_get_stores_in_radius(self):
        # Test the stores in radius endpoint with valid data
        response = self.client.get("/api/stores/radius?postcode=BR53RP&radius=7")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(len(data) > 0)
        self.assertTrue(
            all("latitude" in store and "longitude" in store for store in data)
        )

        # Check if the stores are sorted from north to south
        latitudes = [store["latitude"] for store in data]
        self.assertEqual(latitudes, sorted(latitudes, reverse=True))

    def test_invalid_postcode(self):
        response = self.client.get("/api/stores/radius?postcode=INVALID&radius=10")
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertEqual(data["error"], "Invalid postcode")

    def test_missing_query_params(self):
        response = self.client.get("/api/stores/radius")
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertEqual(
            data["error"], "Query parameters 'postcode' and 'radius' are missing"
        )


if __name__ == "__main__":
    unittest.main()
