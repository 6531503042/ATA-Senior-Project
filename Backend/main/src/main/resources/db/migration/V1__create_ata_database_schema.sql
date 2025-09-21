-- Complete Database Schema for ATA Senior Project
-- This migration creates all tables, indexes, constraints, and default data

-- =============================================
-- 1. CORE TABLES
-- =============================================

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    department_id BIGINT,
    active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 2. PROJECT MANAGEMENT TABLES
-- =============================================

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    department_id BIGINT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Project members junction table
CREATE TABLE IF NOT EXISTS project_members (
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, user_id)
);

-- Project roles table
CREATE TABLE IF NOT EXISTS project_roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    permissions TEXT NOT NULL DEFAULT '[]', -- JSON array of permissions
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Project member roles table
CREATE TABLE IF NOT EXISTS project_member_roles (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES project_roles(id) ON DELETE CASCADE,
    assigned_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 3. FEEDBACK SYSTEM TABLES
-- =============================================

-- Feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id BIGINT REFERENCES projects(id) ON DELETE SET NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id BIGSERIAL PRIMARY KEY,
    text VARCHAR(500) NOT NULL,
    description TEXT,
    question_type VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    required BOOLEAN DEFAULT TRUE,
    validation_rules TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Question choices table
CREATE TABLE IF NOT EXISTS question_choices (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    choice TEXT NOT NULL
);

-- Feedback questions junction table
CREATE TABLE IF NOT EXISTS feedback_questions (
    feedback_id BIGINT NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    PRIMARY KEY (feedback_id, question_id)
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id BIGSERIAL PRIMARY KEY,
    feedback_id BIGINT NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
    user_id VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_reviewed BOOLEAN DEFAULT FALSE,
    privacy_level VARCHAR(50),
    overall_comments TEXT,
    admin_rating DECIMAL(3,1),
    admin_sentiment VARCHAR(20),
    analysis_notes TEXT,
    analyzed_at TIMESTAMP,
    analyzed_by VARCHAR(100)
);

-- Submission responses table
CREATE TABLE IF NOT EXISTS submission_responses (
    submission_id BIGINT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    response TEXT,
    PRIMARY KEY (submission_id, question_id)
);

-- =============================================
-- 4. FEEDBACK TARGET TABLES
-- =============================================

-- Feedback target users table
CREATE TABLE IF NOT EXISTS feedback_target_users (
    feedback_id BIGINT NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (feedback_id, user_id)
);

-- Feedback target departments table
CREATE TABLE IF NOT EXISTS feedback_target_departments (
    feedback_id BIGINT NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
    department_id BIGINT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    PRIMARY KEY (feedback_id, department_id)
);

-- =============================================
-- 5. FOREIGN KEY CONSTRAINTS
-- =============================================

-- Fix projects department foreign key
ALTER TABLE projects
    ALTER COLUMN department_id TYPE BIGINT USING department_id::bigint;

-- Add foreign key constraint for projects department
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'departments'
    ) THEN
        ALTER TABLE projects
            DROP CONSTRAINT IF EXISTS fk_projects_department,
            ADD CONSTRAINT fk_projects_department FOREIGN KEY (department_id)
                REFERENCES departments(id) ON DELETE SET NULL;
    END IF;
END$$;

-- Add foreign key constraint for users department
ALTER TABLE users 
ADD CONSTRAINT fk_users_department 
FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- =============================================
-- 6. INDEXES FOR PERFORMANCE
-- =============================================

-- Projects indexes
CREATE UNIQUE INDEX IF NOT EXISTS uq_projects_name ON projects(name);
CREATE INDEX IF NOT EXISTS idx_projects_department_id ON projects(department_id);

-- Feedbacks indexes
CREATE INDEX IF NOT EXISTS idx_feedbacks_project_id ON feedbacks(project_id);

-- Project members indexes
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);

-- Project member roles indexes
CREATE INDEX IF NOT EXISTS idx_project_member_roles_project_id ON project_member_roles(project_id);
CREATE INDEX IF NOT EXISTS idx_project_member_roles_user_id ON project_member_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_project_member_roles_role_id ON project_member_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_project_member_roles_project_user ON project_member_roles(project_id, user_id);
CREATE INDEX IF NOT EXISTS idx_project_member_roles_active ON project_member_roles(is_active);

-- Unique index for active project member roles
CREATE UNIQUE INDEX IF NOT EXISTS idx_project_member_roles_unique_active 
ON project_member_roles(project_id, user_id) 
WHERE is_active = true;

-- Question choices indexes
CREATE INDEX IF NOT EXISTS idx_question_choices_question_id ON question_choices(question_id);

-- Feedback questions indexes
CREATE INDEX IF NOT EXISTS idx_feedback_questions_feedback_id ON feedback_questions(feedback_id);
CREATE INDEX IF NOT EXISTS idx_feedback_questions_question_id ON feedback_questions(question_id);

-- Submission responses indexes
CREATE INDEX IF NOT EXISTS idx_submission_responses_submission_id ON submission_responses(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_responses_question_id ON submission_responses(question_id);

-- Feedback target indexes
CREATE INDEX IF NOT EXISTS idx_feedback_target_users_feedback_id ON feedback_target_users(feedback_id);
CREATE INDEX IF NOT EXISTS idx_feedback_target_departments_feedback_id ON feedback_target_departments(feedback_id);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_department_id ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at);
CREATE INDEX IF NOT EXISTS idx_users_first_name ON users(first_name);
CREATE INDEX IF NOT EXISTS idx_users_last_name ON users(last_name);

-- Submissions analysis indexes
CREATE INDEX IF NOT EXISTS idx_submissions_analyzed_at ON submissions(analyzed_at);
CREATE INDEX IF NOT EXISTS idx_submissions_analyzed_by ON submissions(analyzed_by);
CREATE INDEX IF NOT EXISTS idx_submissions_admin_rating ON submissions(admin_rating);
CREATE INDEX IF NOT EXISTS idx_submissions_admin_sentiment ON submissions(admin_sentiment);

-- =============================================
-- 7. CONSTRAINTS
-- =============================================

-- Projects constraints
ALTER TABLE projects ALTER COLUMN name SET NOT NULL;

-- Submissions constraints
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'chk_admin_rating_range'
    ) THEN
        ALTER TABLE submissions 
        ADD CONSTRAINT chk_admin_rating_range 
        CHECK (admin_rating IS NULL OR (admin_rating >= 0 AND admin_rating <= 10));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'chk_admin_sentiment_values'
    ) THEN
        ALTER TABLE submissions 
        ADD CONSTRAINT chk_admin_sentiment_values 
        CHECK (admin_sentiment IS NULL OR admin_sentiment IN ('positive', 'neutral', 'negative'));
    END IF;
END $$;

-- =============================================
-- 8. DEFAULT DATA & INITIAL USERS
-- =============================================

-- Insert default roles
INSERT INTO roles (name, description) 
VALUES 
    ('ADMIN', 'Administrator role with full access'),
    ('USER', 'Regular user with basic access'),
    ('SUPER_ADMIN', 'Super administrator with full access')
ON CONFLICT (name) DO NOTHING;

-- Insert default admin user
-- Password: admin123 (BCrypt hash)
INSERT INTO users (username, email, password, first_name, last_name) 
VALUES (
    'admin', 
    'admin@example.com', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa',
    'Admin',
    'User'
)
ON CONFLICT (username) DO NOTHING;

-- Insert default regular user
-- Password: user123 (BCrypt hash)
INSERT INTO users (username, email, password, first_name, last_name) 
VALUES (
    'user', 
    'user@example.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Regular',
    'User'
)
ON CONFLICT (username) DO NOTHING;

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ADMIN'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Assign user role to regular user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'user' AND r.name = 'USER'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Insert default project roles
INSERT INTO project_roles (name, description, permissions, is_default) VALUES
('Owner', 'Project owner with full permissions', 
 '["project.read","project.write","project.delete","members.read","members.write","members.delete","feedback.read","feedback.write","feedback.delete","authority.manage"]', 
 false),
('Manager', 'Project manager with management permissions', 
 '["project.read","project.write","members.read","members.write","feedback.read","feedback.write"]', 
 false),
('Contributor', 'Project contributor with read/write access', 
 '["project.read","feedback.read","feedback.write"]', 
 true),
('Viewer', 'Project viewer with read-only access', 
 '["project.read","feedback.read"]', 
 false)
ON CONFLICT (name) DO NOTHING;

-- Update existing users to be active by default
UPDATE users SET active = true WHERE active IS NULL;

-- =============================================
-- INITIAL USERS SUMMARY:
-- =============================================
-- Admin User: username='admin', password='admin123', role='ADMIN'
-- Regular User: username='user', password='user123', role='USER'
-- =============================================

-- =============================================
-- 9. COMMENTS
-- =============================================

COMMENT ON COLUMN projects.active IS 'Boolean flag indicating if the project is active (true) or inactive (false)';
COMMENT ON COLUMN questions.category IS 'Question category as VARCHAR (temporary until R2DBC enum support is configured)';
COMMENT ON COLUMN submissions.admin_rating IS 'Admin rating for submission analysis (0-10 scale)';
COMMENT ON COLUMN submissions.admin_sentiment IS 'Admin sentiment analysis (positive, neutral, negative)';
