-- Temporarily revert category back to VARCHAR to test functionality
-- This allows us to proceed with testing while keeping the Java enum benefits
-- V17: Revert question category from enum back to VARCHAR

-- Step 1: Change column back to VARCHAR
ALTER TABLE questions 
ALTER COLUMN category TYPE VARCHAR(50) 
USING category::text;

-- Step 2: Remove the NOT NULL constraint temporarily (we'll add it back later)
ALTER TABLE questions 
ALTER COLUMN category DROP NOT NULL;

-- Step 3: Drop the enum type (we can recreate it later when we have proper R2DBC enum support)
DROP TYPE IF EXISTS question_category_enum;

-- Step 4: Add comment explaining this is temporary
COMMENT ON COLUMN questions.category IS 'Question category as VARCHAR (temporary until R2DBC enum support is configured)';
