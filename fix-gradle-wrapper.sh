#!/bin/bash
set -e

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}== Gradle Wrapper Fix Tool ==${NC}"
echo -e "${YELLOW}This script will check and fix missing gradle-wrapper.jar files in all Java services${NC}"

# Services to check
SERVICES=("discovery-service" "user-service" "feedback-service")

# Use curl instead of wget (macOS compatible)
download_file() {
  local url=$1
  local output_file=$2
  
  echo -e "${YELLOW}Downloading file using curl...${NC}"
  if curl -s -o "$output_file" "$url"; then
    return 0
  else
    return 1
  fi
}

for service in "${SERVICES[@]}"; do
  echo -e "\n${YELLOW}Checking $service...${NC}"
  
  # Check if service directory exists
  if [ ! -d "backend/$service" ]; then
    echo -e "${RED}Service directory backend/$service does not exist. Skipping.${NC}"
    continue
  fi
  
  # Check if gradle directory exists
  if [ ! -d "backend/$service/gradle" ]; then
    echo -e "${YELLOW}Creating gradle directory for $service...${NC}"
    mkdir -p "backend/$service/gradle/wrapper"
  fi
  
  # Check if wrapper directory exists
  if [ ! -d "backend/$service/gradle/wrapper" ]; then
    echo -e "${YELLOW}Creating wrapper directory for $service...${NC}"
    mkdir -p "backend/$service/gradle/wrapper"
  fi
  
  # Check if wrapper jar exists
  if [ ! -f "backend/$service/gradle/wrapper/gradle-wrapper.jar" ]; then
    echo -e "${YELLOW}gradle-wrapper.jar is missing for $service. Downloading...${NC}"
    if download_file "https://github.com/gradle/gradle/raw/v7.6.1/gradle/wrapper/gradle-wrapper.jar" "backend/$service/gradle/wrapper/gradle-wrapper.jar"; then
      echo -e "${GREEN}Successfully downloaded gradle-wrapper.jar for $service.${NC}"
    else
      echo -e "${RED}Failed to download gradle-wrapper.jar for $service.${NC}"
      exit 1
    fi
  else
    echo -e "${GREEN}gradle-wrapper.jar already exists for $service.${NC}"
  fi
  
  # Check if wrapper properties exists, create if missing
  if [ ! -f "backend/$service/gradle/wrapper/gradle-wrapper.properties" ]; then
    echo -e "${YELLOW}gradle-wrapper.properties is missing for $service. Creating...${NC}"
    cat > "backend/$service/gradle/wrapper/gradle-wrapper.properties" << 'EOT'
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-7.6.1-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
EOT
    echo -e "${GREEN}Created gradle-wrapper.properties for $service.${NC}"
  else
    echo -e "${GREEN}gradle-wrapper.properties already exists for $service.${NC}"
  fi
  
  # Ensure gradlew is executable
  if [ -f "backend/$service/gradlew" ]; then
    chmod +x "backend/$service/gradlew"
    echo -e "${GREEN}Made gradlew executable for $service.${NC}"
  else
    echo -e "${RED}gradlew script is missing for $service. Please check your project setup.${NC}"
  fi
done

echo -e "\n${GREEN}Fix process completed!${NC}"
echo -e "${YELLOW}Now you can run './start-with-traefik.sh' to start the services.${NC}" 