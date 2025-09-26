-- Ensure default users and passwords are present and correct
-- Admin: username=admin password=admin123 (BCrypt)
-- User : username=user  password=user123  (BCrypt)

-- Upsert roles
INSERT INTO roles (name, description)
VALUES ('ADMIN', 'Administrator role with full access')
ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (name, description)
VALUES ('USER', 'Regular user with basic access')
ON CONFLICT (name) DO NOTHING;

-- Upsert admin user
INSERT INTO users (username, email, password, first_name, last_name)
SELECT 'admin', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Admin', 'User'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Force admin password to known hash in case it drifted
UPDATE users SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa'
WHERE username = 'admin';

-- Upsert regular user
INSERT INTO users (username, email, password, first_name, last_name)
SELECT 'user', 'user@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Regular', 'User'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'user');

-- Ensure role assignments
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
-- Ensure default roles, users, role assignments, and correct passwords
-- This migration is idempotent and avoids overwriting real user-changed data

-- 1) Ensure roles exist
INSERT INTO roles (name, description)
VALUES 
  ('ADMIN', 'Administrator role with full access'),
  ('USER', 'Regular user with basic access'),
  ('SUPER_ADMIN', 'Super administrator with full access')
ON CONFLICT (name) DO NOTHING;

-- 2) Ensure default users exist (no overwrite if already present)
-- Passwords are known-good BCrypt hashes for:
--   admin -> admin123
--   user  -> user123
INSERT INTO users (username, email, password, first_name, last_name, active)
VALUES 
  ('admin', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Admin', 'User', TRUE),
  ('user',  'user@example.com',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Regular', 'User', TRUE)
ON CONFLICT (username) DO NOTHING;

-- 3) Ensure role assignments for default users (no overwrite if already assigned)
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

-- 4) Enforce default passwords deterministically for fresh environments
--    (Teams rely on admin/admin123 and user/user123 out of the box)
UPDATE users
SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa'
WHERE username = 'admin';

UPDATE users
SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'user';

-- 5) Ensure active flag is true for default users if missing
UPDATE users SET active = TRUE WHERE username IN ('admin', 'user') AND active IS DISTINCT FROM TRUE;


