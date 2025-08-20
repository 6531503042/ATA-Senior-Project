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

CREATE TABLE IF NOT EXISTS submissions (
    id BIGSERIAL PRIMARY KEY,
    feedback_id BIGINT NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
    user_id VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_reviewed BOOLEAN DEFAULT FALSE,
    privacy_level VARCHAR(50),
    overall_comments TEXT
);


