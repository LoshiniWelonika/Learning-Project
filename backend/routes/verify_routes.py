from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS
import joblib

from utils.text_cleaner import clean_text

verify_bp = Blueprint("verify", __name__)

# Load trained model and vectorizer
model = joblib.load("model/fake_news_model.pkl")
vectorizer = joblib.load("model/tfidf_vectorizer.pkl")

@verify_bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Fake News API running"}), 200


@verify_bp.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Text field is required"}), 400

    raw_text = data["text"]
    cleaned_text = clean_text(raw_text)

    vectorized_text = vectorizer.transform([cleaned_text])

    prediction = model.predict(vectorized_text)[0]
    confidence = model.predict_proba(vectorized_text)[0].max()

    response = {
        "prediction": "REAL" if prediction == 1 else "FAKE",
        "confidence": round(float(confidence), 2)
    }

    return jsonify(response), 200


