FROM openjdk:17-slim

# Install wget for health check
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY build/libs/discovery-service-0.0.1-SNAPSHOT.jar discovery-service.jar

EXPOSE 8087

# Add proper Java options for containerized environment
ENV JAVA_OPTS="-XX:+UseContainerSupport -Xmx512m"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar discovery-service.jar"] 