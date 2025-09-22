import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, render_template, jsonify
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from werkzeug.exceptions import HTTPException

# -------------------
# CONFIG
# -------------------
MODEL_PATH = "./model/civic_model.keras"  # your trained inference model
IMG_SIZE = (224, 224)
CLASS_NAMES = ["garbage",  "normal road","potholes", "street light off", "street light on"]

# -------------------
# INIT APP + MODEL
# -------------------
app = Flask(__name__)
model = load_model(MODEL_PATH)

# -------------------
# IMAGE PREPROCESSING
# -------------------
def preprocess_image(image, target_size=IMG_SIZE):
    """Convert PIL image to model input format."""
    image = image.convert("RGB")               # ensure 3 channels
    image = image.resize(target_size)          # resize to 224x224
    image_array = np.array(image)              # to numpy array
    image_array = np.expand_dims(image_array, axis=0)  # add batch dim
    # image_array = preprocess_input(image_array)        # same preprocessing as training
    return image_array

# -------------------
# PREDICTION FUNCTION
# -------------------
def predict(image: Image.Image):
    processed = preprocess_image(image)
    preds = model.predict(processed)
    confidence = float(np.max(preds))
    predicted_class = int(np.argmax(preds))
    return CLASS_NAMES[predicted_class], confidence

@app.route("/predict", methods=["POST"])
def predict_route():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:
        image = Image.open(file.stream)
        result, confidence = predict(image)
        return jsonify({
            "predicted_class": result,
            "confidence": round(confidence, 4)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.errorhandler(HTTPException)
def handle_http_exc(e):
    resp = jsonify({"error": e.description, "code": e.code})
    return resp, e.code

@app.errorhandler(Exception)
def handle_exc(e):
    resp = jsonify({"error": str(e)})
    return resp, 500
# -------------------
# RUN APP
# -------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
