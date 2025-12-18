from flask import Blueprint, request, jsonify, current_app, redirect
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import users_collection, verifications_collection
import os
import requests
from urllib.parse import urlencode, quote_plus

# optional local api_key file providing CLIENT_ID/CLIENT_SECRET as fallbacks
try:
    from api_key import CLIENT_ID as API_CLIENT_ID, CLIENT_SECRET as API_CLIENT_SECRET
except Exception:
    API_CLIENT_ID = None
    API_CLIENT_SECRET = None

bcrypt = Bcrypt()
auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    users_collection.insert_one({
        "full_name": full_name,
        "email": email,
        "password": hashed_pw
    })

    return jsonify({"message": "User created successfully!"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    # Special-case Admin user (static credentials)
    if email and isinstance(email, str) and email.lower() == "admin@gmail.com" and password == "admin123":
        access_token = create_access_token(identity="admin@gmail.com")
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": {"full_name": "Admin", "email": "admin@gmail.com", "is_admin": True},
        }), 200

    user = users_collection.find_one({"email": email}) if email else None

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not user.get("password"):
        return jsonify({"error": "User has no local password; please use OAuth login"}), 401

    if not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid password"}), 401

    # Generate JWT token
    access_token = create_access_token(identity=email)

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "full_name": user["full_name"],
            "email": user["email"]
        }
    }), 200


@auth_bp.route("/google/login")
def google_login():
    """Redirect the user to Google's OAuth 2.0 server for authorization."""
    # prefer env vars, fall back to api_key module if present
    client_id = os.getenv("GOOGLE_CLIENT_ID") or API_CLIENT_ID
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    if not client_id:
        return jsonify({"error": "GOOGLE_CLIENT_ID not configured on server"}), 500

    redirect_uri = os.environ.get("GOOGLE_REDIRECT_URI", "http://127.0.0.1:5000/auth/google/callback")
    scope = "openid email profile"
    params = {
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "scope": scope,
        "access_type": "offline",
        "prompt": "consent",
    }
    auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)
    return redirect(auth_url)


@auth_bp.route("/google/callback")
def google_callback():
    """Handle Google's OAuth2 callback, exchange code for tokens, create/find user, issue JWT, then redirect to frontend with token."""
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing code in callback"}), 400

    # prefer env vars, fall back to api_key values
    client_id = os.getenv("GOOGLE_CLIENT_ID") or API_CLIENT_ID
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET") or API_CLIENT_SECRET
    redirect_uri = os.environ.get("GOOGLE_REDIRECT_URI", "http://127.0.0.1:5000/auth/google/callback")
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")

    if not client_id or not client_secret:
        return jsonify({"error": "Google OAuth not configured (client id/secret)"}), 500

    # Exchange code for tokens
    token_url = "https://oauth2.googleapis.com/token"
    payload = {
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }

    try:
        token_resp = requests.post(token_url, data=payload, timeout=10)
        token_resp.raise_for_status()
        token_data = token_resp.json()
    except Exception:
        current_app.logger.exception("Failed to exchange code for tokens")
        return jsonify({"error": "Token exchange failed"}), 500

    id_token = token_data.get("id_token")
    if not id_token:
        return jsonify({"error": "No id_token returned from Google"}), 500

    # Validate token info via Google's tokeninfo endpoint
    try:
        info_resp = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}")
        info_resp.raise_for_status()
        info = info_resp.json()
    except Exception:
        current_app.logger.exception("Failed to validate id_token")
        return jsonify({"error": "Failed to validate id_token"}), 500

    email = info.get("email")
    name = info.get("name") or info.get("email")
    aud = info.get("aud")
    if aud != client_id:
        return jsonify({"error": "Invalid token audience"}), 400

    # Create or find user
    try:
        user = users_collection.find_one({"email": email})
        if not user:
            users_collection.insert_one({
                "full_name": name,
                "email": email,
                # no password since oauth user
                "password": None,
            })
    except Exception:
        current_app.logger.exception("Failed to lookup/create user")

    # Issue JWT for our app
    access_token = create_access_token(identity=email)

    # Redirect back to frontend with token in query string
    # build a safe redirect URL with encoded params
    params = {
        "access_token": access_token,
        "email": email,
        "name": name,
    }
    redirect_to = f"{frontend_url}/login?" + urlencode({k: (v or "") for k, v in params.items()})
    return redirect(redirect_to)


@auth_bp.route("/admin", methods=["GET"])
@jwt_required()
def admin_dashboard():
    """Return simple admin dashboard stats. Accessible only to Admin user or users with is_admin flag."""
    identity = get_jwt_identity()
    # identity may be 'admin@gmail.com' for static admin or an email
    is_admin = False
    if identity == "admin@gmail.com":
        is_admin = True
    else:
        try:
            user = users_collection.find_one({"email": identity})
            if user and user.get("is_admin"):
                is_admin = True
        except Exception:
            pass

    if not is_admin:
        return jsonify({"error": "Forbidden"}), 403

    try:
        users_count = users_collection.count_documents({})
        verifications_count = verifications_collection.count_documents({})
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

        return jsonify({"users_count": users_count, "verifications_count": verifications_count, "recent": recent}), 200
    except Exception as e:
        current_app.logger.exception("Failed to build admin dashboard")
        return jsonify({"error": "Failed to fetch admin data"}), 500
