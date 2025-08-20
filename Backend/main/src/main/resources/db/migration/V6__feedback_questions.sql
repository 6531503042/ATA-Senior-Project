CREATE TABLE IF NOT EXISTS feedback_questions (
    feedback_id BIGINT NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    PRIMARY KEY (feedback_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_feedback_questions_feedback_id ON feedback_questions(feedback_id);
CREATE INDEX IF NOT EXISTS idx_feedback_questions_question_id ON feedback_questions(question_id);


