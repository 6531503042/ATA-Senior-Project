-- Change question category from string to enum
-- Migration V16: Convert questions.category (VARCHAR) to (ENUM)

-- Step 1: Create the enum type for question categories
CREATE TYPE question_category_enum AS ENUM (
    'WORK_ENVIRONMENT',
    'WORK_LIFE_BALANCE', 
    'TEAM_COLLABORATION',
    'PROJECT_MANAGEMENT',
    'PROJECT_SATISFACTION',
    'TECHNICAL_SKILLS',
    'COMMUNICATION',
    'LEADERSHIP',
    'INNOVATION',
    'PERSONAL_GROWTH',
    'GENERAL'
);

-- Step 2: Update existing data to match enum values (set default to GENERAL if NULL or unknown)
UPDATE questions 
SET category = CASE 
    WHEN UPPER(category) IN ('WORK_ENVIRONMENT', 'WORK ENVIRONMENT') THEN 'WORK_ENVIRONMENT'
    WHEN UPPER(category) IN ('WORK_LIFE_BALANCE', 'WORK LIFE BALANCE', 'WORKLIFE', 'WORK-LIFE') THEN 'WORK_LIFE_BALANCE'
    WHEN UPPER(category) IN ('TEAM_COLLABORATION', 'TEAM COLLABORATION', 'TEAMWORK', 'COLLABORATION') THEN 'TEAM_COLLABORATION'
    WHEN UPPER(category) IN ('PROJECT_MANAGEMENT', 'PROJECT MANAGEMENT', 'PROJECT_MGMT', 'PM') THEN 'PROJECT_MANAGEMENT'
    WHEN UPPER(category) IN ('PROJECT_SATISFACTION', 'PROJECT SATISFACTION', 'PROJECT_SAT') THEN 'PROJECT_SATISFACTION'
    WHEN UPPER(category) IN ('TECHNICAL_SKILLS', 'TECHNICAL SKILLS', 'TECH_SKILLS', 'TECHNICAL') THEN 'TECHNICAL_SKILLS'
    WHEN UPPER(category) IN ('COMMUNICATION', 'COMM') THEN 'COMMUNICATION'
    WHEN UPPER(category) IN ('LEADERSHIP', 'LEADER') THEN 'LEADERSHIP'
    WHEN UPPER(category) IN ('INNOVATION', 'INNOVATIVE') THEN 'INNOVATION'
    WHEN UPPER(category) IN ('PERSONAL_GROWTH', 'PERSONAL GROWTH', 'GROWTH', 'DEVELOPMENT') THEN 'PERSONAL_GROWTH'
    ELSE 'GENERAL'
END
WHERE category IS NOT NULL;

-- Step 3: Set NULL categories to GENERAL
UPDATE questions 
SET category = 'GENERAL' 
WHERE category IS NULL;

-- Step 4: Alter the column to use the new enum type
ALTER TABLE questions 
ALTER COLUMN category TYPE question_category_enum 
USING category::question_category_enum;

-- Step 5: Set NOT NULL constraint since we've cleaned up the data
ALTER TABLE questions 
ALTER COLUMN category SET NOT NULL;

-- Step 6: Add comment to document the change
COMMENT ON COLUMN questions.category IS 'Question category using predefined enum values for better categorization';
