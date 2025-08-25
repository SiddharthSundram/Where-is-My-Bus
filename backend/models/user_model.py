import uuid
from datetime import datetime
from db import db
from werkzeug.security import generate_password_hash, check_password_hash

class UserModel:
    @staticmethod
    def create_user(name, email, phone, password, role="USER", preferences=None):
        """Create a new user with full details"""
        hashed_password = generate_password_hash(password)
        user_data = {
            "id": str(uuid.uuid4()),
            "email": email.lower().strip(),
            "name": name,
            "phone": phone,
            "passwordHash": hashed_password,
            "role": role,
            "preferences": preferences if preferences else {},
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        db.users.insert_one(user_data)
        return user_data

    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        return db.users.find_one({"email": email.lower().strip()})

    @staticmethod
    def check_password(hashed_password, password):
        """Verify hashed password"""
        return check_password_hash(hashed_password, password)

    @staticmethod
    def update_user(email, update_data):
        """Update user details"""
        update_data["updatedAt"] = datetime.utcnow()
        db.users.update_one({"email": email.lower().strip()}, {"$set": update_data})
