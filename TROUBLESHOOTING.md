# Troubleshooting Guide

## JAR File Issues

If you see an error like `no main manifest attribute, in app.jar`, it means the JAR file is not being built correctly. The updated Dockerfiles have fixed this by:

1. Using proper multi-stage builds
2. Using the Spring Boot `bootJar` task to create executable JARs
3. Copying JARs from the correct path in the build stage
4. Setting the correct path for the ENTRYPOINT

### Checking JAR Files

To verify if a JAR file has the proper manifest:

```bash
# Extract the manifest from the JAR
jar xf app.jar META-INF/MANIFEST.MF

# View the manifest contents
cat META-INF/MANIFEST.MF
```

A proper Spring Boot JAR should have a `Main-Class` entry in the manifest.

### Manual JAR Creation

If the automatic build still fails, you can manually create a JAR:

```bash
cd backend/discovery-service
./gradlew clean bootJar
```

Then copy the JAR manually to your Docker image.

## Gradle Wrapper Issues

If you see the error `Could not find or load main class org.gradle.wrapper.GradleWrapperMain`, it means the Gradle wrapper JAR file is missing.

### Using the Fix Script

We've created a script to help fix Gradle wrapper issues:

```bash
# Make the script executable
chmod +x fix-gradle-wrapper.sh

# Run the script to fix gradle wrapper issues
./fix-gradle-wrapper.sh
```

The script will:
1. Check if the gradle-wrapper.jar exists for each service
2. Download the file if it's missing
3. Create proper gradle-wrapper.properties if needed
4. Make the gradlew script executable

### Manual Fix

If you prefer to fix the issue manually:

```bash
# For each service with issues (replace SERVICE_NAME with actual service name)
mkdir -p backend/SERVICE_NAME/gradle/wrapper
curl -s -o backend/SERVICE_NAME/gradle/wrapper/gradle-wrapper.jar https://github.com/gradle/gradle/raw/v7.6.1/gradle/wrapper/gradle-wrapper.jar
chmod +x backend/SERVICE_NAME/gradlew
```

## Docker Issues

### Understanding Multi-Stage Builds

Our Dockerfiles use multi-stage builds:
1. First stage (named `build`) compiles the Java code and creates the JAR
2. Second stage copies only the JAR file from the build stage

Common issues occur when:
- The JAR file path is incorrect
- The JAR wasn't created properly in the build stage
- The ENTRYPOINT is pointing to the wrong file

### Debugging Container Failures

If a container fails to start:

```bash
# Check logs
docker logs container_name

# Inspect the container
docker inspect container_name

# Start an interactive shell in the container 
docker run -it --rm --entrypoint /bin/sh your_image_name
```

## Traefik Configuration

If services are running but not accessible through Traefik:

1. Check Traefik logs: `docker logs traefik`
2. Verify labels in `docker-compose.yml`
3. Make sure hostname resolution works: `ping api.localhost`
4. Check certificate paths and permissions 