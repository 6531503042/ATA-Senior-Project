CREATE TABLE IF NOT EXISTS submission_responses (
    submission_id BIGINT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    response TEXT,
    PRIMARY KEY (submission_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_submission_responses_submission_id ON submission_responses(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_responses_question_id ON submission_responses(question_id);


