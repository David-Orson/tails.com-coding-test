from flask import Blueprint, request, jsonify
import requests
from cache import save_cache, postcode_cache, is_cache_expired
from rate_limit import rate_limit
from utils import haversine
import json
import time

routes = Blueprint("routes", __name__)
with open("stores.json") as f:
    stores = json.load(f)


@routes.route("/api/stores", methods=["GET"])
@rate_limit
def get_stores():
    query = request.args.get("query", "").lower()
    if not query:
        return jsonify({"error": "Query parameter 'query' is missing"}), 400

    matching_stores = [
        store
        for store in stores
        if query in store["name"].lower() or query in store["postcode"].lower()
    ]

    matching_stores.sort(key=lambda store: (store["postcode"], store["name"]))

    for store in matching_stores:
        postcode = store["postcode"]
        if postcode:
            cache_entry = postcode_cache.get(postcode)
            if cache_entry and not is_cache_expired(cache_entry["timestamp"]):
                store["latitude"] = cache_entry["latitude"]
                store["longitude"] = cache_entry["longitude"]
            else:
                response = requests.get(
                    f"https://api.postcodes.io/postcodes/{postcode}"
                )
                if response.status_code == 200:
                    data = response.json().get("result", {})
                    latitude = data.get("latitude")
                    longitude = data.get("longitude")
                    postcode_cache[postcode] = {
                        "latitude": latitude,
                        "longitude": longitude,
                        "timestamp": time.time(),
                    }
                    store["latitude"] = latitude
                    store["longitude"] = longitude
                    save_cache()
                else:
                    store["latitude"] = None
                    store["longitude"] = None
        else:
            store["latitude"] = None
            store["longitude"] = None

    return jsonify(matching_stores)


@routes.route("/api/stores/radius", methods=["GET"])
@rate_limit
def get_stores_in_radius():
    postcode = request.args.get("postcode", "").lower()
    radius = float(request.args.get("radius", "0"))
    if not postcode or not radius:
        return jsonify(
            {"error": "Query parameters 'postcode' and 'radius' are missing"}
        ), 400

    if postcode not in postcode_cache:
        response = requests.get(f"https://api.postcodes.io/postcodes/{postcode}")
        if response.status_code == 200:
            data = response.json().get("result", {})
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            postcode_cache[postcode] = {
                "latitude": latitude,
                "longitude": longitude,
                "timestamp": time.time(),
            }
            save_cache()
        else:
            return jsonify({"error": "Invalid postcode"}), 400

    origin = postcode_cache[postcode]
    origin_lat = origin["latitude"]
    origin_lon = origin["longitude"]

    stores_in_radius = []
    for store_postcode, location in postcode_cache.items():
        if store_postcode != postcode:
            store_lat = location["latitude"]
            store_lon = location["longitude"]
            distance = haversine(origin_lon, origin_lat, store_lon, store_lat)
            if distance <= radius:
                stores_in_radius.append(
                    {
                        "postcode": store_postcode,
                        "latitude": store_lat,
                        "longitude": store_lon,
                    }
                )

    store_details_in_radius = [
        {
            "name": store["name"],
            "postcode": store["postcode"],
            "latitude": location["latitude"],
            "longitude": location["longitude"],
        }
        for store in stores
        for location in stores_in_radius
        if store["postcode"] == location["postcode"]
    ]

    store_details_in_radius.sort(
        key=lambda store: store["latitude"], reverse=True
    )  # North to south

    return jsonify(store_details_in_radius)


@routes.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200


@routes.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found", "message": str(error)}), 404
