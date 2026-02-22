# Survey Image Upload - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Run Database Migration
```bash
# Using psql
psql -U your_user -d your_database -f scripts/add-image-url-column.sql

# Or using Supabase CLI
supabase db push
```

**Important**: If you already ran the old migration with the index, remove it first:
```sql
DROP INDEX IF EXISTS idx_surveys_image_url;
```

See `docs/IMAGE_UPLOAD_INDEX_FIX.md` for details on why the index was removed.

### 2. Deploy Code
All code changes are already implemented. Just deploy the updated files.

### 3. Test It Out
1. Go to Admin Dashboard → Create New Survey
2. Fill in survey details
3. Scroll to "Survey Image (Optional)" section
4. Click to upload an image (PNG, JPG, GIF)
5. Click "Create Survey"
6. Go to front page and see your image displayed!

## 📋 What's New

### For Admins
- **Create Survey**: Upload image when creating new survey
- **Edit Survey**: Change or remove survey image
- **Bilingual**: Full Arabic/English support

### For Users
- **Front Page**: See custom survey images instead of default Kaaba
- **Fallback**: Default Kaaba shown if no image provided

## 🎯 Key Features

✅ Base64 encoding (no external storage needed)
✅ File size validation (max 5MB)
✅ Image preview before upload
✅ Bilingual labels (Arabic/English)
✅ Optional field (surveys work without images)
✅ Easy to remove or update images

## 📁 Files Changed

```
survey-platform/
├── scripts/
│   └── add-image-url-column.sql (NEW)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── surveys/
│   │   │       ├── route.ts (MODIFIED)
│   │   │       └── [id]/route.ts (MODIFIED)
│   │   ├── admin/surveys/
│   │   │   ├── create/page.tsx (MODIFIED)
│   │   │   └── [id]/edit/page.tsx (MODIFIED)
│   │   └── page.tsx (MODIFIED)
│   └── i18n/locales/
│       ├── en.json (MODIFIED)
│       └── ar.json (MODIFIED)
└── docs/
    └── SURVEY_IMAGE_UPLOAD_FEATURE.md (NEW)
```

## 🔧 API Changes

### POST /api/surveys
```json
{
  "title_en": "Survey Title",
  "title_ar": "عنوان الاستبيان",
  "description_en": "Description",
  "description_ar": "الوصف",
  "customer_type": "pilgrims",
  "image_url": "data:image/png;base64,...",  // NEW - Optional
  "questions": [...]
}
```

### PUT /api/surveys/[id]
Same as above - `image_url` is optional and can be updated independently.

## 🖼️ Image Specifications

- **Formats**: PNG, JPG, GIF, WebP
- **Max Size**: 5MB
- **Recommended Size**: Under 500KB
- **Display Size**: 128x128px
- **Storage**: Base64 in database

## 🌍 Bilingual Support

### English Labels
- "Survey Image (Optional)"
- "Click to upload image"
- "Image Preview"
- "Remove"

### Arabic Labels
- "صورة الاستبيان (اختياري)"
- "انقر لتحميل صورة"
- "معاينة الصورة"
- "إزالة"

## ⚡ Performance Tips

1. **Compress images** before uploading (use TinyPNG, ImageOptim)
2. **Keep under 500KB** for optimal performance
3. **Use appropriate format**: PNG for graphics, JPG for photos
4. **Monitor database size** as images add ~30% to storage

## 🐛 Troubleshooting

### Image not showing on front page?
- Check if image_url is stored in database
- Verify base64 string is valid
- Check browser console for errors

### File upload fails?
- Ensure file is under 5MB
- Check file format is supported (PNG, JPG, GIF)
- Try a different image file

### Database migration fails?
- Verify database connection
- Check if column already exists
- Ensure sufficient permissions

## 📚 Full Documentation

For detailed information, see:
- `docs/SURVEY_IMAGE_UPLOAD_FEATURE.md` - Complete documentation
- `SURVEY_IMAGE_IMPLEMENTATION_SUMMARY.md` - Implementation details

## ✅ Testing Checklist

- [ ] Database migration executed successfully
- [ ] Create survey with image
- [ ] Create survey without image
- [ ] Image displays on front page
- [ ] Default Kaaba shows when no image
- [ ] Edit survey to change image
- [ ] Edit survey to remove image
- [ ] File size validation works (try >5MB)
- [ ] Bilingual labels display correctly
- [ ] Works on mobile devices

## 🎉 You're Done!

The survey image upload feature is now ready to use. Start creating surveys with custom images!

## 💡 Tips

1. **Best Practice**: Use consistent image sizes for better UI
2. **Branding**: Use your organization's logo or branded images
3. **Accessibility**: Use descriptive alt text (automatically set to survey title)
4. **Performance**: Compress images to keep database size manageable

## 🆘 Need Help?

1. Check `docs/SURVEY_IMAGE_UPLOAD_FEATURE.md` for detailed troubleshooting
2. Review code comments in modified files
3. Check browser console for JavaScript errors
4. Verify database migration was successful

---

**Version**: 1.0
**Last Updated**: 2024
**Status**: Ready for Production
