-- Basic schema for user service

-- Create roles table with permissions
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    full_name VARCHAR(50),
    department_id BIGINT,
    position VARCHAR(50),
    role_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Create user_project_authorities table
CREATE TABLE IF NOT EXISTS user_project_authorities (
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    department_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    role VARCHAR(50),
    is_manager BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    UNIQUE (user_id, team_id)
);

-- Insert initial roles with permissions
INSERT INTO roles (name, description, permissions) 
VALUES 
    ('ROLE_ADMIN', 'Administrator role with full access', 
     ARRAY['*', 'users:*', 'roles:*', 'departments:*', 'teams:*', 'projects:*', 'feedbacks:*']),
    ('ROLE_MANAGER', 'Manager role with elevated privileges', 
     ARRAY['users:read', 'users:create', 'users:update', 'teams:*', 'departments:read', 'projects:*', 'feedbacks:*']),
    ('ROLE_USER', 'Standard user role', 
     ARRAY['users:read:id', 'teams:read', 'departments:read', 'projects:read', 'feedbacks:create', 'feedbacks:read:id']),
    ('ROLE_MENTOR', 'Mentor role with specific permissions',
     ARRAY['*', 'users:read', 'teams:*', 'projects:*', 'feedbacks:*'])
ON CONFLICT (name) DO UPDATE 
SET permissions = EXCLUDED.permissions,
    description = EXCLUDED.description;
