-- Ensure default users and passwords are present and correct
-- Admin: username=admin password=admin123 (BCrypt)
-- User : username=user  password=user123  (BCrypt)

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Ensure roles exist
INSERT INTO roles (name, description)
VALUES 
  ('ADMIN', 'Administrator role with full access'),
  ('USER', 'Regular user with basic access')
ON CONFLICT (name) DO NOTHING;

-- 2) Ensure default users exist with proper bcrypt passwords
-- Use deterministic salt for consistent hashes across environments
INSERT INTO users (username, email, password, first_name, last_name, active)
VALUES 
  ('admin', 'admin@example.com', crypt('admin123', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa'), 'Admin', 'User', TRUE),
  ('user',  'user@example.com',  crypt('user123', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), 'Regular', 'User', TRUE)
ON CONFLICT (username) DO NOTHING;

-- 3) Force correct passwords for existing users (in case they were changed)
-- Use the same deterministic approach
UPDATE users
SET password = crypt('admin123', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa')
WHERE username = 'admin';

UPDATE users
SET password = crypt('user123', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
WHERE username = 'user';

-- 4) Ensure role assignments for default users
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'ADMIN'
WHERE u.username = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'USER'
WHERE u.username = 'user'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- 5) Ensure active flag is true for default users if missing
UPDATE users SET active = TRUE WHERE username IN ('admin', 'user') AND active IS DISTINCT FROM TRUE;


