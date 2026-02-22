# Survey Image Upload Feature

## Overview
This feature adds the ability for admins to upload custom images for surveys. Images are stored as base64-encoded data URLs directly in the database, eliminating the need for external file storage services.

## Database Changes

### Migration Script
File: `scripts/add-image-url-column.sql`

Adds a new column to the surveys table:
- **Column**: `image_url` (TEXT)
- **Purpose**: Stores base64-encoded image data URLs
- **Index**: `idx_surveys_image_url` for faster queries

### Running the Migration
```sql
-- Connect to your database and run:
ALTER TABLE surveys ADD COLUMN IF NOT EXISTS image_url TEXT;
CREATE INDEX IF NOT EXISTS idx_surveys_image_url ON surveys(image_url);
```

## API Changes

### POST /api/surveys (Create Survey)
**New Parameter**: `image_url` (optional)
- Type: string (base64 data URL)
- Example: `data:image/png;base64,iVBORw0KGgoAAAANS...`

**Request Body**:
```json
{
  "title_en": "Survey Title",
  "title_ar": "عنوان الاستبيان",
  "description_en": "Description",
  "description_ar": "الوصف",
  "customer_type": "pilgrims",
  "image_url": "data:image/png;base64,...",
  "questions": [...]
}
```

### PUT /api/surveys/[id] (Update Survey)
**New Parameter**: `image_url` (optional)
- Can be updated independently of other survey fields
- Pass `null` to remove an image

**Request Body**:
```json
{
  "title_en": "Updated Title",
  "title_ar": "العنوان المحدث",
  "description_en": "Updated description",
  "description_ar": "الوصف المحدث",
  "customer_type": "pilgrims",
  "image_url": "data:image/png;base64,...",
  "questions": [...]
}
```

## Frontend Changes

### Admin Survey Creation Form
File: `src/app/admin/surveys/create/page.tsx`

**New Features**:
- Image upload input field with drag-and-drop support
- File size validation (max 5MB)
- Image preview before submission
- Remove image button
- Bilingual labels (Arabic/English)

**State Management**:
```typescript
const [imageUrl, setImageUrl] = useState<string | null>(null);
```

**Handler Functions**:
- `handleImageUpload()`: Converts image to base64 data URL
- `removeImage()`: Clears the selected image

### Admin Survey Edit Form
File: `src/app/admin/surveys/[id]/edit/page.tsx`

**Features**:
- Same image upload functionality as create form
- Loads existing image on page load
- Allows updating or removing existing images
- Bilingual support

### Front Page Survey Display
File: `src/app/page.tsx`

**Changes**:
- Displays uploaded image if available
- Falls back to default Kaaba SVG if no image is provided
- Image dimensions: 128x128px (w-32 h-32)
- Responsive container with gray background

**Display Logic**:
```typescript
{survey.image_url ? (
  <img src={survey.image_url} alt={title} className="w-32 h-32 object-contain" />
) : (
  <img src="/kaaba.svg" alt="Kaaba" className="w-32 h-32 object-contain" />
)}
```

## Internationalization (i18n)

### New Translation Keys

**English** (`src/i18n/locales/en.json`):
```json
{
  "survey": {
    "image": "Survey Image",
    "imageUpload": "Upload Image",
    "imageOptional": "Image (Optional)",
    "selectImage": "Select Image",
    "uploadImage": "Upload Image",
    "imagePreview": "Image Preview",
    "noImageSelected": "No image selected",
    "imageSizeWarning": "Image will be stored as base64. Keep file size reasonable (under 2MB recommended)"
  }
}
```

**Arabic** (`src/i18n/locales/ar.json`):
```json
{
  "survey": {
    "image": "صورة الاستبيان",
    "imageUpload": "تحميل الصورة",
    "imageOptional": "الصورة (اختياري)",
    "selectImage": "اختر صورة",
    "uploadImage": "تحميل الصورة",
    "imagePreview": "معاينة الصورة",
    "noImageSelected": "لم يتم اختيار صورة",
    "imageSizeWarning": "سيتم تخزين الصورة كـ base64 في قاعدة البيانات"
  }
}
```

## Technical Details

### Base64 Encoding
- Images are converted to base64 format using the FileReader API
- Data URLs include the MIME type: `data:image/[type];base64,[data]`
- Supported formats: PNG, JPG, GIF, WebP, etc.

### File Size Validation
- Maximum file size: 5MB
- Validation occurs on the client side before upload
- Error message displayed if file exceeds limit

### Image Preview
- Shows a preview of the selected image before submission
- Preview container: 128x128px with object-contain
- Green border indicates successful selection

### Database Storage
- Images stored as TEXT in the `image_url` column
- Base64 strings can be quite large (typically 1-3MB for reasonable images)
- Consider database backup size when storing many large images

## Usage Guide

### For Admins

#### Creating a Survey with Image
1. Navigate to "Create New Survey"
2. Fill in survey details (title, description, etc.)
3. In the "Survey Image (Optional)" section, click to upload
4. Select an image file (PNG, JPG, GIF)
5. Preview the image
6. Click "Create Survey"

#### Editing a Survey Image
1. Navigate to "Edit Survey"
2. Scroll to the "Survey Image (Optional)" section
3. To change image: Click "Remove" then upload a new image
4. To remove image: Click "Remove"
5. Click "Update Survey"

#### On the Front Page
- Surveys with images display the uploaded image
- Surveys without images display the default Kaaba SVG
- Images are displayed in a 128x128px container

## Performance Considerations

### Database Size
- Each base64-encoded image adds ~1.3x the original file size
- A 1MB image becomes ~1.3MB in the database
- Consider implementing image compression before upload

### Loading Performance
- Large base64 strings are embedded in API responses
- Consider lazy loading or pagination for surveys with many images
- Browser caching helps with repeated page loads

### Optimization Tips
1. Compress images before uploading (use tools like TinyPNG)
2. Use appropriate image formats (PNG for graphics, JPG for photos)
3. Keep images under 500KB for optimal performance
4. Consider implementing image resizing on the client side

## Troubleshooting

### Image Not Displaying
1. Check browser console for errors
2. Verify image_url is not null in database
3. Ensure base64 string is valid
4. Check image MIME type is supported

### File Upload Fails
1. Verify file size is under 5MB
2. Check file format is supported (PNG, JPG, GIF)
3. Ensure browser has FileReader API support
4. Check browser console for specific error messages

### Database Issues
1. Verify migration script was executed
2. Check image_url column exists in surveys table
3. Ensure sufficient disk space for base64 data
4. Monitor database size growth

## Future Enhancements

Potential improvements for future versions:
1. Image compression on client side
2. Image cropping/resizing tool
3. Multiple images per survey
4. Image gallery view
5. CDN integration for external storage
6. Image optimization service integration
7. Thumbnail generation
8. Image metadata extraction

## Security Considerations

1. **File Type Validation**: Only image files are accepted
2. **File Size Limits**: 5MB maximum to prevent abuse
3. **Base64 Encoding**: Safe for database storage
4. **XSS Prevention**: Images are served as data URLs, not from user input
5. **CORS**: No external requests needed

## Rollback Instructions

If you need to remove this feature:

1. Remove image_url column from database:
```sql
ALTER TABLE surveys DROP COLUMN IF EXISTS image_url;
DROP INDEX IF EXISTS idx_surveys_image_url;
```

2. Revert code changes in:
   - `src/app/admin/surveys/create/page.tsx`
   - `src/app/admin/surveys/[id]/edit/page.tsx`
   - `src/app/page.tsx`
   - `src/app/api/surveys/route.ts`
   - `src/app/api/surveys/[id]/route.ts`

3. Remove translation keys from i18n files

## Testing Checklist

- [ ] Create survey with image
- [ ] Create survey without image
- [ ] Edit survey to add image
- [ ] Edit survey to change image
- [ ] Edit survey to remove image
- [ ] Verify image displays on front page
- [ ] Verify default Kaaba displays when no image
- [ ] Test with various image formats (PNG, JPG, GIF)
- [ ] Test file size validation (upload >5MB file)
- [ ] Test bilingual labels (Arabic/English)
- [ ] Test on mobile devices
- [ ] Verify database stores base64 correctly
- [ ] Test API endpoints with image_url parameter
