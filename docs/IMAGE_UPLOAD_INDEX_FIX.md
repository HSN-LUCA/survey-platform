# Image Upload Index Fix

## Problem

When updating a survey with a large base64-encoded image, PostgreSQL throws this error:

```
Failed to update survey: index row requires 64872 bytes, maximum size is 8191
```

## Root Cause

The original migration script created an index on the `image_url` column:

```sql
CREATE INDEX IF NOT EXISTS idx_surveys_image_url ON surveys(image_url);
```

PostgreSQL indexes have a **maximum size of 8KB (8191 bytes) per row**. Since base64-encoded images can be very large (up to 5MB), the index cannot accommodate them.

## Solution

Remove the index from the `image_url` column. The index is not needed because:

1. **No queries by image_url** - We never search or filter by image_url
2. **Always fetched with survey** - Images are always retrieved as part of the survey record
3. **Storage only** - The column is used only for storing and retrieving image data with the survey

## Updated Migration

```sql
-- Add image_url column to surveys table
ALTER TABLE surveys ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Note: We do NOT create an index on image_url because:
-- 1. Base64-encoded images can be very large (up to 5MB)
-- 2. PostgreSQL indexes have a maximum size of 8KB per row
-- 3. We don't query by image_url, only retrieve it with survey data
-- 4. The image is always fetched with the survey record, not searched independently

COMMENT ON COLUMN surveys.image_url IS 'Base64-encoded image data URL for the survey card display. Not indexed due to size constraints.';
```

## If You Already Have the Old Index

If you already ran the old migration with the index, you can remove it:

```sql
DROP INDEX IF EXISTS idx_surveys_image_url;
```

## Testing

After applying the fix:

1. Create a survey with a large image (close to 5MB)
2. Edit the survey and update the image
3. Verify no "index row requires X bytes" error occurs

## Commit

- **Hash**: `95bb267`
- **Message**: "fix: Remove index from image_url column to prevent size limit errors"

