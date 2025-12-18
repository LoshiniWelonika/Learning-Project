from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import users_collection, verifications_collection

admin_bp = Blueprint("admin", __name__)


def _is_admin_identity(identity):
    try:
        if isinstance(identity, str) and identity.lower() == "admin@gmail.com":
            return True
        user = users_collection.find_one({"email": identity})
        return bool(user and user.get("is_admin"))
    except Exception:
        current_app.logger.exception("Error checking admin identity")
        return False


@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
def stats():
    identity = get_jwt_identity()
    if not _is_admin_identity(identity):
        return jsonify({"error": "Forbidden"}), 403

    try:
        total = verifications_collection.count_documents({})
        real = verifications_collection.count_documents({"prediction": "REAL"})
        fake = verifications_collection.count_documents({"prediction": "FAKE"})

        # recent verifications
        recent = []
        docs = verifications_collection.find().sort("created_at", -1).limit(10)
        for d in docs:
            recent.append({
                "id": str(d.get("_id")),
                "text": (d.get("text") or "")[:300],
                "prediction": d.get("prediction"),
                "confidence": float(d.get("confidence", 0)),
                "username": d.get("username"),
                "user_email": d.get("user_email"),
                "created_at": d.get("created_at").isoformat() if d.get("created_at") else None,
            })

        return jsonify({"total": total, "real": real, "fake": fake, "recent": recent}), 200
    except Exception:
        current_app.logger.exception("Failed to build admin stats")
        return jsonify({"error": "Failed to fetch admin stats"}), 500
