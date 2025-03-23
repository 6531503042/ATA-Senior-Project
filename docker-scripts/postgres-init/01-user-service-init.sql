-- Connect to the user_service database
\connect user_service;

-- Create roles table if not exists
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    rolename VARCHAR(60) UNIQUE NOT NULL
);

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    reset_password_token VARCHAR(255),
    reset_password_token_expiry TIMESTAMP,
    gender VARCHAR(50),
    avatar VARCHAR(255),
    department VARCHAR(255),
    position VARCHAR(255),
    active BOOLEAN DEFAULT TRUE
);

-- Create join table for users and roles
CREATE TABLE IF NOT EXISTS users_roles (
    user_id BIGINT NOT NULL,
    roles_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, roles_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (roles_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Create user_project_authorities table
CREATE TABLE IF NOT EXISTS user_project_authorities (
    user_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert roles if they don't exist
INSERT INTO roles (rolename) VALUES ('ROLE_ADMIN') ON CONFLICT (rolename) DO NOTHING;
INSERT INTO roles (rolename) VALUES ('ROLE_USER') ON CONFLICT (rolename) DO NOTHING;

-- Insert admin user - password: admin123 (bcrypt encoded)
INSERT INTO users (fullname, username, email, password, department, position)
VALUES (
    'Admin User', 
    'admin', 
    'admin@example.com', 
    '$2a$10$OwuE6wqvI.ysXz8SpJJ5pOgyHJFfFUQKZ0bJY7.KfJL99BlmO0SHe', -- bcrypt hashed 'admin123'
    'Management',
    'System Administrator'
) ON CONFLICT (username) DO NOTHING;

-- Insert 5 regular users - password: password123 (bcrypt encoded)
INSERT INTO users (fullname, username, email, password, department, position)
VALUES 
    ('John Smith', 'john', 'john@example.com', '$2a$10$d/DoAXGlC3hVJu7Ux0HrE.7khB9wMmuoA2ZD0ik93XUlyBHLXUjLe', 'HR', 'HR Manager'),
    ('Jane Doe', 'jane', 'jane@example.com', '$2a$10$d/DoAXGlC3hVJu7Ux0HrE.7khB9wMmuoA2ZD0ik93XUlyBHLXUjLe', 'Engineering', 'Senior Developer'),
    ('Bob Johnson', 'bob', 'bob@example.com', '$2a$10$d/DoAXGlC3hVJu7Ux0HrE.7khB9wMmuoA2ZD0ik93XUlyBHLXUjLe', 'Finance', 'Financial Analyst'),
    ('Alice Williams', 'alice', 'alice@example.com', '$2a$10$d/DoAXGlC3hVJu7Ux0HrE.7khB9wMmuoA2ZD0ik93XUlyBHLXUjLe', 'Marketing', 'Marketing Specialist'),
    ('Charlie Brown', 'charlie', 'charlie@example.com', '$2a$10$d/DoAXGlC3hVJu7Ux0HrE.7khB9wMmuoA2ZD0ik93XUlyBHLXUjLe', 'Operations', 'Operations Manager')
ON CONFLICT (username) DO NOTHING;

-- Assign admin role to admin user
INSERT INTO users_roles (user_id, roles_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.rolename = 'ROLE_ADMIN'
ON CONFLICT (user_id, roles_id) DO NOTHING;

-- Assign user role to all regular users
INSERT INTO users_roles (user_id, roles_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username IN ('john', 'jane', 'bob', 'alice', 'charlie') AND r.rolename = 'ROLE_USER'
ON CONFLICT (user_id, roles_id) DO NOTHING; 