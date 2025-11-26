# Fix 503 Service Unavailable Error

คู่มือการแก้ไขปัญหา HTTP 503 Service Unavailable ที่เกิดขึ้นบ่อยๆ

## 🔍 สาเหตุของปัญหา

503 Service Unavailable เกิดจาก:

1. **Services ไม่พร้อม** - Frontend/Backend ยังไม่พร้อมรับ request
2. **Health Checks ไม่ผ่าน** - Services ตอบสนองช้าหรือไม่ตอบสนอง
3. **Connection Issues** - Connection timeout หรือ connection pool หมด
4. **Resource Exhaustion** - Memory/CPU หมด
5. **Service Crashes** - Services crash และไม่ restart อัตโนมัติ

## ✅ วิธีแก้ไขที่ทำไปแล้ว

### 1. ปรับปรุง Caddy Configuration

#### เพิ่ม Timeout Settings
- `read_timeout`: 120s (เพิ่มจาก 90s)
- `write_timeout`: 120s (เพิ่มจาก 90s)
- `response_header_timeout`: 60s (เพิ่มจาก 30s)

#### เพิ่ม Connection Pooling
- `keepalive`: 60s (เพิ่มจาก 30s)
- `keepalive_idle_conns`: 200 (เพิ่มจาก 100)
- `keepalive_idle_conns_per_host`: 20 (เพิ่มจาก 10)

#### ปรับปรุง Retry Logic
- `max_fails`: 5 (เพิ่มจาก 3)
- `fail_duration`: 10s (เพิ่มจาก 5s)
- `try_duration`: 30s (ใหม่ - รอนานขึ้นก่อน mark unhealthy)
- `health_interval`: 3s (ลดจาก 5s - check บ่อยขึ้น)
- `health_status`: เพิ่ม 200, 301, 302, 307, 308

### 2. ปรับ Health Check Endpoints

- **Admin Frontend**: `/` แทน `/admin` (ง่ายกว่า)
- **Employee Frontend**: `/` แทน `/employee/login` (ง่ายกว่า)
- **API**: `/api/health` (เดิม)

### 3. สร้าง Monitoring Script

`scripts\monitor-services.ps1` - Monitor และ auto-restart services

## 🚀 การใช้งาน

### Restart Caddy ด้วย Configuration ใหม่

```powershell
.\scripts\restart-caddy.ps1
```

### Monitor Services อัตโนมัติ

```powershell
.\scripts\monitor-services.ps1
```

Script นี้จะ:
- ตรวจสอบ services ทุก 30 วินาที
- Restart services ที่ unhealthy หลังจาก 3 failures ติดต่อกัน
- แสดงสถานะ real-time

### ตรวจสอบ Health

```powershell
.\scripts\check-services-health.ps1
```

## 🔧 Troubleshooting

### ถ้ายังเจอ 503 บ่อยๆ

#### 1. ตรวจสอบว่า Services พร้อมหรือยัง

```powershell
# ตรวจสอบ ports
netstat -ano | findstr ":8080 :3000 :3001 :8088"

# ตรวจสอบ health
.\scripts\check-services-health.ps1
```

#### 2. Restart Services ทั้งหมด

```powershell
# หยุดทั้งหมด
taskkill /IM java.exe /F
taskkill /IM node.exe /F
taskkill /IM caddy.exe /F

# เริ่มใหม่
.\scripts\run-all.bat

# รอให้ services พร้อม
.\scripts\wait-for-services.ps1
```

#### 3. ใช้ Production Build

```powershell
# Admin Frontend
cd frontend\admin
npm run build
npm run start

# Employee Frontend
cd frontend\employee
npm run build
npm run start
```

#### 4. Monitor Services

```powershell
# เปิด monitor ใน window แยก
.\scripts\monitor-services.ps1
```

## 📊 Best Practices

### 1. รอให้ Services พร้อมก่อนใช้งาน

- **Backend**: รอ ~30-60 วินาที
- **Frontend**: รอ ~60-90 วินาที (ถ้า build)
- **Caddy**: รอ ~5-10 วินาที

### 2. ใช้ Production Build

Production build (`npm run build && npm run start`) มีประสิทธิภาพดีกว่า dev mode (`npm run dev`)

### 3. Monitor Services

ใช้ `monitor-services.ps1` เพื่อ auto-restart services ที่ crash

### 4. หลีกเลี่ยงการกดปุ่มซ้ำๆ

- รอ response ก่อนกดอีกครั้ง
- ใช้ loading indicators
- ป้องกัน double-click

### 5. ตรวจสอบ Resource Usage

```powershell
# ตรวจสอบ RAM/CPU usage
Get-Process | Where-Object {$_.ProcessName -match "java|node|caddy"} | Format-Table ProcessName, @{Name="CPU(%)";Expression={$_.CPU}}, @{Name="RAM(MB)";Expression={[math]::Round($_.WS/1MB,2)}}
```

## 🎯 Configuration Changes Summary

### Caddyfile Changes

| Setting | Old Value | New Value | Reason |
|---------|-----------|-----------|--------|
| `read_timeout` | 90s | 120s | ให้เวลามากขึ้นสำหรับ slow responses |
| `write_timeout` | 90s | 120s | ให้เวลามากขึ้นสำหรับ slow requests |
| `response_header_timeout` | 30s | 60s | ให้เวลามากขึ้นสำหรับ headers |
| `keepalive` | 30s | 60s | Keep connections alive นานขึ้น |
| `keepalive_idle_conns` | 100 | 200 | เพิ่ม connection pool |
| `keepalive_idle_conns_per_host` | 10 | 20 | เพิ่ม connections per host |
| `max_fails` | 3 | 5 | Retry มากขึ้นก่อน mark unhealthy |
| `fail_duration` | 5s | 10s | รอนานขึ้นก่อน mark failed |
| `health_interval` | 5s | 3s | Check บ่อยขึ้น |
| `try_duration` | - | 30s | รอนานขึ้นก่อน mark unhealthy |

## 📝 Additional Notes

- **Health Checks**: ปรับเป็น `/` สำหรับ frontend เพื่อให้ง่ายและเร็วขึ้น
- **Retry Logic**: เพิ่ม retry และ wait time เพื่อให้ services มีเวลา recover
- **Connection Pooling**: เพิ่ม pool size เพื่อรองรับ concurrent requests มากขึ้น

## 🔗 Related Documentation

- [Running Services Guide](./RUNNING_SERVICES.md)
- [Performance Optimization](./PERFORMANCE_OPTIMIZATION.md)
- [Caddy Setup](./CADDY_SETUP.md)
- [Cloudflare Setup](./CLOUDFLARE_SETUP.md)



