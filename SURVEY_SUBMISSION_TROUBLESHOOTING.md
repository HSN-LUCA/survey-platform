# Survey Submission Troubleshooting Guide

## Problem: Internal Error When Submitting Survey

When you fill in user details and submit a survey, you get an error message saying "Internal server error".

## Quick Diagnosis

### Step 1: Check Browser Console
1. Press **F12** to open Developer Tools
2. Click the **Console** tab
3. Submit the survey again
4. Look for error messages

### Step 2: Check the Error Message
The error will likely say something like:
```
Survey submission error: {
  status: 500,
  error: "column \"email\" of relation \"responses\" does not exist"
}
```

This means the database columns for user details don't exist.

## Solution: Add Database Columns

### Method 1: Supabase Web UI (Easiest)

1. **Open Supabase**
   - Go to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Run Migration**
   - Copy this SQL:
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
   - Paste it into the SQL editor
   - Click **Run**
   - Wait for success message

4. **Test**
   - Go back to your app
   - Submit a survey
   - Should work now!

### Method 2: Command Line (psql)

If you have psql installed:

```bash
psql "postgresql://postgres:52S7BkoypaKNqvw5@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres?sslmode=require" << EOF
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
EOF
```

### Method 3: Using Migration Script

```bash
cd survey-platform
psql "postgresql://postgres:52S7BkoypaKNqvw5@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres?sslmode=require" < scripts/add-user-details-columns.sql
```

## Verify the Fix

### Check 1: Verify Columns Exist

In Supabase SQL Editor, run:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'responses' 
ORDER BY ordinal_position;
```

You should see:
- id (uuid)
- survey_id (uuid)
- user_session_id (character varying)
- **email (character varying)** ← New
- **gender (character varying)** ← New
- **age_range (character varying)** ← New
- **education_level (character varying)** ← New
- **nationality (character varying)** ← New
- submitted_at (timestamp without time zone)

### Check 2: Test Survey Submission

1. Go to your app
2. Select a survey
3. Fill in user details:
   - Email: test@example.com
   - Gender: Male
   - Age Range: 30-39
   - Education Level: Bachelor
   - Nationality: Saudi Arabia
4. Answer survey questions
5. Click Submit
6. Should see success message ✓

### Check 3: Verify Data in Database

In Supabase SQL Editor, run:
```sql
SELECT id, survey_id, email, gender, age_range, education_level, nationality, submitted_at
FROM responses
ORDER BY submitted_at DESC
LIMIT 5;
```

You should see your submitted data.

## Still Having Issues?

### Issue: "Permission denied" error

**Cause**: Using wrong API key

**Fix**: Check `.env.local` has the Service Role Key:
```
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
```

### Issue: "Relation responses does not exist" error

**Cause**: Database tables not initialized

**Fix**: Run the full initialization:
```bash
psql "postgresql://postgres:52S7BkoypaKNqvw5@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres?sslmode=require" < scripts/init-db.sql
```

### Issue: Still getting error after adding columns

**Cause**: Server not restarted

**Fix**: 
1. Stop the development server (Ctrl+C)
2. Start it again (npm run dev)
3. Try submitting again

### Issue: Columns already exist error

**Cause**: Columns were already added

**Fix**: This is fine! The `IF NOT EXISTS` clause prevents errors. Just run the query again - it won't hurt.

## Advanced Debugging

### Check Server Logs

The API now logs detailed information. Look for:

```
Inserting response with payload: {
  survey_id: "...",
  user_session_id: "...",
  email: "...",
  gender: "...",
  age_range: "...",
  education_level: "...",
  nationality: "..."
}
```

If there's an error:
```
Response insert error: {
  message: "...",
  code: "...",
  ...
}
```

### Check Network Request

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Submit survey
4. Find POST request to `/api/responses`
5. Click on it
6. Check **Response** tab for error details

### Check Browser Console

1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Submit survey
4. Look for console logs:
   ```
   Submitting survey with user details: {...}
   Survey submission error: {...}
   ```

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `column "email" does not exist` | Columns not added | Run migration SQL |
| `column "age_range" does not exist` | Columns not added | Run migration SQL |
| `permission denied` | Wrong API key | Check SUPABASE_SERVICE_ROLE_KEY |
| `relation "responses" does not exist` | Tables not created | Run init-db.sql |
| `Network error` | Server not running | Start dev server |
| `401 Unauthorized` | Auth issue | Check credentials |

## Checklist

- [ ] Opened browser console (F12)
- [ ] Checked error message
- [ ] Ran migration SQL
- [ ] Verified columns exist
- [ ] Restarted dev server
- [ ] Tested survey submission
- [ ] Verified data in database
- [ ] No errors in console

## Need More Help?

1. **Check Documentation**
   - QUICK_FIX_SURVEY_SUBMISSION.md
   - FIX_SURVEY_SUBMISSION_ERROR.md
   - DEBUG_SURVEY_SUBMISSION.md

2. **Check Logs**
   - Browser console (F12)
   - Server logs
   - Network tab

3. **Verify Setup**
   - Environment variables
   - Database credentials
   - Supabase project

4. **Try Again**
   - Clear browser cache
   - Restart dev server
   - Try in incognito window
