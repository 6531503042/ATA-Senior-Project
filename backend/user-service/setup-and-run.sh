#!/bin/bash

set -e

echo "=== User Service Setup and Run Script ==="
echo ""

echo "1. Setting up PostgreSQL database..."
# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker to continue."
    exit 1
fi

# Check if the PostgreSQL container is running
if ! docker ps | grep -q "postgres"; then
    echo "Starting PostgreSQL container..."
    docker run --name postgres-db -e POSTGRES_PASSWORD=6531503042 -e POSTGRES_DB=user -p 3307:5432 -d postgres:14-alpine
    echo "Waiting for PostgreSQL to start..."
    sleep 10
else
    echo "PostgreSQL container is already running."
fi

echo ""
echo "2. Setting up environment..."
# Create initial SQL migration if it doesn't exist
MIGRATION_DIR="src/main/resources/db/migration"
if [ ! -d "$MIGRATION_DIR" ]; then
    echo "Creating migration directory..."
    mkdir -p "$MIGRATION_DIR"
fi

# Check if the V1__init.sql file exists, if not create it
if [ ! -f "$MIGRATION_DIR/V1__init.sql" ]; then
    echo "Creating initial SQL migration..."
    cat > "$MIGRATION_DIR/V1__init.sql" << EOL
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    full_name VARCHAR(50),
    gender VARCHAR(10),
    avatar VARCHAR(255),
    phoneNumber VARCHAR(20),
    department_id BIGINT,
    position VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    team VARCHAR(50),
    manager_id BIGINT,
    team_role VARCHAR(50),
    skill_level VARCHAR(20),
    years_of_experience INTEGER,
    primary_skill VARCHAR(50),
    employment_type VARCHAR(20),
    work_mode VARCHAR(20),
    joining_date DATE,
    last_promotion_date DATE,
    work_anniversary DATE,
    shift_type VARCHAR(20),
    remote_work_days INTEGER,
    last_login TIMESTAMP,
    last_active_time TIMESTAMP,
    login_frequency VARCHAR(20),
    account_status VARCHAR(20),
    system_access_level VARCHAR(20),
    preferred_communication VARCHAR(20),
    nationality VARCHAR(50),
    preferred_language VARCHAR(50),
    timezone VARCHAR(50),
    linkedin_profile VARCHAR(255),
    github_profile VARCHAR(255),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS user_project_authorities (
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_skills (
    user_id BIGINT NOT NULL,
    skill VARCHAR(100) NOT NULL,
    PRIMARY KEY (user_id, skill),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_skill_proficiency (
    user_id BIGINT NOT NULL,
    skill VARCHAR(100) NOT NULL,
    proficiency VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, skill),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_tech_stack (
    user_id BIGINT NOT NULL,
    technology VARCHAR(100) NOT NULL,
    PRIMARY KEY (user_id, technology),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_languages (
    user_id BIGINT NOT NULL,
    language VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, language),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
EOL
    echo "Initial SQL migration created."
fi

# Ensure JDBC driver is available
echo ""
echo "3. Making sure all dependencies are available..."
./gradlew dependencies --configuration runtimeClasspath | grep -q "org.postgresql:postgresql" || ./gradlew --refresh-dependencies

echo ""
echo "4. Building the application..."
./gradlew clean build -x test

echo ""
echo "5. Running the application..."
echo "The application will start with custom configuration to ensure database connectivity."
echo "Press Ctrl+C to stop the application when done."
echo ""

# Run with explicit configuration
./gradlew bootRun --args='--spring.flyway.enabled=true --spring.r2dbc.url=r2dbc:postgresql://localhost:3307/user --spring.r2dbc.username=postgres --spring.r2dbc.password=6531503042 --spring.flyway.url=jdbc:postgresql://localhost:3307/user --spring.flyway.user=postgres --spring.flyway.password=6531503042 --spring.flyway.baseline-on-migrate=true --spring.sql.init.mode=never --eureka.client.enabled=false' 