-- Connect to the feedback_service database
\connect feedback_service;

-- Create the basic schema structure for the feedback service
-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    text VARCHAR(500) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- RATING, TEXT_BASED, MULTIPLE_CHOICE
    required BOOLEAN DEFAULT TRUE,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Answer options table for multiple choice questions
CREATE TABLE IF NOT EXISTS answer_options (
    id SERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    text VARCHAR(255) NOT NULL,
    value VARCHAR(255),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Feedback templates
CREATE TABLE IF NOT EXISTS feedbacks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Join table for feedback templates and questions
CREATE TABLE IF NOT EXISTS feedback_questions (
    feedback_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    question_order INT NOT NULL,
    PRIMARY KEY (feedback_id, question_id),
    FOREIGN KEY (feedback_id) REFERENCES feedbacks(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Project member table
CREATE TABLE IF NOT EXISTS project_members (
    project_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL, -- EMPLOYEE, MANAGER
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Feedback submissions table
CREATE TABLE IF NOT EXISTS feedback_submissions (
    id SERIAL PRIMARY KEY,
    project_id BIGINT,
    feedback_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    manager_id BIGINT,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'PENDING',
    privacy_level VARCHAR(50) DEFAULT 'PUBLIC',
    overall_comments TEXT,
    FOREIGN KEY (feedback_id) REFERENCES feedbacks(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Individual question responses table
CREATE TABLE IF NOT EXISTS question_responses (
    id SERIAL PRIMARY KEY,
    submission_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    response TEXT,
    FOREIGN KEY (submission_id) REFERENCES feedback_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_project_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_feedback_active ON feedbacks(active);
CREATE INDEX IF NOT EXISTS idx_submission_status ON feedback_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submission_project ON feedback_submissions(project_id);
CREATE INDEX IF NOT EXISTS idx_submission_employee ON feedback_submissions(employee_id); 