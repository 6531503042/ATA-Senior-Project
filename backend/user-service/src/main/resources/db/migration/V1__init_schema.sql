-- Basic schema for user service

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
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
    phone_number VARCHAR(20),
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

-- Insert initial roles
INSERT INTO roles (name, description) 
VALUES 
    ('ROLE_ADMIN', 'Administrator role with full access'),
    ('ROLE_USER', 'Standard user role'),
    ('ROLE_MANAGER', 'Manager role with elevated privileges')
ON CONFLICT (name) DO NOTHING;
