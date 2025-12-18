from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "super-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

jwt = JWTManager(app)

# Register blueprints
from routes.auth_routes import auth_bp, bcrypt
from routes.verify_routes import verify_bp
from routes.admin_routes import admin_bp

# Initialize extensions that require app context
bcrypt.init_app(app)

# URL prefixes align with frontend calls
app.register_blueprint(auth_bp, url_prefix="/auth") 
app.register_blueprint(verify_bp, url_prefix="/verify")
app.register_blueprint(admin_bp, url_prefix="/admin")

if __name__ == "__main__":
    app.run(debug=True)
