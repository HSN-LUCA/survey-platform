-- Add category column to questions table if it doesn't exist
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS category VARCHAR(255) DEFAULT NULL;

-- Create index on category for better query performance
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);

-- Add comment to explain the column
COMMENT ON COLUMN questions.category IS 'Optional category to group related questions in surveys';
