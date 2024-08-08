from functools import wraps
from flask import request, jsonify
import time
from config import RATE_LIMIT_MS

last_request_time = {}


def rate_limit(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_id = request.remote_addr
        current_time = time.time() * 1000

        last_time = last_request_time.get(user_id, None)

        if last_time and (current_time - last_time) < RATE_LIMIT_MS:
            return jsonify({"error": "Too many requests, slow down!"}), 429

        last_request_time[user_id] = current_time

        return func(*args, **kwargs)

    return wrapper
