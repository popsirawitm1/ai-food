import tensorflow as tf
from tensorflow import keras
from pathlib import Path
import json

SRC = "thai_food_model.keras"
OUT = Path("exported")
OUT.mkdir(exist_ok=True)

model = keras.models.load_model(SRC)
print("Input shape:", model.input_shape)   # (None, 128, 128, 3)
print("Output shape:", model.output_shape) # (None, 10)

# 1) เซฟ H5 (ได้เตือนว่า legacy แต่ใช้แปลง TF.js ได้)
model.save(OUT / "thai_food.h5")

# 2) เซฟเป็น SavedModel แบบ Keras 3 → ใช้ export() แทน save_format="tf"
model.export(OUT / "savedmodel")  # <-- แก้ตรงนี้

# TODO: ปรับ labels ให้ตรงลำดับคลาสของคุณ
labels = [
  "คลาส1","คลาส2","คลาส3","คลาส4","คลาส5",
  "คลาส6","คลาส7","คลาส8","คลาส9","คลาส10"
]
with open(OUT / "labels.json", "w", encoding="utf-8") as f:
    json.dump(labels, f, ensure_ascii=False, indent=2)

print("✅ Export done ->", OUT.resolve())
