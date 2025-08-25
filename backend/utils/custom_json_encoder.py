import json
from bson import ObjectId
from datetime import datetime

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        # Convert ObjectId → str
        if isinstance(obj, ObjectId):
            return str(obj)
        # Convert datetime → ISO 8601 string
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)
