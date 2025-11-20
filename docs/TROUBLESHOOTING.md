# Troubleshooting Guide

## 504 Gateway Timeout Error

### สาเหตุ
- Backend/Frontend services ไม่ตอบสนองภายใน timeout
- Services ทำงานช้าเกินไป
- Services ยังไม่พร้อม (กำลัง build/start)

### วิธีแก้ไข

#### 1. ตรวจสอบ Services
```powershell
# ตรวจสอบว่า services ทำงานอยู่หรือไม่
netstat -ano | findstr ":8080 :3000 :3001"

# ทดสอบ services โดยตรง
Invoke-WebRequest -Uri "http://127.0.0.1:3001/employee/login" -TimeoutSec 10
```

#### 2. เพิ่ม Timeout ใน Caddyfile
Timeout ได้ถูกเพิ่มเป็น 60s แล้วใน Caddyfile

#### 3. Restart Caddy
```powershell
# หยุด Caddy
Stop-Process -Name caddy -Force

# เริ่มใหม่
.\caddy.exe run --config .\Caddyfile
```

#### 4. ตรวจสอบ Frontend Services
```powershell
# Admin Frontend
cd frontend\admin
npm run dev

# Employee Frontend
cd frontend\employee
npm run dev
```

---

## Services ไม่ตอบสนอง

### ตรวจสอบ:
1. Services ทำงานอยู่หรือไม่
2. Services พร้อมหรือยัง (อาจกำลัง build)
3. Ports ถูกใช้งานหรือไม่

### แก้ไข:
- Restart services
- ตรวจสอบ logs
- เพิ่ม timeout ใน Caddyfile

---

## Cloudflare Tunnel ไม่เชื่อมต่อ

### สาเหตุ:
- Caddy ไม่ทำงาน
- Origin service ไม่ตอบสนอง

### วิธีแก้:
1. ตรวจสอบ Caddy: `netstat -ano | findstr ":8088"`
2. ตรวจสอบ services: `netstat -ano | findstr ":8080 :3000 :3001"`
3. Restart Caddy และ services

