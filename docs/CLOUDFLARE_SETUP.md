# Cloudflare Tunnel Setup Guide

> **Note:** The consolidated deployment path (apps + Caddy + Cloudflare) lives in [DEPLOYMENT_RUNBOOK.md](DEPLOYMENT_RUNBOOK
.md). Refer there first when handing off to operations.

## 📋 สารบัญ

1. [Overview](#overview)
2. [Quick Tunnel (Temporary)](#quick-tunnel-temporary)
3. [Named Tunnel (Static Domain)](#named-tunnel-static-domain)
4. [Scripts](#scripts)
5. [Troubleshooting](#troubleshooting)

---

## Overview

Cloudflare Tunnel ช่วยให้สามารถเข้าถึง local services ผ่าน public URL โดยไม่ต้องเปิด port ใน firewall

### ประเภทของ Tunnels

1. **Quick Tunnel** - URL ชั่วคราว (เปลี่ยนทุกครั้งที่ restart)
2. **Named Tunnel** - Domain คงที่ (ต้อง setup ใน Cloudflare Dashboard)

---

## Quick Tunnel (Temporary)

### การใช้งาน

Quick Tunnel เหมาะสำหรับการทดสอบหรือ development เพราะ setup ง่าย แต่ URL จะเปลี่ยนทุกครั้งที่ restart

### เริ่ม Quick Tunnel

#### วิธีที่ 1: ใช้ Script (แนะนำ)
```powershell
.\scripts\cloudflare\start-quick-tunnel.ps1
```

#### วิธีที่ 2: รันโดยตรง
```powershell
cloudflared tunnel --url http://127.0.0.1:8088
```

### ดู URL ปัจจุบัน

```powershell
# ดูจาก logs
Get-Content logs\cloudflared.log | Select-String "trycloudflare.com"

# ดูจาก file
Get-Content logs\current-cloudflare-url.txt
```

### หยุด Quick Tunnel

```powershell
Stop-Process -Name cloudflared -Force
```

---

## Named Tunnel (Static Domain)

### Prerequisites

1. **Cloudflare Account** - สมัครที่ https://dash.cloudflare.com
2. **Domain** - Domain ที่ต้องการใช้ (หรือใช้ subdomain ของ Cloudflare)

### Setup Steps

#### 1. Login to Cloudflare

```powershell
cloudflared tunnel login
```

คำสั่งนี้จะเปิด browser ให้ login และ authorize

#### 2. Create Tunnel

```powershell
cloudflared tunnel create ata-tunnel
```

บันทึก Tunnel ID ที่ได้

#### 3. Create Config File

สร้างไฟล์ `config\cloudflare\config.yml`:

```yaml
tunnel: <TUNNEL_ID>
credentials-file: config\cloudflare\credentials.json

ingress:
  - hostname: admin.yourdomain.com
    service: http://127.0.0.1:8088/admin
  - hostname: employee.yourdomain.com
    service: http://127.0.0.1:8088/employee
  - hostname: api.yourdomain.com
    service: http://127.0.0.1:8088/api
  - service: http_status:404
```

#### 4. Route DNS

```powershell
cloudflared tunnel route dns ata-tunnel admin.yourdomain.com
cloudflared tunnel route dns ata-tunnel employee.yourdomain.com
cloudflared tunnel route dns ata-tunnel api.yourdomain.com
```

#### 5. Start Tunnel

```powershell
.\scripts\cloudflare\start-named-tunnel.ps1
```

หรือ

```powershell
cloudflared tunnel run --config config\cloudflare\config.yml
```

---

## Scripts

### Available Scripts

| Script | Description |
|--------|-------------|
| `scripts\cloudflare\start-quick-tunnel.ps1` | เริ่ม Quick Tunnel |
| `scripts\cloudflare\start-named-tunnel.ps1` | เริ่ม Named Tunnel |
| `scripts\cloudflare\start-tunnel.ps1` | Main entry point (เลือก tunnel type) |
| `scripts\cloudflare\get-url.ps1` | ดู URL ปัจจุบัน |
| `scripts\cloudflare\monitor-tunnel.ps1` | Monitor tunnel status |

### Usage

#### Start Quick Tunnel
```powershell
.\scripts\cloudflare\start-quick-tunnel.ps1
```

#### Start Named Tunnel
```powershell
.\scripts\cloudflare\start-named-tunnel.ps1
```

#### Get Current URL
```powershell
.\scripts\cloudflare\get-url.ps1
```

---

## Troubleshooting

### ปัญหา: Tunnel ไม่เชื่อมต่อ

**ตรวจสอบ:**
```powershell
# ตรวจสอบว่า cloudflared ทำงานอยู่หรือไม่
Get-Process cloudflared -ErrorAction SilentlyContinue

# ดู logs
Get-Content logs\cloudflared.log -Tail 50
```

**แก้ไข:**
1. ตรวจสอบว่า Caddy ทำงานอยู่:
   ```powershell
   Get-Process caddy -ErrorAction SilentlyContinue
   ```

2. ตรวจสอบว่า services พร้อม:
   ```powershell
   .\scripts\check-services-health.ps1
   ```

3. Restart Tunnel:
   ```powershell
   Stop-Process -Name cloudflared -Force
   .\scripts\cloudflare\start-quick-tunnel.ps1
   ```

---

### ปัญหา: 502 Bad Gateway

**สาเหตุ:** Caddy หรือ upstream services ไม่พร้อม

**แก้ไข:**
1. ตรวจสอบ Caddy:
   ```powershell
   Get-Process caddy -ErrorAction SilentlyContinue
   ```

2. ตรวจสอบ services:
   ```powershell
   .\scripts\check-services-health.ps1
   ```

3. Restart Caddy:
   ```powershell
   Stop-Process -Name caddy -Force
   Start-Process -FilePath ".\caddy.exe" -ArgumentList @("run", "--config", "Caddyfile", "--pidfile", "caddy.pid") -WindowStyle Minimized
   ```

---

### ปัญหา: 524 Timeout

**สาเหตุ:** Timeout ระหว่าง Cloudflare และ origin

**แก้ไข:**
1. เพิ่ม timeout ใน Caddyfile (ทำไปแล้ว)
2. ตรวจสอบว่า services พร้อม:
   ```powershell
   .\scripts\check-services-health.ps1
   ```

---

### ปัญหา: DNS_PROBE_POSSIBLE

**สาเหตุ:** Tunnel ไม่ทำงานหรือ URL หมดอายุ

**แก้ไข:**
1. Restart Tunnel:
   ```powershell
   Stop-Process -Name cloudflared -Force
   .\scripts\cloudflare\start-quick-tunnel.ps1
   ```

2. ดู URL ใหม่:
   ```powershell
   Get-Content logs\current-cloudflare-url.txt
   ```

---

## Best Practices

1. **ใช้ Named Tunnel สำหรับ Production** - URL คงที่และเสถียรกว่า
2. **Monitor Tunnel Status** - ใช้ `monitor-tunnel.ps1` เพื่อตรวจสอบ
3. **Keep Tunnel Running** - ใช้ supervisor script เพื่อ auto-restart
4. **Check Logs** - ตรวจสอบ logs เมื่อมีปัญหา

---

## Additional Resources

- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Running Services Guide](./RUNNING_SERVICES.md)
- [Performance Optimization](./PERFORMANCE_OPTIMIZATION.md)



