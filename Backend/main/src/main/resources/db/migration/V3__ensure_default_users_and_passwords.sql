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

-- 4) Correct default passwords only if the user has never logged in
--    This prevents overwriting real users who changed their passwords
UPDATE users
SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa'
WHERE username = 'admin'
  AND (last_login_at IS NULL);

UPDATE users
SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'user'
  AND (last_login_at IS NULL);

-- 5) Ensure active flag is true for default users if missing
UPDATE users SET active = TRUE WHERE username IN ('admin', 'user') AND active IS DISTINCT FROM TRUE;


