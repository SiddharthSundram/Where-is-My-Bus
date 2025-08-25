from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from utils.jwt_utils import generate_token, verify_token
from utils.json_encoder import serialize_doc
from db import db

auth_bp = Blueprint("auth", __name__)

# ✅ Register route
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")
        password = data.get("password")

        # Validate inputs
        if not name or not email or not phone or not password:
            return jsonify({"error": "All fields are required"}), 400

        # Check if email exists
        if db.users.find_one({"email": email}):
            return jsonify({"error": "Email already exists"}), 400

        # Create new user
        new_user = {
            "name": name,
            "email": email,
            "phone": phone,
            "passwordHash": generate_password_hash(password),
            "role": "USER",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        # Insert user into DB
        result = db.users.insert_one(new_user)
        new_user["_id"] = str(result.inserted_id)

        return jsonify({
            "message": "User registered successfully",
            "user": {
                "id": new_user["_id"],
                "name": new_user["name"],
                "email": new_user["email"],
                "phone": new_user["phone"],
                "role": new_user["role"],
                "createdAt": new_user["createdAt"].isoformat(),
                "updatedAt": new_user["updatedAt"].isoformat()
            }
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Login route
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        # Validate inputs
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Find user by email
        user = db.users.find_one({"email": email})
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # Verify password
        if not check_password_hash(user["passwordHash"], password):
            return jsonify({"error": "Invalid email or password"}), 401

        # Generate JWT token
        token = generate_token(str(user["_id"]))

        # Convert user data safely
        user = serialize_doc(user)

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user["_id"],
                "name": user.get("name", ""),
                "email": user["email"],
                "phone": user.get("phone", ""),
                "role": user.get("role", "USER"),
                "createdAt": user.get("createdAt"),
                "updatedAt": user.get("updatedAt")
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Profile route
@auth_bp.route("/profile", methods=["GET"])
def profile():
    try:
        # Get JWT from headers
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Missing token"}), 401

        # Verify token
        decoded = verify_token(token)
        if not decoded:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Fetch user from DB
        user = db.users.find_one({"_id": db.ObjectId(decoded["user_id"])}, {"passwordHash": 0})
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"user": serialize_doc(user)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Logout route
@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({
        "message": "Logout successful. Please delete the token on the client side."
    }), 200
