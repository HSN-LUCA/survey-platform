# Fix Survey Submission Error - User Details Columns

## Problem
When submitting a survey after adding user details, you get an internal error (500). This is likely because the database columns for user details don't exist in your Supabase database.

## Solution
You need to add the user details columns to the `responses` table in Supabase.

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the following SQL:

```sql
-- Add user details columns to responses table if they don't exist
ALTER TABLE responses
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS age_range VARCHAR(50),
ADD COLUMN IF NOT EXISTS education_level VARCHAR(100),
ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_responses_email ON responses(email);
CREATE INDEX IF NOT EXISTS idx_responses_gender ON responses(gender);
CREATE INDEX IF NOT EXISTS idx_responses_age_range ON responses(age_range);
CREATE INDEX IF NOT EXISTS idx_responses_education_level ON responses(education_level);
CREATE INDEX IF NOT EXISTS idx_responses_nationality ON responses(nationality);
```

5. Click **Run** button
6. You should see a success message

### Option 2: Using psql Command Line

If you have psql installed:

```bash
psql "postgresql://postgres:52S7BkoypaKNqvw5@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres?sslmode=require" < scripts/add-user-details-columns.sql
```

### Option 3: Using pgAdmin

1. Open pgAdmin (http://localhost:5050)
2. Connect to your Supabase database
3. Navigate to the `responses` table
4. Right-click and select **Query Tool**
5. Paste the SQL from Option 1
6. Execute the query

## Verification

After running the migration, verify the columns exist:

1. In Supabase SQL Editor, run:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'responses' 
ORDER BY ordinal_position;
```

2. You should see these columns:
   - id (uuid)
   - survey_id (uuid)
   - user_session_id (character varying)
   - email (character varying)
   - gender (character varying)
   - age_range (character varying)
   - education_level (character varying)
   - nationality (character varying)
   - submitted_at (timestamp without time zone)

## Testing

After adding the columns:

1. Go to the home page
2. Select a survey
3. Fill in the user details form (email, gender, age range, education level, nationality)
4. Answer the survey questions
5. Click "Submit Survey"
6. You should see a success message

## Troubleshooting

### Still getting error?

1. Check the browser console (F12) for the actual error message
2. Check the server logs for more details
3. Verify the columns were actually created by running the verification query above
4. Make sure you're using the correct Supabase credentials

### Column already exists error?

This is fine - the `IF NOT EXISTS` clause prevents errors if columns already exist. Just run the query again.

### Permission denied error?

Make sure you're using the Service Role Key (not the Anon Key) in your `.env.local`:
```
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
```

## API Changes

The responses API now includes enhanced logging. If you still get errors, check:

1. **Server logs** - The API will log the exact error from Supabase
2. **Browser console** - The error message will be more detailed now
3. **Network tab** - Check the response body for the actual error

## Files Modified

- `src/app/api/responses/route.ts` - Added detailed error logging
- `scripts/add-user-details-columns.sql` - New migration script

## Next Steps

Once the columns are added and survey submission works:

1. Test with different user details
2. Verify data is saved correctly in Supabase
3. Check the admin dashboard to see the responses with user details
