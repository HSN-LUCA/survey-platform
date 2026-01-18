# Update Database for User Details Feature

## Important: Database Migration Required

The user details feature requires new columns in the `responses` table. You need to update your database.

## Option 1: Fresh Database (Recommended)

If you haven't created any surveys yet:

1. Go to Supabase SQL Editor
2. Delete all tables (or drop the database)
3. Run the updated `scripts/init-db.sql`
4. Create admin account again

This is the cleanest approach.

## Option 2: Migrate Existing Database

If you have existing surveys and responses:

1. Go to https://app.supabase.com
2. Click your project
3. Click **SQL Editor**
4. Click **New Query**
5. Paste this SQL:

```sql
-- Add new columns to responses table
ALTER TABLE responses ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE responses ADD COLUMN IF NOT EXISTS gender VARCHAR(50);
ALTER TABLE responses ADD COLUMN IF NOT EXISTS age_range VARCHAR(50);
ALTER TABLE responses ADD COLUMN IF NOT EXISTS education_level VARCHAR(100);
ALTER TABLE responses ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);

-- Add index for email lookups
CREATE INDEX IF NOT EXISTS idx_responses_email ON responses(email);
```

6. Click **Run**
7. Wait for "Success" message

## Verify Migration

After running the SQL:

1. Go to **Table Editor** in Supabase
2. Click **responses** table
3. Scroll right to see new columns:
   - email
   - gender
   - age_range
   - education_level
   - nationality

All columns should be visible and empty (NULL).

## What Happens Now

### New Responses
- All new survey responses will include user details
- User details are stored in the new columns

### Existing Responses
- Old responses will have NULL values for user details
- This is fine - they were submitted before the feature existed
- You can still view them normally

## Testing

After migration:

1. Go to http://localhost:3000
2. Click "Start Survey"
3. You should see the user details form
4. Fill it out and submit
5. Go to admin dashboard
6. View the survey responses
7. You should see the user details in the response

## Rollback (If Needed)

If you need to remove the columns:

```sql
ALTER TABLE responses DROP COLUMN IF EXISTS email;
ALTER TABLE responses DROP COLUMN IF EXISTS gender;
ALTER TABLE responses DROP COLUMN IF EXISTS age_range;
ALTER TABLE responses DROP COLUMN IF EXISTS education_level;
ALTER TABLE responses DROP COLUMN IF EXISTS nationality;

DROP INDEX IF EXISTS idx_responses_email;
```

But this will lose any user details data that was collected.

## Troubleshooting

### "Column already exists" error
- The columns already exist
- You can safely ignore this error
- The migration is complete

### "Permission denied" error
- You don't have permission to modify the table
- Check your Supabase credentials
- Try using the Service Role Key instead of Anon Key

### Columns not appearing
- Refresh the Supabase page
- Clear browser cache
- Try viewing the table again

## Next Steps

1. ✅ Run the SQL migration
2. ✅ Verify the columns exist
3. ✅ Test the user details form
4. ✅ Create a test survey
5. ✅ Submit a test response with user details
6. ✅ View the response in admin dashboard

---

**Migration complete!** Your database is now ready for the user details feature.
