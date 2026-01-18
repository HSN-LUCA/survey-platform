# Bilingual Options Feature - Complete Guide

## Overview

The survey options feature now supports full bilingual (English/Arabic) options with preset option templates. Admins can quickly add options in both languages without manually typing them each time.

## Features

### 1. Preset Options
- 30+ pre-configured options in both English and Arabic
- Organized into 8 categories for easy selection
- One-click loading of entire option sets

### 2. Bilingual Support
- Each option has English and Arabic versions
- Automatically displayed in the user's selected language
- Full RTL support for Arabic

### 3. Custom Options
- Add custom options in both languages
- Mix preset and custom options
- Full control over option text

### 4. Easy Management
- View all current options
- Remove individual options
- Clear all options at once
- Add options one by one

---

## Preset Option Categories

### 1. Agreement (5 options)
- Strongly Agree / أوافق بشدة
- Agree / أوافق
- Neutral / محايد
- Disagree / لا أوافق
- Strongly Disagree / لا أوافق بشدة

### 2. Yes/No (3 options)
- Yes / نعم
- No / لا
- Maybe / ربما

### 3. Satisfaction (5 options)
- Very Satisfied / راضٍ جداً
- Satisfied / راضٍ
- Somewhat Satisfied / راضٍ إلى حد ما
- Dissatisfied / غير راضٍ
- Very Dissatisfied / غير راضٍ جداً

### 4. Likelihood (4 options)
- Very Likely / محتمل جداً
- Likely / محتمل
- Unlikely / غير محتمل
- Very Unlikely / غير محتمل جداً

### 5. Quality (4 options)
- Excellent / ممتاز
- Good / جيد
- Fair / مقبول
- Poor / سيء

### 6. Frequency (5 options)
- Always / دائماً
- Often / غالباً
- Sometimes / أحياناً
- Rarely / نادراً
- Never / أبداً

### 7. Importance (4 options)
- Very Important / مهم جداً
- Important / مهم
- Somewhat Important / مهم إلى حد ما
- Not Important / غير مهم

### 8. Recommendation (2 options)
- Would Recommend / سأوصي به
- Would Not Recommend / لن أوصي به

### 9. Service Quality (4 options)
- Excellent Service / خدمة ممتازة
- Good Service / خدمة جيدة
- Average Service / خدمة متوسطة
- Poor Service / خدمة سيئة

---

## How to Use

### Creating a Survey with Preset Options

1. **Go to Create Survey**
   - Admin Dashboard → Create Survey

2. **Add a Question**
   - Click "Add Question"
   - Fill in question text (English & Arabic)
   - Select "Multiple Choice" as question type

3. **Load Preset Options**
   - Scroll to "Use Preset Options" section
   - Select a category from the dropdown
   - Options are automatically loaded

4. **View Current Options**
   - See all loaded options displayed
   - Each option shows English and Arabic text
   - Remove individual options if needed

5. **Add Custom Options (Optional)**
   - Enter English text in first field
   - Enter Arabic text in second field
   - Click "+ Add Option"
   - Repeat for more custom options

6. **Create Survey**
   - Click "Create Survey"
   - Survey is saved with all options

### Example: Creating a Satisfaction Survey

1. Create survey: "Customer Satisfaction"
2. Add Question 1: "How satisfied are you?"
   - Type: Multiple Choice
   - Load Preset: "Satisfaction"
   - Options loaded: Very Satisfied, Satisfied, Somewhat Satisfied, Dissatisfied, Very Dissatisfied

3. Add Question 2: "Would you recommend us?"
   - Type: Multiple Choice
   - Load Preset: "Recommendation"
   - Options loaded: Would Recommend, Would Not Recommend

4. Add Question 3: "Service Quality?"
   - Type: Multiple Choice
   - Load Preset: "Service Quality"
   - Options loaded: Excellent Service, Good Service, Average Service, Poor Service

5. Create Survey
   - All questions with bilingual options are saved

---

## Technical Details

### File Structure

```
survey-platform/
├── src/
│   ├── config/
│   │   └── presetOptions.ts (NEW)
│   ├── app/
│   │   └── admin/surveys/create/page.tsx (UPDATED)
│   ├── app/api/surveys/route.ts (UPDATED)
│   └── i18n/locales/
│       ├── en.json (UPDATED)
│       └── ar.json (UPDATED)
```

### Option Data Structure

**Old Format** (String):
```typescript
options: ['Option 1', 'Option 2']
```

**New Format** (Object):
```typescript
interface Option {
  id: string;
  text_en: string;
  text_ar: string;
}

options: [
  {
    id: 'option-1',
    text_en: 'Option 1',
    text_ar: 'الخيار 1'
  },
  {
    id: 'option-2',
    text_en: 'Option 2',
    text_ar: 'الخيار 2'
  }
]
```

### API Compatibility

The API handles both formats:
- Old format (strings) - converted to bilingual format
- New format (objects) - used as-is

This ensures backward compatibility with existing surveys.

---

## Database Schema

The `options` table already supports bilingual options:

```sql
CREATE TABLE options (
  id UUID PRIMARY KEY,
  question_id UUID NOT NULL,
  text_en VARCHAR(255) NOT NULL,
  text_ar VARCHAR(255) NOT NULL,
  order_num INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);
```

No database changes needed - the schema already supports this feature!

---

## User Experience

### For Admins

**Before**:
- Type each option manually
- Only in one language
- Repeat for every survey

**After**:
- Select preset category
- All options loaded in both languages
- Add custom options if needed
- Save time and ensure consistency

### For Users

**Before**:
- Options only in one language
- Switch language to see different text

**After**:
- Options automatically in their language
- Seamless bilingual experience
- RTL layout for Arabic

---

## Features

✅ 30+ preset options
✅ 8 organized categories
✅ Full bilingual support (English/Arabic)
✅ RTL layout for Arabic
✅ Custom option support
✅ Mix preset and custom options
✅ Easy option management
✅ One-click option loading
✅ Backward compatible
✅ No database changes needed

---

## Testing

### Test Checklist

- [ ] Create survey with preset options
- [ ] Verify all options load correctly
- [ ] Check English text displays correctly
- [ ] Check Arabic text displays correctly
- [ ] Add custom options
- [ ] Mix preset and custom options
- [ ] Remove individual options
- [ ] Clear all options
- [ ] Take survey in English
- [ ] Take survey in Arabic
- [ ] Verify RTL layout for Arabic
- [ ] Test on mobile device

### Test Survey

**Survey**: Customer Feedback

**Question 1**: How satisfied are you?
- Type: Multiple Choice
- Preset: Satisfaction
- Expected: 5 options in both languages

**Question 2**: Would you recommend?
- Type: Multiple Choice
- Preset: Recommendation
- Expected: 2 options in both languages

**Question 3**: Service Quality?
- Type: Multiple Choice
- Preset: Service Quality
- Expected: 4 options in both languages

---

## Preset Options Reference

### All 30+ Options

| ID | English | Arabic |
|----|---------|--------|
| strongly_agree | Strongly Agree | أوافق بشدة |
| agree | Agree | أوافق |
| neutral | Neutral | محايد |
| disagree | Disagree | لا أوافق |
| strongly_disagree | Strongly Disagree | لا أوافق بشدة |
| yes | Yes | نعم |
| no | No | لا |
| maybe | Maybe | ربما |
| very_satisfied | Very Satisfied | راضٍ جداً |
| satisfied | Satisfied | راضٍ |
| somewhat_satisfied | Somewhat Satisfied | راضٍ إلى حد ما |
| dissatisfied | Dissatisfied | غير راضٍ |
| very_dissatisfied | Very Dissatisfied | غير راضٍ جداً |
| very_likely | Very Likely | محتمل جداً |
| likely | Likely | محتمل |
| unlikely | Unlikely | غير محتمل |
| very_unlikely | Very Unlikely | غير محتمل جداً |
| excellent | Excellent | ممتاز |
| good | Good | جيد |
| fair | Fair | مقبول |
| poor | Poor | سيء |
| always | Always | دائماً |
| often | Often | غالباً |
| sometimes | Sometimes | أحياناً |
| rarely | Rarely | نادراً |
| never | Never | أبداً |
| very_important | Very Important | مهم جداً |
| important | Important | مهم |
| somewhat_important | Somewhat Important | مهم إلى حد ما |
| not_important | Not Important | غير مهم |
| would_recommend | Would Recommend | سأوصي به |
| would_not_recommend | Would Not Recommend | لن أوصي به |
| excellent_service | Excellent Service | خدمة ممتازة |
| good_service | Good Service | خدمة جيدة |
| average_service | Average Service | خدمة متوسطة |
| poor_service | Poor Service | خدمة سيئة |

---

## Adding More Preset Options

To add more preset options:

1. **Edit** `src/config/presetOptions.ts`
2. **Add** new option to `PRESET_OPTIONS` array:
   ```typescript
   {
     id: 'new_option_id',
     text_en: 'English Text',
     text_ar: 'النص العربي',
   }
   ```
3. **Add** to category in `PRESET_OPTIONS_BY_CATEGORY`:
   ```typescript
   newCategory: ['new_option_id', ...]
   ```
4. **Update** translations in `en.json` and `ar.json`
5. **Restart** dev server

---

## Performance

- ✅ No additional database queries
- ✅ Options loaded from config file
- ✅ Instant option loading
- ✅ Minimal memory footprint
- ✅ Scales to any number of options

---

## Backward Compatibility

- ✅ Old surveys continue to work
- ✅ Old option format (strings) still supported
- ✅ API handles both formats
- ✅ No breaking changes
- ✅ No database migration needed

---

## Future Enhancements

Possible improvements:
- Custom preset categories
- Save custom option sets
- Option templates per survey type
- Import/export options
- Option analytics
- Most used options tracking

---

## Support

### Documentation
- This file: `BILINGUAL_OPTIONS_FEATURE.md`
- Preset options config: `src/config/presetOptions.ts`
- Create survey form: `src/app/admin/surveys/create/page.tsx`

### Questions?
1. Check the preset options config file
2. Review the create survey form code
3. Check the translations in i18n files
4. Review this documentation

---

## Summary

✅ **Feature**: Bilingual preset options
✅ **Status**: Complete and ready to use
✅ **Languages**: English and Arabic
✅ **Options**: 30+ preset options in 8 categories
✅ **Custom**: Support for custom options
✅ **Backward Compatible**: Works with existing surveys
✅ **No Migration**: No database changes needed

**Start using it now!**
