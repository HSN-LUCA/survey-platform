-- Migration script to update category column to bilingual columns
-- This script renames the existing 'category' column to 'category_en' and adds 'category_ar'
-- For existing databases that have the single 'category' column

-- Check if 'category' column exists and rename it to 'category_en'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'category'
  ) THEN
    ALTER TABLE questions RENAME COLUMN category TO category_en;
    RAISE NOTICE 'Renamed category column to category_en';
  END IF;
END $$;

-- Add 'category_ar' column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'category_ar'
  ) THEN
    ALTER TABLE questions ADD COLUMN category_ar VARCHAR(255);
    RAISE NOTICE 'Added category_ar column';
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_questions_category_en ON questions(category_en);
CREATE INDEX IF NOT EXISTS idx_questions_category_ar ON questions(category_ar);

-- Verify the migration
SELECT 'Migration completed successfully' as status;
