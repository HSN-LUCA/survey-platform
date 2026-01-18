# Step-by-Step: Fix Survey Categories Feature

## The Problem
When you try to create a survey, you get: **"Failed to create survey"**

## The Reason
The database is missing the `category` column in the `questions` table.

## The Solution (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com
2. Log in with your account
3. Click on your project (survey-platform)

### Step 2: Open SQL Editor
1. On the left sidebar, find **SQL Editor**
2. Click on it
3. Click **New Query** button

### Step 3: Copy the Migration SQL
Copy this entire SQL code:

```sql
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS category VARCHAR(255) DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);

COMMENT ON COLUMN questions.category IS 'Optional category to group related questions in surveys';
```

### Step 4: Paste and Run
1. Paste the SQL into the query editor
2. Click the **Run** button (or press Ctrl+Enter)
3. Wait for it to complete

### Step 5: Verify Success
You should see: **"Success. No rows returned"**

If you see an error about "column already exists", that's fine - it means the column is already there.

### Step 6: Refresh Your Browser
1. Go back to your app (http://localhost:3000)
2. Press F5 to refresh
3. Go to Admin Dashboard → Create Survey

### Step 7: Test It
1. Fill in survey title (English and Arabic)
2. Add a question
3. **NEW**: Enter a category name (e.g., "Service Quality")
4. Click "Create Survey"
5. It should work now!

## Verification

After creating a survey, verify it worked:

1. Go to home page
2. Click on the survey you just created
3. Enter your details
4. You should see:
   - Progress bar at the top
   - Questions grouped by category
   - Category header showing the category name

## If It Still Doesn't Work

### Check 1: Did the migration run?
1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Click on **questions** table
4. Scroll right to see all columns
5. Look for **category** column
6. If you see it, the migration worked

### Check 2: Check the error message
1. Open your browser (F12)
2. Go to Console tab
3. Try creating a survey again
4. Look for error messages
5. Share the error message if you need help

### Check 3: Restart the app
1. Stop the dev server (Ctrl+C in terminal)
2. Run `npm run dev` again
3. Try creating a survey

## What Changed

The migration added:
- **category column**: Stores the category name for each question
- **index**: Makes queries faster
- **comment**: Documents what the column is for

## Next Steps

Once the fix is working:

1. **Create surveys with categories**:
   - Assign questions to categories
   - Use the same category name to group related questions

2. **Test the feature**:
   - Create a survey with 3 categories
   - Take the survey
   - Verify progress bar shows all categories
   - Verify questions are grouped correctly

3. **Test in Arabic**:
   - Switch to Arabic language
   - Verify RTL layout works
   - Verify category names display correctly

## Example Survey

Here's an example of what to create:

**Survey Title**: Customer Satisfaction

**Questions**:
1. How would you rate our service?
   - Category: **Service Quality**
   - Type: Star Rating

2. Was the staff helpful?
   - Category: **Service Quality**
   - Type: Multiple Choice
   - Options: Yes, No, Somewhat

3. How satisfied are you with the product?
   - Category: **Product Quality**
   - Type: Star Rating

4. Would you recommend it?
   - Category: **Product Quality**
   - Type: Multiple Choice
   - Options: Yes, No, Maybe

When users take this survey, they'll see:
- Progress bar with 2 categories
- Questions grouped under each category
- Progress updates as they move through categories

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "column already exists" error | This is fine, the column exists. Try creating a survey. |
| "permission denied" error | Log out and log back in to Supabase |
| Still getting "Failed to create survey" | Check browser console (F12) for error details |
| Category column not showing in table | Refresh the page or try the migration again |

## Time Estimate

- Reading this guide: 2 minutes
- Running the migration: 1 minute
- Testing: 2 minutes
- **Total: 5 minutes**

## Questions?

If you have questions:
1. Check `CATEGORY_FEATURE_TROUBLESHOOTING.md`
2. Check `FIX_CATEGORY_COLUMN_MIGRATION.md`
3. Check browser console for error messages
4. Check Supabase logs for database errors

## Summary

1. Open Supabase SQL Editor
2. Run the migration SQL
3. Refresh your browser
4. Try creating a survey
5. Done!

The feature is now ready to use. Start creating surveys with categories!
