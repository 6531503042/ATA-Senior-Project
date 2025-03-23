# Use OpenJDK 17 as base image
FROM openjdk:17-slim

# Set working directory
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the necessary files
COPY entrypoint.sh .
COPY build.gradle settings.gradle ./
COPY gradle gradle/
COPY gradlew ./
COPY src src/

# Make entrypoint script executable
RUN chmod +x ./entrypoint.sh
RUN chmod +x ./gradlew

# Expose port 8081 for the User Service
EXPOSE 8081

# Run the application
ENTRYPOINT ["./entrypoint.sh"] 
