# Text Box Question Type Migration

## Overview
This migration adds support for the new `text_box` question type (free text notes/comments) to the survey platform.

## What Changed
- Added `'text_box'` to the CHECK constraint on the `questions` table's `type` column
- Updated the database schema to allow the new question type

## How to Apply the Migration

### For Supabase Users:

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Create a new query and paste the following SQL:

```sql
-- Drop the old constraint
ALTER TABLE questions DROP CONSTRAINT questions_type_check;

-- Add the new constraint with text_box included
ALTER TABLE questions ADD CONSTRAINT questions_type_check 
  CHECK (type IN ('multiple_choice', 'star_rating', 'percentage_range', 'text_box'));
```

4. Click **Run** to execute the migration
5. You should see a success message

### For PostgreSQL Users:

Run the migration script:
```bash
psql -U your_user -d your_database -f scripts/add-text-box-question-type.sql
```

## Verification

After applying the migration, you should be able to:
1. Create new surveys with text_box questions
2. Edit existing surveys and add text_box questions
3. Users can fill in text_box questions with free text responses

## Rollback (if needed)

If you need to revert this change:

```sql
-- Drop the new constraint
ALTER TABLE questions DROP CONSTRAINT questions_type_check;

-- Restore the old constraint
ALTER TABLE questions ADD CONSTRAINT questions_type_check 
  CHECK (type IN ('multiple_choice', 'star_rating', 'percentage_range'));
```

## Files Modified
- `scripts/init-db.sql` - Updated with new constraint for future databases
- `scripts/add-text-box-question-type.sql` - New migration script

## Related Changes
- Added `TextBoxQuestion` component for rendering textarea input
- Updated `QuestionRenderer` to handle text_box type
- Added text_box option to survey creation and edit pages
- Added bilingual translations for "Notes (Free Text)" / "ملاحظات (نص حر)"
