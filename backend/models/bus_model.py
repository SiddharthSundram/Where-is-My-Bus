import uuid
from datetime import datetime
from db import db
from bson import ObjectId

class BusModel:
    @staticmethod
    def serialize_bus(bus):
        """Convert MongoDB ObjectId to string for JSON response"""
        if not bus:
            return None
        bus["_id"] = str(bus["_id"]) if "_id" in bus else None
        return bus

    @staticmethod
    def create_bus(bus_number, operator, bus_type, capacity, registration_no, gps_device_id, current_location=None, status="ACTIVE"):
        """Create a new bus record"""
        try:
            bus_data = {
                "id": str(uuid.uuid4()),
                "busNumber": bus_number,
                "operator": operator,
                "type": bus_type,
                "capacity": int(capacity),
                "registrationNo": registration_no,
                "gpsDeviceId": gps_device_id,
                "currentLocation": current_location if current_location else {},
                "status": status,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }

            # ✅ Ensure it's always a dict, not a list
            if isinstance(bus_data, list):
                raise ValueError("Invalid data format: expected an object, got a list.")

            db.buses.insert_one(bus_data)
            return BusModel.serialize_bus(bus_data)

        except Exception as e:
            raise Exception(f"Error creating bus: {str(e)}")

    @staticmethod
    def get_all_buses():
        """Fetch all buses"""
        try:
            buses = list(db.buses.find({}))
            return [BusModel.serialize_bus(bus) for bus in buses]
        except Exception as e:
            raise Exception(f"Error fetching buses: {str(e)}")

    @staticmethod
    def get_bus_by_id(bus_id):
        """Fetch single bus"""
        try:
            bus = db.buses.find_one({"id": bus_id})
            return BusModel.serialize_bus(bus)
        except Exception as e:
            raise Exception(f"Error fetching bus: {str(e)}")

    @staticmethod
    def update_bus(bus_id, update_data):
        """Update bus details"""
        try:
            # ✅ Ensure we don't accidentally send a list
            if isinstance(update_data, list):
                raise ValueError("Invalid update format: expected an object, got a list.")

            update_data["updatedAt"] = datetime.utcnow()
            result = db.buses.update_one({"id": bus_id}, {"$set": update_data})
            return result.modified_count > 0
        except Exception as e:
            raise Exception(f"Error updating bus: {str(e)}")

    @staticmethod
    def delete_bus(bus_id):
        """Delete a bus"""
        try:
            result = db.buses.delete_one({"id": bus_id})
            return result.deleted_count > 0
        except Exception as e:
            raise Exception(f"Error deleting bus: {str(e)}")
