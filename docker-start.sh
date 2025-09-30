#!/bin/bash

# Docker Start Script for ATA Senior Project
echo "🚀 Starting ATA Senior Project with Docker..."

# ตรวจสอบว่า Docker running หรือไม่
if ! docker --version &> /dev/null; then
    echo "❌ Docker is not installed or not running. Please install Docker first."
    exit 1
fi

# ตรวจสอบว่า Docker Compose installed หรือไม่
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are ready"

# สร้าง .env file ถ้ายังไม่มี
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database Configuration
POSTGRES_DB=senior
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123

# Backend Configuration
SPRING_PROFILES_ACTIVE=docker
BACKEND_PORT=8080

# Frontend Configuration
ADMIN_PORT=3000
EMPLOYEE_PORT=3001

# PgAdmin Configuration
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin123
EOF
    echo "✅ .env file created"
fi

# Stop และ remove containers ถ้ามี
echo "🧹 Cleaning up existing containers..."
docker compose down --remove-orphans

# Remove old volumes (optional - ถามผู้ใช้ก่อน)
read -p "🗑️  Do you want to remove old database volumes? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing old volumes..."
    docker volume rm ata-senior-project_postgres_data 2>/dev/null || true
    docker volume rm ata-senior-project_pgadmin_data 2>/dev/null || true
fi

# Build และ start services
echo "🔨 Building and starting services..."
docker compose up --build -d

# รอให้ services พร้อม
echo "⏳ Waiting for services to be ready..."
echo "   - PostgreSQL (port 5433)"
echo "   - Backend (port 8080)"
echo "   - Admin Frontend (port 3000)"
echo "   - Employee Frontend (port 3001)"
echo "   - PgAdmin (port 5051)"

# ตรวจสอบ health ของ services
echo "🔍 Checking service health..."
sleep 10

# ตรวจสอบ PostgreSQL
if docker compose exec postgres pg_isready -U postgres -d senior &> /dev/null; then
    echo "✅ PostgreSQL is ready"
else
    echo "⚠️  PostgreSQL is not ready yet, may need more time"
fi

# ตรวจสอบ Backend
if curl -f http://localhost:8080/actuator/health &> /dev/null; then
    echo "✅ Backend is ready"
else
    echo "⚠️  Backend is starting up, may need more time"
fi

echo ""
echo "🎉 Services are starting up!"
echo ""
echo "📋 Access URLs:"
echo "   Admin Frontend:    http://localhost:3000"
echo "   Employee Frontend: http://localhost:3001"
echo "   Backend API:       http://localhost:8080"
echo "   PgAdmin:          http://localhost:5051"
echo "   PostgreSQL:       localhost:5433"
echo ""
echo "🔐 Default Login Credentials:"
echo "   Username: admin"
echo "   Password: Passw0rd!"
echo ""
echo "📊 Database Connection:"
echo "   Host: localhost"
echo "   Port: 5433"
echo "   Database: senior"
echo "   Username: postgres"
echo "   Password: postgres123"
echo ""
echo "🛠️  Useful Commands:"
echo "   View logs:     docker compose logs -f"
echo "   Stop services: docker compose down"
echo "   Restart:       docker compose restart"
echo ""
echo "✨ Happy coding! ✨"
