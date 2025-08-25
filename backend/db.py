from pymongo import MongoClient
from config import Config

try:
    client = MongoClient(Config.MONGO_URI)
    db = client["mybus"]
    print("✅ MongoDB Connected Successfully!")
except Exception as e:
    print(f"❌ MongoDB Connection Error: {e}")
    db = None

