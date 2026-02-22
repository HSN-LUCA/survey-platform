# How to Remove the Image URL Index from Your Database

## Overview

If you already ran the old migration that created the `idx_surveys_image_url` index, you need to remove it to fix the "index row requires X bytes" error.

## Step 1: Run the Cleanup Migration

### Option A: Using psql (PostgreSQL)

```bash
psql -U your_username -d your_database_name -f scripts/remove-image-url-index.sql
```

Replace:
- `your_username` - Your PostgreSQL username
- `your_database_name` - Your database name

### Option B: Using Supabase Dashboard

1. Go to your Supabase project
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste this SQL:

```sql
DROP INDEX IF EXISTS idx_surveys_image_url;
```

5. Click **Run**

### Option C: Using Supabase CLI

```bash
supabase db push
```

This will run all pending migrations, including the new `remove-image-url-index.sql` script.

## Step 2: Verify the Index is Removed

Run this query to confirm the index is gone:

```sql
SELECT * FROM pg_indexes WHERE indexname = 'idx_surveys_image_url';
```

**Expected result**: No rows returned (empty result set)

## Step 3: Test the Fix

After removing the index:

1. Go to Admin Dashboard → Edit a Survey
2. Upload a large image (close to 5MB)
3. Click Save
4. Verify no "index row requires X bytes" error occurs

## If You're Using Supabase

### Method 1: SQL Editor (Easiest)

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Paste:
   ```sql
   DROP INDEX IF EXISTS idx_surveys_image_url;
   ```
5. Click **Run**

### Method 2: Using Supabase CLI

```bash
# First, add the migration to your project
supabase migration new remove_image_url_index

# Then run migrations
supabase db push
```

### Method 3: Direct Connection

If you have direct PostgreSQL access:

```bash
psql postgresql://user:password@host:port/database -c "DROP INDEX IF EXISTS idx_surveys_image_url;"
```

## Troubleshooting

### "Index does not exist" error

This is fine! It means the index was never created or already removed. You can safely ignore this error.

### "Cannot drop index" error

This usually means the index is being used by a constraint. Try:

```sql
DROP INDEX IF EXISTS idx_surveys_image_url CASCADE;
```

### Still getting "index row requires X bytes" error

1. Verify the index was actually dropped:
   ```sql
   SELECT * FROM pg_indexes WHERE indexname = 'idx_surveys_image_url';
   ```

2. If the index still exists, try dropping it with CASCADE:
   ```sql
   DROP INDEX IF EXISTS idx_surveys_image_url CASCADE;
   ```

3. Restart your application after removing the index

## Files Involved

- **Migration to remove index**: `scripts/remove-image-url-index.sql`
- **Original migration**: `scripts/add-image-url-column.sql` (already fixed)
- **Documentation**: `docs/IMAGE_UPLOAD_INDEX_FIX.md`

## Summary

| Step | Action |
|------|--------|
| 1 | Run `scripts/remove-image-url-index.sql` |
| 2 | Verify index is removed with SELECT query |
| 3 | Test by uploading a large image |
| 4 | Restart application if needed |

## Questions?

See `docs/IMAGE_UPLOAD_INDEX_FIX.md` for technical details on why the index was removed.

