from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS
import joblib
from flask_jwt_extended import jwt_required, get_jwt_identity
import requests
from bs4 import BeautifulSoup

from utils.text_cleaner import clean_text
from models import verifications_collection, users_collection
from datetime import datetime

verify_bp = Blueprint("verify", __name__)

# Load trained model and vectorizer
model = joblib.load("model/fake_news_model.pkl")
vectorizer = joblib.load("model/tfidf_vectorizer.pkl")

@verify_bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Fake News API running"}), 200


@verify_bp.route("/predict", methods=["POST"])
@jwt_required(optional=True)
def predict():
    data = request.get_json() or {}

    raw_text = None
    source_url = None

    # If a URL is provided, fetch and extract article text
    if data.get("url"):
        source_url = data.get("url")
        try:
            resp = requests.get(source_url, timeout=8, headers={"User-Agent": "Mozilla/5.0"})
            resp.raise_for_status()
            html = resp.text
            # Try to extract main article text
            soup = BeautifulSoup(html, "html.parser")
            article = None
            # prefer <article> or <main>
            if soup.article:
                article = soup.article
            elif soup.find("main"):
                article = soup.find("main")

            if article:
                paragraphs = [p.get_text(separator=" ", strip=True) for p in article.find_all("p")]
                raw_text = "\n\n".join(p for p in paragraphs if p)
            else:
                # fallback: collect all <p> tags and choose the longest contiguous block
                paragraphs = [p.get_text(separator=" ", strip=True) for p in soup.find_all("p")]
                raw_text = "\n\n".join(p for p in paragraphs if p)

            if not raw_text or len(raw_text.strip()) < 50:
                # as last resort, use page title and meta description
                title = soup.title.string if soup.title else ""
                desc = ""
                md = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
                if md and md.get("content"):
                    desc = md.get("content")
                raw_text = (title + "\n" + desc).strip()
        except Exception as e:
            return jsonify({"error": f"Failed to fetch URL: {str(e)}"}), 400
    else:
        # Expect direct text
        if not data.get("text"):
            return jsonify({"error": "Text or url field is required"}), 400
        raw_text = data.get("text")

    cleaned_text = clean_text(raw_text or "")

    vectorized_text = vectorizer.transform([cleaned_text])

    prediction = model.predict(vectorized_text)[0]
    confidence = model.predict_proba(vectorized_text)[0].max()

    response = {
        "prediction": "REAL" if prediction == 1 else "FAKE",
        "confidence": round(float(confidence), 2)
    }
    # include content snippet in response (useful for URL inputs)
    try:
        response["content"] = (raw_text[:2000] + "...") if raw_text and len(raw_text) > 2000 else (raw_text or "")
    except Exception:
        response["content"] = ""

    # Persist verification result to the database (include user info if available)
    try:
        identity = get_jwt_identity()
        username = None
        user_email = None
        if identity:
            user_email = identity
            try:
                user = users_collection.find_one({"email": identity})
                if user and user.get("full_name"):
                    username = user.get("full_name")
                else:
                    username = identity
            except Exception:
                username = identity

        doc = {
            "text": raw_text,
            "cleaned_text": cleaned_text,
            "prediction": response["prediction"],
            "confidence": float(confidence),
            "username": username,
            "user_email": user_email,
            "created_at": datetime.utcnow(),
        }
        if source_url:
            doc["source_url"] = source_url
        verifications_collection.insert_one(doc)
    except Exception as e:
        # Log insertion error (do not fail the request because of DB error)
        print("Failed to save verification result:", e)

    return jsonify(response), 200


@verify_bp.route("/history", methods=["GET"])
@jwt_required()
def history():
    """Return verification history for the authenticated user."""
    identity = get_jwt_identity()
    if not identity:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        docs = (
            verifications_collection.find({"user_email": identity})
            .sort("created_at", -1)
            .limit(200)
        )

        results = []
        for d in docs:
            results.append({
                "id": str(d.get("_id")),
                "text": d.get("text"),
                "prediction": d.get("prediction"),
                "confidence": float(d.get("confidence", 0)),
                "username": d.get("username"),
                "user_email": d.get("user_email"),
                "created_at": d.get("created_at").isoformat() if d.get("created_at") else None,
            })

        return jsonify({"history": results}), 200
    except Exception as e:
        print("Failed to fetch history:", e)
        return jsonify({"error": "Failed to fetch history"}), 500


