-- Add analysis fields to submissions table
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS admin_rating DECIMAL(3,1),
ADD COLUMN IF NOT EXISTS admin_sentiment VARCHAR(20),
ADD COLUMN IF NOT EXISTS analysis_notes TEXT,
ADD COLUMN IF NOT EXISTS analyzed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS analyzed_by VARCHAR(100);

-- Create index for analysis queries
CREATE INDEX IF NOT EXISTS idx_submissions_analyzed_at ON submissions(analyzed_at);
CREATE INDEX IF NOT EXISTS idx_submissions_analyzed_by ON submissions(analyzed_by);
CREATE INDEX IF NOT EXISTS idx_submissions_admin_rating ON submissions(admin_rating);
CREATE INDEX IF NOT EXISTS idx_submissions_admin_sentiment ON submissions(admin_sentiment);

-- Add constraint for rating range
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

-- Add constraint for sentiment values
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
