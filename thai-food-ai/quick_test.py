import sys
print("Testing TensorFlow and Keras import...")

try:
    import tensorflow as tf
    print(f"✅ TensorFlow version: {tf.__version__}")

    from tensorflow import keras
    print(f"✅ Keras version: {keras.__version__}")

    import os
    BASE_DIR = r"D:\work-psu\AIProject\ai-food\thai-food-ai"
    model_path = os.path.join(BASE_DIR, "thai_food_model.keras")

    print(f"\nAttempting to load model from: {model_path}")
    print(f"File exists: {os.path.exists(model_path)}")

    if os.path.exists(model_path):
        model = keras.models.load_model(model_path)
        print(f"\n✅ SUCCESS! Model loaded")
        print(f"Input shape: {model.input_shape}")
        print(f"Output shape: {model.output_shape}")
    else:
        print("❌ Model file not found!")

except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()

print("\nTest complete!")

