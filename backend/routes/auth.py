# auth.py

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from utils.jwt_utils import generate_token, verify_token
from utils.json_encoder import serialize_doc
from db import db
from bson import ObjectId
from functools import wraps

# --- Blueprint Setup ---
# For standard user authentication (register, login, profile)
auth_bp = Blueprint("auth", __name__)
# For admin-only user management
admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

# --- Admin-Only Decorator ---
def admin_required(f):
    """
    A decorator to ensure that the user is an admin.
    It checks the JWT for a 'role' claim equal to 'ADMIN'.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Missing token"}), 401
        
        decoded = verify_token(token)
        if not decoded or decoded.get("role") != "ADMIN":
            return jsonify({"error": "Admin access required"}), 403 # 403 Forbidden for insufficient permissions
            
        return f(*args, **kwargs)
    return decorated_function

# ============================================
# == STANDARD AUTHENTICATION ROUTES (auth_bp) ==
# ============================================

@auth_bp.route("/register", methods=["POST"])
def register():
    """Handles new user registration."""
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")
        password = data.get("password")
        role = data.get("role", "USER").upper()

        if not name or not email or not phone or not password:
            return jsonify({"error": "All fields are required"}), 400

        if db.users.find_one({"email": email}):
            return jsonify({"error": "Email already exists"}), 400

        # Create the new user object with default fields
        new_user = {
            "name": name,
            "email": email,
            "phone": phone,
            "passwordHash": generate_password_hash(password),
            "role": role if role in ["USER", "ADMIN"] else "USER",
            "status": "ACTIVE",  # Default status for new users
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
            "lastLogin": None,
            "totalBookings": 0,
            "totalSpent": 0,
        }

        result = db.users.insert_one(new_user)
        # Prepare response object (don't send back password hash)
        user_for_response = {k: v for k, v in new_user.items() if k != "passwordHash"}
        user_for_response["_id"] = str(result.inserted_id)
        
        return jsonify({
            "message": "User registered successfully",
            "user": serialize_doc(user_for_response)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    """Handles user login and JWT generation."""
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = db.users.find_one({"email": email})
        if not user or not check_password_hash(user["passwordHash"], password):
            return jsonify({"error": "Invalid email or password"}), 401

        # Update the lastLogin timestamp on successful login
        db.users.update_one({"_id": user["_id"]}, {"$set": {"lastLogin": datetime.utcnow()}})
        
        token = generate_token(str(user["_id"]), user.get("role", "USER"))
        
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": serialize_doc(user) # serialize_doc will handle removing password hash if configured
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/profile", methods=["GET", "PUT"])
def profile():
    """Allows a logged-in user to view and update their own profile."""
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

        # Handle GET request to return user profile
        if request.method == "GET":
            user.pop("passwordHash", None)
            return jsonify({"user": serialize_doc(user)}), 200

        # Handle PUT request to update user profile
        elif request.method == "PUT":
            data = request.get_json()
            update_fields = {}

            if "name" in data: update_fields["name"] = data["name"]
            if "phone" in data: update_fields["phone"] = data["phone"]
            
            if "email" in data:
                existing_email = db.users.find_one({"email": data["email"], "_id": {"$ne": ObjectId(user_id)}})
                if existing_email:
                    return jsonify({"error": "Email already in use"}), 400
                update_fields["email"] = data["email"]
            
            if "password" in data and data["password"].strip():
                update_fields["passwordHash"] = generate_password_hash(data["password"])

            update_fields["updatedAt"] = datetime.utcnow()
            db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})

            updated_user = db.users.find_one({"_id": ObjectId(user_id)}, {"passwordHash": 0})
            return jsonify({
                "message": "Profile updated successfully",
                "user": serialize_doc(updated_user)
            }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Provides a formal endpoint for logout."""
    return jsonify({
        "message": "Logout successful. Please delete the token on the client side."
    }), 200

# ========================================
# == ADMIN MANAGEMENT ROUTES (admin_bp) ==
# ========================================

@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_all_users():
    """[ADMIN] Fetches all users with optional filtering."""
    try:
        search_term = request.args.get("search", "")
        role_filter = request.args.get("role", "all")
        status_filter = request.args.get("status", "all")

        query = {}
        if search_term:
            query["$or"] = [
                {"name": {"$regex": search_term, "$options": "i"}},
                {"email": {"$regex": search_term, "$options": "i"}},
                {"phone": {"$regex": search_term, "$options": "i"}}
            ]
        if role_filter != "all":
            query["role"] = role_filter.upper()
        if status_filter != "all":
            query["status"] = status_filter.upper()

        users = list(db.users.find(query, {"passwordHash": 0}))
        # Use a list comprehension to apply the function to each user
        serialized_users = [serialize_doc(user) for user in users]
        return jsonify(serialized_users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route("/users", methods=["POST"])
@admin_required
def create_user_by_admin():
    """[ADMIN] Creates a new user."""
    try:
        data = request.get_json()
        if not all(k in data for k in ["name", "email", "password"]):
            return jsonify({"error": "Name, email, and password are required"}), 400
        
        if db.users.find_one({"email": data["email"]}):
            return jsonify({"error": "Email already exists"}), 400

        new_user = {
            "name": data["name"],
            "email": data["email"],
            "phone": data.get("phone", ""),
            "passwordHash": generate_password_hash(data["password"]),
            "role": data.get("role", "USER").upper(),
            "status": data.get("status", "ACTIVE").upper(),
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
            "lastLogin": None,
            "totalBookings": 0,
            "totalSpent": 0,
        }
        result = db.users.insert_one(new_user)
        new_user.pop("passwordHash", None)
        new_user["_id"] = str(result.inserted_id)
        
        return jsonify(serialize_doc(new_user)), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route("/users/<user_id>", methods=["PUT"])
@admin_required
def update_user_by_admin(user_id):
    """[ADMIN] Updates a specific user's details."""
    try:
        data = request.get_json()
        update_fields = {"updatedAt": datetime.utcnow()}

        if "name" in data: update_fields["name"] = data["name"]
        if "email" in data: update_fields["email"] = data["email"]
        if "phone" in data: update_fields["phone"] = data["phone"]
        if "role" in data: update_fields["role"] = data["role"].upper()
        if "status" in data: update_fields["status"] = data["status"].upper()
        
        db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})
        updated_user = db.users.find_one({"_id": ObjectId(user_id)}, {"passwordHash": 0})
        
        return jsonify(serialize_doc(updated_user)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route("/users/<user_id>", methods=["DELETE"])
@admin_required
def delete_user_by_admin(user_id):
    """[ADMIN] Deletes a specific user."""
    try:
        result = db.users.delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500