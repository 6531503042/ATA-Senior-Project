CREATE TABLE IF NOT EXISTS question_choices (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    choice TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_question_choices_question_id ON question_choices(question_id);


