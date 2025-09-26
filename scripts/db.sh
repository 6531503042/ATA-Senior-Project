#!/bin/bash

# Database management script for ATA Senior Project

case "$1" in
    "start")
        echo "Starting PostgreSQL with Docker Compose..."
        docker-compose up -d postgres
        echo "Waiting for PostgreSQL to be ready..."
        sleep 10
        echo "PostgreSQL is ready!"
        echo "Database: senior"
        echo "User: postgres"
        echo "Password: 0947044119"
        echo "Port: 5432"
        ;;
    "stop")
        echo "Stopping PostgreSQL..."
        docker-compose down
        ;;
    "restart")
        echo "Restarting PostgreSQL..."
        docker-compose down
        docker-compose up -d postgres
        sleep 10
        echo "PostgreSQL restarted!"
        ;;
    "reset")
        echo "Resetting database (WARNING: This will delete all data)..."
        docker-compose down -v
        docker-compose up -d postgres
        sleep 10
        echo "Database reset complete!"
        ;;
    "logs")
        docker-compose logs -f postgres
        ;;
    "status")
        docker-compose ps
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|reset|logs|status}"
        echo ""
        echo "Commands:"
        echo "  start   - Start PostgreSQL database"
        echo "  stop    - Stop PostgreSQL database"
        echo "  restart - Restart PostgreSQL database"
        echo "  reset   - Reset database (delete all data)"
        echo "  logs    - Show database logs"
        echo "  status  - Show container status"
        exit 1
        ;;
esac
