#!/bin/bash
set -e

echo "Starting Discovery Service..."

# Check if the application is already built
if [ ! -f app.jar ] && [ -z "$(find build/libs -name '*.jar' 2>/dev/null)" ]; then
  echo "JAR file not found, building the application..."
  
  # Check if gradlew exists and is executable
  if [ ! -f ./gradlew ]; then
    echo "Error: gradlew not found! Cannot build application."
    exit 1
  fi
  
  # Make sure gradlew is executable
  chmod +x ./gradlew
  
  # Build the application using gradlew instead of gradle
  ./gradlew clean bootJar -x test --no-daemon || {
    echo "Error: Failed to build JAR file. Check build logs."
    exit 1
  }
  
  # Find the jar file and create a symbolic link
  JAR_PATH=$(find build/libs -name "*.jar" -type f | head -n 1)
  if [ -z "$JAR_PATH" ]; then
    echo "Error: Build failed, JAR not found!"
    exit 1
  fi
  
  echo "JAR built successfully: $JAR_PATH"
  ln -sf "$JAR_PATH" app.jar
fi

# If jar still not found, show error and exit
if [ ! -f app.jar ]; then
  echo "Error: Unable to find or build JAR file. Check build logs for details."
  exit 1
fi

echo "Running the JAR file..."
# Run the application with explicit spring.cloud.config.enabled=false
exec java -jar -Dspring.cloud.config.enabled=false app.jar