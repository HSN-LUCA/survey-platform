-- Remove index from image_url column
-- This migration removes the index that was created in add-image-url-column.sql
-- The index causes "index row requires X bytes, maximum size is 8191" errors
-- because base64-encoded images can be very large (up to 5MB)

DROP INDEX IF EXISTS idx_surveys_image_url;

-- Verify the index is removed
-- SELECT * FROM pg_indexes WHERE indexname = 'idx_surveys_image_url';
-- Should return no results after this migration
