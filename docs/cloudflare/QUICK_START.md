# Cloudflare Tunnel Quick Start

## 🎯 เลือกประเภท Tunnel

### 1. Named Tunnel (Static Domain) ⭐ **แนะนำสำหรับ Production**

**ข้อดี:**
- ✅ URL ไม่เปลี่ยน (static domain)
- ✅ เหมาะสำหรับ production
- ✅ ใช้ domain ของตัวเองได้
- ✅ เสถียรกว่า

**ข้อเสีย:**
- ต้องมี Cloudflare account + domain
- ต้อง setup ครั้งแรก

**วิธีใช้:**
```powershell
# 1. Setup (ทำครั้งเดียว)
# ดู guide: docs/cloudflare/SETUP_NAMED_TUNNEL.md

# 2. Run tunnel
.\scripts\cloudflare\start-named-tunnel.ps1
```

---

### 2. Quick Tunnel (Temporary URL) - สำหรับ Testing เท่านั้น

**ข้อดี:**
- ✅ Setup ง่าย (ไม่ต้องมี account)
- ✅ ใช้ได้ทันที

**ข้อเสีย:**
- ❌ URL เปลี่ยนทุกครั้งที่ restart
- ❌ ไม่เหมาะสำหรับ production
- ❌ อาจมี downtime

**วิธีใช้:**
```powershell
.\scripts\cloudflare\start-quick-tunnel.ps1
```

---

## 📋 Prerequisites

### สำหรับ Named Tunnel

1. **Cloudflare Account** (ฟรี): https://dash.cloudflare.com/sign-up
2. **Domain** (ซื้อหรือใช้ฟรี)
3. **cloudflared** installed

### สำหรับ Quick Tunnel

- แค่มี `cloudflared.exe` ใน project root

---

## 🚀 Quick Start Steps

### Named Tunnel (Static Domain)

1. **Login to Cloudflare**
   ```powershell
   cloudflared.exe login
   ```

2. **Create Tunnel**
   ```powershell
   cloudflared.exe tunnel create ata-app
   ```

3. **Copy Credentials**
   ```powershell
   # คัดลอก credentials.json จาก %USERPROFILE%\.cloudflared\
   # ไปยัง config\cloudflare\credentials.json
   ```

4. **Setup Config**
   ```powershell
   # คัดลอก template
   Copy-Item config\cloudflare\config.yml.template config\cloudflare\config.yml
   
   # แก้ไข config.yml ตาม domain ของคุณ
   ```

5. **Route DNS**
   ```powershell
   cloudflared.exe tunnel route dns ata-app api.yourdomain.com
   cloudflared.exe tunnel route dns ata-app admin.yourdomain.com
   cloudflared.exe tunnel route dns ata-app employee.yourdomain.com
   ```

6. **Run Tunnel**
   ```powershell
   .\scripts\cloudflare\start-named-tunnel.ps1
   ```

---

### Quick Tunnel (Testing)

```powershell
# Run tunnel
.\scripts\cloudflare\start-quick-tunnel.ps1

# Get URL
.\scripts\cloudflare\get-url.ps1
```

---

## 📁 File Locations

```
config/cloudflare/
├── config.yml              # Your config (create from template)
├── config.yml.template    # Template
└── credentials.json       # Tunnel credentials (gitignored)

scripts/cloudflare/
├── start-named-tunnel.ps1  # Named tunnel script
├── start-quick-tunnel.ps1  # Quick tunnel script
└── get-url.ps1            # Get current URL

logs/
├── cloudflared.log        # Tunnel logs
└── current-cloudflare-url.txt  # Current URL
```

---

## 🔧 Troubleshooting

### Tunnel ไม่ทำงาน

1. ตรวจสอบ logs:
   ```powershell
   Get-Content logs\cloudflared.log -Tail 50
   ```

2. ตรวจสอบว่า cloudflared ทำงานอยู่:
   ```powershell
   Get-Process cloudflared -ErrorAction SilentlyContinue
   ```

3. ตรวจสอบ config:
   ```powershell
   # ตรวจสอบ config file
   Test-Path config\cloudflare\config.yml
   
   # ตรวจสอบ credentials
   Test-Path config\cloudflare\credentials.json
   ```

### URL ไม่แสดง

- **Quick tunnel**: รอสักครู่ (10-30 วินาที)
- **Named tunnel**: ตรวจสอบ DNS records ใน Cloudflare Dashboard

---

## 📝 Notes

- **Quick Tunnel**: เหมาะสำหรับ testing เท่านั้น
- **Named Tunnel**: แนะนำสำหรับ production
- Credentials file ต้องเก็บไว้เป็นความลับ (gitignored)
- Logs ถูกบันทึกไว้ใน `logs/cloudflared.log`

---

## 🔗 More Information

- **Full Setup Guide**: [SETUP_NAMED_TUNNEL.md](SETUP_NAMED_TUNNEL.md)
- **Scripts Documentation**: [../../scripts/cloudflare/README.md](../../scripts/cloudflare/README.md)
- **Cloudflare Docs**: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

