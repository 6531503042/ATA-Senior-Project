# สถานะ Cloudflare Tunnel

## ✅ Cloudflare Tunnel ทำงานแล้ว!

**URL ใหม่:** 
### https://guided-conversation-market-collection.trycloudflare.com

## สถานะ Services

### ✅ ทำงานปกติ
- **Caddy Reverse Proxy**: Port 8088
- **Backend (Spring Boot)**: Port 8080
- **Employee Frontend**: Port 3001
- **Cloudflare Tunnel**: เชื่อมต่อกับ Caddy แล้ว

### ⚠️ ยังไม่ทำงาน
- **Admin Frontend**: Port 3000 (ยังไม่เริ่มทำงาน)

## การใช้งาน

### ✅ ใช้งานได้
- **Employee Portal**: https://guided-conversation-market-collection.trycloudflare.com/employee
- **API**: https://guided-conversation-market-collection.trycloudflare.com/api

### ❌ ยังใช้งานไม่ได้
- **Admin Portal**: https://guided-conversation-market-collection.trycloudflare.com/admin
  - จะได้ 502 Bad Gateway เพราะ Admin Frontend ยังไม่ทำงาน

## วิธีแก้ไข Admin Frontend

1. **ตรวจสอบหน้าต่าง "Admin Frontend"** ที่เปิดไว้
   - ดูว่ามี error อะไร
   - ถ้ามี error ให้แก้ไขตาม error message

2. **หรือรันคำสั่งนี้ใน cmd ใหม่:**
```cmd
cd frontend\admin
set NODE_OPTIONS=--max-old-space-size=2048
npm run build
npm run start
```

3. **หรือใช้สคริปต์:**
```cmd
scripts\restart-admin.bat
```

## หมายเหตุ

- **URL นี้จะเปลี่ยนทุกครั้งที่รีสตาร์ท tunnel** (quick tunnel)
- ถ้าต้องการ URL ถาวร ต้องใช้ Cloudflare account + Named Tunnel
- Employee portal และ API ใช้งานได้ปกติแล้ว

## ตรวจสอบสถานะ

```cmd
# ตรวจสอบ services
netstat -ano | findstr ":3000 :3001 :8080 :8088"

# ทดสอบ Employee (ควรได้ 200 OK)
curl -I http://127.0.0.1:8088/employee/login

# ทดสอบ Admin (ตอนนี้จะได้ 502)
curl -I http://127.0.0.1:8088/admin/login
```

