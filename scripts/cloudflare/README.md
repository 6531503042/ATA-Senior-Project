# Cloudflare Tunnel Scripts

Scripts สำหรับจัดการ Cloudflare Tunnel

## 📋 Scripts

### 1. `start-named-tunnel.ps1` ⭐ (แนะนำ)
รัน **Named Tunnel** ที่มี static domain (URL ไม่เปลี่ยน)

```powershell
.\scripts\cloudflare\start-named-tunnel.ps1
```

**Requirements:**
- Cloudflare account + domain
- Tunnel setup ตาม `docs/cloudflare/SETUP_NAMED_TUNNEL.md`

### 2. `start-quick-tunnel.ps1`
รัน **Quick Tunnel** สำหรับทดสอบ (URL เปลี่ยนทุกครั้งที่ restart)

```powershell
.\scripts\cloudflare\start-quick-tunnel.ps1
```

**Note:** เหมาะสำหรับทดสอบเท่านั้น ไม่เหมาะสำหรับ production

### 3. `get-url.ps1`
แสดง URL ปัจจุบันของ tunnel

```powershell
.\scripts\cloudflare\get-url.ps1
```

---

## 🚀 Quick Start

### สำหรับ Production (Static Domain)

1. Setup Named Tunnel:
   ```powershell
   # ดู guide
   cat docs\cloudflare\SETUP_NAMED_TUNNEL.md
   ```

2. Run tunnel:
   ```powershell
   .\scripts\cloudflare\start-named-tunnel.ps1
   ```

### สำหรับ Testing (Temporary URL)

```powershell
.\scripts\cloudflare\start-quick-tunnel.ps1
```

---

## 📁 File Structure

```
scripts/cloudflare/
├── start-named-tunnel.ps1    # Named tunnel (static domain)
├── start-quick-tunnel.ps1     # Quick tunnel (temporary)
├── get-url.ps1                # Get current URL
└── README.md                  # This file

config/cloudflare/
├── config.yml                 # Tunnel config (create from template)
├── config.yml.template        # Template
└── credentials.json           # Tunnel credentials (from cloudflared)

docs/cloudflare/
└── SETUP_NAMED_TUNNEL.md      # Setup guide
```

---

## 🔧 Troubleshooting

### Tunnel ไม่ทำงาน

1. ตรวจสอบว่า cloudflared ทำงานอยู่:
   ```powershell
   Get-Process cloudflared -ErrorAction SilentlyContinue
   ```

2. ตรวจสอบ logs:
   ```powershell
   Get-Content logs\cloudflared.log -Tail 50
   ```

3. ตรวจสอบ config:
   ```powershell
   # ตรวจสอบ config file
   cat config\cloudflare\config.yml
   
   # ตรวจสอบ credentials
   Test-Path config\cloudflare\credentials.json
   ```

### URL ไม่แสดง

- Quick tunnel: รอสักครู่ (อาจใช้เวลา 10-30 วินาที)
- Named tunnel: ตรวจสอบ DNS records ใน Cloudflare Dashboard

---

## 📝 Notes

- **Quick Tunnel**: URL เปลี่ยนทุกครั้งที่ restart
- **Named Tunnel**: URL คงที่ (ต้อง setup ตาม guide)
- Logs ถูกบันทึกไว้ใน `logs/cloudflared.log`
- URL ถูกบันทึกไว้ใน `logs/current-cloudflare-url.txt`






