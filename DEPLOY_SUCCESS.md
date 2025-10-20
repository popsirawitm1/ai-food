# 🎉 สำเร็จแล้ว! Frontend Deploy บน Netlify

## ✅ เว็บของคุณ:
### 🌐 https://th-ai-food.netlify.app

---

## ⚠️ ขั้นตอนสุดท้าย: Deploy Backend (Python API)

เว็บของคุณยังไม่สามารถทำนายได้ เพราะ Backend ยังทำงานบน localhost เท่านั้น
ให้ทำตามขั้นตอนนี้เพื่อ Deploy Backend บน Railway:

### **วิธีที่ 1: Deploy ผ่าน Railway Dashboard (แนะนำ - ง่ายที่สุด)**

1. **Push โค้ดขึ้น GitHub:**
   ```bash
   # สร้าง GitHub repository ใหม่ที่ https://github.com/new
   # ตั้งชื่อ: ai-food
   
   # จากนั้นรันคำสั่งนี้:
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/ai-food.git
   git push -u origin main
   ```

2. **Deploy บน Railway:**
   - ไปที่ https://railway.app
   - คลิก **"New Project"**
   - เลือก **"Deploy from GitHub repo"**
   - เลือก repository **"ai-food"**
   - เลือกโฟลเดอร์ **"thai-food-ai"** (กด Configure > Root Directory > thai-food-ai)
   - คลิก **"Deploy"**
   - รอประมาณ 5-10 นาที

3. **เปิด Public URL:**
   - ในหน้า Railway project คลิก **Settings**
   - เลื่อนลงมาที่ **Networking**
   - คลิก **"Generate Domain"**
   - คุณจะได้ URL เช่น `https://thai-food-api.up.railway.app`

4. **เชื่อมต่อ Frontend กับ Backend:**
   
   สร้างไฟล์ `.env` ใน Netlify:
   - ไปที่ https://app.netlify.com/sites/th-ai-food/configuration/env
   - คลิก **"Add a variable"**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-api-url.up.railway.app` (URL ที่ได้จาก Railway)
   - คลิก **"Save"**
   - คลิก **"Trigger deploy"** เพื่อ rebuild เว็บ

---

### **วิธีที่ 2: Deploy ด้วย Render (ทางเลือก)**

1. ไปที่ https://render.com
2. Sign up ด้วย GitHub
3. คลิก **"New"** → **"Web Service"**
4. เลือก repository **"ai-food"**
5. ตั้งค่า:
   - **Name:** thai-food-api
   - **Root Directory:** thai-food-ai
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn api:app`
6. คลิก **"Create Web Service"**
7. รอประมาณ 10-15 นาที
8. ได้ URL เช่น `https://thai-food-api.onrender.com`

---

### **วิธีที่ 3: Deploy บน Vercel (Python Serverless)**

**หมายเหตุ:** Vercel มีข้อจำกัดสำหรับ Python (max 50MB, 10s timeout)

1. เข้าไปยังโฟลเดอร์ Backend:
   ```bash
   cd thai-food-ai
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. ตอบคำถาม:
   - Setup and deploy? Yes
   - Project name? thai-food-api
   - Deploy? Yes

---

## 📋 Checklist

- [x] Frontend deployed บน Netlify
- [ ] Backend deployed บน Railway/Render
- [ ] เชื่อมต่อ Frontend กับ Backend (ตั้งค่า NEXT_PUBLIC_API_URL)
- [ ] ทดสอบระบบทั้งหมด

---

## 🎯 เมื่อเสร็จแล้ว

เว็บของคุณจะพร้อมใช้งานที่:
- **Frontend:** https://th-ai-food.netlify.app
- **Backend API:** https://your-api-url.up.railway.app

ทดสอบโดยอัปโหลดรูปอาหารไทยแล้วดูว่าระบบทายชื่ออาหารได้ถูกต้องหรือไม่!

---

## 💡 Tips

1. **Model File ใหญ่:** ไฟล์ `thai_food_model.keras` อาจใหญ่เกิน 100MB
   - ถ้า push ไม่ได้ ให้ใช้ Git LFS:
     ```bash
     git lfs install
     git lfs track "*.keras"
     git add .gitattributes
     git add thai-food-ai/thai_food_model.keras
     git commit -m "Add model with Git LFS"
     git push
     ```

2. **Cold Start:** Backend อาจช้าในครั้งแรก (15-30 วินาที) เป็นเรื่องปกติของ Free Tier

3. **Logs:** ดู logs ได้ที่:
   - Netlify: https://app.netlify.com/sites/th-ai-food/deploys
   - Railway: https://railway.app/project/78d5a64e-a1f5-4299-9cbc-4b35b9b1c933

---

## 🆘 ถ้ามีปัญหา

1. ตรวจสอบ logs ใน Railway/Render
2. ตรวจสอบว่า environment variable ถูกต้อง
3. ตรวจสอบว่า CORS เปิดอยู่ใน API
4. ลองเปิด API URL โดยตรงดูว่าทำงานหรือไม่ (เช่น https://your-api.up.railway.app/health)

---

Good luck! 🚀

