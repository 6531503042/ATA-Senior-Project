-- Add default roles for the system
-- This migration adds common roles that users can be assigned

INSERT INTO roles (name, description) 
VALUES 
    ('USER', 'Regular user with basic access'),
    ('SUPER_ADMIN', 'Super administrator with full access')
ON CONFLICT (name) DO NOTHING;
