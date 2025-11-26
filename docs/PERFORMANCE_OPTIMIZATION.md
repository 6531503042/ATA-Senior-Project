# Performance Optimization Guide

## ปัญหา HTTP 503 Service Unavailable

### สาเหตุที่พบบ่อย:
1. **Frontend services ไม่พร้อม** - Next.js dev server อาจยังไม่พร้อมรับ request เมื่อ startup
2. **Connection pooling ไม่มี** - ไม่มี connection reuse ทำให้ช้า
3. **ไม่มี retry logic** - เมื่อ service ไม่พร้อม Caddy จะ return 503 ทันที
4. **Health checks ไม่ทำงานดีพอ** - ไม่รู้ว่า service พร้อมหรือยัง
5. **ไม่มี caching** - ไม่มี caching สำหรับ static assets

### วิธีแก้ไขที่ทำไปแล้ว:

#### 1. Caddy Configuration (`Caddyfile`)
- ✅ เพิ่ม **connection pooling** (`keepalive`, `keepalive_idle_conns`)
- ✅ เพิ่ม **retry logic** (`max_fails`, `fail_duration`)
- ✅ เพิ่ม **health checks** (`health_uri`, `health_interval`)
- ✅ เพิ่ม **timeout settings** (read/write/dial timeouts)
- ✅ เพิ่ม **buffer settings** (`buffer_requests`, `flush_interval`)
- ✅ เพิ่ม **static assets caching**

#### 2. Service Health Checks
- ✅ สร้าง script `scripts/check-services-health.ps1` สำหรับตรวจสอบ health

### การใช้งาน:

#### ตรวจสอบ Health ของ Services:
```powershell
.\scripts\check-services-health.ps1
```

#### Restart Services:
```powershell
.\scripts\run-all.bat
```

### Best Practices:

1. **รอให้ Services พร้อมก่อนใช้งาน**
   - Backend: รอ ~30-60 วินาที
   - Frontend: รอ ~60-90 วินาที (ถ้า build)
   - Caddy: รอ ~5-10 วินาที

2. **ตรวจสอบ Health ก่อนใช้งาน**
   ```powershell
   .\scripts\check-services-health.ps1
   ```

3. **หลีกเลี่ยงการกดปุ่มซ้ำๆ**
   - รอ response ก่อนกดอีกครั้ง
   - ใช้ loading indicators

4. **Monitor Resource Usage**
   - ตรวจสอบ RAM/CPU usage
   - ปิด services ที่ไม่ใช้

### Troubleshooting:

#### ถ้ายังเจอ 503:
1. ตรวจสอบว่า services ทำงานอยู่:
   ```powershell
   netstat -ano | findstr ":8080 :3000 :3001 :8088"
   ```

2. ตรวจสอบ health:
   ```powershell
   .\scripts\check-services-health.ps1
   ```

3. Restart services:
   ```powershell
   .\scripts\run-all.bat
   ```

4. ตรวจสอบ logs:
   - Backend: ดูใน window ที่ run `gradlew bootRun`
   - Frontend: ดูใน window ที่ run `npm run start`
   - Caddy: ดูใน window ที่ run `caddy.exe run`

### Performance Tips:

1. **ใช้ Production Build**
   - `npm run build && npm run start` แทน `npm run dev`
   - Production build เร็วกว่า dev mode

2. **เพิ่ม Memory Limit**
   - `NODE_OPTIONS=--max-old-space-size=2048`

3. **ปิด Services ที่ไม่ใช้**
   - ปิด browser tabs ที่ไม่ใช้
   - ปิด extensions ที่ไม่จำเป็น

4. **ใช้ Static Assets Caching**
   - Caddy จะ cache static assets อัตโนมัติ

### Monitoring:

- ตรวจสอบ response time
- ตรวจสอบ error rate
- ตรวจสอบ resource usage



