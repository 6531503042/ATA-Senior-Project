CREATE TABLE IF NOT EXISTS feedback_target_users (
    feedback_id BIGINT NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (feedback_id, user_id)
);

CREATE TABLE IF NOT EXISTS feedback_target_departments (
    feedback_id BIGINT NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
    department_id BIGINT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    PRIMARY KEY (feedback_id, department_id)
);

CREATE INDEX IF NOT EXISTS idx_feedback_target_users_feedback_id ON feedback_target_users(feedback_id);
CREATE INDEX IF NOT EXISTS idx_feedback_target_departments_feedback_id ON feedback_target_departments(feedback_id);


