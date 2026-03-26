from math import ceil

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required

from models import Product, db


products_bp = Blueprint("products", __name__, url_prefix="/api/products")


def _is_admin():
    claims = get_jwt()
    return claims.get("role") == "admin"


@products_bp.get("")
def list_products():
    page = max(int(request.args.get("page", 1)), 1)
    per_page = max(min(int(request.args.get("per_page", 8)), 50), 1)
    search = (request.args.get("search") or "").strip()
    category = (request.args.get("category") or "").strip()

    query = Product.query

    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    if category:
        query = query.filter(Product.category == category)

    total = query.count()
    products = query.order_by(Product.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    categories = [c[0] for c in db.session.query(Product.category).distinct().all()]

    return jsonify(
        {
            "data": [product.to_dict() for product in products],
            "meta": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "total_pages": ceil(total / per_page) if total else 1,
            },
            "categories": categories,
        }
    ), 200


@products_bp.get("/<int:product_id>")
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict()), 200


@products_bp.post("")
@jwt_required()
def create_product():
    if not _is_admin():
        return jsonify({"message": "Admin access required"}), 403

    data = request.get_json(silent=True) or {}
    required = ["name", "description", "price", "stock", "category", "image_url"]
    if any(field not in data for field in required):
        return jsonify({"message": "Missing required product fields"}), 400

    product = Product(
        name=data["name"],
        description=data["description"],
        price=float(data["price"]),
        stock=int(data["stock"]),
        category=data["category"],
        image_url=data["image_url"],
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201


@products_bp.put("/<int:product_id>")
@jwt_required()
def update_product(product_id):
    if not _is_admin():
        return jsonify({"message": "Admin access required"}), 403

    product = Product.query.get_or_404(product_id)
    data = request.get_json(silent=True) or {}

    for field in ["name", "description", "category", "image_url"]:
        if field in data:
            setattr(product, field, data[field])

    if "price" in data:
        product.price = float(data["price"])
    if "stock" in data:
        product.stock = int(data["stock"])

    db.session.commit()
    return jsonify(product.to_dict()), 200


@products_bp.delete("/<int:product_id>")
@jwt_required()
def delete_product(product_id):
    if not _is_admin():
        return jsonify({"message": "Admin access required"}), 403

    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"}), 200
