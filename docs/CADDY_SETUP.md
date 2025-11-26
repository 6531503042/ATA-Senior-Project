# Caddy Reverse Proxy Setup Guide

คู่มือการตั้งค่าและใช้งาน Caddy Reverse Proxy สำหรับ ATA Senior Project

## 📋 สารบัญ

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running Caddy](#running-caddy)
5. [Troubleshooting](#troubleshooting)

---

## Overview

Caddy ทำหน้าที่เป็น Reverse Proxy ที่:
- Route requests ไปยัง services ที่เหมาะสม
- Handle SSL/TLS (ถ้าใช้ domain จริง)
- Load balancing และ health checks
- Compression และ caching

### Architecture

```
Internet → Cloudflare Tunnel → Caddy (8088) → Services
                                    ├─ Admin (3000)
                                    ├─ Employee (3001)
                                    └─ API (8080)
```

---

## Installation

### Windows

#### วิธีที่ 1: Download Binary
1. ไปที่ https://caddyserver.com/download
2. Download Windows binary
3. วาง `caddy.exe` ใน root directory ของ project

#### วิธีที่ 2: Winget
```powershell
winget install Caddy.Caddy
```

#### วิธีที่ 3: Chocolatey
```powershell
choco install caddy
```

### Verify Installation

```powershell
.\caddy.exe version
```

---

## Configuration

### Caddyfile Structure

ไฟล์ `Caddyfile` อยู่ใน root directory:

```caddyfile
:8088 {
    # API route
    @api path /api/*
    handle @api {
        reverse_proxy 127.0.0.1:8080 {
            # Transport settings
            transport http {
                read_timeout 90s
                write_timeout 90s
                dial_timeout 10s
                response_header_timeout 30s
                keepalive 30s
                keepalive_idle_conns 100
                keepalive_idle_conns_per_host 10
            }
            
            # Retry logic
            lb_policy round_robin
            fail_duration 5s
            max_fails 3
            unhealthy_status 503 502 504
            health_interval 5s
            health_timeout 3s
            health_uri /api/health
            
            # Buffer settings
            flush_interval -1
            buffer_requests
        }
    }

    # Admin frontend route
    @admin path /admin*
    handle @admin {
        reverse_proxy 127.0.0.1:3000 {
            # ... similar configuration
        }
    }

    # Employee frontend route
    @employee path /employee*
    handle @employee {
        reverse_proxy 127.0.0.1:3001 {
            # ... similar configuration
        }
    }

    # Root redirect
    @root path /
    redir @root /admin
}
```

### Key Features

1. **Connection Pooling** - Reuse connections เพื่อประสิทธิภาพที่ดีกว่า
2. **Retry Logic** - Retry เมื่อ service ไม่พร้อม
3. **Health Checks** - ตรวจสอบ service health อัตโนมัติ
4. **Compression** - Compress responses อัตโนมัติ
5. **Static Assets Caching** - Cache static files

---

## Running Caddy

### ตรวจสอบว่า Caddy ทำงานอยู่หรือไม่

```powershell
Get-Process caddy -ErrorAction SilentlyContinue
```

### เริ่ม Caddy

#### วิธีที่ 1: รันโดยตรง
```powershell
.\caddy.exe run --config Caddyfile
```

#### วิธีที่ 2: Background Process
```powershell
Start-Process -FilePath ".\caddy.exe" -ArgumentList @("run", "--config", "Caddyfile", "--pidfile", "caddy.pid") -WindowStyle Minimized
```

#### วิธีที่ 3: ใช้ Script
```powershell
.\scripts\run-all.bat
```

### หยุด Caddy

```powershell
Stop-Process -Name caddy -Force
```

### Restart Caddy

ใช้ script สำหรับ restart ที่ปลอดภัย:

```powershell
.\scripts\restart-caddy.ps1
```

Script นี้จะ:
1. หยุด Caddy processes ทั้งหมด
2. Free up ports (2019 admin API, 8088 HTTP)
3. Validate Caddyfile
4. เริ่ม Caddy ใหม่

### Reload Configuration

```powershell
# Caddy จะ reload config อัตโนมัติเมื่อไฟล์เปลี่ยน
# หรือใช้ admin API
Invoke-WebRequest -Uri "http://localhost:2019/load" -Method POST -Body (Get-Content Caddyfile -Raw)
```

---

## Verification

### ตรวจสอบว่า Caddy พร้อมหรือยัง

```powershell
# ตรวจสอบ port
netstat -ano | findstr ":8088"

# ตรวจสอบ response
Invoke-WebRequest -Uri "http://127.0.0.1:8088/admin" -TimeoutSec 5
```

### Test Routes

```powershell
# Admin
Invoke-WebRequest -Uri "http://127.0.0.1:8088/admin" -TimeoutSec 5

# Employee
Invoke-WebRequest -Uri "http://127.0.0.1:8088/employee/login" -TimeoutSec 5

# API
Invoke-WebRequest -Uri "http://127.0.0.1:8088/api/health" -TimeoutSec 5
```

---

## Troubleshooting

### ปัญหา: Caddy ไม่เริ่ม

**ตรวจสอบ:**
```powershell
# ตรวจสอบว่า port ถูกใช้งานหรือไม่
netstat -ano | findstr ":8088"

# ตรวจสอบ Caddyfile syntax
.\caddy.exe validate --config Caddyfile
```

**แก้ไข:**
1. หยุด process ที่ใช้ port:
   ```powershell
   $pid = (Get-NetTCPConnection -LocalPort 8088 -ErrorAction SilentlyContinue).OwningProcess
   if ($pid) { Stop-Process -Id $pid -Force }
   ```

2. เริ่ม Caddy ใหม่:
   ```powershell
   .\caddy.exe run --config Caddyfile
   ```

---

### ปัญหา: 503 Service Unavailable

**สาเหตุ:** Upstream services ไม่พร้อม

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

### ปัญหา: Connection Timeout

**สาเหตุ:** Timeout settings ต่ำเกินไป

**แก้ไข:**
เพิ่ม timeout ใน Caddyfile:
```caddyfile
transport http {
    read_timeout 90s
    write_timeout 90s
    dial_timeout 10s
    response_header_timeout 30s
}
```

---

### ปัญหา: Caddy ไม่สามารถเชื่อมต่อกับ Upstream

**ตรวจสอบ:**
```powershell
# ตรวจสอบว่า services ทำงานอยู่
netstat -ano | findstr ":8080 :3000 :3001"

# ตรวจสอบ health
.\scripts\check-services-health.ps1
```

**แก้ไข:**
1. เริ่ม services ที่ยังไม่ทำงาน
2. Restart Caddy

---

## Configuration Options

### Timeout Settings

```caddyfile
transport http {
    read_timeout 90s          # Timeout สำหรับอ่าน response
    write_timeout 90s         # Timeout สำหรับเขียน request
    dial_timeout 10s          # Timeout สำหรับเชื่อมต่อ
    response_header_timeout 30s  # Timeout สำหรับรับ headers
}
```

### Connection Pooling

```caddyfile
transport http {
    keepalive 30s                    # Keep connections alive
    keepalive_idle_conns 100         # Max idle connections
    keepalive_idle_conns_per_host 10 # Max idle connections per host
}
```

### Retry Logic

```caddyfile
reverse_proxy 127.0.0.1:8080 {
    fail_duration 5s        # Duration before marking as failed
    max_fails 3            # Max failures before marking unhealthy
    unhealthy_status 503 502 504  # Status codes that indicate unhealthy
}
```

### Health Checks

```caddyfile
reverse_proxy 127.0.0.1:8080 {
    health_uri /health           # Health check endpoint
    health_interval 5s          # Check interval
    health_timeout 3s           # Health check timeout
}
```

---

## Best Practices

1. **Always Check Health** - ใช้ health checks เพื่อหลีกเลี่ยงปัญหา
2. **Use Connection Pooling** - เพิ่มประสิทธิภาพด้วย connection reuse
3. **Set Appropriate Timeouts** - ป้องกัน timeout errors
4. **Monitor Logs** - ตรวจสอบ logs เมื่อมีปัญหา
5. **Use Production Build** - ใช้ production build ของ frontend เพื่อประสิทธิภาพที่ดีกว่า

---

## Additional Resources

- [Caddy Documentation](https://caddyserver.com/docs/)
- [Running Services Guide](./RUNNING_SERVICES.md)
- [Performance Optimization](./PERFORMANCE_OPTIMIZATION.md)

