from flask import Blueprint, request, jsonify
from models.schedule_model import ScheduleModel
from utils.jwt_utils import verify_token
from utils.json_encoder import serialize_doc
from functools import wraps

schedule_bp = Blueprint("schedules", __name__)

# Middleware to verify JWT & role-based access (as provided in your file)
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

# [POST] Create a new schedule — ADMIN ONLY
@schedule_bp.route("/", methods=["POST"])
@auth_required(admin_only=True)
def create_schedule():
    """Creates a new schedule for a bus with detailed stop timings."""
    try:
        data = request.get_json()
        # ✅ UPDATED: Changed required fields to match the new model
        required = ["busId", "daysActive", "stop_timings"]
        missing = [key for key in required if key not in data]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

        # ✅ UPDATED: Call the model with the new arguments
        new_schedule = ScheduleModel.create_schedule(
            bus_id=data["busId"],
            days_active=data["daysActive"],
            stop_timings=data["stop_timings"],
            frequency_min=data.get("frequencyMin")
        )
        return jsonify({
            "message": "Schedule created successfully ✅",
            "schedule": serialize_doc(new_schedule)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# [GET] Get all schedules or filter by busId
@schedule_bp.route("/", methods=["GET"])
@auth_required()
def get_schedules():
    """Fetches all schedules, with an option to filter by busId."""
    try:
        bus_id = request.args.get("busId")
        if bus_id:
            schedules = ScheduleModel.get_schedules_by_bus_id(bus_id)
        else:
            schedules = ScheduleModel.get_all_schedules()
        
        schedules = [serialize_doc(s) for s in schedules]
        return jsonify(schedules), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# [GET] Get a single schedule by its ID
@schedule_bp.route("/<schedule_id>", methods=["GET"])
@auth_required()
def get_schedule_by_id(schedule_id):
    """Fetches a single schedule by its unique ID."""
    try:
        schedule = ScheduleModel.get_schedule_by_id(schedule_id)
        if not schedule:
            return jsonify({"error": "Schedule not found"}), 404
        return jsonify(serialize_doc(schedule)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# [PUT] Update a schedule — ADMIN ONLY
@schedule_bp.route("/<schedule_id>", methods=["PUT"])
@auth_required(admin_only=True)
def update_schedule(schedule_id):
    """Updates an existing schedule's details."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body cannot be empty"}), 400

        updated = ScheduleModel.update_schedule(schedule_id, data)
        if not updated:
            return jsonify({"error": "Schedule not found or no changes made"}), 404
        
        updated_schedule = ScheduleModel.get_schedule_by_id(schedule_id)
        return jsonify({
            "message": "Schedule updated successfully ✅",
            "schedule": serialize_doc(updated_schedule)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# [DELETE] Delete a schedule — ADMIN ONLY
@schedule_bp.route("/<schedule_id>", methods=["DELETE"])
@auth_required(admin_only=True)
def delete_schedule(schedule_id):
    """Deletes a schedule from the database."""
    try:
        deleted = ScheduleModel.delete_schedule(schedule_id)
        if not deleted:
            return jsonify({"error": "Schedule not found"}), 404
        return jsonify({"message": "Schedule deleted successfully ✅"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

