from flask import Blueprint, request, jsonify
from models.bus_model import BusModel
from utils.jwt_utils import verify_token
from utils.json_encoder import serialize_doc
from functools import wraps

bus_bp = Blueprint("buses", __name__)

# ✅ Middleware to verify JWT & role-based access
def auth_required(admin_only=False):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = request.headers.get("Authorization")
            if not token:
                return jsonify({"error": "Missing token"}), 401

            # ✅ Remove Bearer prefix if present
            if token.startswith("Bearer "):
                token = token.split(" ")[1]

            decoded = verify_token(token)
            if not decoded:
                return jsonify({"error": "Invalid or expired token"}), 401

            # ✅ Check admin role for restricted endpoints
            if admin_only and decoded.get("role") != "ADMIN":
                return jsonify({"error": "Admin access required"}), 403

            request.user = decoded
            return f(*args, **kwargs)
        return wrapper
    return decorator


# ✅ Add a new bus with route + stops — ADMIN ONLY
@bus_bp.route("/", methods=["POST"])
@auth_required(admin_only=True)
def create_bus():
    try:
        data = request.get_json()
        required_fields = [
            "busCategory",
            "busNumber",
            "type",
            "capacity",
            "registrationNo",
            "gpsDeviceId"
        ]

        # ✅ Validate required fields
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

        # ✅ Route object with stops inside
        route = data.get("route", {})

        bus = BusModel.create_bus(
            bus_category=data["busCategory"],
            bus_number=data["busNumber"],
            bus_type=data["type"],
            capacity=data["capacity"],
            registration_no=data["registrationNo"],
            gps_device_id=data["gpsDeviceId"],
            current_location=data.get("currentLocation", {}),
            status=data.get("status", "ACTIVE"),
            route=route
        )

        return jsonify({
            "message": "Bus added successfully ✅",
            "bus": serialize_doc(bus)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Get all buses with routes + stops (USER + ADMIN)
@bus_bp.route("/", methods=["GET"])
@auth_required()
def get_all_buses():
    try:
        buses = BusModel.get_all_buses()
        return jsonify({"buses": [serialize_doc(bus) for bus in buses]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Get single bus with routes + stops (USER + ADMIN)
@bus_bp.route("/<bus_id>", methods=["GET"])
@auth_required()
def get_bus(bus_id):
    try:
        bus = BusModel.get_bus_by_id(bus_id)
        if not bus:
            return jsonify({"error": "Bus not found"}), 404
        return jsonify({"bus": serialize_doc(bus)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Update bus or nested route/stops — ADMIN ONLY
@bus_bp.route("/<bus_id>", methods=["PUT"])
@auth_required(admin_only=True)
def update_bus(bus_id):
    try:
        data = request.get_json()
        updated = BusModel.update_bus(bus_id, data)
        if not updated:
            return jsonify({"error": "Bus not found or no changes made"}), 404
        return jsonify({"message": "Bus updated successfully ✅"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Delete a bus completely — ADMIN ONLY
@bus_bp.route("/<bus_id>", methods=["DELETE"])
@auth_required(admin_only=True)
def delete_bus(bus_id):
    try:
        deleted = BusModel.delete_bus(bus_id)
        if not deleted:
            return jsonify({"error": "Bus not found"}), 404
        return jsonify({"message": "Bus deleted successfully ✅"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
