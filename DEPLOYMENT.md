# Thai Food AI - Deployment Guide

## 📦 การ Deploy แบบแยกส่วน (แนะนำ)

### 1. Deploy Frontend (Next.js) → Vercel หรือ Firebase Hosting

#### Option A: Deploy ด้วย Vercel (ง่ายที่สุด) ⭐

1. ติดตั้ง Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd D:\work-psu\AIProject\ai-food
vercel
```

3. ตอบคำถาม:
   - Setup and deploy? Yes
   - Which scope? เลือก account ของคุณ
   - Link to existing project? No
   - Project name? ai-food
   - Directory? ./
   - Override settings? No

4. เสร็จแล้ว! คุณจะได้ URL เช่น `https://ai-food-xxxxx.vercel.app`

#### Option B: Deploy ด้วย Firebase Hosting

1. ติดตั้ง Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login และ init:
```bash
firebase login
firebase init hosting
```

3. ตั้งค่า:
   - Public directory: `out`
   - Single-page app: Yes
   - GitHub automatic builds: No

4. Build และ Deploy:
```bash
npm run build
firebase deploy
```

---

### 2. Deploy Backend (Python API) → Railway (ฟรี, แนะนำ)

#### ขั้นตอน Deploy Python API บน Railway:

1. สมัครที่ https://railway.app (ใช้ GitHub account)

2. คลิก "New Project" → "Deploy from GitHub repo"

3. เชื่อม GitHub repo หรือใช้ Railway CLI:
```bash
npm i -g @railway/cli
railway login
cd thai-food-ai
railway init
railway up
```

4. เพิ่มไฟล์ที่จำเป็น (ผมจะสร้างให้ด้านล่าง):
   - `Procfile`
   - `runtime.txt`
   - `.railwayignore`

5. Set Environment Variables ใน Railway Dashboard:
   - `PORT=5000`

6. Deploy สำเร็จ! คุณจะได้ URL เช่น `https://thai-food-api.railway.app`

---

### 3. เชื่อมต่อ Frontend กับ Backend

แก้ไขไฟล์ `src/app/page.tsx` เปลี่ยน URL จาก:
```typescript
const apiResponse = await fetch('http://localhost:5000/predict', {
```

เป็น:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const apiResponse = await fetch(`${apiUrl}/predict`, {
```

แล้วสร้างไฟล์ `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-api-url.railway.app
```

---

## 🚀 ทางเลือกอื่นๆ สำหรับ Backend:

### Option 2: Google Cloud Run (ฟรี 2 ล้าน requests/เดือน)
- รองรับ Docker
- Auto-scaling
- ต้องใช้ credit card

### Option 3: Render (ฟรี)
- ใช้งานง่าย
- รองรับ Python
- มี free tier

### Option 4: Hugging Face Spaces (ฟรี)
- เหมาะสำหรับ ML models
- รองรับ Gradio/Streamlit

---

## 📋 Checklist ก่อน Deploy:

- [ ] ติดตั้ง dependencies ครบ
- [ ] ทดสอบ API ใน local ได้
- [ ] แก้ CORS ให้รองรับ domain จริง
- [ ] เปลี่ยน `debug=False` ใน production
- [ ] เพิ่ม error handling
- [ ] ตั้งค่า environment variables
- [ ] อัปโหลด model file (thai_food_model.keras)

---

## 💡 Tips:

1. **Model ใหญ่เกินไป:** 
   - ใช้ Git LFS สำหรับไฟล์ใหญ่
   - หรือเก็บไว้ Google Cloud Storage แล้วดาวน์โหลดตอน startup

2. **Cold Start:**
   - Backend อาจช้าในครั้งแรก (15-30 วินาที)
   - ใช้ keep-alive service หรือ paid plan

3. **Security:**
   - เพิ่ม rate limiting
   - ตรวจสอบ file size
   - ใช้ HTTPS

---

## 📞 หากต้องการความช่วยเหลือ:

1. Railway: https://docs.railway.app
2. Vercel: https://vercel.com/docs
3. Google Cloud Run: https://cloud.google.com/run/docs

