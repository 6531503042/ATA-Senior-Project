#!/bin/bash

echo "Building Discovery Service..."
cd discovery-service
./gradlew clean build -x test
cd ..

echo "Building User Service..."
cd user-service
./gradlew clean build -x test
cd ..

echo "Building Feedback Service..."
cd feedback-service
./gradlew clean build -x test
cd ..

echo "Starting all services with Docker Compose..."
docker-compose down -v
docker-compose up -d --build

echo "Checking service status..."
docker-compose ps 