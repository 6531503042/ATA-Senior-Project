# Cloudflare Tunnel FAQ

## ❓ ทำไม Tunnel ยังใช้ Generated Domain?

**คำตอบ:** เพราะคุณกำลังใช้ **Quick Tunnel** ซึ่งเป็น temporary tunnel

### Quick Tunnel (ตอนนี้)
- URL: `xxx.trycloudflare.com` (เปลี่ยนทุกครั้ง)
- ไม่ต้องมี account
- เหมาะสำหรับ testing เท่านั้น

### Named Tunnel (Static Domain)
- URL: `api.yourdomain.com` (ไม่เปลี่ยน)
- ต้องมี Cloudflare account + domain
- เหมาะสำหรับ production

---

## ❓ ทำไมไม่ใช้ Static IP Address?

**คำตอบ:** Cloudflare Tunnel **ไม่ได้ใช้ Static IP Address** แต่ใช้ **Static Domain Name** แทน

### ทำไม?
- Cloudflare Tunnel เป็น reverse proxy ที่ใช้ domain name
- IP address ไม่จำเป็นเพราะ Cloudflare จัดการ DNS ให้
- Domain name ใช้งานง่ายกว่า IP address

---

## ❓ วิธีได้ Static Domain (ไม่เปลี่ยน)?

### ต้อง Setup Named Tunnel

**ขั้นตอน:**

1. **มี Cloudflare Account + Domain**
   ```powershell
   # สมัคร: https://dash.cloudflare.com/sign-up
   ```

2. **Login & Create Tunnel**
   ```powershell
   cloudflared.exe login
   cloudflared.exe tunnel create ata-app
   ```

3. **Route DNS**
   ```powershell
   cloudflared.exe tunnel route dns ata-app api.yourdomain.com
   cloudflared.exe tunnel route dns ata-app admin.yourdomain.com
   cloudflared.exe tunnel route dns ata-app employee.yourdomain.com
   ```

4. **Configure & Run**
   ```powershell
   # Copy template
   Copy-Item config\cloudflare\config.yml.template config\cloudflare\config.yml
   
   # Edit config.yml with your domain
   # Then run:
   .\scripts\cloudflare\start-named-tunnel.ps1
   ```

**ดู guide เต็มๆ:** `docs\cloudflare\SETUP_NAMED_TUNNEL.md`

---

## ❓ Error: "Unable to reach the origin service"

**สาเหตุ:** Caddy reverse proxy ไม่ทำงาน

**วิธีแก้:**
```powershell
# เริ่ม Caddy
.\ops\caddy\caddy.exe run --config .\ops\caddy\Caddyfile

# หรือใช้ script
.\scripts\start-all-with-tunnel.ps1
```

---

## ❓ URL เปลี่ยนทุกครั้งที่ Restart?

**สาเหตุ:** ใช้ Quick Tunnel (temporary)

**วิธีแก้:** Setup Named Tunnel สำหรับ static domain

---

## ❓ ต้องมี Domain จริงๆ หรือ?

**คำตอบ:** ใช่ สำหรับ Named Tunnel (static domain)

### ตัวเลือก:
1. **ซื้อ Domain** (เช่น Namecheap, GoDaddy)
2. **ใช้ Free Domain** (เช่น Freenom, Dot TK)
3. **ใช้ Quick Tunnel** (ไม่ต้องมี domain แต่ URL เปลี่ยน)

---

## 📝 สรุป

| คำถาม | คำตอบ |
|--------|-------|
| ทำไมไม่ใช้ Static IP? | Cloudflare Tunnel ใช้ Domain Name ไม่ใช่ IP |
| วิธีได้ Static Domain? | Setup Named Tunnel |
| ต้องมี Domain จริงๆ? | ใช่ สำหรับ Named Tunnel |
| Quick Tunnel vs Named Tunnel? | Quick = Temp, Named = Static |

---

## 🔗 Links

- **Setup Guide**: `docs\cloudflare\SETUP_NAMED_TUNNEL.md`
- **Quick Start**: `docs\cloudflare\QUICK_START.md`
- **Explanation**: `docs\cloudflare\STATIC_DOMAIN_EXPLANATION.md`






