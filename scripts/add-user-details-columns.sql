-- Add user details columns to responses table if they don't exist
-- This script adds the columns needed for the user details feature

ALTER TABLE responses
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS age_range VARCHAR(50),
ADD COLUMN IF NOT EXISTS education_level VARCHAR(100),
ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_responses_email ON responses(email);
CREATE INDEX IF NOT EXISTS idx_responses_gender ON responses(gender);
CREATE INDEX IF NOT EXISTS idx_responses_age_range ON responses(age_range);
CREATE INDEX IF NOT EXISTS idx_responses_education_level ON responses(education_level);
CREATE INDEX IF NOT EXISTS idx_responses_nationality ON responses(nationality);

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'responses' 
ORDER BY ordinal_position;
