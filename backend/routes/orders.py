from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import Cart, Order, OrderItem, Product, db


orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")


def _current_user_id() -> int:
    return int(get_jwt_identity())


@orders_bp.post("/checkout")
@jwt_required()
def checkout():
    user_id = _current_user_id()
    cart_items = Cart.query.filter_by(user_id=user_id).all()

    if not cart_items:
        return jsonify({"message": "Cart is empty"}), 400

    total = 0.0
    for item in cart_items:
        product = Product.query.get(item.product_id)
        if not product:
            return jsonify({"message": f"Product {item.product_id} not found"}), 404
        if item.quantity > product.stock:
            return jsonify({"message": f"Insufficient stock for {product.name}"}), 400
        total += item.quantity * product.price

    order = Order(user_id=user_id, total_price=total, status="placed")
    db.session.add(order)
    db.session.flush()

    for item in cart_items:
        product = Product.query.get(item.product_id)
        product.stock -= item.quantity
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price,
        )
        db.session.add(order_item)

    Cart.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify(order.to_dict()), 201


@orders_bp.get("")
@jwt_required()
def order_history():
    user_id = _current_user_id()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify([order.to_dict() for order in orders]), 200


@orders_bp.get("/<int:order_id>")
@jwt_required()
def get_order(order_id):
    user_id = _current_user_id()
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({"message": "Order not found"}), 404
    return jsonify(order.to_dict()), 200
