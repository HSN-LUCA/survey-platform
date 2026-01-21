# Immediate Action: Survey Submission Error

## What You're Seeing
Empty error object in console when submitting survey:
```
Survey submission error: {}
```

## What to Do RIGHT NOW

### Step 1: Open Browser Console (F12)
Press **F12** → Click **Console** tab

### Step 2: Submit Survey Again
Fill in user details and submit

### Step 3: Look for This in Console
```
Response data: {
  error: "column \"email\" of relation \"responses\" does not exist"
}
```

### Step 4: Copy the Error Message
The actual error is in the `error` field

### Step 5: Apply the Fix

**If error says "column ... does not exist":**
1. Go to Supabase: https://app.supabase.com
2. Click SQL Editor
3. Click New Query
4. Paste this:
```sql
ALTER TABLE responses
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS age_range VARCHAR(50),
ADD COLUMN IF NOT EXISTS education_level VARCHAR(100),
ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);
```
5. Click Run
6. Restart dev server (Ctrl+C, then npm run dev)
7. Try submitting again

**If error says "permission denied":**
1. Check `.env.local` has this line:
```
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
```
2. Restart dev server
3. Try again

**If error says "relation ... does not exist":**
1. Run full database setup:
```bash
psql "postgresql://postgres:52S7BkoypaKNqvw5@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres?sslmode=require" < scripts/init-db.sql
```
2. Restart dev server
3. Try again

## That's It!

The error should now be fixed. If not:
1. Check the error message again
2. Make sure you restarted the dev server
3. Try in an incognito window
4. Clear browser cache

## Need More Help?

See: **FIX_EMPTY_ERROR_OBJECT.md** for detailed debugging
