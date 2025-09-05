#!/bin/bash

# ATA Senior Project Build Script
# This script builds all components of the ATA project

set -e  # Exit on any error

echo "🚀 Starting ATA Senior Project Build Process..."
echo "================================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required tools
echo "🔍 Checking required tools..."
if ! command_exists bun; then
    echo "❌ Bun is not installed. Please install Bun first."
    exit 1
fi

if ! command_exists docker; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ All required tools are available."

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if [ -f "scripts/package.json" ]; then
    cd scripts && bun install && cd ..
fi

# Install project dependencies
echo "📦 Installing project dependencies..."
node scripts/ata.js install

# Build Backend
echo ""
echo "☕ Building Backend (Spring Boot WebFlux)..."
cd backend/main
./gradlew build --no-daemon
if [ $? -ne 0 ]; then
    echo "❌ Failed to build backend"
    exit 1
fi
cd ../..
echo "✅ Backend built successfully"

# Build Admin Frontend
echo ""
echo "⚛️  Building Admin Frontend (Next.js)..."
cd frontend/admin
bun run build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build admin frontend"
    exit 1
fi
cd ../..
echo "✅ Admin Frontend built successfully"

# Build Employee Frontend
echo ""
echo "👤 Building Employee Frontend (Next.js)..."
cd frontend/employee
bun run build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build employee frontend"
    exit 1
fi
cd ../..
echo "✅ Employee Frontend built successfully"

# Build Docker Images
echo ""
echo "🐳 Building Docker Images..."
docker compose build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build Docker images"
    exit 1
fi
echo "✅ Docker images built successfully"

echo ""
echo "🎉 Build process completed successfully!"
echo "================================================"
echo ""
echo "💡 Available commands:"
echo "   • ./build.sh          - Build all components"
echo "   • node scripts/ata.js dev     - Start development servers"
echo "   • node scripts/ata.js docker  - Docker operations"
echo "   • docker compose up -d        - Start all services"
echo ""
echo "🌐 Services will be available at:"
echo "   • Backend API:        http://localhost:8080"
echo "   • Admin Frontend:     http://localhost:3000"
echo "   • Employee Frontend:  http://localhost:3001"
echo "   • PostgreSQL:         localhost:5432"
echo "   • Redis:              localhost:6379"