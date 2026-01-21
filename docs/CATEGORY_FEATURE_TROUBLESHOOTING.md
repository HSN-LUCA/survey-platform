# Survey Categories Feature - Troubleshooting Guide

## Issue: "Failed to create survey" Error

### Root Cause
The `category` column doesn't exist in the `questions` table in your Supabase database.

### Solution
You need to run a database migration to add the `category` column.

**See: `FIX_CATEGORY_COLUMN_MIGRATION.md` for detailed steps**

## Quick Fix (5 minutes)

1. Open Supabase Dashboard: https://supabase.com
2. Go to **SQL Editor**
3. Run this SQL:

```sql
ALTER TABLE questions ADD COLUMN IF NOT EXISTS category VARCHAR(255) DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
```

4. Refresh your browser
5. Try creating a survey again

## Common Errors and Solutions

### Error 1: "Failed to create survey"
**Cause**: Category column doesn't exist
**Fix**: Run the migration (see above)

### Error 2: "column 'category' already exists"
**Cause**: Column already exists (this is good!)
**Fix**: No action needed, try creating a survey

### Error 3: "permission denied"
**Cause**: Not logged in or insufficient permissions
**Fix**: 
- Log out and log back in to Supabase
- Make sure you're using the correct account
- Check that you have admin permissions

### Error 4: "Internal server error" (generic)
**Cause**: Various possible causes
**Fix**:
1. Open browser console (F12)
2. Look for error messages
3. Check Supabase logs
4. Try the migration again

## Verification Steps

After running the migration, verify it worked:

1. **Check in Supabase Dashboard**:
   - Go to Table Editor
   - Click on `questions` table
   - Scroll right to see columns
   - Look for `category` column

2. **Check in Browser Console**:
   - Open browser (F12)
   - Go to Console tab
   - Try creating a survey
   - Look for error messages

3. **Check Supabase Logs**:
   - Go to Supabase Dashboard
   - Click on your project
   - Go to Logs (if available)
   - Look for database errors

## Testing After Fix

Once the migration is complete:

1. **Create a test survey**:
   - Go to Admin Dashboard
   - Click Create Survey
   - Add survey title and description
   - Add 3 questions with different categories:
     - Q1: Category "Service Quality"
     - Q2: Category "Service Quality"
     - Q3: Category "Product Quality"
   - Click Create Survey

2. **Verify it worked**:
   - You should see success message
   - Survey should appear in surveys list
   - No error messages

3. **Take the survey**:
   - Go to home page
   - Click on the survey
   - Enter your details
   - Verify progress bar shows 2 categories
   - Verify questions are grouped by category

## Advanced Troubleshooting

### Check if Column Exists

Run this query in Supabase SQL Editor:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'questions' 
AND column_name = 'category';
```

If it returns a row, the column exists. If not, run the migration.

### Check Index

Run this query:

```sql
SELECT indexname FROM pg_indexes 
WHERE tablename = 'questions' 
AND indexname = 'idx_questions_category';
```

If it returns a row, the index exists.

### Check Recent Errors

Run this query to see recent database errors:

```sql
SELECT * FROM pg_stat_statements 
WHERE query LIKE '%category%' 
ORDER BY query_start DESC 
LIMIT 10;
```

## Still Having Issues?

1. **Clear browser cache**:
   - Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
   - Clear all cache
   - Refresh page

2. **Check network tab**:
   - Open F12 → Network tab
   - Try creating a survey
   - Look at the POST request to `/api/surveys`
   - Check the response for error details

3. **Check API logs**:
   - Look at the response body in Network tab
   - It should contain the actual error message
   - Share this error message for support

4. **Restart the app**:
   - Stop the dev server (Ctrl+C)
   - Run `npm run dev` again
   - Try creating a survey

## Database Schema

After migration, your `questions` table should have:

```
Column Name    | Type         | Nullable | Default
---------------|--------------|----------|--------
id             | uuid         | NO       | 
survey_id      | uuid         | NO       | 
type           | text         | NO       | 
content_en     | text         | NO       | 
content_ar     | text         | NO       | 
required       | boolean      | NO       | 
order_num      | integer      | NO       | 
category       | varchar(255) | YES      | NULL    ← NEW
created_at     | timestamp    | YES      | 
updated_at     | timestamp    | YES      | 
```

## Performance Notes

- The migration adds an index on the `category` column
- This improves query performance when filtering by category
- No performance impact on existing queries
- Safe to run multiple times (uses `IF NOT EXISTS`)

## Rollback

If you need to remove the category feature:

```sql
DROP INDEX IF EXISTS idx_questions_category;
ALTER TABLE questions DROP COLUMN IF EXISTS category;
```

Then remove the category field from the create survey form.

## Support

For additional help:
1. Check `SURVEY_CATEGORIES_IMPLEMENTATION_COMPLETE.md`
2. Check `CATEGORIES_QUICK_START.md`
3. Check `IMPLEMENTATION_NOTES_CATEGORIES.md`
4. Review the error message in browser console
5. Check Supabase logs for database errors

## Summary

**The fix is simple**: Run the migration SQL to add the `category` column to the `questions` table. After that, survey creation with categories will work perfectly.

**Time to fix**: 5 minutes
**Difficulty**: Easy
**Risk**: None (uses `IF NOT EXISTS` to prevent errors)
