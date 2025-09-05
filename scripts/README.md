# ATA Project Scripts

Scripts สำหรับจัดการและรัน ATA Senior Project ได้อย่างง่ายดาย

## 🚀 การติดตั้ง

```bash
# ติดตั้ง dependencies ทั้งหมด
ata install
# หรือ
ata i
```

## 📋 Commands ที่ใช้ได้

### `ata dev`
เริ่มต้น development servers ต่างๆ

```bash
ata dev
```

**ตัวเลือกที่ใช้ได้:**
- 🐳 **Docker Compose** - รัน services ทั้งหมดผ่าน Docker
- ☕ **Spring Boot Backend** - รัน WebFlux backend
- ⚛️ **Admin Frontend** - รัน Next.js admin panel
- 👤 **Employee Frontend** - รัน Next.js employee portal
- 🚀 **All Frontend Services** - รัน frontend ทั้งหมดพร้อมกัน
- 🔧 **Backend Build & Run** - Build และรัน backend

### `ata install` / `ata i`
ติดตั้ง dependencies สำหรับทุกโปรเจค

```bash
ata install
# หรือ
ata i
```

**สิ่งที่ทำ:**
- ติดตั้ง dependencies สำหรับ Admin Frontend
- ติดตั้ง dependencies สำหรับ Employee Frontend  
- Build Backend project

### `ata build`
Build ทุกโปรเจค

```bash
ata build
```

**สิ่งที่ทำ:**
- Build Backend (Gradle)
- Build Admin Frontend (Next.js)
- Build Employee Frontend (Next.js)

### `ata clean`
ลบ build artifacts และ dependencies

```bash
ata clean
```

**สิ่งที่ทำ:**
- Clean Backend build files
- ลบ node_modules และ .next สำหรับ frontend ทั้งหมด

## 🎯 ตัวอย่างการใช้งาน

### เริ่มต้นโปรเจคใหม่
```bash
# 1. ติดตั้ง dependencies
ata install

# 2. เริ่ม development
ata dev
```

### Development workflow
```bash
# รัน backend เท่านั้น
ata dev
# เลือก "Spring Boot Backend (WebFlux)"

# รัน frontend เท่านั้น  
ata dev
# เลือก "All Frontend Services"

# รันทุกอย่างผ่าน Docker
ata dev
# เลือก "Docker Compose (All Services)"
```

### Build และ Deploy
```bash
# Build ทุกโปรเจค
ata build

# Clean และติดตั้งใหม่
ata clean
ata install
```

## 📁 โครงสร้างโปรเจค

```
ATA-Senior-Project/
├── backend/main/          # Spring Boot WebFlux Backend
├── frontend/admin/        # Next.js Admin Panel
├── frontend/employee/     # Next.js Employee Portal
└── scripts/              # ATA Scripts
    ├── ata.js           # Main script
    └── commands/        # Command implementations
```

## 🔧 Requirements

- **Node.js** (สำหรับรัน scripts)
- **Bun** (สำหรับ frontend dependencies)
- **Java 21** (สำหรับ backend)
- **Docker** (สำหรับ containerized services)

## 💡 Tips

- ใช้ `ata dev` แทนการ cd เข้าไปในแต่ละโฟลเดอร์
- `ata install` จะติดตั้ง dependencies ทั้งหมดในครั้งเดียว
- `ata clean` ช่วยแก้ปัญหา dependency conflicts
- `ata build` ใช้สำหรับ production builds
