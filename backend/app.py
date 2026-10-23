
import os
from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient(
    os.getenv(
        "MONGO_URI",
        "mongodb://localhost:27017/food_ordering"
    )
)
db = client.get_default_database()

MENU = [
    {"id": "burger", "name": "Burger", "price": 8.99},
    {"id": "pizza", "name": "Pizza", "price": 12.50},
    {"id": "fries", "name": "French Fries", "price": 3.50},
]

@app.get("/api/health")
def health():
    try:
        client.admin.command("ping")
        return jsonify(status="ok", database="connected")
    except Exception:
        return jsonify(status="error"), 503

@app.get("/api/menu")
def menu():
    return jsonify(MENU)

@app.post("/api/orders")
def create_order():
    data = request.get_json(silent=True) or {}
    name = str(data.get("customer_name", "")).strip()
    items = data.get("items", [])

    if not name or not isinstance(items, list) or not items:
        return jsonify(error="Name and items are required"), 400

    available = {item["id"]: item for item in MENU}
    order_items = []

    for item in items:
        if not isinstance(item, dict):
            return jsonify(error="Invalid item"), 400

        product = available.get(item.get("item_id"))

        try:
            quantity = int(item.get("quantity", 0))
        except (TypeError, ValueError):
            quantity = 0

        if not product or not 1 <= quantity <= 99:
            return jsonify(error="Invalid product or quantity"), 400

        order_items.append({
            "name": product["name"],
            "price": product["price"],
            "quantity": quantity
        })

    total = round(sum(
        item["price"] * item["quantity"]
        for item in order_items
    ), 2)

    result = db.orders.insert_one({
        "customer_name": name,
        "items": order_items,
        "total": total,
        "status": "received"
    })

    return jsonify(
        order_id=str(result.inserted_id),
        total=total,
        status="received"
    ), 201

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", "5000"))
    )
