from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.bus_routes import bus_bp  # ✅ Import bus routes
from db import db
from utils.custom_json_encoder import CustomJSONEncoder

app = Flask(__name__)

# ✅ Secret key for JWT (better to keep in config.py or .env in production)
app.config["SECRET_KEY"] = "SECRET_KEY"

# ✅ CORS Setup (Allow all origins for development)
CORS(app, resources={r"/*": {"origins": "*"}})  # ✅ Allow all origins for dev

# ✅ Set custom JSON encoder globally
app.json_encoder = CustomJSONEncoder

# ✅ Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(bus_bp, url_prefix="/buses")  # ✅ Register bus routes

# ✅ Health Check Route
@app.route("/", methods=["GET"])
def health_check():
    return {"status": "OK", "message": "MyBus API is running 🚍"}, 200

# ✅ Database check route
@app.route("/db-check", methods=["GET"])
def db_check():
    try:
        # Check if MongoDB is connected
        db.users.find_one()
        return {"status": "OK", "message": "MongoDB connected ✅"}, 200
    except Exception as e:
        return {"status": "FAIL", "error": str(e)}, 500


if __name__ == "__main__":
    # Run the app
    app.run(host="127.0.0.1", port=5000, debug=True)
