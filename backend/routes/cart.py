from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import Cart, Product, db


cart_bp = Blueprint("cart", __name__, url_prefix="/api/cart")


def _current_user_id() -> int:
    return int(get_jwt_identity())


@cart_bp.get("")
@jwt_required()
def get_cart():
    user_id = _current_user_id()
    items = Cart.query.filter_by(user_id=user_id).all()
    return jsonify([item.to_dict() for item in items]), 200


@cart_bp.post("/add")
@jwt_required()
def add_to_cart():
    user_id = _current_user_id()
    data = request.get_json(silent=True) or {}
    product_id = data.get("product_id")
    quantity = int(data.get("quantity", 1))

    if not product_id or quantity < 1:
        return jsonify({"message": "Invalid product_id or quantity"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
    if item:
        item.quantity += quantity
    else:
        item = Cart(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(item)

    if item.quantity > product.stock:
        return jsonify({"message": "Quantity exceeds stock"}), 400

    db.session.commit()
    return jsonify(item.to_dict()), 201


@cart_bp.put("/update/<int:cart_id>")
@jwt_required()
def update_cart(cart_id):
    user_id = _current_user_id()
    item = Cart.query.filter_by(id=cart_id, user_id=user_id).first()
    if not item:
        return jsonify({"message": "Cart item not found"}), 404

    data = request.get_json(silent=True) or {}
    quantity = int(data.get("quantity", 1))
    if quantity < 1:
        return jsonify({"message": "Quantity must be at least 1"}), 400

    if quantity > item.product.stock:
        return jsonify({"message": "Quantity exceeds stock"}), 400

    item.quantity = quantity
    db.session.commit()
    return jsonify(item.to_dict()), 200


@cart_bp.delete("/remove/<int:cart_id>")
@jwt_required()
def remove_cart_item(cart_id):
    user_id = _current_user_id()
    item = Cart.query.filter_by(id=cart_id, user_id=user_id).first()
    if not item:
        return jsonify({"message": "Cart item not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item removed"}), 200


@cart_bp.delete("/clear")
@jwt_required()
def clear_cart():
    user_id = _current_user_id()
    Cart.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({"message": "Cart cleared"}), 200
