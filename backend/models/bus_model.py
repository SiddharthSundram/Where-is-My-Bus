import uuid
from datetime import datetime
from db import db
from bson import ObjectId

class BusModel:
    collection = db.buses_data  # ✅ Single collection for buses + routes + stops

    @staticmethod
    def serialize_bus(bus):
        """Convert MongoDB ObjectId to string for JSON response"""
        if not bus:
            return None
        bus["_id"] = str(bus["_id"])
        return bus

    @staticmethod
    def create_bus(
        bus_category,
        bus_number,
        bus_type,
        capacity,
        registration_no,
        gps_device_id,
        current_location=None,
        status="ACTIVE",
        route=None
    ):
        """
        Create a new bus with nested routes + stops in a flat structure.
        """
        try:
            bus_data = {
                "_id": ObjectId(),
                "id": str(uuid.uuid4()),

                # Bus Info
                "busCategory": bus_category,     # ✅ State or Private
                "busNumber": bus_number,         # ✅ Bus name like 1A, 215A
                "type": bus_type,                # ✅ ac or non-ac
                "capacity": int(capacity),
                "registrationNo": registration_no,
                "gpsDeviceId": gps_device_id,           

                # Location & Status
                "currentLocation": current_location if current_location else {},
                "status": status,

                # Timestamps
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow(),

                # Routes + Stops
                "route": route if route else {}
            }

            BusModel.collection.insert_one(bus_data)
            return BusModel.serialize_bus(bus_data)

        except Exception as e:
            raise Exception(f"Error creating bus: {str(e)}")

    @staticmethod
    def get_all_buses():
        """Fetch all buses with routes and stops"""
        try:
            buses = list(BusModel.collection.find({}))
            return [BusModel.serialize_bus(bus) for bus in buses]
        except Exception as e:
            raise Exception(f"Error fetching buses: {str(e)}")

    @staticmethod
    def get_bus_by_id(bus_id):
        """Fetch a single bus by its unique ID"""
        try:
            bus = BusModel.collection.find_one({"id": bus_id})
            return BusModel.serialize_bus(bus)
        except Exception as e:
            raise Exception(f"Error fetching bus: {str(e)}")

    @staticmethod
    def update_bus(bus_id, update_data):
        """Update bus details, route, or stops"""
        try:
            if isinstance(update_data, list):
                raise ValueError("Invalid update format: expected an object, got a list.")

            update_data["updatedAt"] = datetime.utcnow()
            result = BusModel.collection.update_one(
                {"id": bus_id},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except Exception as e:
            raise Exception(f"Error updating bus: {str(e)}")

    @staticmethod
    def delete_bus(bus_id):
        """Delete a bus"""
        try:
            result = BusModel.collection.delete_one({"id": bus_id})
            return result.deleted_count > 0
        except Exception as e:
            raise Exception(f"Error deleting bus: {str(e)}")
