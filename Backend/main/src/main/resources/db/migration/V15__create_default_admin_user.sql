-- Create default admin user and role
-- Password: admin123 (BCrypt hashed)

-- Insert default admin role
INSERT INTO roles (name, description) 
VALUES ('ADMIN', 'Administrator role with full access')
ON CONFLICT (name) DO NOTHING;

-- Insert default admin user
-- Password: admin123 (BCrypt hash)
INSERT INTO users (username, email, password) 
VALUES (
    'admin', 
    'admin@example.com', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa'
)
ON CONFLICT (username) DO NOTHING;

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ADMIN'
ON CONFLICT (user_id, role_id) DO NOTHING;

