#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting HR Feedback System Services${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Error: Docker is not running. Please start Docker and try again.${NC}"
  exit 1
fi

# Create necessary directories if they don't exist
echo -e "${YELLOW}Creating necessary directories...${NC}"
mkdir -p docker-scripts backend/feedback-scoring-service/models

# Ensure scripts are executable
echo -e "${YELLOW}Making scripts executable...${NC}"
chmod +x docker-scripts/create-multiple-postgresql-databases.sh

# Start all services with Docker Compose
echo -e "${YELLOW}Starting services with Docker Compose...${NC}"
docker-compose up -d

# Check if services are up
echo -e "${YELLOW}Checking service health...${NC}"

# Function to check service health
check_service() {
  local service=$1
  local port=$2
  local endpoint=$3
  local max_attempts=30
  local attempt=1
  
  echo -e "Waiting for ${service} to be ready..."
  
  while [ $attempt -le $max_attempts ]; do
    if curl -s "http://localhost:${port}${endpoint}" > /dev/null; then
      echo -e "${GREEN}${service} is ready!${NC}"
      return 0
    fi
    
    attempt=$((attempt+1))
    sleep 2
  done
  
  echo -e "${RED}${service} did not become ready within the expected time.${NC}"
  return 1
}

# Check each service
check_service "Discovery Service" "8087" "/actuator/health" || true
check_service "User Service" "8081" "/actuator/health" || true
check_service "Feedback Service" "8084" "/actuator/health" || true
check_service "Feedback Scoring Service" "8085" "/health" || true
check_service "Frontend" "3000" "/" || true

echo -e "${GREEN}All services have been started!${NC}"
echo -e "${YELLOW}You can access the frontend at:${NC} http://localhost:3000"
echo -e "${YELLOW}Eureka Dashboard:${NC} http://localhost:8087"

# Show running containers
echo -e "\n${YELLOW}Running containers:${NC}"
docker-compose ps 