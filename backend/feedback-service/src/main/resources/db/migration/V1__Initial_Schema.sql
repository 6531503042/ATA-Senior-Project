-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    project_start_date TIMESTAMP,
    project_end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Project members table
CREATE TABLE IF NOT EXISTS project_members (
    project_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    PRIMARY KEY (project_id, member_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    description TEXT,
    question_type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    required BOOLEAN DEFAULT TRUE,
    validation_rules VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    project_id BIGINT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Question choices table
CREATE TABLE IF NOT EXISTS question_choices (
    id SERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    choice VARCHAR(255) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id BIGINT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    allow_anonymous BOOLEAN DEFAULT TRUE,
    department_id VARCHAR(255),
    status VARCHAR(50),
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_department_wide BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Feedback questions junction table
CREATE TABLE IF NOT EXISTS feedback_questions (
    feedback_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    PRIMARY KEY (feedback_id, question_id),
    FOREIGN KEY (feedback_id) REFERENCES feedbacks(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Feedback target users table
CREATE TABLE IF NOT EXISTS feedback_target_users (
    feedback_id BIGINT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (feedback_id, user_id),
    FOREIGN KEY (feedback_id) REFERENCES feedbacks(id) ON DELETE CASCADE
);

-- Feedback target departments table
CREATE TABLE IF NOT EXISTS feedback_target_departments (
    feedback_id BIGINT NOT NULL,
    department_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (feedback_id, department_id),
    FOREIGN KEY (feedback_id) REFERENCES feedbacks(id) ON DELETE CASCADE
);

-- Feedback submissions table
CREATE TABLE IF NOT EXISTS feedback_submissions (
    id SERIAL PRIMARY KEY,
    feedback_id BIGINT NOT NULL,
    submitted_by VARCHAR(255),
    overall_comments TEXT NOT NULL,
    privacy_level VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed BOOLEAN DEFAULT FALSE,
    scored BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (feedback_id) REFERENCES feedbacks(id) ON DELETE CASCADE
);

-- Feedback submission responses table
CREATE TABLE IF NOT EXISTS feedback_submission_responses (
    submission_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    response TEXT,
    PRIMARY KEY (submission_id, question_id),
    FOREIGN KEY (submission_id) REFERENCES feedback_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
); 