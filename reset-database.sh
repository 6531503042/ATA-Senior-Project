#!/bin/bash

echo "🔄 Resetting ATA Database and Users..."

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker compose down -v

# Remove database volumes
echo "🗑️  Removing database volumes..."
docker volume rm ata-senior-project_pg-data ata-senior-project_redis-data 2>/dev/null || true

# Start services
echo "🚀 Starting services..."
docker compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Wait for PostgreSQL to be ready
echo "🔍 Waiting for PostgreSQL..."
until docker exec ata-it-postgres pg_isready -U postgres; do
  echo "PostgreSQL not ready, waiting..."
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Start backend to run migrations
echo "🏗️  Starting backend to run migrations..."
docker compose up -d backend

# Wait for backend to complete migrations
echo "⏳ Waiting for migrations to complete..."
sleep 15

# Test login with admin user
echo "🧪 Testing admin login..."
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

if echo "$ADMIN_RESPONSE" | grep -q "token"; then
  echo "✅ Admin login successful!"
else
  echo "❌ Admin login failed: $ADMIN_RESPONSE"
fi

# Test login with regular user
echo "🧪 Testing user login..."
USER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"user123"}')

if echo "$USER_RESPONSE" | grep -q "token"; then
  echo "✅ User login successful!"
else
  echo "❌ User login failed: $USER_RESPONSE"
fi

echo "🎉 Database reset complete!"
echo ""
echo "📋 Login Credentials:"
echo "   Admin: username=admin, password=admin123"
echo "   User:  username=user,  password=user123"
echo ""
echo "🌐 Services:"
echo "   Backend: http://localhost:8080"
echo "   Admin Frontend: http://localhost:3000"
echo "   Employee Frontend: http://localhost:3001"
