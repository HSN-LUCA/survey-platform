# Survey Image Upload Feature - Implementation Summary

## What Was Added

### 1. Database Migration
- **File**: `scripts/add-image-url-column.sql`
- **Change**: Added `image_url` TEXT column to surveys table
- **Status**: Ready to execute

### 2. API Endpoints Updated
- **POST /api/surveys**: Now accepts optional `image_url` parameter
- **PUT /api/surveys/[id]**: Now accepts optional `image_url` parameter
- **Files Modified**:
  - `src/app/api/surveys/route.ts`
  - `src/app/api/surveys/[id]/route.ts`

### 3. Admin Forms Updated
- **Create Survey Form**: `src/app/admin/surveys/create/page.tsx`
  - Added image upload input with preview
  - File size validation (max 5MB)
  - Remove image button
  - Bilingual labels

- **Edit Survey Form**: `src/app/admin/surveys/[id]/edit/page.tsx`
  - Same features as create form
  - Loads existing image on page load
  - Allows updating or removing images

### 4. Front Page Updated
- **File**: `src/app/page.tsx`
- **Change**: Displays uploaded image or falls back to default Kaaba SVG
- **Image Display**: 128x128px container with object-contain

### 5. Internationalization
- **Files Modified**:
  - `src/i18n/locales/en.json`
  - `src/i18n/locales/ar.json`
- **New Keys**: image, imageUpload, imageOptional, selectImage, uploadImage, imagePreview, noImageSelected, imageSizeWarning

## Key Features

✅ **Base64 Encoding**: Images stored directly in database as base64 data URLs
✅ **File Validation**: Maximum 5MB file size with client-side validation
✅ **Image Preview**: Shows preview before submission
✅ **Bilingual Support**: Full Arabic/English labels and messages
✅ **Fallback Display**: Shows default Kaaba SVG if no image provided
✅ **Optional Field**: Image upload is completely optional
✅ **Easy Management**: Remove or update images in edit form

## Files Modified

1. `survey-platform/scripts/add-image-url-column.sql` - NEW
2. `survey-platform/src/app/api/surveys/route.ts` - MODIFIED
3. `survey-platform/src/app/api/surveys/[id]/route.ts` - MODIFIED
4. `survey-platform/src/app/admin/surveys/create/page.tsx` - MODIFIED
5. `survey-platform/src/app/admin/surveys/[id]/edit/page.tsx` - MODIFIED
6. `survey-platform/src/app/page.tsx` - MODIFIED
7. `survey-platform/src/i18n/locales/en.json` - MODIFIED
8. `survey-platform/src/i18n/locales/ar.json` - MODIFIED
9. `survey-platform/docs/SURVEY_IMAGE_UPLOAD_FEATURE.md` - NEW

## Implementation Steps

### Step 1: Run Database Migration
```bash
# Connect to your database and execute:
psql -U your_user -d your_database -f scripts/add-image-url-column.sql
```

### Step 2: Deploy Code Changes
All code changes are already implemented. Simply deploy the updated files.

### Step 3: Test the Feature
1. Create a new survey with an image
2. Verify image displays on front page
3. Edit survey to change/remove image
4. Test with various image formats
5. Test file size validation

## Technical Details

### Image Storage
- Format: Base64-encoded data URL
- Example: `data:image/png;base64,iVBORw0KGgoAAAANS...`
- Storage: TEXT column in surveys table
- Size: ~1.3x the original file size

### File Validation
- Accepted formats: PNG, JPG, GIF, WebP, etc.
- Maximum size: 5MB
- Validation: Client-side before upload

### Display Logic
```typescript
// On front page
{survey.image_url ? (
  <img src={survey.image_url} alt={title} />
) : (
  <img src="/kaaba.svg" alt="Kaaba" />
)}
```

## API Request Examples

### Create Survey with Image
```bash
curl -X POST http://localhost:3000/api/surveys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title_en": "Customer Satisfaction",
    "title_ar": "رضا العملاء",
    "description_en": "Please rate your experience",
    "description_ar": "يرجى تقييم تجربتك",
    "customer_type": "pilgrims",
    "image_url": "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "questions": [...]
  }'
```

### Update Survey Image
```bash
curl -X PUT http://localhost:3000/api/surveys/SURVEY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title_en": "Customer Satisfaction",
    "title_ar": "رضا العملاء",
    "description_en": "Please rate your experience",
    "description_ar": "يرجى تقييم تجربتك",
    "customer_type": "pilgrims",
    "image_url": "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "questions": [...]
  }'
```

## Performance Notes

- Base64 images increase database size by ~30%
- Recommended image size: Under 500KB
- Consider compressing images before upload
- Database queries include image_url in responses

## Rollback Plan

If needed, you can rollback by:
1. Removing the `image_url` column from database
2. Reverting code changes in the 5 modified files
3. Removing new translation keys

See `docs/SURVEY_IMAGE_UPLOAD_FEATURE.md` for detailed rollback instructions.

## Next Steps

1. ✅ Run database migration
2. ✅ Deploy code changes
3. ✅ Test all functionality
4. ✅ Monitor database size
5. Consider future enhancements (image compression, CDN integration, etc.)

## Support & Documentation

For detailed information, see:
- `docs/SURVEY_IMAGE_UPLOAD_FEATURE.md` - Complete feature documentation
- API endpoint documentation in code comments
- Inline code comments for implementation details

## Questions?

Refer to the comprehensive documentation in `docs/SURVEY_IMAGE_UPLOAD_FEATURE.md` for:
- Detailed technical specifications
- Troubleshooting guide
- Performance considerations
- Security considerations
- Future enhancement ideas
