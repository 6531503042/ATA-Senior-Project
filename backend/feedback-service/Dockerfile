# Use OpenJDK 17 as base image
FROM openjdk:17-slim

# Install required packages
RUN apt-get update && \
    apt-get install -y wget && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the Gradle files first to leverage Docker cache
COPY build.gradle settings.gradle gradlew ./
COPY gradle gradle

# Make gradlew executable
RUN chmod +x ./gradlew

# Copy the source code
COPY src src

# Build the application
RUN ./gradlew build -x test

# Expose port 8084 for the Feedback Service
EXPOSE 8084

# Run the application
CMD ["java", "-jar", "build/libs/feedback-service-0.0.1-SNAPSHOT.jar"] 