from flask import Flask
from flask_cors import CORS
from routes import routes
from cache import update_cache

import json

app = Flask(__name__)
CORS(app)

app.register_blueprint(routes)

if __name__ == "__main__":
    with open("stores.json") as f:
        stores = json.load(f)
    update_cache(stores)
    app.run(host="0.0.0.0", port=5000, debug=True)
