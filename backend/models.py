from pymongo import MongoClient

# Localhost or your MongoDB Atlas connection string
client = MongoClient("mongodb+srv://loshinikedapanawala:wLo6iVxBRXii3Grr@cluster0.imcqp0l.mongodb.net/truthlab_db")
db = client["truthlab_db"]
users_collection = db["users"]
verifications_collection = db["verifications"]
