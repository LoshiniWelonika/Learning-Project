from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from flask_cors import CORS
from routes.faq_routes import faq_bp
from routes.report_routes import report_bp

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "super-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

jwt = JWTManager(app)

# Register blueprints
from routes.auth_routes import auth_bp, bcrypt
from routes.verify_routes import verify_bp

# Initialize extensions that require app context
bcrypt.init_app(app)

# URL prefixes align with frontend calls
app.register_blueprint(auth_bp, url_prefix="/auth") 
app.register_blueprint(verify_bp, url_prefix="/verify")
app.register_blueprint(faq_bp, url_prefix="/faq")
app.register_blueprint(report_bp, url_prefix="/report")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
