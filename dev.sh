#!/bin/bash

# ATA Senior Project Development Script
# This script provides easy development workflow options

set -e  # Exit on any error

echo "🚀 ATA Senior Project Development Helper"
echo "========================================"

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

# Show menu
echo ""
echo "What would you like to do?"
echo "1) 🐳 Start all services with Docker"
echo "2) 🔧 Build and start all services with Docker"
echo "3) ☕ Start Backend only (local)"
echo "4) ⚛️  Start Admin Frontend only (local)"
echo "5) 👤 Start Employee Frontend only (local)"
echo "6) 🚀 Start all Frontend services (local)"
echo "7) 📦 Install all dependencies"
echo "8) 🧹 Clean and rebuild everything"
echo "9) 📊 View Docker service status"
echo "10) 📋 View Docker logs"
echo "11) 🛑 Stop all Docker services"
echo ""

read -p "Enter your choice (1-11): " choice

case $choice in
    1)
        echo "🐳 Starting all services with Docker..."
        docker compose up -d
        echo "✅ Services started! Check status with: docker compose ps"
        ;;
    2)
        echo "🔧 Building and starting all services with Docker..."
        docker compose build
        docker compose up -d
        echo "✅ Services built and started!"
        ;;
    3)
        echo "☕ Starting Backend (Spring Boot WebFlux)..."
        cd backend/main
        ./gradlew bootRun
        ;;
    4)
        echo "⚛️  Starting Admin Frontend (Next.js)..."
        cd frontend/admin
        bun run dev
        ;;
    5)
        echo "👤 Starting Employee Frontend (Next.js)..."
        cd frontend/employee
        bun run dev
        ;;
    6)
        echo "🚀 Starting all Frontend services..."
        echo "Starting Admin Frontend..."
        cd frontend/admin
        bun run dev &
        ADMIN_PID=$!
        cd ../employee
        echo "Starting Employee Frontend..."
        bun run dev &
        EMPLOYEE_PID=$!
        echo "✅ Both frontend services started!"
        echo "Press Ctrl+C to stop all services"
        wait $ADMIN_PID $EMPLOYEE_PID
        ;;
    7)
        echo "📦 Installing all dependencies..."
        node scripts/ata.js install
        ;;
    8)
        echo "🧹 Cleaning and rebuilding everything..."
        node scripts/ata.js clean
        node scripts/ata.js install
        ./build.sh
        ;;
    9)
        echo "📊 Docker service status:"
        docker compose ps
        ;;
    10)
        echo "📋 Which service logs do you want to view?"
        echo "1) All services"
        echo "2) Backend"
        echo "3) Admin Frontend"
        echo "4) Employee Frontend"
        echo "5) PostgreSQL"
        echo "6) Redis"
        read -p "Enter your choice (1-6): " log_choice
        
        case $log_choice in
            1) docker compose logs -f ;;
            2) docker compose logs -f backend ;;
            3) docker compose logs -f admin-frontend ;;
            4) docker compose logs -f employee-frontend ;;
            5) docker compose logs -f postgres ;;
            6) docker compose logs -f redis ;;
            *) echo "Invalid choice" ;;
        esac
        ;;
    11)
        echo "🛑 Stopping all Docker services..."
        docker compose down
        echo "✅ All services stopped!"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🌐 Services URLs:"
echo "   • Backend API:        http://localhost:8080"
echo "   • Admin Frontend:     http://localhost:3000"
echo "   • Employee Frontend:  http://localhost:3001"
echo "   • PostgreSQL:         localhost:5432"
echo "   • Redis:              localhost:6379"
