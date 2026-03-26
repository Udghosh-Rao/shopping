from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from models import Product, User, db
from routes.auth import auth_bp
from routes.cart import cart_bp
from routes.orders import orders_bp
from routes.products import products_bp


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "change-me-in-production"

    CORS(app)
    db.init_app(app)
    JWTManager(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(orders_bp)

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"}), 200

    with app.app_context():
        db.create_all()
        seed_products()
        seed_admin_user()

    return app


def seed_admin_user():
    existing_admin = User.query.filter_by(email="admin@example.com").first()
    if existing_admin:
        return

    admin = User(username="admin", email="admin@example.com", role="admin")
    admin.set_password("admin123")
    db.session.add(admin)
    db.session.commit()


def seed_products():
    if Product.query.count() > 0:
        return

    sample_products = [
        {"name": "Indigo Running Shoes", "description": "Lightweight shoes for daily running.", "price": 79.99, "stock": 25, "category": "Footwear", "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"},
        {"name": "Trail Pro Sneakers", "description": "Durable trail sneakers with extra grip.", "price": 99.99, "stock": 20, "category": "Footwear", "image_url": "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&q=80"},
        {"name": "Urban Hoodie", "description": "Comfortable hoodie for all seasons.", "price": 49.5, "stock": 40, "category": "Apparel", "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"},
        {"name": "Classic Denim Jacket", "description": "Stylish denim jacket with modern fit.", "price": 89.0, "stock": 15, "category": "Apparel", "image_url": "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=600&q=80"},
        {"name": "Cotton T-Shirt Pack", "description": "Set of 3 premium cotton t-shirts.", "price": 35.99, "stock": 60, "category": "Apparel", "image_url": "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=600&q=80"},
        {"name": "Noise-Cancel Headphones", "description": "Immersive wireless over-ear headphones.", "price": 129.99, "stock": 18, "category": "Electronics", "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"},
        {"name": "Smart Fitness Watch", "description": "Track workouts, sleep, and heart rate.", "price": 149.99, "stock": 22, "category": "Electronics", "image_url": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=600&q=80"},
        {"name": "Bluetooth Speaker", "description": "Portable speaker with deep bass.", "price": 59.99, "stock": 35, "category": "Electronics", "image_url": "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=600&q=80"},
        {"name": "Minimalist Backpack", "description": "Water-resistant backpack with laptop sleeve.", "price": 69.99, "stock": 27, "category": "Accessories", "image_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80"},
        {"name": "Leather Wallet", "description": "Slim wallet with RFID protection.", "price": 39.99, "stock": 50, "category": "Accessories", "image_url": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80"},
    ]

    for product_data in sample_products:
        db.session.add(Product(**product_data))
    db.session.commit()


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
