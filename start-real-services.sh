#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
  echo -e "\n${BOLD}${BLUE}==== $1 ====${NC}"
}

# Function to print status messages
print_status() {
  echo -e "${YELLOW}$1${NC}"
}

# Function to print success messages
print_success() {
  echo -e "${GREEN}$1${NC}"
}

# Function to print error messages
print_error() {
  echo -e "${RED}$1${NC}"
}

# Function to check and display container logs if health check fails
check_container_logs() {
  local service=$1
  print_error "Displaying last 50 lines of logs from $service to help diagnose issues:"
  docker logs --tail 50 $service
}

print_header "Starting HR Feedback Management System"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  print_error "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
  print_error "Docker Compose is not installed. Please install it and try again."
  exit 1
fi

# Stop any existing containers to avoid conflicts
print_status "Stopping any existing containers..."
docker-compose down

# Remove existing volumes if you want a clean start
print_status "Do you want to remove existing database volumes for a clean start? (y/n)"
read -r clean_start
if [[ "$clean_start" =~ ^[Yy]$ ]]; then
  print_status "Removing database volumes..."
  docker volume rm ata-senior-project_postgres-data ata-senior-project_mongodb-data 2>/dev/null || true
fi

# Build the services
print_header "Building Services"
print_status "Building all services (this may take a few minutes)..."
docker-compose build || { print_error "Build failed. Check the errors above."; exit 1; }

# Start the services
print_header "Starting Services"
print_status "Starting all services..."
docker-compose up -d

# Function to check service health
check_health() {
  local service=$1
  local max_attempts=$2
  local attempt=0
  local status=""
  
  print_status "Checking $service health..."
  
  while [ $attempt -lt $max_attempts ]; do
    # Check if container exists
    if ! docker ps -q -f name=$service | grep -q .; then
      print_error "Container $service does not exist or is not running!"
      print_status "Checking container status..."
      docker ps -a -f name=$service
      return 1
    fi
    
    status=$(docker inspect --format='{{.State.Health.Status}}' $service 2>/dev/null || echo "container not found")
    
    if [ "$status" = "healthy" ]; then
      print_success "$service is healthy!"
      return 0
    elif [ "$status" = "unhealthy" ]; then
      print_error "$service is unhealthy!"
      check_container_logs $service
      return 1
    fi
    
    attempt=$((attempt+1))
    print_status "Waiting for $service to be healthy ($attempt/$max_attempts)..."
    sleep 10
  done
  
  print_error "$service did not become healthy within the expected time."
  check_container_logs $service
  return 1
}

print_header "Checking Service Health"
print_status "This may take several minutes as the database is initialized and services start up."

# Check database services first
print_status "Checking database services..."
check_health postgres 12 || { print_error "Postgres database failed to start properly. See logs above."; exit 1; }
check_health mongodb 12 || { print_error "MongoDB failed to start properly. See logs above."; exit 1; }

# Check discovery service next
print_status "Checking discovery service..."
check_health discovery-service 12 || { print_error "Discovery service failed to start properly. See logs above."; exit 1; }

# Check backend services
print_status "Checking backend services..."
check_health user-service 18 || { print_error "User service failed to start properly. See logs above."; exit 1; }
check_health feedback-service 18 || { print_error "Feedback service failed to start properly. See logs above."; exit 1; }
check_health feedback-scoring-service 6 || { print_error "Feedback scoring service failed to start properly. See logs above."; exit 1; }

# Check frontend
print_status "Checking frontend service..."
check_health frontend 6 || { print_status "Frontend container does not have health checks, but should be available if running."; }

# Show running containers
print_header "Services Status"
docker-compose ps

print_header "System Ready"
print_success "All services have been started successfully!"
print_success "You can access the application at http://localhost:3000"
print_status "Use the following credentials to log in:"
echo -e "  ${BOLD}Admin:${NC} username: admin, password: admin123"
echo -e "  ${BOLD}Users:${NC} username: john/jane/bob/alice/charlie, password: password123"
echo
print_status "To view logs from a specific service:"
echo -e "  docker logs -f [service-name]"
echo
print_status "To stop all services:"
echo -e "  docker-compose down" 