from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash


db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    cart_items = db.relationship("CartItem", backref="user", lazy=True, cascade="all, delete-orphan")
    wishlist_items = db.relationship("Wishlist", backref="user", lazy=True, cascade="all, delete-orphan")
    orders = db.relationship("Order", backref="user", lazy=True, cascade="all, delete-orphan")
    addresses = db.relationship("Address", backref="user", lazy=True, cascade="all, delete-orphan")

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "phone": self.phone,
            "created_at": self.created_at.isoformat(),
        }


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(80), nullable=False, index=True)
    subcategory = db.Column(db.String(80), nullable=True, index=True)
    price = db.Column(db.Float, nullable=False)
    original_price = db.Column(db.Float, nullable=False)
    discount_percent = db.Column(db.Integer, nullable=False, default=0)
    image_url = db.Column(db.String(500), nullable=False)
    image_url_hover = db.Column(db.String(500), nullable=True)
    badge = db.Column(db.String(20), nullable=True)  # NEW | BESTSELLER | SALE | HOT | LIMITED
    sizes = db.Column(db.String(200), nullable=True)  # comma-separated: XS,S,M,L,XL,XXL
    colors = db.Column(db.String(200), nullable=True)  # comma-separated: Black,White,Navy
    stock = db.Column(db.Integer, nullable=False, default=100)  # Stock quantity
    in_stock = db.Column(db.Boolean, nullable=False, default=True)
    rating = db.Column(db.Float, nullable=False, default=4.0)
    reviews = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "subcategory": self.subcategory,
            "price": self.price,
            "original_price": self.original_price,
            "discount_percent": self.discount_percent,
            "image_url": self.image_url,
            "image_url_hover": self.image_url_hover,
            "badge": self.badge,
            "sizes": self.sizes.split(",") if self.sizes else [],
            "colors": self.colors.split(",") if self.colors else [],
            "stock": self.stock,
            "in_stock": self.in_stock,
            "rating": self.rating,
            "reviews": self.reviews,
            "created_at": self.created_at.isoformat(),
        }


class Address(db.Model):
    __tablename__ = "addresses"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    line1 = db.Column(db.String(255), nullable=False)
    line2 = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)
    is_default = db.Column(db.Boolean, nullable=False, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "full_name": self.full_name,
            "phone": self.phone,
            "line1": self.line1,
            "line2": self.line2,
            "city": self.city,
            "state": self.state,
            "pincode": self.pincode,
            "is_default": self.is_default,
        }


class CartItem(db.Model):
    __tablename__ = "cart_items"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    size = db.Column(db.String(10), nullable=True)
    color = db.Column(db.String(50), nullable=True)

    product = db.relationship("Product")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "size": self.size,
            "color": self.color,
            "product": self.product.to_dict() if self.product else None,
        }


class Wishlist(db.Model):
    __tablename__ = "wishlist"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)

    product = db.relationship("Product")

    __table_args__ = (db.UniqueConstraint("user_id", "product_id", name="uix_wishlist_user_product"),)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "product": self.product.to_dict() if self.product else None,
        }


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    address_id = db.Column(db.Integer, db.ForeignKey("addresses.id"), nullable=True)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(40), nullable=False, default="pending")  # pending/confirmed/shipped/delivered
    payment_method = db.Column(db.String(20), nullable=False, default="COD")  # COD/UPI/Card
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    items = db.relationship("OrderItem", backref="order", lazy=True, cascade="all, delete-orphan")
    address = db.relationship("Address")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "address_id": self.address_id,
            "total": self.total,
            "status": self.status,
            "payment_method": self.payment_method,
            "created_at": self.created_at.isoformat(),
            "items": [item.to_dict() for item in self.items],
            "address": self.address.to_dict() if self.address else None,
        }


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    size = db.Column(db.String(10), nullable=True)
    price = db.Column(db.Float, nullable=False)

    product = db.relationship("Product")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "size": self.size,
            "price": self.price,
            "product": self.product.to_dict() if self.product else None,
        }
