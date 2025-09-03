-- Remap legacy question_type values to new enum names
UPDATE questions SET question_type = 'TEXT' WHERE UPPER(question_type) IN ('TEXT_BASED', 'TEXT') OR question_type IS NULL;
UPDATE questions SET question_type = 'MULTIPLE_CHOICE' WHERE UPPER(question_type) IN ('MULTIPLE_CHOICE', 'SINGLE_CHOICE');
UPDATE questions SET question_type = 'RATING' WHERE UPPER(question_type) IN ('RATING', 'SENTIMENT');
UPDATE questions SET question_type = 'BOOLEAN' WHERE UPPER(question_type) = 'BOOLEAN';


