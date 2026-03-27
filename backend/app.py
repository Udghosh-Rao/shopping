from datetime import datetime, timedelta
from random import sample

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from sqlalchemy import desc, func, or_, text

from models import Address, CartItem, Order, OrderItem, Product, User, Wishlist, db

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "change-me-in-production-f8b23e4a9d1c"

CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])
db.init_app(app)
jwt = JWTManager(app)

APPAREL_CATEGORIES = ["T-Shirts", "Shirts", "Joggers", "Shorts", "Hoodies", "Jackets", "Sneakers"]
ALLOWED_PAYMENT_METHODS = {"COD", "UPI", "Card"}


def _json_body():
    return request.get_json(silent=True) or {}


def _parse_int(value, default=None):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _build_token(user: User) -> str:
    return create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role, "email": user.email},
    )


def _is_admin(user: User | None) -> bool:
    return bool(user and user.role == "admin")


def _ensure_user_columns() -> None:
    table_exists = db.session.execute(
        text("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
    ).first()
    if not table_exists:
        return

    existing_columns = {
        row[1] for row in db.session.execute(text("PRAGMA table_info(users)")).fetchall()
    }
    if "role" not in existing_columns:
        db.session.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'"))
        db.session.execute(text("UPDATE users SET role = 'user' WHERE role IS NULL"))
    if "is_active" not in existing_columns:
        db.session.execute(text("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1"))
        db.session.execute(text("UPDATE users SET is_active = 1 WHERE is_active IS NULL"))
    db.session.commit()


def _get_current_user():
    user_id = int(get_jwt_identity())
    return User.query.get(user_id)


@app.after_request
def add_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    return response


@app.errorhandler(404)
def not_found(_e):
    return jsonify({"error": "Not found"}), 404


@app.errorhandler(500)
def server_error(_e):
    return jsonify({"error": "Server error"}), 500


# ═══════════════════════════════════════════════════════════════════════════
# AUTH ROUTES
# ═══════════════════════════════════════════════════════════════════════════

@app.post("/api/auth/register")
def register():
    data = _json_body()
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")
    phone = (data.get("phone") or "").strip() or None

    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    user = User(username=username, email=email, phone=phone, role="user", is_active=True)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = _build_token(user)
    return jsonify({"token": token, "username": user.username, "email": user.email, "role": user.role}), 201


@app.post("/api/auth/bootstrap-admin")
def bootstrap_admin():
    if User.query.filter_by(role="admin").first():
        return jsonify({"error": "Admin already exists"}), 409

    data = _json_body()
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    admin_user = User(username=username, email=email, role="admin", is_active=True)
    admin_user.set_password(password)
    db.session.add(admin_user)
    db.session.commit()

    token = _build_token(admin_user)
    return jsonify({"token": token, "username": admin_user.username, "email": admin_user.email, "role": admin_user.role}), 201


@app.post("/api/auth/login")
def login():
    data = _json_body()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401
    if not user.is_active:
        return jsonify({"error": "Account disabled"}), 403

    token = _build_token(user)
    return jsonify({"token": token, "username": user.username, "email": user.email, "role": user.role}), 200


@app.post("/api/auth/admin/login")
def admin_login():
    data = _json_body()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401
    if not user.is_active:
        return jsonify({"error": "Account disabled"}), 403
    if not _is_admin(user):
        return jsonify({"error": "Admin access required"}), 403

    token = _build_token(user)
    return jsonify({"token": token, "username": user.username, "email": user.email, "role": user.role}), 200


@app.post("/api/auth/logout")
@jwt_required()
def logout():
    return jsonify({"message": "Logged out"}), 200


@app.get("/api/auth/me")
@jwt_required()
def get_current_user():
    user = _get_current_user()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200


# ═══════════════════════════════════════════════════════════════════════════
# PRODUCT ROUTES
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/products")
def get_products():
    category = request.args.get("category")
    subcategory = request.args.get("subcategory")
    badge = request.args.get("badge")
    search = request.args.get("search")
    min_price = request.args.get("min_price", type=float)
    max_price = request.args.get("max_price", type=float)
    sort = request.args.get("sort", "newest")
    featured = request.args.get("featured")
    page = max(request.args.get("page", 1, type=int) or 1, 1)
    per_page = request.args.get("per_page", 12, type=int) or 12
    per_page = min(max(per_page, 1), 50)

    query = Product.query.filter(Product.category.in_(APPAREL_CATEGORIES))

    if category:
        query = query.filter(Product.category == category)
    if subcategory:
        query = query.filter(Product.subcategory == subcategory)
    if badge:
        query = query.filter(Product.badge == badge.upper())
    if featured and str(featured).lower() == "true":
        query = query.filter(Product.badge.in_(["BESTSELLER", "NEW", "HOT"]))
    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.category.ilike(f"%{search}%"),
                Product.subcategory.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%"),
            )
        )
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort == "rating":
        query = query.order_by(Product.rating.desc())
    elif sort == "popular":
        query = query.order_by(Product.reviews.desc(), Product.rating.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify(
        {
            "products": [p.to_dict() for p in paginated.items],
            "page": page,
            "per_page": per_page,
            "total": paginated.total,
            "pages": paginated.pages,
            "current_page": page,
        }
    ), 200


@app.get("/api/products/bulk")
def get_products_bulk():
    ids_param = request.args.get("ids", "")
    ids = []
    for value in ids_param.split(","):
        value = value.strip()
        if value.isdigit():
            ids.append(int(value))

    if not ids:
        return jsonify([]), 200

    products = Product.query.filter(Product.id.in_(ids), Product.category.in_(APPAREL_CATEGORIES)).all()
    product_map = {p.id: p.to_dict() for p in products}
    ordered = [product_map[i] for i in ids if i in product_map]
    return jsonify(ordered), 200


@app.get("/api/products/<int:product_id>")
def get_product(product_id):
    product = Product.query.filter(
        Product.id == product_id, Product.category.in_(APPAREL_CATEGORIES)
    ).first()
    if not product:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product.to_dict()), 200


@app.get("/api/products/featured")
def get_featured_products():
    products = (
        Product.query.filter(
            or_(Product.badge == "BESTSELLER", Product.badge == "NEW"),
            Product.category.in_(APPAREL_CATEGORIES),
        )
        .order_by(Product.rating.desc())
        .limit(8)
        .all()
    )
    return jsonify([p.to_dict() for p in products]), 200


@app.get("/api/products/related/<int:product_id>")
def get_related_products(product_id):
    product = Product.query.filter(
        Product.id == product_id, Product.category.in_(APPAREL_CATEGORIES)
    ).first()
    if not product:
        return jsonify({"error": "Product not found"}), 404

    related = (
        Product.query.filter(
            Product.category == product.category,
            Product.id != product_id,
            Product.category.in_(APPAREL_CATEGORIES),
        )
        .limit(6)
        .all()
    )
    return jsonify([p.to_dict() for p in related]), 200


@app.get("/api/flash-sale")
def get_flash_sale():
    sale_products = Product.query.filter(
        Product.badge == "SALE", Product.category.in_(APPAREL_CATEGORIES)
    ).all()
    if len(sale_products) >= 4:
        selected = sample(sale_products, 4)
    else:
        selected = (
            Product.query.filter(Product.category.in_(APPAREL_CATEGORIES))
            .order_by(desc(Product.discount_percent))
            .limit(4)
            .all()
        )

    ends_at = (datetime.utcnow() + timedelta(hours=24)).isoformat() + "Z"
    return jsonify({"ends_at": ends_at, "products": [p.to_dict() for p in selected]}), 200


@app.get("/api/delivery/check")
def check_delivery():
    pincode = request.args.get("pincode", "")
    valid = pincode.isdigit() and len(pincode) == 6
    if not valid:
        return jsonify({"available": False, "error": "Invalid pincode"}), 400

    return jsonify({"available": True, "days": "3-5", "free": True}), 200


@app.get("/api/categories")
def get_categories():
    categories = (
        db.session.query(Product.category)
        .filter(Product.category.in_(APPAREL_CATEGORIES))
        .distinct()
        .all()
    )
    return jsonify([c[0] for c in categories]), 200


@app.get("/api/subcategories")
def get_subcategories():
    subcategories = (
        db.session.query(Product.subcategory)
        .filter(Product.subcategory.isnot(None), Product.category.in_(APPAREL_CATEGORIES))
        .distinct()
        .all()
    )
    return jsonify([s[0] for s in subcategories]), 200


# ═══════════════════════════════════════════════════════════════════════════
# CART ROUTES (JWT Protected)
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/cart")
@jwt_required()
def get_cart():
    user_id = int(get_jwt_identity())
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    return jsonify([item.to_dict() for item in cart_items]), 200


@app.post("/api/cart/add")
@jwt_required()
def add_to_cart():
    user_id = int(get_jwt_identity())
    data = _json_body()
    product_id = data.get("product_id")
    quantity = _parse_int(data.get("quantity", 1), default=1)
    size = data.get("size")
    color = data.get("color")

    if not product_id or quantity is None or quantity < 1:
        return jsonify({"error": "Valid product ID and quantity are required"}), 400

    product = Product.query.filter(
        Product.id == product_id, Product.category.in_(APPAREL_CATEGORIES)
    ).first()
    if not product:
        return jsonify({"error": "Product not found"}), 404

    existing = CartItem.query.filter_by(user_id=user_id, product_id=product_id, size=size, color=color).first()
    requested_quantity = quantity + (existing.quantity if existing else 0)

    if requested_quantity > product.stock:
        return jsonify({"error": "Requested quantity exceeds available stock"}), 400

    if existing:
        existing.quantity = requested_quantity
        db.session.commit()
        return jsonify(existing.to_dict()), 200

    cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity, size=size, color=color)
    db.session.add(cart_item)
    db.session.commit()
    return jsonify(cart_item.to_dict()), 201


@app.put("/api/cart/update/<int:item_id>")
@jwt_required()
def update_cart_item(item_id):
    user_id = int(get_jwt_identity())
    data = _json_body()
    quantity = _parse_int(data.get("quantity"))

    if quantity is None or quantity < 1:
        return jsonify({"error": "Invalid quantity"}), 400

    cart_item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    if not cart_item:
        return jsonify({"error": "Cart item not found"}), 404
    if quantity > cart_item.product.stock:
        return jsonify({"error": "Requested quantity exceeds available stock"}), 400

    cart_item.quantity = quantity
    db.session.commit()
    return jsonify(cart_item.to_dict()), 200


@app.delete("/api/cart/remove/<int:item_id>")
@jwt_required()
def remove_cart_item(item_id):
    user_id = int(get_jwt_identity())
    cart_item = CartItem.query.filter_by(id=item_id, user_id=user_id).first()
    if not cart_item:
        return jsonify({"error": "Cart item not found"}), 404

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({"message": "Item removed"}), 200


@app.delete("/api/cart/clear")
@jwt_required()
def clear_cart():
    user_id = int(get_jwt_identity())
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({"message": "Cart cleared"}), 200


# ═══════════════════════════════════════════════════════════════════════════
# WISHLIST ROUTES (JWT Protected)
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/wishlist")
@jwt_required()
def get_wishlist():
    user_id = int(get_jwt_identity())
    wishlist_items = Wishlist.query.filter_by(user_id=user_id).all()
    return jsonify([item.to_dict() for item in wishlist_items]), 200


@app.post("/api/wishlist/add")
@jwt_required()
def add_to_wishlist():
    user_id = int(get_jwt_identity())
    data = _json_body()
    product_id = data.get("product_id")

    if not product_id:
        return jsonify({"error": "Product ID required"}), 400

    product = Product.query.filter(
        Product.id == product_id, Product.category.in_(APPAREL_CATEGORIES)
    ).first()
    if not product:
        return jsonify({"error": "Product not found"}), 404

    existing = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing:
        return jsonify({"message": "Already in wishlist"}), 200

    wishlist_item = Wishlist(user_id=user_id, product_id=product_id)
    db.session.add(wishlist_item)
    db.session.commit()
    return jsonify(wishlist_item.to_dict()), 201


@app.delete("/api/wishlist/remove/<int:item_id>")
@jwt_required()
def remove_from_wishlist(item_id):
    user_id = int(get_jwt_identity())
    wishlist_item = Wishlist.query.filter_by(id=item_id, user_id=user_id).first()
    if not wishlist_item:
        return jsonify({"error": "Wishlist item not found"}), 404

    db.session.delete(wishlist_item)
    db.session.commit()
    return jsonify({"message": "Item removed from wishlist"}), 200


# ═══════════════════════════════════════════════════════════════════════════
# ORDER ROUTES (JWT Protected)
# ═══════════════════════════════════════════════════════════════════════════

@app.post("/api/orders/checkout")
@jwt_required()
def checkout():
    user_id = int(get_jwt_identity())
    data = _json_body()
    address_data = data.get("address")
    payment_method = data.get("payment_method", "COD")

    if payment_method not in ALLOWED_PAYMENT_METHODS:
        return jsonify({"error": "Invalid payment method"}), 400

    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"error": "Cart is empty"}), 400

    address_id = None
    if address_data:
        if isinstance(address_data, int):
            address = Address.query.filter_by(id=address_data, user_id=user_id).first()
            if not address:
                return jsonify({"error": "Address not found"}), 404
            address_id = address.id
        else:
            required_fields = ["full_name", "phone", "line1", "city", "state", "pincode"]
            if any(not str(address_data.get(field, "")).strip() for field in required_fields):
                return jsonify({"error": "Incomplete address details"}), 400
            address = Address(
                user_id=user_id,
                full_name=str(address_data.get("full_name")).strip(),
                phone=str(address_data.get("phone")).strip(),
                line1=str(address_data.get("line1")).strip(),
                line2=(address_data.get("line2") or "").strip() or None,
                city=str(address_data.get("city")).strip(),
                state=str(address_data.get("state")).strip(),
                pincode=str(address_data.get("pincode")).strip(),
                is_default=address_data.get("is_default", False),
            )
            db.session.add(address)
            db.session.flush()
            address_id = address.id

    total = 0.0
    for item in cart_items:
        if not item.product:
            return jsonify({"error": f"Product not found for cart item {item.id}"}), 404
        if item.quantity > item.product.stock:
            return jsonify({"error": f"Insufficient stock for {item.product.name}"}), 400
        total += item.product.price * item.quantity

    order = Order(user_id=user_id, address_id=address_id, total=total, payment_method=payment_method, status="pending")
    db.session.add(order)
    db.session.flush()

    for cart_item in cart_items:
        cart_item.product.stock = max(cart_item.product.stock - cart_item.quantity, 0)
        cart_item.product.in_stock = cart_item.product.stock > 0
        order_item = OrderItem(
            order_id=order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            size=cart_item.size,
            price=cart_item.product.price,
        )
        db.session.add(order_item)

    CartItem.query.filter_by(user_id=user_id).delete()

    db.session.commit()
    return jsonify(order.to_dict()), 201


@app.get("/api/orders")
@jwt_required()
def get_orders():
    user_id = int(get_jwt_identity())
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify([order.to_dict() for order in orders]), 200


@app.get("/api/orders/<int:order_id>")
@jwt_required()
def get_order(order_id):
    user_id = int(get_jwt_identity())
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(order.to_dict()), 200


# ═══════════════════════════════════════════════════════════════════════════
# ADDRESS ROUTES (JWT Protected)
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/addresses")
@jwt_required()
def get_addresses():
    user_id = int(get_jwt_identity())
    addresses = Address.query.filter_by(user_id=user_id).all()
    return jsonify([addr.to_dict() for addr in addresses]), 200


@app.post("/api/addresses/add")
@jwt_required()
def add_address():
    user_id = int(get_jwt_identity())
    data = _json_body()
    required_fields = ["full_name", "phone", "line1", "city", "state", "pincode"]
    if any(not str(data.get(field, "")).strip() for field in required_fields):
        return jsonify({"error": "Missing required address fields"}), 400

    address = Address(
        user_id=user_id,
        full_name=str(data.get("full_name")).strip(),
        phone=str(data.get("phone")).strip(),
        line1=str(data.get("line1")).strip(),
        line2=(data.get("line2") or "").strip() or None,
        city=str(data.get("city")).strip(),
        state=str(data.get("state")).strip(),
        pincode=str(data.get("pincode")).strip(),
        is_default=data.get("is_default", False),
    )
    db.session.add(address)
    db.session.commit()
    return jsonify(address.to_dict()), 201


@app.put("/api/addresses/<int:address_id>")
@jwt_required()
def update_address(address_id):
    user_id = int(get_jwt_identity())
    address = Address.query.filter_by(id=address_id, user_id=user_id).first()
    if not address:
        return jsonify({"error": "Address not found"}), 404

    data = _json_body()
    address.full_name = str(data.get("full_name", address.full_name)).strip()
    address.phone = str(data.get("phone", address.phone)).strip()
    address.line1 = str(data.get("line1", address.line1)).strip()
    address.line2 = (data.get("line2", address.line2) or "").strip() or None
    address.city = str(data.get("city", address.city)).strip()
    address.state = str(data.get("state", address.state)).strip()
    address.pincode = str(data.get("pincode", address.pincode)).strip()
    address.is_default = data.get("is_default", address.is_default)

    db.session.commit()
    return jsonify(address.to_dict()), 200


@app.delete("/api/addresses/<int:address_id>")
@jwt_required()
def delete_address(address_id):
    user_id = int(get_jwt_identity())
    address = Address.query.filter_by(id=address_id, user_id=user_id).first()
    if not address:
        return jsonify({"error": "Address not found"}), 404

    db.session.delete(address)
    db.session.commit()
    return jsonify({"message": "Address deleted"}), 200


# ═══════════════════════════════════════════════════════════════════════════
# ADMIN ROUTES (JWT + Admin)
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/api/admin/products")
@jwt_required()
def admin_list_products():
    current_user = _get_current_user()
    if not _is_admin(current_user):
        return jsonify({"error": "Admin access required"}), 403

    page = max(request.args.get("page", 1, type=int) or 1, 1)
    per_page = min(max(request.args.get("per_page", 20, type=int) or 20, 1), 100)
    paginated = Product.query.order_by(Product.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify(
        {
            "products": [product.to_dict() for product in paginated.items],
            "meta": {"page": page, "per_page": per_page, "total": paginated.total, "pages": paginated.pages},
        }
    ), 200


@app.post("/api/admin/products")
@jwt_required()
def admin_create_product():
    current_user = _get_current_user()
    if not _is_admin(current_user):
        return jsonify({"error": "Admin access required"}), 403

    data = _json_body()
    required = ["name", "description", "price", "category", "image_url"]
    if any(not str(data.get(field, "")).strip() for field in required):
        return jsonify({"error": "Missing required product fields"}), 400

    price = float(data["price"])
    stock = max(_parse_int(data.get("stock"), 0) or 0, 0)
    product = Product(
        name=str(data["name"]).strip(),
        description=str(data["description"]).strip(),
        category=str(data["category"]).strip(),
        subcategory=(data.get("subcategory") or "").strip() or None,
        price=price,
        original_price=float(data.get("original_price", price)),
        discount_percent=max(_parse_int(data.get("discount_percent"), 0) or 0, 0),
        image_url=str(data["image_url"]).strip(),
        image_url_hover=(data.get("image_url_hover") or "").strip() or None,
        badge=(data.get("badge") or "").strip() or None,
        sizes=",".join(data.get("sizes", [])) if isinstance(data.get("sizes"), list) else (data.get("sizes") or None),
        colors=",".join(data.get("colors", [])) if isinstance(data.get("colors"), list) else (data.get("colors") or None),
        stock=stock,
        in_stock=stock > 0,
        rating=float(data.get("rating", 4.0)),
        reviews=max(_parse_int(data.get("reviews"), 0) or 0, 0),
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201


@app.put("/api/admin/products/<int:product_id>")
@jwt_required()
def admin_update_product(product_id):
    current_user = _get_current_user()
    if not _is_admin(current_user):
        return jsonify({"error": "Admin access required"}), 403

    product = Product.query.get_or_404(product_id)
    data = _json_body()

    for field in ["name", "description", "category", "subcategory", "image_url", "image_url_hover", "badge"]:
        if field in data:
            value = data[field]
            setattr(product, field, (str(value).strip() or None) if value is not None else None)
    if "price" in data:
        product.price = float(data["price"])
    if "original_price" in data:
        product.original_price = float(data["original_price"])
    if "discount_percent" in data:
        product.discount_percent = max(_parse_int(data["discount_percent"], 0) or 0, 0)
    if "sizes" in data:
        product.sizes = ",".join(data["sizes"]) if isinstance(data["sizes"], list) else data["sizes"]
    if "colors" in data:
        product.colors = ",".join(data["colors"]) if isinstance(data["colors"], list) else data["colors"]
    if "stock" in data:
        product.stock = max(_parse_int(data["stock"], 0) or 0, 0)
        product.in_stock = product.stock > 0
    if "in_stock" in data:
        product.in_stock = bool(data["in_stock"])
    if "rating" in data:
        product.rating = float(data["rating"])
    if "reviews" in data:
        product.reviews = max(_parse_int(data["reviews"], 0) or 0, 0)

    db.session.commit()
    return jsonify(product.to_dict()), 200


@app.delete("/api/admin/products/<int:product_id>")
@jwt_required()
def admin_delete_product(product_id):
    current_user = _get_current_user()
    if not _is_admin(current_user):
        return jsonify({"error": "Admin access required"}), 403

    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"}), 200


@app.get("/api/admin/orders")
@jwt_required()
def admin_list_orders():
    current_user = _get_current_user()
    if not _is_admin(current_user):
        return jsonify({"error": "Admin access required"}), 403

    page = max(request.args.get("page", 1, type=int) or 1, 1)
    per_page = min(max(request.args.get("per_page", 20, type=int) or 20, 1), 100)
    status = (request.args.get("status") or "").strip().lower()

    query = Order.query
    if status:
        query = query.filter(Order.status == status)
    paginated = query.order_by(Order.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify(
        {
            "orders": [order.to_dict() for order in paginated.items],
            "meta": {"page": page, "per_page": per_page, "total": paginated.total, "pages": paginated.pages},
        }
    ), 200


@app.get("/api/admin/orders/<int:order_id>")
@jwt_required()
def admin_get_order(order_id):
    current_user = _get_current_user()
    if not _is_admin(current_user):
        return jsonify({"error": "Admin access required"}), 403

    order = Order.query.get_or_404(order_id)
    return jsonify(order.to_dict()), 200


@app.put("/api/admin/orders/<int:order_id>")
@jwt_required()
def admin_update_order(order_id):
    current_user = _get_current_user()
    if not _is_admin(current_user):
        return jsonify({"error": "Admin access required"}), 403

    order = Order.query.get_or_404(order_id)
    data = _json_body()
    new_status = (data.get("status") or "").strip().lower()
    valid_statuses = {"pending", "confirmed", "shipped", "delivered", "cancelled"}
    if new_status not in valid_statuses:
        return jsonify({"error": "Invalid status"}), 400
    order.status = new_status
    db.session.commit()
    return jsonify(order.to_dict()), 200


@app.get("/api/admin/users")
@jwt_required()
def admin_list_users():
    current_user = _get_current_user()
    if not _is_admin(current_user):
        return jsonify({"error": "Admin access required"}), 403

    page = max(request.args.get("page", 1, type=int) or 1, 1)
    per_page = min(max(request.args.get("per_page", 20, type=int) or 20, 1), 100)
    paginated = User.query.order_by(User.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify(
        {
            "users": [user.to_dict() for user in paginated.items],
            "meta": {"page": page, "per_page": per_page, "total": paginated.total, "pages": paginated.pages},
        }
    ), 200


@app.get("/api/admin/users/<int:user_id>")
@jwt_required()
def admin_get_user(user_id):
    current_user = _get_current_user()
    if not _is_admin(current_user):
        return jsonify({"error": "Admin access required"}), 403

    user = User.query.get_or_404(user_id)
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    total_spent = float(sum(order.total for order in orders))
    return jsonify({"user": user.to_dict(), "orders_count": len(orders), "total_spent": total_spent, "orders": [o.to_dict() for o in orders]}), 200


@app.put("/api/admin/users/<int:user_id>")
@jwt_required()
def admin_update_user(user_id):
    current_user = _get_current_user()
    if not _is_admin(current_user):
        return jsonify({"error": "Admin access required"}), 403

    user = User.query.get_or_404(user_id)
    data = _json_body()
    role = (data.get("role") or "").strip().lower()
    if role:
        if role not in {"user", "admin"}:
            return jsonify({"error": "Invalid role"}), 400
        user.role = role
    if "is_active" in data:
        user.is_active = bool(data["is_active"])
    db.session.commit()
    return jsonify(user.to_dict()), 200


@app.get("/api/admin/dashboard/stats")
@jwt_required()
def admin_dashboard_stats():
    current_user = _get_current_user()
    if not _is_admin(current_user):
        return jsonify({"error": "Admin access required"}), 403

    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    week_start = today_start - timedelta(days=today_start.weekday())
    month_start = datetime(now.year, now.month, 1)

    today_revenue = (
        db.session.query(func.sum(Order.total))
        .filter(Order.created_at >= today_start)
        .scalar()
        or 0
    )
    week_revenue = (
        db.session.query(func.sum(Order.total))
        .filter(Order.created_at >= week_start)
        .scalar()
        or 0
    )
    month_revenue = (
        db.session.query(func.sum(Order.total))
        .filter(Order.created_at >= month_start)
        .scalar()
        or 0
    )
    total_revenue = db.session.query(func.sum(Order.total)).scalar() or 0

    order_stats = {
        "pending": Order.query.filter_by(status="pending").count(),
        "confirmed": Order.query.filter_by(status="confirmed").count(),
        "shipped": Order.query.filter_by(status="shipped").count(),
        "delivered": Order.query.filter_by(status="delivered").count(),
        "cancelled": Order.query.filter_by(status="cancelled").count(),
    }

    top_products_query = (
        db.session.query(
            Product.id,
            Product.name,
            func.sum(OrderItem.quantity).label("sold"),
        )
        .join(OrderItem, OrderItem.product_id == Product.id)
        .group_by(Product.id, Product.name)
        .order_by(desc("sold"))
        .limit(5)
        .all()
    )

    return jsonify(
        {
            "revenue": {
                "today": float(today_revenue),
                "this_week": float(week_revenue),
                "this_month": float(month_revenue),
                "total": float(total_revenue),
            },
            "orders": order_stats,
            "users": {
                "total": User.query.count(),
                "new_this_month": User.query.filter(User.created_at >= month_start).count(),
            },
            "top_products": [
                {"id": row[0], "name": row[1], "sold": int(row[2] or 0)} for row in top_products_query
            ],
        }
    ), 200


@app.get("/api/admin/addresses")
@jwt_required()
def admin_list_addresses():
    current_user = _get_current_user()
    if not _is_admin(current_user):
        return jsonify({"error": "Admin access required"}), 403

    addresses = Address.query.order_by(Address.id.desc()).all()
    return jsonify([address.to_dict() for address in addresses]), 200


@app.delete("/api/admin/addresses/<int:address_id>")
@jwt_required()
def admin_delete_address(address_id):
    current_user = _get_current_user()
    if not _is_admin(current_user):
        return jsonify({"error": "Admin access required"}), 403

    address = Address.query.get_or_404(address_id)
    db.session.delete(address)
    db.session.commit()
    return jsonify({"message": "Address deleted"}), 200


with app.app_context():
    db.create_all()
    _ensure_user_columns()
    print("✅ Database tables created")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
