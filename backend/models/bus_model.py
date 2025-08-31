import uuid
from datetime import datetime
from db import db
from bson import ObjectId
from bson.errors import InvalidId # Import InvalidId to handle bad ID formats

class BusModel:
    collection = db.buses_data

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
        Create a new bus. We will primarily use the MongoDB '_id'.
        The 'id' field is redundant and can be removed if not used elsewhere.
        """
        try:
            bus_data = {
                # Bus Info
                "busCategory": bus_category,
                "busNumber": bus_number,
                "type": bus_type,
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

            # Let MongoDB handle the _id creation
            result = BusModel.collection.insert_one(bus_data)
            
            # Fetch the inserted document to return it with the string ID
            new_bus = BusModel.collection.find_one({"_id": result.inserted_id})
            if new_bus:
                new_bus["_id"] = str(new_bus["_id"])
            return new_bus

        except Exception as e:
            raise Exception(f"Error creating bus: {str(e)}")

    @staticmethod
    def get_all_buses():
        """Fetch all buses and serialize their '_id' to a string"""
        try:
            buses = list(BusModel.collection.find({}))
            for bus in buses:
                bus["_id"] = str(bus["_id"]) # Serialize ID
            return buses
        except Exception as e:
            raise Exception(f"Error fetching buses: {str(e)}")

    @staticmethod
    def get_bus_by_id(bus_id):
        """ ✅ CORRECTED: Fetch a single bus by its '_id' """
        try:
            # The fix is to query by '_id' and convert the string to an ObjectId
            bus = BusModel.collection.find_one({"_id": ObjectId(bus_id)})
            if bus:
                bus["_id"] = str(bus["_id"]) # Serialize ID for the response
            return bus
        except InvalidId:
            # This handles cases where the bus_id string is not a valid format
            return None
        except Exception as e:
            raise Exception(f"Error fetching bus: {str(e)}")

    @staticmethod
    def update_bus(bus_id, update_data):
        """ ✅ CORRECTED: Update bus details by its '_id' """
        try:
            update_data["updatedAt"] = datetime.utcnow()
            result = BusModel.collection.update_one(
                {"_id": ObjectId(bus_id)}, # Query by '_id'
                {"$set": update_data}
            )
            return result.modified_count > 0
        except InvalidId:
            return False
        except Exception as e:
            raise Exception(f"Error updating bus: {str(e)}")

    @staticmethod
    def delete_bus(bus_id):
        """ ✅ CORRECTED: Delete a bus by its '_id' """
        try:
            result = BusModel.collection.delete_one({"_id": ObjectId(bus_id)}) # Query by '_id'
            return result.deleted_count > 0
        except InvalidId:
            return False
        except Exception as e:
            raise Exception(f"Error deleting bus: {str(e)}")