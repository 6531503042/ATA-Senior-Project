-- Track time spent filling feedback forms
CREATE TABLE IF NOT EXISTS submission_sessions (
    id BIGSERIAL PRIMARY KEY,
    feedback_id BIGINT NOT NULL,
    submission_id BIGINT,
    user_id VARCHAR(255) NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP,
    duration_seconds BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submission_sessions_user ON submission_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_submission_sessions_feedback ON submission_sessions(feedback_id);
CREATE INDEX IF NOT EXISTS idx_submission_sessions_started ON submission_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_submission_sessions_ended ON submission_sessions(ended_at);

-- When ending a session, duration_seconds = EXTRACT(EPOCH FROM (ended_at - started_at))

