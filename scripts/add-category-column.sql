-- Add category column to questions table
ALTER TABLE questions ADD COLUMN IF NOT EXISTS category VARCHAR(255);

-- Create index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
