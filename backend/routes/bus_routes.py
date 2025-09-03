from flask import Blueprint, request, jsonify
from models.bus_model import BusModel
from models.schedule_model import ScheduleModel
from utils.jwt_utils import verify_token
from utils.json_encoder import serialize_doc
from functools import wraps

bus_bp = Blueprint("buses", __name__)

# Middleware to verify JWT & role-based access
def auth_required(admin_only=False):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = request.headers.get("Authorization")
            if not token:
                return jsonify({"error": "Missing token"}), 401

            if token.startswith("Bearer "):
                token = token.split(" ")[1]

            decoded = verify_token(token)
            if not decoded:
                return jsonify({"error": "Invalid or expired token"}), 401

            if admin_only and decoded.get("role") != "ADMIN":
                return jsonify({"error": "Admin access required"}), 403

            request.user = decoded
            return f(*args, **kwargs)
        return wrapper
    return decorator


# Add a new bus with route + stops — ADMIN ONLY
@bus_bp.route("/", methods=["POST"])
@auth_required(admin_only=True)
def create_bus():
    try:
        data = request.get_json()
        required_fields = [
            "busCategory", "busNumber", "type", "capacity",
            "registrationNo", "gpsDeviceId"
        ]
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

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


# Get all buses (with query param modes)
@bus_bp.route("/", methods=["GET"])
@auth_required()
def get_buses():
    try:
        mode = request.args.get("mode")      # all | cities | stops | search
        source = request.args.get("source")
        destination = request.args.get("destination")

        buses = BusModel.get_all_buses()
        buses = [serialize_doc(bus) for bus in buses]

        # Default → return all buses
        if not mode or mode == "all":
            return jsonify({"buses": buses}), 200

        # Unique cities
        if mode == "cities":
            cities = list({bus["route"]["city"] for bus in buses if "route" in bus and bus["route"]})
            return jsonify({"cities": cities}), 200

        # Unique stops
        if mode == "stops":
            stops = set()
            for bus in buses:
                for stop in bus.get("route", {}).get("stops", []):
                    stops.add(stop["name"])
            return jsonify({"stops": list(stops)}), 200

        # Search buses by source → destination
        if mode == "search" and source and destination:
            result = []
            for bus in buses:
                stops = [s["name"] for s in bus.get("route", {}).get("stops", [])]
                if source in stops and destination in stops:
                    if stops.index(source) < stops.index(destination):  # ensure direction
                        result.append(bus)

            return jsonify({"buses": result}), 200

        return jsonify({"error": "Invalid mode or missing parameters"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get single bus
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


# Update bus — ADMIN ONLY
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


# Delete bus — ADMIN ONLY
@bus_bp.route("/<bus_id>", methods=["DELETE"])
@auth_required(admin_only=True)
def delete_bus(bus_id):
    try:
        # CALL THE DELETE METHOD FOR SCHEDULES BEFORE DELETING THE BUS
        ScheduleModel.delete_by_bus_id(bus_id)
        
        # Now, delete the bus itself
        deleted = BusModel.delete_bus(bus_id)
        
        if not deleted:
            return jsonify({"error": "Bus not found"}), 404
            
        return jsonify({"message": "Bus and all related schedules deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500