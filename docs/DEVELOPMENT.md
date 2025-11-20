# ATA Senior Project - Development Guide

คู่มือการพัฒนา ATA Senior Project ที่มี 3 services หลัก: Backend, Admin Frontend, และ Employee Frontend

## 🏗️ โครงสร้างโปรเจค

```
ATA-Senior-Project/
├── backend/main/          # Spring Boot WebFlux Backend
├── frontend/admin/        # Next.js Admin Panel
├── frontend/employee/     # Next.js Employee Portal
├── scripts/              # ATA Management Scripts
├── build.sh              # Complete Build Script
├── dev.sh                # Development Helper Script
└── docker-compose.yml    # Docker Services Configuration
```

## 🚀 Quick Start

### 1. การติดตั้งครั้งแรก
```bash
# ติดตั้ง dependencies ทั้งหมด
./build.sh

# หรือใช้ ata script
node scripts/ata.js install
```

### 2. การรัน Development
```bash
# ใช้ interactive script
./dev.sh

# หรือใช้ ata script
node scripts/ata.js dev
```

### 3. การรันด้วย Docker
```bash
# รันทุก services ด้วย Docker
docker compose up -d

# หรือใช้ ata script
node scripts/ata.js docker
```

## 📋 Available Commands

### ATA Scripts (`node scripts/ata.js <command>`)

| Command | Description |
|---------|-------------|
| `dev` | Start development servers (interactive menu) |
| `install` | Install all dependencies |
| `build` | Build all projects |
| `clean` | Clean build artifacts |
| `docker` | Docker operations (interactive menu) |
| `full-build` | Run complete build process (includes Docker) |

### Build Script (`./build.sh`)
- Build ทั้ง 3 services (Backend, Admin, Employee)
- Build Docker images
- ตรวจสอบ dependencies
- แสดง URLs ของ services

### Development Script (`./dev.sh`)
- Interactive menu สำหรับ development workflow
- รองรับการรัน services แยกกันหรือรวมกัน
- จัดการ Docker services
- ดู logs และ status

## 🐳 Docker Services

### Services ที่รันใน Docker:
1. **Backend** (Spring Boot WebFlux) - Port 8080
2. **Admin Frontend** (Next.js) - Port 3000  
3. **Employee Frontend** (Next.js) - Port 3001
4. **PostgreSQL** - Port 5432
5. **Redis** - Port 6379

### Docker Commands:
```bash
# Build และ start ทุก services
docker compose up -d

# Build images ใหม่
docker compose build

# ดู status
docker compose ps

# ดู logs
docker compose logs -f [service-name]

# Stop services
docker compose down

# Clean up (ลบ volumes และ networks)
docker compose down -v --remove-orphans
```

## 🔧 Development Workflows

### 1. Full Docker Development
```bash
# Build และ start ทุกอย่าง
./build.sh
docker compose up -d
```

### 2. Local Development
```bash
# ติดตั้ง dependencies
node scripts/ata.js install

# รัน backend
node scripts/ata.js dev
# เลือก "Spring Boot Backend (WebFlux)"

# รัน frontend (terminal ใหม่)
node scripts/ata.js dev  
# เลือก "All Frontend Services"
```

### 3. Mixed Development
```bash
# รัน databases ด้วย Docker
docker compose up -d postgres redis

# รัน applications locally
node scripts/ata.js dev
```

## 🌐 Service URLs

เมื่อ services รันแล้ว จะเข้าถึงได้ที่:

- **Backend API**: http://localhost:8080
- **Admin Frontend**: http://localhost:3000
- **Employee Frontend**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🛠️ Requirements

- **Node.js** (v18+)
- **Bun** (สำหรับ frontend dependencies)
- **Java 21** (สำหรับ backend)
- **Docker** (สำหรับ containerized services)
- **Docker Compose** (สำหรับ multi-service setup)

## 📁 Docker Images

### Backend Image
- **Base**: `openjdk:21-jre-slim`
- **Build**: Multi-stage build with Gradle
- **Health Check**: `/actuator/health`

### Frontend Images (Admin & Employee)
- **Base**: `oven/bun:1`
- **Build**: Multi-stage build with Next.js
- **Health Check**: `/api/health`

## 🔍 Troubleshooting

### Common Issues:

1. **Port conflicts**: ตรวจสอบว่า ports 8080, 3000, 3001, 5432, 6379 ว่าง
2. **Docker issues**: รัน `docker compose down` แล้วลองใหม่
3. **Build failures**: รัน `node scripts/ata.js clean` แล้วติดตั้งใหม่
4. **Database connection**: ตรวจสอบว่า PostgreSQL container รันอยู่

### Useful Commands:
```bash
# ดู Docker logs
docker compose logs -f

# ดู service status
docker compose ps

# Clean และ rebuild
node scripts/ata.js clean
./build.sh

# Reset Docker environment
docker compose down -v --remove-orphans
docker system prune -f
```

## 💡 Tips

- ใช้ `./dev.sh` สำหรับ development workflow ที่ง่าย
- ใช้ `./build.sh` สำหรับ production builds
- ใช้ `node scripts/ata.js docker` สำหรับ Docker management
- ตรวจสอบ logs ด้วย `docker compose logs -f [service]`
- ใช้ `docker compose ps` เพื่อดู service status
