from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow import keras
import numpy as np
import cv2
import io
import json
import os

app = Flask(__name__)
CORS(app)

# กำหนด path ของโฟลเดอร์ปัจจุบัน
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ฟังก์ชันสำหรับโหลด model แบบ compatible
def load_model_safe(model_path):
    """โหลด model โดยรองรับทั้ง Keras 2.x และ 3.x"""
    try:
        # พยายามโหลดแบบปกติก่อน
        return keras.models.load_model(model_path)
    except (TypeError, ValueError) as e:
        if 'batch_shape' in str(e) or 'Unrecognized keyword arguments' in str(e):
            print("⚠️  Detected legacy model format, trying compatibility mode...")
            try:
                # ลองใช้ tf.keras แทน
                return tf.keras.models.load_model(model_path, compile=False)
            except Exception as e2:
                print(f"❌ Failed to load with tf.keras: {e2}")
                # ลองโหลดแบบ SavedModel format
                try:
                    savedmodel_path = os.path.join(BASE_DIR, "exported", "savedmodel")
                    if os.path.exists(savedmodel_path):
                        print(f"Trying SavedModel format from: {savedmodel_path}")
                        return tf.keras.models.load_model(savedmodel_path)
                except Exception as e3:
                    print(f"❌ Failed to load SavedModel: {e3}")
                raise e
        else:
            raise e

# โหลดโมเดล
model_path = os.path.join(BASE_DIR, "thai_food_model.keras")
model = load_model_safe(model_path)
print("✅ Model loaded successfully!")
print(f"Input shape: {model.input_shape}")
print(f"Output shape: {model.output_shape}")

# โหลด labels
labels_path = os.path.join(BASE_DIR, "exported", "labels.json")
with open(labels_path, "r", encoding="utf-8") as f:
    labels = json.load(f)

# กำหนด threshold สำหรับการตรวจสอบว่ารูปอยู่ในฐานความรู้หรือไม่
CONFIDENCE_THRESHOLD = 0.7  # ถ้าความมั่นใจต่ำกว่า 70% ถือว่าไม่อยู่ในฐานความรู้

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # รับรูปภาพจาก request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        file = request.files['image']

        # อ่านรูปภาพด้วย OpenCV (ตามโค้ดต้นแบบ)
        image_bytes = file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        # อ่านเป็น BGR โดยตรง (ไม่แปลงเป็น RGB) เหมือนโค้ดต้นแบบ
        X = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if X is None:
            return jsonify({'error': 'Invalid image file'}), 400

        # ประมวลผลตามโค้ดต้นแบบ: resize และ reshape แล้วหารด้วย 255
        X = np.array(cv2.resize(X, (128, 128))).reshape(128, 128, 3) / 255

        # ทำนายผล (ใช้ np.array([X]) เหมือนโค้ดต้นแบบ)
        predictions = model.predict(np.array([X]))
        print("Predictions:", predictions)

        # ใช้ argmax กับ axis=1 เหมือนโค้ดต้นแบบ
        predicted_class_int = np.argmax(predictions, axis=1)[0]
        predicted_probability = np.max(predictions, axis=1)[0]

        print(f"Predicted class int: {predicted_class_int}")
        print(f"Predicted probability: {predicted_probability:.4f}")

        # สร้าง result ทั้งหมด
        results = []
        for i, prob in enumerate(predictions[0]):
            results.append({
                'class': labels[i],
                'confidence': float(prob)
            })

        # เรียงตาม confidence จากมากไปน้อย
        results.sort(key=lambda x: x['confidence'], reverse=True)

        # ตรวจสอบว่า confidence ต่ำเกินไปหรือไม่
        if predicted_probability < CONFIDENCE_THRESHOLD:
            return jsonify({
                'prediction': None,
                'confidence': float(predicted_probability),
                'message': 'ไม่พบอาหารนี้ในฐานความรู้',
                'not_in_database': True,
                'all_predictions': results[:5]
            })

        return jsonify({
            'prediction': labels[predicted_class_int],
            'confidence': float(predicted_probability),
            'not_in_database': False,
            'all_predictions': results[:5]
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': True})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
