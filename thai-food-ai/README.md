# Thai Food AI - API Setup

## วิธีการติดตั้งและรัน

### 1. ติดตั้ง Python packages
```bash
cd thai-food-ai
pip install -r requirements.txt
```

### 2. รัน API Server
```bash
python api.py
```

API จะทำงานที่ `http://localhost:5000`

### 3. รัน Next.js Frontend (ใน terminal อื่น)
```bash
cd ..
npm run dev
```

เว็บจะเปิดที่ `http://localhost:3000`

## API Endpoints

- `GET /health` - ตรวจสอบสถานะ API
- `POST /predict` - ทำนายชื่ออาหารจากรูปภาพ
  - Input: `multipart/form-data` with `image` field
  - Output: JSON with prediction results

## Model Info

- Input shape: (128, 128, 3)
- Output: 10 classes of Thai food
- Model file: `thai_food_model.keras`
