-- Add image_url column to surveys table
-- This migration adds support for storing survey images as base64-encoded data URLs

ALTER TABLE surveys ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_surveys_image_url ON surveys(image_url);

-- Add comment to document the column
COMMENT ON COLUMN surveys.image_url IS 'Base64-encoded image data URL for the survey card display';
