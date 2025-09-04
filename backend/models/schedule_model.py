from datetime import datetime
from db import db
from bson import ObjectId
from bson.errors import InvalidId

class ScheduleModel:
    """
    Handles all database operations for the schedules collection.
    Schedules now contain detailed timings for each stop.
    """
    collection = db.schedules

    @staticmethod
    def create_schedule(bus_id, days_active, stop_timings, frequency_min=None):
        """
        Creates a new schedule with detailed timings for each stop.
        'stop_timings' should be a list of dictionaries.
        e.g., [{"stop_id": "s1", "stop_name": "A", "arrivalTime": "09:00", "departureTime": "09:02"}, ...]
        """
        try:
            # The data structure is updated to store timings per stop
            schedule_data = {
                "busId": ObjectId(bus_id),
                "daysActive": days_active,
                "stop_timings": stop_timings, # <-- REPLACED old time fields
                "frequencyMin": frequency_min,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
            result = ScheduleModel.collection.insert_one(schedule_data)
            
            # Fetch the new document to return it
            new_schedule = ScheduleModel.collection.find_one({"_id": result.inserted_id})
            if new_schedule:
                new_schedule["_id"] = str(new_schedule["_id"])
            return new_schedule

        except Exception as e:
            raise Exception(f"Error creating schedule: {str(e)}")

    @staticmethod
    def get_all_schedules():
        """Fetches all schedules and serializes their '_id' to a string."""
        try:
            schedules = list(ScheduleModel.collection.find({}))
            for schedule in schedules:
                schedule["_id"] = str(schedule["_id"])
            return schedules
        except Exception as e:
            raise Exception(f"Error fetching schedules: {str(e)}")

    @staticmethod
    def get_schedule_by_id(schedule_id):
        """Fetches a single schedule by its '_id'."""
        try:
            schedule = ScheduleModel.collection.find_one({"_id": ObjectId(schedule_id)})
            if schedule:
                schedule["_id"] = str(schedule["_id"])
            return schedule
        except InvalidId:
            return None
        except Exception as e:
            raise Exception(f"Error fetching schedule: {str(e)}")

    @staticmethod
    def get_schedules_by_bus_id(bus_id):
        """Fetches all schedules for a specific bus."""
        try:
            schedules = list(ScheduleModel.collection.find({"busId": ObjectId(bus_id)}))
            for schedule in schedules:
                schedule["_id"] = str(schedule["_id"])
            return schedules
        except InvalidId:
            return []
        except Exception as e:
            raise Exception(f"Error fetching schedules by bus ID: {str(e)}")

    @staticmethod
    def update_schedule(schedule_id, update_data):
        """Updates schedule details by its '_id' and returns a boolean."""
        try:
            update_data["updatedAt"] = datetime.utcnow()
            result = ScheduleModel.collection.update_one(
                {"_id": ObjectId(schedule_id)},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except InvalidId:
            return False
        except Exception as e:
            raise Exception(f"Error updating schedule: {str(e)}")

    @staticmethod
    def delete_schedule(schedule_id):
        """Deletes a schedule by its '_id' and returns a boolean."""
        try:
            result = ScheduleModel.collection.delete_one({"_id": ObjectId(schedule_id)})
            return result.deleted_count > 0
        except InvalidId:
            return False
        except Exception as e:
            raise Exception(f"Error deleting schedule: {str(e)}")

    @staticmethod
    def delete_by_bus_id(bus_id):
        """Deletes all schedules for a specific bus (for cascading delete)."""
        try:
            result = ScheduleModel.collection.delete_many({"busId": ObjectId(bus_id)})
            return result.deleted_count
        except InvalidId:
            return 0
        except Exception as e:
            raise Exception(f"Error deleting schedules by bus ID: {str(e)}")
