# utils/jwt_utils.py
import jwt
from datetime import datetime, timedelta
from config import Config

def generate_token(user_id, role="USER"):
    """Generate JWT token with role info"""
    payload = {
        "user_id": str(user_id),
        "role": role,  # ✅ Include role
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")


def verify_token(token):
    """Verify JWT token"""
    try:
        decoded = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
