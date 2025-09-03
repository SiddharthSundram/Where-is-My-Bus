import os
from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp, admin_bp
from routes.bus_routes import bus_bp
from routes.schedule_routes import schedule_bp 
from db import db
from utils.custom_json_encoder import CustomJSONEncoder

# --- App Initialization ---
app = Flask(__name__)

# Load secret key from config or environment
app.config["SECRET_KEY"] = "SECRET_KEY" # Replace with your actual secret key management

# Improve CORS setup for production readiness
CORS(app, resources={r"/*": {"origins": "*"}}) # Allows all origins for development

# Set custom JSON encoder globally - This automatically handles ObjectId and datetime conversion for all jsonify responses
app.json_encoder = CustomJSONEncoder

# --- Register Blueprints ---
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(admin_bp, url_prefix="/admin")
app.register_blueprint(bus_bp, url_prefix="/buses")
app.register_blueprint(schedule_bp, url_prefix="/schedules")

# --- Base Routes ---
@app.route("/", methods=["GET"])
def health_check():
    return {"status": "OK", "message": "MyBus API is running 🚍"}, 200

@app.route("/db-check", methods=["GET"])
def db_check():
    try:
        # Pymongo's command 'ping' is a lightweight way to check connection
        db.command('ping')
        return {"status": "OK", "message": "MongoDB connected successfully"}, 200
    except Exception as e:
        return {"status": "FAIL", "error": str(e)}, 500

# --- Run the App ---
if __name__ == "__main__":
    # Debug mode is based on environment variable for safety
    is_debug = os.getenv("FLASK_DEBUG", "1") == "1"
    app.run(host="0.0.0.0", port=5000, debug=is_debug)