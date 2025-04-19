-- Debug query to print role table structure
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'roles';

-- Insert more test data for roles if needed
INSERT INTO roles (name, description) 
VALUES 
    ('ROLE_TESTER', 'Test role for debugging')
ON CONFLICT (name) DO NOTHING; 