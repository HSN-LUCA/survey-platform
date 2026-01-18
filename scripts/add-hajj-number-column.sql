-- Add hajj_number column to responses table
ALTER TABLE responses ADD COLUMN IF NOT EXISTS hajj_number VARCHAR(100);

-- Create index for hajj_number for faster queries
CREATE INDEX IF NOT EXISTS idx_responses_hajj_number ON responses(hajj_number);
