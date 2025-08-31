from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from utils.jwt_utils import generate_token, verify_token
from utils.json_encoder import serialize_doc
from db import db
from bson import ObjectId

auth_bp = Blueprint("auth", __name__)

# ✅ Register route (works for USER and ADMIN directly)
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")
        password = data.get("password")
        role = data.get("role", "USER").upper()

        # Validate inputs
        if not name or not email or not phone or not password:
            return jsonify({"error": "All fields are required"}), 400

        # Check if email already exists
        if db.users.find_one({"email": email}):
            return jsonify({"error": "Email already exists"}), 400

        # Create new user object
        new_user = {
            "name": name,
            "email": email,
            "phone": phone,
            "passwordHash": generate_password_hash(password),
            "role": role if role in ["USER", "ADMIN"] else "USER",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        # Insert into DB
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

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = db.users.find_one({"email": email})
        if not user or not check_password_hash(user["passwordHash"], password):
            return jsonify({"error": "Invalid email or password"}), 401

        token = generate_token(str(user["_id"]), user.get("role", "USER"))
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


# ✅ Profile route — GET & UPDATE
@auth_bp.route("/profile", methods=["GET", "PUT"])
def profile():
    try:
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Missing token"}), 401

        decoded = verify_token(token)
        if not decoded:
            return jsonify({"error": "Invalid or expired token"}), 401

        user_id = decoded["user_id"]
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # ✅ GET request → return user profile
        if request.method == "GET":
            user.pop("passwordHash", None)
            return jsonify({"user": serialize_doc(user)}), 200

        # ✅ PUT request → update user profile
        elif request.method == "PUT":
            data = request.get_json()
            update_fields = {}

            # Allow updating name, email, phone
            if "name" in data:
                update_fields["name"] = data["name"]
            if "email" in data:
                # Check if new email already exists for another user
                existing_email = db.users.find_one({"email": data["email"], "_id": {"$ne": ObjectId(user_id)}})
                if existing_email:
                    return jsonify({"error": "Email already in use"}), 400
                update_fields["email"] = data["email"]
            if "phone" in data:
                update_fields["phone"] = data["phone"]

            # Update password if provided
            if "password" in data and data["password"].strip():
                update_fields["passwordHash"] = generate_password_hash(data["password"])

            # Update timestamp
            update_fields["updatedAt"] = datetime.utcnow()

            # Apply updates
            db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})

            # Return updated profile
            updated_user = db.users.find_one({"_id": ObjectId(user_id)}, {"passwordHash": 0})
            return jsonify({
                "message": "Profile updated successfully",
                "user": serialize_doc(updated_user)
            }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Logout route
@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({
        "message": "Logout successful. Please delete the token on the client side."
    }), 200
