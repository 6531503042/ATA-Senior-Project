#!/bin/bash

# Simple database setup script for ATA Senior Project
# This script works with your existing PostgreSQL installation

set -e

echo "🚀 Setting up ATA Senior Project Database..."

# Database configuration
DB_NAME="senior"
DB_USER="postgres"
DB_PASSWORD="0947044119"
DB_HOST="localhost"
DB_PORT="5432"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if PostgreSQL is running
check_postgres() {
    echo "Checking PostgreSQL connection..."
    if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
        print_status "PostgreSQL is running and accessible"
        return 0
    else
        print_error "Cannot connect to PostgreSQL. Please ensure PostgreSQL is running."
        echo "Try: brew services start postgresql@17"
        return 1
    fi
}

# Create database if it doesn't exist
create_database() {
    echo "Setting up database..."
    
    # Check if database exists
    if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1; then
        print_warning "Database '$DB_NAME' already exists"
        read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Dropping existing database..."
            PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
        else
            print_status "Using existing database"
            return 0
        fi
    fi
    
    # Create database
    print_status "Creating database '$DB_NAME'..."
    PGPASSWORD=$DB_PASSWORD createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
    
    print_status "Database created successfully!"
}

# Enable pgcrypto extension
enable_pgcrypto() {
    echo "Enabling pgcrypto extension..."
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;" > /dev/null 2>&1
    print_status "pgcrypto extension enabled"
}

# Test database connection
test_connection() {
    echo "Testing database connection..."
    if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
        print_status "Database connection successful!"
        return 0
    else
        print_error "Database connection failed"
        return 1
    fi
}

# Main execution
main() {
    echo "=========================================="
    echo "ATA Senior Project Database Setup"
    echo "=========================================="
    echo
    
    # Check PostgreSQL
    if ! check_postgres; then
        exit 1
    fi
    
    # Create database
    create_database
    
    # Enable pgcrypto
    enable_pgcrypto
    
    # Test connection
    if test_connection; then
        echo
        echo "=========================================="
        print_status "Database setup completed successfully!"
        echo "=========================================="
        echo
        echo "Database Details:"
        echo "  Host: $DB_HOST"
        echo "  Port: $DB_PORT"
        echo "  Database: $DB_NAME"
        echo "  Username: $DB_USER"
        echo "  Password: $DB_PASSWORD"
        echo
        echo "Next steps:"
        echo "1. Start your backend: cd Backend/main && ./gradlew bootRun"
        echo "2. The migrations will automatically create users and roles"
        echo "3. Test login with admin/admin123 or user/user123"
        echo
    else
        print_error "Database setup failed"
        exit 1
    fi
}

# Run main function
main "$@"
