# Backend Dockerfile for Spring Boot application
FROM openjdk:21-jdk-slim

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy gradle wrapper and build files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Make gradlew executable
RUN chmod +x gradlew

# Copy source code
COPY src src

# Build the application (แยกการ build เพื่อ cache layer)
RUN ./gradlew build -x test --no-daemon

# Create a non-root user for security
RUN groupadd -r ata && useradd -r -g ata ata
RUN chown -R ata:ata /app
USER ata

# Expose port
EXPOSE 8080

# Health check with longer timeout for Spring Boot startup
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application with optimized JVM settings
CMD ["java", "-Xmx512m", "-Xms256m", "-Djava.security.egd=file:/dev/./urandom", "-jar", "build/libs/main-0.0.1-SNAPSHOT.jar"]