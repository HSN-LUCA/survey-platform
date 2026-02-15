-- Migration: Add text_box question type to questions table
-- This script updates the CHECK constraint on the questions table to include 'text_box' type

-- Drop the old constraint
ALTER TABLE questions DROP CONSTRAINT questions_type_check;

-- Add the new constraint with text_box included
ALTER TABLE questions ADD CONSTRAINT questions_type_check 
  CHECK (type IN ('multiple_choice', 'star_rating', 'percentage_range', 'text_box'));

-- Verify the constraint was added
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'questions' AND constraint_name = 'questions_type_check';
