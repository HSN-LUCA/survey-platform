# Hajj Number Field - Quick Start

## What's New

Users must now enter their **Hajj number** before starting a survey. This field appears right after the email field in the user details form.

## User Experience

### Before (Old Flow)
1. Email
2. Gender
3. Age Range
4. Education Level
5. Nationality
6. Start Survey

### After (New Flow)
1. Email
2. **Hajj Number** ← NEW
3. Gender
4. Age Range
5. Education Level
6. Nationality
7. Start Survey

## Setup

### Step 1: Run Database Migration
```bash
# Execute the migration script
supabase db push

# Or run manually:
# scripts/add-hajj-number-column.sql
```

### Step 2: Verify
- Check that `hajj_number` column exists in `responses` table
- Verify the app loads without errors

### Step 3: Test
1. Open a survey link
2. Fill in all fields including Hajj number
3. Submit the form
4. Verify data appears in database

## Field Details

| Property | Value |
|----------|-------|
| **Label** | Hajj Number (English) / رقم الحج (Arabic) |
| **Type** | Text input |
| **Required** | Yes |
| **Placeholder** | Enter your Hajj number |
| **Validation** | Required field |
| **Position** | After email, before gender |

## Bilingual Support

### English
- Label: "Hajj Number"
- Placeholder: "Enter your Hajj number"

### Arabic
- Label: "رقم الحج"
- Placeholder: "أدخل رقم الحج الخاص بك"
- Layout: RTL (automatic)

## Database

### New Column
```sql
ALTER TABLE responses ADD COLUMN IF NOT EXISTS hajj_number VARCHAR(100);
```

### Query Examples
```sql
-- Get all responses with Hajj number
SELECT hajj_number, email, submitted_at 
FROM responses 
WHERE survey_id = 'survey-id'
ORDER BY submitted_at DESC;

-- Count responses by Hajj number
SELECT hajj_number, COUNT(*) as count
FROM responses
WHERE survey_id = 'survey-id'
GROUP BY hajj_number;
```

## Files Changed

1. `src/components/UserDetailsForm.tsx` - Added field
2. `src/app/api/responses/route.ts` - Handle data
3. `src/i18n/locales/en.json` - English translations
4. `src/i18n/locales/ar.json` - Arabic translations
5. `scripts/add-hajj-number-column.sql` - Database migration

## Testing

### Manual Test
1. Open survey
2. Try submitting without Hajj number → Should show error
3. Enter Hajj number and submit → Should work
4. Check database → Hajj number should be saved

### Automated Test
```bash
npm test
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Field not showing | Clear cache, refresh page |
| Validation not working | Check browser console for errors |
| Data not saving | Verify database migration ran |
| Arabic text wrong | Check translation keys in ar.json |

## Analytics

### Using Hajj Number
- Filter responses by Hajj number
- Group responses by Hajj group
- Generate reports by Hajj number
- Track response rates per Hajj number

## FAQ

**Q: Is Hajj number required?**
A: Yes, users must enter it to proceed.

**Q: What format should Hajj number be?**
A: Any text format is accepted (no specific format validation).

**Q: Can I make it optional?**
A: Yes, modify the validation in UserDetailsForm.tsx.

**Q: How do I query by Hajj number?**
A: Use SQL: `WHERE hajj_number = 'value'`

**Q: Does it work in Arabic?**
A: Yes, full Arabic support with RTL layout.

## Summary

✅ Hajj number field added to user details form
✅ Database column created
✅ Bilingual support (English/Arabic)
✅ RTL layout for Arabic
✅ Required field validation
✅ Data saved with survey responses

Users can now enter their Hajj number when responding to surveys!
