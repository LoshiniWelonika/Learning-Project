from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from pymongo import MongoClient
from datetime import datetime
import certifi

# --- Report Blueprint ---
report_bp = Blueprint("report_bp", __name__)

# --- MongoDB connection ---
try:
    client = MongoClient(
        "mongodb+srv://loshinikedapanawala:wLo6iVxBRXii3Grr@cluster0.imcqp0l.mongodb.net/truthlab_db?retryWrites=true&w=majority",
        tls=True,
        tlsCAFile=certifi.where()
    )
    db = client["truthlab_db"]
    report_collection = db["issue_reports"]  # new collection for reported issues
    print("Connected to MongoDB successfully (Report)!")

except Exception as e:
    print("MongoDB connection error:", e)

# --- Submit Report Route ---
@report_bp.route("/submit-report", methods=["POST", "OPTIONS"])
@cross_origin()
def submit_report():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 200

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    email = data.get("email")
    satisfaction = data.get("satisfaction")
    issue_description = data.get("issue_description")
    news_id = data.get("news_id")  # The news ID the issue is related to

    missing = [k for k, v in (("email", email), ("satisfaction", satisfaction), ("issue_description", issue_description), ("news_id", news_id)) if not v]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    # Insert into MongoDB
    result = report_collection.insert_one({
        "email": email,
        "satisfaction": satisfaction,
        "issue_description": issue_description,
        "news_id": news_id,
        "reported_at": datetime.utcnow()
    })
    print("[REPORT] inserted report id:", result.inserted_id)

    return jsonify({"message": "Your issue has been reported successfully!"}), 201
