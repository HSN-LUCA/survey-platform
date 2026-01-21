# Quick Fix: Survey Submission Error

## The Problem
When you submit a survey after filling in user details, you get an internal error (500).

## The Cause
The database columns for user details (email, gender, age_range, education_level, nationality) don't exist in your Supabase database yet.

## The Fix (3 Steps)

### Step 1: Open Supabase SQL Editor
1. Go to https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Migration
Copy and paste this SQL:

```sql
ALTER TABLE responses
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS age_range VARCHAR(50),
ADD COLUMN IF NOT EXISTS education_level VARCHAR(100),
ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_responses_email ON responses(email);
CREATE INDEX IF NOT EXISTS idx_responses_gender ON responses(gender);
CREATE INDEX IF NOT EXISTS idx_responses_age_range ON responses(age_range);
CREATE INDEX IF NOT EXISTS idx_responses_education_level ON responses(education_level);
CREATE INDEX IF NOT EXISTS idx_responses_nationality ON responses(nationality);
```

Click **Run** ✓

### Step 3: Test It
1. Go to your survey app
2. Select a survey
3. Fill in user details
4. Answer questions
5. Submit - should work now! ✓

## If It Still Doesn't Work

1. **Check browser console** (F12) for the actual error
2. **Check server logs** for detailed error messages
3. **Verify columns exist** by running:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'responses';
   ```

## What Changed
- Added detailed error logging to the API
- Improved error messages in the UI
- Created migration script for the database columns

## Files Updated
- `src/app/api/responses/route.ts` - Better error logging
- `src/components/SurveyPage.tsx` - Better error handling
- `scripts/add-user-details-columns.sql` - Migration script
