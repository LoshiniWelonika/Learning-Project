from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from pymongo import MongoClient
from datetime import datetime
import certifi

# --- FAQ Blueprint ---
faq_bp = Blueprint("faq_bp", __name__)

# --- MongoDB connection ---
try:
    client = MongoClient(
        "mongodb+srv://loshinikedapanawala:wLo6iVxBRXii3Grr@cluster0.imcqp0l.mongodb.net/truthlab_db?retryWrites=true&w=majority",
        tls=True,
        tlsCAFile=certifi.where()
    )
    db = client["truthlab_db"]
    faq_questions_collection = db["faq_questions"]  # new collection for FAQ questions
    print("Connected to MongoDB successfully (FAQ)!")
except Exception as e:
    print("MongoDB connection error:", e)

# --- Submit FAQ Question Route ---
@faq_bp.route("/submit-question", methods=["POST", "OPTIONS"])
@cross_origin()
def submit_faq():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 200

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    name = data.get("name")
    email = data.get("email")
    question = data.get("question")

    missing = [k for k, v in (("name", name), ("email", email), ("question", question)) if not v]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    # Insert into MongoDB
    result = faq_questions_collection.insert_one({
        "name": name,
        "email": email,
        "question": question,
        "submitted_at": datetime.utcnow()
    })
    print("[FAQ] inserted question id:", result.inserted_id)

    return jsonify({"message": "Your question has been submitted successfully!"}), 201
