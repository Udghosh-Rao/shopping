import os
from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from dotenv import load_dotenv
from flask import Flask, g, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

load_dotenv()

db = SQLAlchemy()

VALID_ROLES = {"user", "organizer"}


def create_app() -> Flask:
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY", "dev-only-secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///mvp_auth.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_EXPIRES_HOURS"] = int(os.getenv("JWT_EXPIRES_HOURS", "24"))

    db.init_app(app)

    cors_origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")]
    CORS(app, resources={r"/api/*": {"origins": cors_origins}})

    class User(db.Model):
        __tablename__ = "users"

        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(120), nullable=False)
        email = db.Column(db.String(255), nullable=False, unique=True, index=True)
        password_hash = db.Column(db.String(255), nullable=False)
        role = db.Column(db.String(20), nullable=False, default="user")
        created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
        updated_at = db.Column(
            db.DateTime,
            default=datetime.utcnow,
            onupdate=datetime.utcnow,
            nullable=False,
        )

        def to_dict(self):
            return {
                "id": self.id,
                "name": self.name,
                "email": self.email,
                "role": self.role,
                "createdAt": self.created_at.isoformat() + "Z",
                "updatedAt": self.updated_at.isoformat() + "Z",
            }

    def create_jwt(user: User) -> str:
        expires_at = datetime.now(timezone.utc) + timedelta(hours=app.config["JWT_EXPIRES_HOURS"])
        payload = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "exp": expires_at,
            "iat": datetime.now(timezone.utc),
        }
        return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")

    def token_required(allowed_roles=None):
        allowed_roles_set = set(allowed_roles or [])

        def decorator(fn):
            @wraps(fn)
            def wrapped(*args, **kwargs):
                auth_header = request.headers.get("Authorization", "")
                if not auth_header.startswith("Bearer "):
                    return jsonify({"error": "Missing or invalid Authorization header"}), 401

                token = auth_header.split(" ", 1)[1].strip()
                if not token:
                    return jsonify({"error": "Token cannot be empty"}), 401

                try:
                    payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
                except jwt.ExpiredSignatureError:
                    return jsonify({"error": "Token expired"}), 401
                except jwt.InvalidTokenError:
                    return jsonify({"error": "Invalid token"}), 401

                user_id = payload.get("sub")
                role = payload.get("role")
                if not user_id or role not in VALID_ROLES:
                    return jsonify({"error": "Invalid token payload"}), 401

                user = User.query.get(int(user_id))
                if not user:
                    return jsonify({"error": "User not found"}), 401

                if role != user.role:
                    return jsonify({"error": "Token role is outdated. Please login again."}), 401

                if allowed_roles_set and user.role not in allowed_roles_set:
                    return jsonify({"error": "Forbidden: insufficient role"}), 403

                g.current_user = user
                return fn(*args, **kwargs)

            return wrapped

        return decorator

    @app.post("/api/auth/register")
    def register():
        data = request.get_json(silent=True) or {}
        name = (data.get("name") or "").strip()
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""
        role = (data.get("role") or "user").strip().lower()

        if not name or not email or not password:
            return jsonify({"error": "name, email, and password are required"}), 400

        if role not in VALID_ROLES:
            return jsonify({"error": "role must be either user or organizer"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 409

        user = User(
            name=name,
            email=email,
            password_hash=generate_password_hash(password),
            role=role,
        )
        db.session.add(user)
        db.session.commit()

        token = create_jwt(user)
        return jsonify({"token": token, "user": user.to_dict()}), 201

    @app.post("/api/auth/login")
    def login():
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""

        if not email or not password:
            return jsonify({"error": "email and password are required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({"error": "Invalid email or password"}), 401

        token = create_jwt(user)
        return jsonify({"token": token, "user": user.to_dict()}), 200

    @app.get("/api/profile")
    @token_required({"user", "organizer"})
    def get_profile():
        return jsonify({"user": g.current_user.to_dict()}), 200

    @app.put("/api/profile")
    @token_required({"user", "organizer"})
    def update_profile():
        data = request.get_json(silent=True) or {}
        name = data.get("name")
        email = data.get("email")

        user = g.current_user

        if name is not None:
            name = name.strip()
            if not name:
                return jsonify({"error": "name cannot be empty"}), 400
            user.name = name

        if email is not None:
            email = email.strip().lower()
            if not email:
                return jsonify({"error": "email cannot be empty"}), 400
            existing = User.query.filter_by(email=email).first()
            if existing and existing.id != user.id:
                return jsonify({"error": "Email already in use"}), 409
            user.email = email

        db.session.commit()
        return jsonify({"user": user.to_dict()}), 200

    @app.get("/api/organizer/overview")
    @token_required({"organizer"})
    def organizer_overview():
        return jsonify(
            {
                "message": "Organizer access granted",
                "metrics": {
                    "activeEvents": 3,
                    "pendingApprovals": 5,
                    "ticketsSoldToday": 42,
                },
            }
        ), 200

    @app.get("/api/me/role")
    @token_required({"user", "organizer"})
    def my_role():
        return jsonify({"role": g.current_user.role}), 200

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"}), 200

    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
