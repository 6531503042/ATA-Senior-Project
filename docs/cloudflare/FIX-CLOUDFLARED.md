# วิธีแก้ปัญหา Cloudflared ถูก Windows Defender บล็อค

## ปัญหา
Windows Defender บล็อค `cloudflared.exe` เพราะคิดว่าเป็นไวรัส (false positive)

## วิธีแก้ (เลือกวิธีใดวิธีหนึ่ง)

### วิธีที่ 1: เพิ่ม Exception ใน Windows Defender (แนะนำ)

1. เปิด **Windows Security**
   - กด `Win + I` → **Update & Security** → **Windows Security**
   - หรือค้นหา "Windows Security" ใน Start Menu

2. ไปที่ **Virus & threat protection**
   - คลิก **Manage settings** (ภายใต้ Virus & threat protection settings)

3. เพิ่ม Exclusion
   - เลื่อนลงไปหา **Exclusions**
   - คลิก **Add or remove exclusions**
   - คลิก **Add an exclusion** → เลือก **Folder**
   - เลือกโฟลเดอร์: `C:\Users\Administrator\Desktop\ATA-Senior-Project`

4. รัน Cloudflared อีกครั้ง
   ```powershell
   .\cloudflared.exe tunnel --url http://127.0.0.1:8088
   ```

### วิธีที่ 2: ใช้ PowerShell Script (ต้องรันเป็น Admin)

```powershell
# รัน PowerShell เป็น Administrator ก่อน
Set-ExecutionPolicy Bypass -Scope Process
.\start-cloudflared.ps1
```

### วิธีที่ 3: ดาวน์โหลดและติดตั้งแบบ Manual

1. ไปที่: https://github.com/cloudflare/cloudflared/releases/latest
2. ดาวน์โหลด `cloudflared-windows-amd64.exe`
3. เปลี่ยนชื่อเป็น `cloudflared.exe`
4. วางไว้ในโฟลเดอร์โปรเจกต์
5. เพิ่ม Exception ใน Windows Defender (ตามวิธีที่ 1)
6. รัน: `.\cloudflared.exe tunnel --url http://127.0.0.1:8088`

## สถานะ Reverse Proxy

Reverse Proxy (Caddy) ทำงานได้แล้ว! คุณสามารถใช้ Local URLs ได้:

- **Admin**: http://127.0.0.1:8088/admin
- **Employee**: http://127.0.0.1:8088/employee  
- **API**: http://127.0.0.1:8088/api

Public URL จะแสดงเมื่อ Cloudflared ทำงานได้

