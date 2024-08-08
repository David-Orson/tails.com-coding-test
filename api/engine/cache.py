import json
import os
import time
import requests
from config import CACHE_FILE, CACHE_EXPIRATION_SECONDS


def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE) as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error loading cache: {e}")
            return {}
    return {}


postcode_cache = load_cache()


def save_cache():
    try:
        with open(CACHE_FILE, "w") as f:
            json.dump(postcode_cache, f)
    except IOError as e:
        print(f"Error saving cache: {e}")


def is_cache_expired(timestamp):
    return (time.time() - timestamp) > CACHE_EXPIRATION_SECONDS


def update_cache(stores):
    for store in stores:
        postcode = store["postcode"]
        if postcode and postcode not in postcode_cache:
            response = requests.get(f"https://api.postcodes.io/postcodes/{postcode}")
            if response.status_code == 200:
                data = response.json().get("result", {})
                latitude = data.get("latitude")
                longitude = data.get("longitude")
                if latitude and longitude:
                    postcode_cache[postcode] = {
                        "latitude": latitude,
                        "longitude": longitude,
                        "timestamp": time.time(),
                    }
                    store["latitude"] = latitude
                    store["longitude"] = longitude
    save_cache()
