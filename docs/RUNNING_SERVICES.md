# Running Services Guide

> **Note:** For a single, handoff-ready playbook covering services, proxy, and tunnel, use [DEPLOYMENT_RUNBOOK.md](DEPLOYMEN
T_RUNBOOK.md). This guide focuses on service-level detail.

## 📋 สารบัญ

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Running All Services](#running-all-services)
4. [Running Individual Services](#running-individual-services)
5. [Service Ports](#service-ports)
6. [Troubleshooting](#troubleshooting)

---

## Overview

ATA Senior Project ประกอบด้วย services หลักดังนี้:

- **Backend** (Spring Boot) - Port 8080
- **Admin Frontend** (Next.js) - Port 3000
- **Employee Frontend** (Next.js) - Port 3001
- **Caddy Reverse Proxy** - Port 8088
- **Cloudflare Tunnel** - Public URL

---

## Prerequisites

### Required Software

1. **Java 17+** - สำหรับ Backend
2. **Node.js 18+** - สำหรับ Frontend
3. **Caddy** - Reverse Proxy
4. **Cloudflare Tunnel (cloudflared)** - Public Access

### Installation

#### Caddy
```powershell
# Download from https://caddyserver.com/download
# หรือใช้ winget
winget install Caddy.Caddy
```

#### Cloudflare Tunnel
```powershell
winget install -e --id Cloudflare.cloudflared
```

---

## Running All Services

### วิธีที่ 1: ใช้ Script (แนะนำ)

```powershell
.\scripts\run-all.bat
```

Script นี้จะ:
1. หยุด processes ที่ทำงานอยู่
2. เริ่ม Backend (Spring Boot)
3. เริ่ม Admin Frontend (Next.js production)
4. เริ่ม Employee Frontend (Next.js production)
5. เริ่ม Caddy Reverse Proxy
6. เริ่ม Cloudflare Tunnel

### วิธีที่ 2: PowerShell Script

```powershell
.\scripts\windows\start-all-services.ps1
```

---

## Running Individual Services

### 1. Backend (Spring Boot)

```powershell
cd Backend\main
.\gradlew.bat bootRun
```

**หรือใช้ PowerShell:**
```powershell
cd Backend\main
.\gradlew.bat bootRun
```

**ตรวจสอบ:**
```powershell
# ตรวจสอบว่า Backend พร้อมหรือยัง
Invoke-WebRequest -Uri "http://127.0.0.1:8080/api/health" -TimeoutSec 5
```

---

### 2. Admin Frontend (Next.js)

#### Development Mode
```powershell
cd frontend\admin
npm run dev
```

#### Production Mode
```powershell
cd frontend\admin
npm run build
npm run start
```

**ตรวจสอบ:**
```powershell
# ตรวจสอบว่า Admin Frontend พร้อมหรือยัง
Invoke-WebRequest -Uri "http://127.0.0.1:3000/admin" -TimeoutSec 5
```

---

### 3. Employee Frontend (Next.js)

#### Development Mode
```powershell
cd frontend\employee
npm run dev
```

#### Production Mode
```powershell
cd frontend\employee
npm run build
npm run start
```

**ตรวจสอบ:**
```powershell
# ตรวจสอบว่า Employee Frontend พร้อมหรือยัง
Invoke-WebRequest -Uri "http://127.0.0.1:3001/employee/login" -TimeoutSec 5
```

---

### 4. Caddy Reverse Proxy

#### ตรวจสอบว่า Caddy ทำงานอยู่หรือไม่
```powershell
Get-Process caddy -ErrorAction SilentlyContinue
```

#### เริ่ม Caddy
```powershell
# ถ้า caddy.exe อยู่ในโฟลเดอร์ ops/caddy
.\ops\caddy\caddy.exe run --config .\ops\caddy\Caddyfile

# หรือใช้ PowerShell script
Start-Process -FilePath ".\caddy.exe" -ArgumentList @("run", "--config", "Caddyfile", "--pidfile", "caddy.pid") -WindowStyle Minimized
```

#### หยุด Caddy
```powershell
Stop-Process -Name caddy -Force
```

### Restart Caddy
```powershell
.\scripts\restart-caddy.ps1
```

Script นี้จะ:
1. หยุด Caddy processes ทั้งหมด
2. Free up ports (2019, 8088)
3. Validate Caddyfile
4. เริ่ม Caddy ใหม่

**ตรวจสอบ:**
```powershell
# ตรวจสอบว่า Caddy พร้อมหรือยัง
Invoke-WebRequest -Uri "http://127.0.0.1:8088/admin" -TimeoutSec 5

# ตรวจสอบ port
netstat -ano | findstr ":8088"
```

---

### 5. Cloudflare Tunnel

#### Quick Tunnel (Temporary URL)
```powershell
# ใช้ script ที่มีอยู่
.\scripts\cloudflare\start-quick-tunnel.ps1

# หรือรันโดยตรง
cloudflared tunnel --url http://127.0.0.1:8088
```

#### Named Tunnel (Static Domain)
```powershell
# ใช้ script ที่มีอยู่
.\scripts\cloudflare\start-named-tunnel.ps1

# หรือรันโดยตรง
cloudflared tunnel run --config config\cloudflare\config.yml
```

**ตรวจสอบ:**
```powershell
# ตรวจสอบว่า Tunnel ทำงานอยู่หรือไม่
Get-Process cloudflared -ErrorAction SilentlyContinue

# ดู URL ปัจจุบัน
Get-Content logs\current-cloudflare-url.txt
```

---

## Service Ports

| Service | Port | URL |
|---------|------|-----|
| Backend | 8080 | http://127.0.0.1:8080 |
| Admin Frontend | 3000 | http://127.0.0.1:3000 |
| Employee Frontend | 3001 | http://127.0.0.1:3001 |
| Caddy Reverse Proxy | 8088 | http://127.0.0.1:8088 |
| Cloudflare Tunnel | - | https://*.trycloudflare.com |

### Access URLs (ผ่าน Caddy)

- **Admin**: http://127.0.0.1:8088/admin
- **Employee**: http://127.0.0.1:8088/employee
- **API**: http://127.0.0.1:8088/api

---

## Health Check Scripts

### ตรวจสอบ Health ของ Services ทั้งหมด
```powershell
.\scripts\check-services-health.ps1
```

### รอให้ Services พร้อม
```powershell
.\scripts\wait-for-services.ps1
```

---

## Service Startup Order

เพื่อหลีกเลี่ยงปัญหา 503 errors แนะนำให้เริ่ม services ตามลำดับนี้:

1. **Backend** (รอ ~30-60 วินาที)
2. **Admin Frontend** (รอ ~60-90 วินาที)
3. **Employee Frontend** (รอ ~60-90 วินาที)
4. **Caddy** (รอ ~5-10 วินาที)
5. **Cloudflare Tunnel** (รอ ~5-10 วินาที)

### ใช้ Script รอให้ Services พร้อม
```powershell
# เริ่ม services
.\scripts\run-all.bat

# รอให้ services พร้อม
.\scripts\wait-for-services.ps1
```

---

## Troubleshooting

### ปัญหา: Service ไม่เริ่ม

**ตรวจสอบ:**
```powershell
# ตรวจสอบว่า port ถูกใช้งานหรือไม่
netstat -ano | findstr ":8080 :3000 :3001 :8088"

# ตรวจสอบ processes
Get-Process | Where-Object {$_.ProcessName -match "java|node|caddy|cloudflared"}
```

**แก้ไข:**
```powershell
# หยุด processes ที่ใช้ port
taskkill /IM java.exe /F
taskkill /IM node.exe /F
taskkill /IM caddy.exe /F
taskkill /IM cloudflared.exe /F

# เริ่มใหม่
.\scripts\run-all.bat
```

---

### ปัญหา: 503 Service Unavailable

**สาเหตุ:**
- Services ยังไม่พร้อม
- Caddy ไม่สามารถเชื่อมต่อกับ upstream services ได้

**แก้ไข:**
1. ตรวจสอบว่า services ทำงานอยู่:
   ```powershell
   .\scripts\check-services-health.ps1
   ```

2. รอให้ services พร้อม:
   ```powershell
   .\scripts\wait-for-services.ps1
   ```

3. Restart Caddy:
   ```powershell
   Stop-Process -Name caddy -Force
   Start-Process -FilePath ".\caddy.exe" -ArgumentList @("run", "--config", "Caddyfile", "--pidfile", "caddy.pid") -WindowStyle Minimized
   ```

---

### ปัญหา: Caddy ไม่ทำงาน

**ตรวจสอบ:**
```powershell
# ตรวจสอบว่า Caddy process ทำงานอยู่หรือไม่
Get-Process caddy -ErrorAction SilentlyContinue

# ตรวจสอบ port
netstat -ano | findstr ":8088"
```

**แก้ไข:**
```powershell
# เริ่ม Caddy
.\ops\caddy\caddy.exe run --config .\ops\caddy\Caddyfile

# หรือใช้ script
Start-Process -FilePath ".\caddy.exe" -ArgumentList @("run", "--config", "Caddyfile", "--pidfile", "caddy.pid") -WindowStyle Minimized
```

---

### ปัญหา: Cloudflare Tunnel ไม่ทำงาน

**ตรวจสอบ:**
```powershell
# ตรวจสอบว่า cloudflared process ทำงานอยู่หรือไม่
Get-Process cloudflared -ErrorAction SilentlyContinue

# ดู logs
Get-Content logs\cloudflared.log -Tail 20
```

**แก้ไข:**
```powershell
# เริ่ม Tunnel ใหม่
.\scripts\cloudflare\start-quick-tunnel.ps1

# หรือ
.\scripts\cloudflare\start-named-tunnel.ps1
```

---

## Useful Commands

### ตรวจสอบ Status ของ Services
```powershell
# ตรวจสอบ processes
Get-Process | Where-Object {$_.ProcessName -match "java|node|caddy|cloudflared"} | Format-Table ProcessName, Id, @{Name="Port";Expression={(Get-NetTCPConnection -OwningProcess $_.Id -ErrorAction SilentlyContinue | Select-Object -First 1).LocalPort}}

# ตรวจสอบ ports
netstat -ano | findstr ":8080 :3000 :3001 :8088"
```

### หยุด Services ทั้งหมด
```powershell
taskkill /IM java.exe /F
taskkill /IM node.exe /F
taskkill /IM caddy.exe /F
taskkill /IM cloudflared.exe /F
```

### เริ่ม Services ทั้งหมด
```powershell
.\scripts\run-all.bat
```

---

## Additional Resources

- [Performance Optimization Guide](./PERFORMANCE_OPTIMIZATION.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Cloudflare Tunnel Setup](./cloudflare/SETUP_NAMED_TUNNEL.md)

---

## Notes

- **Production Build**: ใช้ `npm run build && npm run start` แทน `npm run dev` เพื่อประสิทธิภาพที่ดีกว่า
- **Memory Limit**: Frontend services ใช้ `NODE_OPTIONS=--max-old-space-size=2048` เพื่อเพิ่ม memory limit
- **Health Checks**: ใช้ health check scripts ก่อนใช้งาน services เพื่อหลีกเลี่ยงปัญหา 503 errors

