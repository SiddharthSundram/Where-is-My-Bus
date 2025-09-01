from datetime import datetime
from db import db
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId # Import ObjectId

class UserModel:
    @staticmethod
    def create_user(name, email, phone, password, role="USER"):
        """Create a new user using MongoDB's native _id."""
        hashed_password = generate_password_hash(password)
        
        user_data = {
            # No custom "id" field needed. MongoDB handles _id automatically.
            "email": email.lower().strip(),
            "name": name,
            "phone": phone,
            "passwordHash": hashed_password,
            "role": role,
            "status": "ACTIVE",  # Add other relevant fields
            "preferences": {},
            "lastLogin": None,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        # insert_one returns an InsertOneResult object containing the new _id
        result = db.users.insert_one(user_data)
        
        # Return the user document by finding it with the new _id
        return UserModel.find_by_id(result.inserted_id)

    @staticmethod
    def find_by_email(email):
        """Find a user by their email address (for login/checking duplicates)."""
        return db.users.find_one({"email": email.lower().strip()})

    @staticmethod
    def find_by_id(user_id):
        """Find a user by their unique _id."""
        # Convert the string ID to a MongoDB ObjectId
        return db.users.find_one({"_id": ObjectId(user_id)})

    @staticmethod
    def update_by_id(user_id, update_data):
        """Update user details using their _id and return the updated document."""
        update_data["updatedAt"] = datetime.utcnow()
        
        db.users.update_one(
            {"_id": ObjectId(user_id)}, 
            {"$set": update_data}
        )
        
        # Fetch and return the newly updated user document
        return UserModel.find_by_id(user_id)

    @staticmethod
    def check_password(hashed_password, password):
        """Verify a password against its hash."""
        return check_password_hash(hashed_password, password)