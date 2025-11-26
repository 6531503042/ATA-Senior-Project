# Cloudflare Tunnel: Static Domain vs Static IP

## ❓ คำถาม: ทำไมไม่ใช้ Static IP Address?

**คำตอบ:** Cloudflare Tunnel **ไม่ได้ใช้ Static IP Address** โดยตรง แต่ใช้ **Static Domain Name** แทน

---

## 🔍 ความเข้าใจผิด

### ❌ ความเข้าใจผิด
- "ฉันต้องการ static IP address"
- "ทำไม tunnel ยังใช้ generated domain?"

### ✅ ความจริง
- Cloudflare Tunnel ใช้ **Domain Name** ไม่ใช่ IP Address
- **Static Domain** = Domain ที่ไม่เปลี่ยน (เช่น `api.yourdomain.com`)
- **Quick Tunnel** = Domain ที่เปลี่ยนทุกครั้ง (เช่น `xxx.trycloudflare.com`)

---

## 📊 เปรียบเทียบ

| ประเภท | URL | เปลี่ยนหรือไม่ | เหมาะสำหรับ |
|--------|-----|----------------|-------------|
| **Quick Tunnel** | `xxx.trycloudflare.com` | ✅ เปลี่ยนทุกครั้ง | Testing เท่านั้น |
| **Named Tunnel** | `api.yourdomain.com` | ❌ ไม่เปลี่ยน | Production |

---

## 🎯 วิธีได้ Static Domain (ไม่เปลี่ยน)

### ต้องใช้ **Named Tunnel** ไม่ใช่ Quick Tunnel

**ขั้นตอน:**

1. **มี Cloudflare Account + Domain**
   - สมัคร Cloudflare: https://dash.cloudflare.com/sign-up
   - เพิ่ม domain ของคุณ

2. **Setup Named Tunnel**
   ```powershell
   # Login
   cloudflared.exe login
   
   # Create tunnel
   cloudflared.exe tunnel create ata-app
   
   # Route DNS
   cloudflared.exe tunnel route dns ata-app api.yourdomain.com
   cloudflared.exe tunnel route dns ata-app admin.yourdomain.com
   cloudflared.exe tunnel route dns ata-app employee.yourdomain.com
   ```

3. **Configure & Run**
   ```powershell
   # Copy template
   Copy-Item config\cloudflare\config.yml.template config\cloudflare\config.yml
   
   # Edit config.yml with your domain
   # Then run:
   .\scripts\cloudflare\start-named-tunnel.ps1
   ```

---

## 🔧 ปัญหาปัจจุบัน

### Error ที่เห็น:
```
ERR Unable to reach the origin service. 
dial tcp 127.0.0.1:8088: connectex: No connection could be made 
because the target machine actively refused it.
```

**สาเหตุ:** Caddy reverse proxy ไม่ทำงาน (port 8088 ไม่มี service)

**วิธีแก้:**
1. เริ่ม Caddy ก่อน:
   ```powershell
   .\caddy.exe run --config .\Caddyfile
   ```

2. แล้วค่อยเริ่ม Cloudflare Tunnel

---

## 📝 สรุป

### Quick Tunnel (ตอนนี้)
- ✅ Setup ง่าย (ไม่ต้องมี account)
- ❌ URL เปลี่ยนทุกครั้ง (`xxx.trycloudflare.com`)
- ❌ ไม่เหมาะสำหรับ production

### Named Tunnel (แนะนำ)
- ✅ URL ไม่เปลี่ยน (`api.yourdomain.com`)
- ✅ เหมาะสำหรับ production
- ⚠️ ต้องมี Cloudflare account + domain

---

## 🚀 ขั้นตอนต่อไป

1. **เริ่ม Caddy** (ถ้ายังไม่ทำงาน):
   ```powershell
   .\caddy.exe run --config .\Caddyfile
   ```

2. **Setup Named Tunnel** สำหรับ static domain:
   ```powershell
   # ดู guide
   cat docs\cloudflare\SETUP_NAMED_TUNNEL.md
   ```

3. **Run Named Tunnel**:
   ```powershell
   .\scripts\cloudflare\start-named-tunnel.ps1
   ```

---

## 💡 หมายเหตุ

- **Cloudflare Tunnel ไม่ได้ใช้ Static IP** - มันใช้ Domain Name
- **Static Domain** = Domain ที่ไม่เปลี่ยน (ต้องใช้ Named Tunnel)
- **Quick Tunnel** = Temporary domain (เปลี่ยนทุกครั้ง)
- **Caddy ต้องทำงานก่อน** Tunnel ถึงจะเชื่อมต่อได้






