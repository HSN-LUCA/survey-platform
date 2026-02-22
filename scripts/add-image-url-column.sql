-- Add image_url column to surveys table
-- This migration adds support for storing survey images as base64-encoded data URLs

ALTER TABLE surveys ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Note: We do NOT create an index on image_url because:
-- 1. Base64-encoded images can be very large (up to 5MB)
-- 2. PostgreSQL indexes have a maximum size of 8KB per row
-- 3. We don't query by image_url, only retrieve it with survey data
-- 4. The image is always fetched with the survey record, not searched independently

-- Add comment to document the column
COMMENT ON COLUMN surveys.image_url IS 'Base64-encoded image data URL for the survey card display. Not indexed due to size constraints.';
