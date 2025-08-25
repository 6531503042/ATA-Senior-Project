-- Change project status from string to boolean active field
-- Migration V14: Convert projects.status (VARCHAR) to projects.active (BOOLEAN)

-- Step 1: Add new active column as boolean with default true
ALTER TABLE projects ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;

-- Step 2: Update active column based on existing status values
-- Assuming active status values like 'ACTIVE', 'ENABLED', 'OPEN' should be true
-- and inactive status values like 'INACTIVE', 'DISABLED', 'CLOSED', 'COMPLETED' should be false
UPDATE projects 
SET active = CASE 
    WHEN UPPER(status) IN ('ACTIVE', 'ENABLED', 'OPEN', 'ONGOING', 'IN_PROGRESS', 'STARTED') THEN TRUE
    WHEN UPPER(status) IN ('INACTIVE', 'DISABLED', 'CLOSED', 'COMPLETED', 'FINISHED', 'CANCELLED', 'SUSPENDED') THEN FALSE
    ELSE TRUE  -- Default to true for unknown statuses
END
WHERE status IS NOT NULL;

-- Step 3: Drop the old status column
ALTER TABLE projects DROP COLUMN status;

-- Step 4: Add comment to document the change
COMMENT ON COLUMN projects.active IS 'Boolean flag indicating if the project is active (true) or inactive (false)';
