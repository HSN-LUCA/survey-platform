# Fix: Add Category Column to Database

## Problem
Survey creation is failing because the `category` column doesn't exist in the `questions` table yet.

## Solution
Run the database migration to add the `category` column.

## Steps to Fix

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to https://supabase.com and log in
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste this SQL:

```sql
-- Add category column to questions table if it doesn't exist
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS category VARCHAR(255) DEFAULT NULL;

-- Create index on category for better query performance
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);

-- Add comment to explain the column
COMMENT ON COLUMN questions.category IS 'Optional category to group related questions in surveys';
```

6. Click **Run** (or press Ctrl+Enter)
7. Wait for the query to complete
8. You should see: "Success. No rows returned"

### Option 2: Using SQL File

1. Open `scripts/add-category-column.sql`
2. Copy the entire content
3. Go to Supabase Dashboard → SQL Editor
4. Create a new query
5. Paste the content
6. Click Run

### Option 3: Using Supabase CLI

If you have Supabase CLI installed:

```bash
cd survey-platform
supabase db push
```

## Verify the Migration

After running the migration, verify it worked:

1. Go to Supabase Dashboard
2. Go to **Table Editor** (left sidebar)
3. Click on **questions** table
4. Scroll right to see if **category** column exists
5. You should see a new column named `category` with type `text`

## After Migration

Once the migration is complete:

1. Refresh your browser
2. Go to Admin Dashboard → Create Survey
3. Try creating a survey with categories
4. The survey should now be created successfully

## Troubleshooting

### Error: "column 'category' already exists"
- This is fine! It means the column already exists
- You can proceed to create surveys

### Error: "permission denied"
- Make sure you're logged in with the correct Supabase account
- Make sure you have admin/owner permissions on the project

### Survey still fails to create
- Check browser console (F12) for error messages
- Check Supabase logs for database errors
- Make sure the migration ran successfully

## What the Migration Does

1. **Adds category column**: Allows questions to have an optional category
2. **Sets default to NULL**: Questions without a category will have NULL value
3. **Creates index**: Improves query performance when filtering by category
4. **Adds comment**: Documents the column purpose

## Rollback (if needed)

If you need to remove the category column:

```sql
DROP INDEX IF EXISTS idx_questions_category;
ALTER TABLE questions DROP COLUMN IF EXISTS category;
```

## Next Steps

After the migration:

1. Create a survey with categories
2. Assign questions to different categories
3. Take the survey and verify the progress bar shows categories
4. Test in both English and Arabic

## Questions?

If you encounter any issues:
1. Check the error message in the browser console
2. Check Supabase logs for database errors
3. Verify the migration ran successfully
4. Try refreshing the page and trying again
