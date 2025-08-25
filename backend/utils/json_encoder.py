from bson import ObjectId
from datetime import datetime

def serialize_doc(doc):
    """Convert ObjectId & datetime fields into JSON-safe formats"""
    if not doc:
        return None
    serialized = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            serialized[key] = str(value)
        elif isinstance(value, datetime):
            serialized[key] = value.isoformat()
        else:
            serialized[key] = value
    return serialized
