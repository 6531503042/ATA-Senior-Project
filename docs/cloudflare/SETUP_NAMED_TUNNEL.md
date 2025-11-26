# Cloudflare Named Tunnel Setup Guide (Static Domain)

## 📋 Prerequisites

1. **Cloudflare Account** (ฟรี): https://dash.cloudflare.com/sign-up
2. **Domain** (ซื้อหรือใช้ฟรีจาก Cloudflare)
3. **cloudflared** installed: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

---

## 🚀 Quick Setup (Step by Step)

### Step 1: Login to Cloudflare

```powershell
# Windows
cloudflared.exe login

# Linux/macOS
cloudflared login
```

- จะเปิดเบราว์เซอร์ให้คุณ login
- เลือก domain ที่ต้องการใช้

### Step 2: Create Named Tunnel

```powershell
# สร้าง tunnel ชื่อ "ata-app" (เปลี่ยนชื่อได้ตามต้องการ)
cloudflared.exe tunnel create ata-app
```

- จะได้ `credentials.json` file
- บันทึก path ของไฟล์นี้ไว้ (มักจะอยู่ใน `%USERPROFILE%\.cloudflared\<tunnel-id>.json`)

### Step 3: Copy Credentials File

```powershell
# คัดลอก credentials.json ไปยัง config folder
# Windows
Copy-Item "$env:USERPROFILE\.cloudflared\<tunnel-id>.json" "config\cloudflare\credentials.json"

# หรือคัดลอกด้วยมือจาก:
# %USERPROFILE%\.cloudflared\<tunnel-id>.json
# ไปยัง: config\cloudflare\credentials.json
```

### Step 4: Configure Tunnel

1. คัดลอก `config/cloudflare/config.yml.template` เป็น `config/cloudflare/config.yml`
2. แก้ไขค่าใน `config.yml`:

```yaml
tunnel: ata-app  # ชื่อ tunnel ที่สร้างไว้
credentials-file: config/cloudflare/credentials.json

ingress:
  # Option 1: Multiple subdomains (แนะนำ)
  - hostname: api.yourdomain.com
    service: http://127.0.0.1:8080
  - hostname: admin.yourdomain.com
    service: http://127.0.0.1:3000
  - hostname: employee.yourdomain.com
    service: http://127.0.0.1:3001
  - service: http_status:404

  # Option 2: Single domain with Caddy (ใช้ path routing)
  # - hostname: yourdomain.com
  #   service: http://127.0.0.1:8088
  # - service: http_status:404
```

### Step 5: Route DNS

```powershell
# สำหรับ Option 1 (Multiple subdomains)
cloudflared.exe tunnel route dns ata-app api.yourdomain.com
cloudflared.exe tunnel route dns ata-app admin.yourdomain.com
cloudflared.exe tunnel route dns ata-app employee.yourdomain.com

# สำหรับ Option 2 (Single domain)
cloudflared.exe tunnel route dns ata-app yourdomain.com
```

### Step 6: Run Tunnel

```powershell
# ใช้ script ที่เตรียมไว้
.\scripts\cloudflare\start-named-tunnel.ps1

# หรือรันด้วยมือ
cloudflared.exe tunnel --config config\cloudflare\config.yml run ata-app
```

---

## 📁 File Structure

```
ATA-Senior-Project/
├── config/
│   └── cloudflare/
│       ├── config.yml              # Configuration (สร้างจาก template)
│       ├── config.yml.template     # Template
│       └── credentials.json        # Tunnel credentials (จาก cloudflared)
├── scripts/
│   └── cloudflare/
│       ├── start-named-tunnel.ps1  # Main script to run tunnel
│       └── start-quick-tunnel.ps1  # Quick tunnel (temporary URL)
└── docs/
    └── cloudflare/
        └── SETUP_NAMED_TUNNEL.md   # This guide
```

---

## 🔧 Troubleshooting

### Problem: "Cannot find credentials file"

**Solution**: ตรวจสอบว่า `credentials.json` อยู่ใน `config/cloudflare/` และ path ใน `config.yml` ถูกต้อง

### Problem: "DNS record already exists"

**Solution**: ลบ DNS record เก่าออกก่อน:
```powershell
# ดู DNS records
cloudflared.exe tunnel route dns list

# ลบ record (ถ้าจำเป็น)
# ไปที่ Cloudflare Dashboard → DNS → ลบ record ที่ซ้ำ
```

### Problem: "Tunnel not found"

**Solution**: ตรวจสอบชื่อ tunnel:
```powershell
# ดู tunnels ทั้งหมด
cloudflared.exe tunnel list

# ถ้าไม่มี tunnel ให้สร้างใหม่
cloudflared.exe tunnel create ata-app
```

---

## 🎯 Benefits of Named Tunnel

✅ **Static Domain**: URL ไม่เปลี่ยน  
✅ **Production Ready**: เหมาะสำหรับใช้งานจริง  
✅ **Better Performance**: เสถียรกว่า quick tunnel  
✅ **Custom Domain**: ใช้ domain ของตัวเองได้  
✅ **SSL/TLS**: ได้ HTTPS อัตโนมัติ  

---

## 📝 Notes

- **Quick Tunnel** (trycloudflare.com) เหมาะสำหรับทดสอบเท่านั้น
- **Named Tunnel** เหมาะสำหรับ production
- Credentials file ต้องเก็บไว้เป็นความลับ (อย่า commit ลง git)
- ถ้าใช้ Caddy reverse proxy ให้ใช้ Option 2 (single domain)

---

## 🔗 Useful Links

- Cloudflare Tunnel Docs: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- Cloudflare Dashboard: https://dash.cloudflare.com/
- Download cloudflared: https://github.com/cloudflare/cloudflared/releases






