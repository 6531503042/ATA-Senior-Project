#!/bin/bash
set -e

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting HR Feedback Management System with Traefik${NC}"

# Function to check if Docker is running
check_docker() {
  if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker and try again.${NC}"
    exit 1
  fi
  echo -e "${GREEN}Docker is running.${NC}"
}

# Check Docker
check_docker

# Generate certificates if needed
if [ ! -f ./certs/localhost.crt ] || [ ! -f ./certs/localhost.key ]; then
  echo -e "${YELLOW}Generating self-signed certificates...${NC}"
  chmod +x ./generate-certs.sh
  ./generate-certs.sh
else
  echo -e "${GREEN}Certificates already exist.${NC}"
fi

# Function to display container logs
show_logs() {
  local container_name=$1
  local lines=${2:-50}
  
  echo -e "${BLUE}=== Logs for $container_name (last $lines lines) ===${NC}"
  docker logs --tail $lines $container_name
  echo -e "${BLUE}=== End of logs for $container_name ===${NC}"
}

# Function to clean up
clean_up() {
  echo -e "${YELLOW}Cleaning up containers...${NC}"
  docker-compose down
  echo -e "${GREEN}Clean up complete.${NC}"
}

# Function to build a specific service
build_service() {
  local service_name=$1
  local critical=${2:-true}
  
  echo -e "${YELLOW}Building $service_name...${NC}"
  if ! docker-compose build --no-cache $service_name; then
    echo -e "${RED}Failed to build $service_name. Check Dockerfile and try again.${NC}"
    
    if [ "$critical" = "true" ]; then
      return 1
    else
      echo -e "${YELLOW}Non-critical service, continuing anyway...${NC}"
      return 0
    fi
  fi
  
  echo -e "${GREEN}Successfully built $service_name.${NC}"
  return 0
}

# Trap for clean exit
trap clean_up INT

# Build each service individually
echo -e "${YELLOW}Building services one by one...${NC}"

# Build core infrastructure first
if ! build_service traefik; then
  echo -e "${RED}Failed to build core infrastructure. Exiting.${NC}"
  exit 1
fi

if ! build_service postgres; then
  echo -e "${RED}Failed to build database. Exiting.${NC}"
  exit 1
fi

if ! build_service mongodb; then
  echo -e "${RED}Failed to build MongoDB. Exiting.${NC}"
  exit 1
fi

# Build Java services with more careful error handling
echo -e "${YELLOW}Building Spring Boot services...${NC}"
for service in discovery-service user-service feedback-service; do
  if ! build_service $service; then
    echo -e "${RED}Failed to build $service. See errors above.${NC}"
    echo -e "${YELLOW}Troubleshooting $service:${NC}"
    echo -e "1. Check if gradle wrapper jar exists in backend/$service/gradle/wrapper/"
    echo -e "2. Try building manually: cd backend/$service && ./gradlew clean bootJar"
    echo -e "3. Check application.yml configuration"
    exit 1
  fi
done

# Build optional services - these are not critical for core functionality
build_service feedback-scoring-service false
build_service frontend false

# Start the containers
echo -e "${YELLOW}Starting all services with Traefik...${NC}"
docker-compose up -d

# Check if all services are running
echo -e "${YELLOW}Checking service status...${NC}"
sleep 5

# Define critical services that must be running
critical_services="traefik postgres mongodb discovery-service user-service feedback-service"
failed_services=false

for service in $critical_services; do
  if [ "$(docker ps -q -f name=$service -f status=running | wc -l)" -eq 0 ]; then
    echo -e "${RED}Critical service $service is not running.${NC}"
    show_logs $service
    failed_services=true
  fi
done

if [ "$failed_services" = true ]; then
  echo -e "${RED}Not all critical services are running.${NC}"
  
  # Special troubleshooting guidance
  echo -e "${YELLOW}Troubleshooting tips:${NC}"
  echo -e "1. Check the logs above for specific errors"
  echo -e "2. Verify the Dockerfiles are properly configured"
  echo -e "3. Make sure your Spring Boot applications have proper Main classes"
  echo -e "4. For more detailed troubleshooting, see TROUBLESHOOTING.md"
else
  echo -e "${GREEN}All critical services are running!${NC}"
  
  # Check optional services
  optional_services="feedback-scoring-service frontend"
  for service in $optional_services; do
    if [ "$(docker ps -q -f name=$service -f status=running | wc -l)" -eq 0 ]; then
      echo -e "${YELLOW}Optional service $service is not running.${NC}"
      if [ "$service" = "feedback-scoring-service" ]; then
        echo -e "${YELLOW}The system will continue to function, but feedback scoring may not be available.${NC}"
      elif [ "$service" = "frontend" ]; then
        echo -e "${YELLOW}The system API is available, but the web interface is not. You can still test API endpoints.${NC}"
      fi
    fi
  done
fi

echo -e "${GREEN}System started successfully!${NC}"
echo -e "${YELLOW}API endpoints are available at:${NC} https://api.localhost"
echo -e "${YELLOW}Traefik dashboard is available at:${NC} https://traefik.localhost"
echo -e "${YELLOW}(Username: admin, Password: admin)${NC}"

# Add to /etc/hosts if needed
if ! grep -q "api.localhost" /etc/hosts; then
  echo -e "${YELLOW}Please add the following entry to your /etc/hosts file:${NC}"
  echo "127.0.0.1 localhost api.localhost traefik.localhost"
fi

# For ngrok setup
echo -e "${YELLOW}To expose with ngrok, run:${NC}"
echo "ngrok http https://localhost"

# Show monitoring info
echo -e "${YELLOW}To check container status:${NC} docker-compose ps"
echo -e "${YELLOW}To view logs for a specific service:${NC} docker-compose logs [service-name]" 