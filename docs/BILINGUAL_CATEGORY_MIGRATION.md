# Bilingual Category Fields Migration Guide

## Overview
The survey platform now supports bilingual category fields with separate columns for Arabic (`category_ar`) and English (`category_en`) instead of a single `category` column.

## For New Installations
New installations will automatically have the bilingual category columns in the database schema.

## For Existing Databases

### Option 1: Using the Migration Script (Recommended)

If your database already has a `category` column, run the migration script to update it:

```bash
# Connect to your Supabase database and run:
psql -h [your-host] -U [your-user] -d [your-database] -f scripts/update-category-columns.sql
```

Or execute the SQL directly in Supabase SQL Editor:

```sql
-- Migration script to update category column to bilingual columns
-- This script renames the existing 'category' column to 'category_en' and adds 'category_ar'

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
```

### Option 2: Manual Steps

If you prefer to do this manually:

1. **Rename existing category column:**
   ```sql
   ALTER TABLE questions RENAME COLUMN category TO category_en;
   ```

2. **Add new category_ar column:**
   ```sql
   ALTER TABLE questions ADD COLUMN category_ar VARCHAR(255);
   ```

3. **Create indexes for performance:**
   ```sql
   CREATE INDEX idx_questions_category_en ON questions(category_en);
   CREATE INDEX idx_questions_category_ar ON questions(category_ar);
   ```

## Backward Compatibility

The API endpoints maintain backward compatibility:
- If you send `category` field, it will be stored in `category_en`
- If you send `category_en` and/or `category_ar`, they will be stored in their respective columns
- Existing surveys with data in the old `category` column will continue to work

## UI Changes

### Survey Creation Page
- Now has two separate input fields: "Category (English)" and "Category (Arabic)"
- Users can set different category names for each language

### Survey Edit Page
- Same bilingual category fields as creation page
- Existing categories will be loaded into the appropriate language field

### Summary Report Dashboard
- Automatically displays categories in the current language
- Arabic interface shows `category_ar`
- English interface shows `category_en`

## Testing the Migration

After running the migration, verify it worked:

```sql
-- Check if columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'questions' 
AND column_name IN ('category', 'category_en', 'category_ar')
ORDER BY column_name;

-- Should return:
-- category_ar | character varying
-- category_en | character varying
-- (no 'category' column)
```

## Troubleshooting

### Error: "Could not find the 'category_ar' column"
This means the migration hasn't been run yet. Run the migration script above.

### Error: "Column 'category' already renamed"
The migration has already been completed. No action needed.

### Data Loss Concerns
The migration script only renames and adds columns - no data is deleted. All existing category data will be preserved in the `category_en` column.

## Support

If you encounter any issues during migration, please check:
1. Your database connection is working
2. You have the necessary permissions to alter tables
3. The migration script syntax is correct for your database version
