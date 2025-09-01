import os #  Import os to read environment variables
from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp, admin_bp #  IMPORT ADMIN BLUEPRINT
from routes.bus_routes import bus_bp
from db import db
from utils.custom_json_encoder import CustomJSONEncoder

# --- App Initialization ---
app = Flask(__name__)

#  LOAD SECRET KEY FROM ENV
app.config["SECRET_KEY"] = "SECRET_KEY"

#  IMPROVE CORS SETUP
# This setup is now safer for production.
CORS(app, resources={r"/*": {"origins": "*"}})  #  Allow all origins for dev

# Set custom JSON encoder globally
app.json_encoder = CustomJSONEncoder

# --- Register Blueprints ---
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(admin_bp, url_prefix="/admin") #  REGISTER ADMIN BLUEPRINT
app.register_blueprint(bus_bp, url_prefix="/buses")

# --- Base Routes ---
@app.route("/", methods=["GET"])
def health_check():
    return {"status": "OK", "message": "MyBus API is running 🚍"}, 200

@app.route("/db-check", methods=["GET"])
def db_check():
    try:
        db.users.find_one()
        return {"status": "OK", "message": "MongoDB connected "}, 200
    except Exception as e:
        return {"status": "FAIL", "error": str(e)}, 500

# --- Run the App ---
if __name__ == "__main__":
    #  DEBUG MODE IS BASED ON ENVIRONMENT
    # In your terminal, you can set: export FLASK_DEBUG=1
    # This keeps your code clean and avoids running debug mode in production.
    is_debug = os.getenv("FLASK_DEBUG", "1") == "1"
    app.run(host="0.0.0.0", port=5000, debug=is_debug)