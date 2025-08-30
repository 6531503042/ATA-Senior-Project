-- Add category column to projects table
ALTER TABLE projects ADD COLUMN category VARCHAR(100);

-- Update existing projects with default category
UPDATE projects SET category = 'Development' WHERE category IS NULL;
