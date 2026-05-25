import os
import re
import tempfile
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from predict_combined import load_all_models, predict_combined
from db import init_db, add_item, get_inventory

app = Flask(__name__, static_folder="frontend", static_url_path="")
CORS(app)

init_db()
_raw_model, _meat_model = load_all_models()

RECIPES = [
    {"id": "r1", "zh": "番茄菠菜烘蛋",     "en": "Tomato Spinach Frittata",  "min": 15, "kcal": 340, "uses": ["tomato", "spinach"],         "saves": 2, "level": "簡單", "method": "平底鍋"},
    {"id": "r2", "zh": "香煎雞胸佐莎莎醬", "en": "Pan-Seared Chicken Salsa", "min": 25, "kcal": 520, "uses": ["chicken", "tomato"],         "saves": 2, "level": "簡單", "method": "平底鍋"},
    {"id": "r3", "zh": "酪梨蘋果薄荷沙拉", "en": "Avocado Apple Mint Salad", "min": 10, "kcal": 280, "uses": ["apple", "avocado"],          "saves": 2, "level": "快手", "method": "生食"},
    {"id": "r4", "zh": "菠菜優格濃湯",     "en": "Spinach Yogurt Bisque",    "min": 30, "kcal": 310, "uses": ["spinach", "yogurt", "milk"], "saves": 3, "level": "中等", "method": "燉煮"},
    {"id": "r5", "zh": "蘑菇酪梨吐司",     "en": "Mushroom Avocado Toast",   "min": 12, "kcal": 420, "uses": ["mushroom", "avocado"],       "saves": 2, "level": "快手", "method": "烤製"},
]


@app.route("/")
def index():
    return send_from_directory("frontend", "Mercado Prototype.html")


@app.route("/scan", methods=["POST"])
def scan():
    if "image" not in request.files:
        return jsonify({"error": "no image field"}), 400
    file = request.files["image"]
    ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    if not ext:
        ext = ".jpg"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
    try:
        file.save(tmp.name)
        tmp.close()
        result = predict_combined(tmp.name, _raw_model, _meat_model)
    finally:
        try:
            os.unlink(tmp.name)
        except OSError:
            pass
    return jsonify(result)


@app.route("/inventory", methods=["GET"])
def get_inv():
    rows = get_inventory()
    items = [
        {
            "id": i + 1,
            "item_name":    r[0],
            "quantity":     r[1],
            "last_added_at": r[2],
            "expiry_date":  r[3],
            "location":     r[4],
        }
        for i, r in enumerate(rows)
    ]
    return jsonify(items)


@app.route("/inventory", methods=["POST"])
def post_inv():
    data = request.get_json(force=True, silent=True) or {}
    if "item_name" not in data:
        return jsonify({"error": "item_name required"}), 400
    add_item(
        data["item_name"],
        data.get("confidence", 0.0),
        expiry_date=data.get("expiry_date") or None,
        location=data.get("location") or None,
    )
    return jsonify({"ok": True}), 201


@app.route("/scan-expiry", methods=["POST"])
def scan_expiry():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return jsonify({"error": "GEMINI_API_KEY not set"}), 500

    if "image" not in request.files:
        return jsonify({"error": "no image field"}), 400

    file = request.files["image"]
    ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    if not ext:
        ext = ".jpg"

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
    try:
        file.save(tmp.name)
        tmp.close()

        import google.generativeai as genai
        import PIL.Image

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        img = PIL.Image.open(tmp.name)
        response = model.generate_content([
            img,
            "這是一個食品包裝的照片。請找出上面標示的有效日期、賞味期限或到期日。"
            "只回傳日期，格式為 YYYY-MM-DD。如果找不到任何日期，只回傳 null。"
            "不要回傳任何其他文字。"
        ])
        text = response.text.strip()
        match = re.search(r"\d{4}-\d{2}-\d{2}", text)
        if match:
            return jsonify({"expiry_date": match.group()})
        else:
            return jsonify({"expiry_date": None})
    finally:
        try:
            os.unlink(tmp.name)
        except OSError:
            pass


@app.route("/recipes", methods=["GET"])
def get_recipes():
    ids = [i for i in request.args.get("ids", "").split(",") if i]
    if ids:
        result = [r for r in RECIPES if any(u in ids for u in r["uses"])]
        if not result:
            result = RECIPES
    else:
        result = RECIPES
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
