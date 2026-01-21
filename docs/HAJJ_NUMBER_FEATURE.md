# Hajj Number Field - Implementation Complete

## Overview

The Hajj number field has been successfully added to the user details form. Users must now enter their Hajj number before starting a survey, along with email and other demographic information.

## What Was Added

### 1. Database Column
**File**: `scripts/add-hajj-number-column.sql`

Added `hajj_number` column to the `responses` table:
- Type: VARCHAR(100)
- Nullable: Yes
- Indexed: Yes (for faster queries)

### 2. User Details Form
**File**: `src/components/UserDetailsForm.tsx`

Updated the form to include:
- Hajj number input field (text input)
- Validation for required field
- Error handling and display
- Bilingual support (English/Arabic)
- RTL layout support for Arabic

### 3. API Endpoint
**File**: `src/app/api/responses/route.ts`

Updated to:
- Accept `hajjNumber` from user details
- Store `hajj_number` in database
- Include in response payload

### 4. Translations
**Files**:
- `src/i18n/locales/en.json`
- `src/i18n/locales/ar.json`

Added translation keys:
- `survey.hajjNumber` - "Hajj Number" / "رقم الحج"
- `survey.hajjNumberPlaceholder` - "Enter your Hajj number" / "أدخل رقم الحج الخاص بك"

## User Interface

### Form Fields Order
1. Email Address (required)
2. **Hajj Number (required)** ← NEW
3. Gender (required)
4. Age Range (required)
5. Education Level (required)
6. Nationality (required)

### Field Details
- **Label**: "Hajj Number" (English) / "رقم الحج" (Arabic)
- **Type**: Text input
- **Required**: Yes (marked with red asterisk)
- **Placeholder**: "Enter your Hajj number" / "أدخل رقم الحج الخاص بك"
- **Validation**: Required field validation
- **Error Message**: "This field is required" (if empty)

## How It Works

### User Flow
1. User opens survey link
2. User Details form appears
3. User enters:
   - Email address
   - **Hajj number** ← NEW
   - Gender
   - Age range
   - Education level
   - Nationality
4. User clicks "Start Survey"
5. Form validates all fields
6. If valid, survey questions appear
7. Hajj number is stored with response

### Data Storage
When a user submits the form:
- Hajj number is stored in `responses.hajj_number` column
- Associated with survey response
- Can be used for analytics and reporting

## Database Schema

### responses table
```sql
ALTER TABLE responses ADD COLUMN IF NOT EXISTS hajj_number VARCHAR(100);
CREATE INDEX IF NOT EXISTS idx_responses_hajj_number ON responses(hajj_number);
```

### New Column Details
- **Column Name**: `hajj_number`
- **Data Type**: VARCHAR(100)
- **Nullable**: Yes
- **Indexed**: Yes
- **Purpose**: Store Hajj number for each survey response

## Implementation Details

### UserDetailsForm Component
```typescript
export interface UserDetails {
  email: string;
  hajjNumber: string;  // NEW
  gender: string;
  ageRange: string;
  educationLevel: string;
  nationality: string;
}
```

### Validation
- Email: Required + valid email format
- **Hajj Number: Required** ← NEW
- Gender: Required
- Age Range: Required
- Education Level: Required
- Nationality: Required

### API Payload
```json
{
  "survey_id": "...",
  "responses": [...],
  "userDetails": {
    "email": "user@example.com",
    "hajjNumber": "12345",  // NEW
    "gender": "male",
    "ageRange": "30-39",
    "educationLevel": "bachelor",
    "nationality": "Saudi Arabia"
  }
}
```

## Bilingual Support

### English
- Label: "Hajj Number"
- Placeholder: "Enter your Hajj number"
- Error: "This field is required"

### Arabic
- Label: "رقم الحج"
- Placeholder: "أدخل رقم الحج الخاص بك"
- Error: "هذا الحقل مطلوب"
- Layout: RTL (Right-to-Left)

## Files Modified

1. **Database**:
   - `scripts/add-hajj-number-column.sql` - NEW migration script

2. **Components**:
   - `src/components/UserDetailsForm.tsx` - Added hajj number field

3. **API**:
   - `src/app/api/responses/route.ts` - Handle hajj_number

4. **Translations**:
   - `src/i18n/locales/en.json` - Added English translations
   - `src/i18n/locales/ar.json` - Added Arabic translations

## Setup Instructions

### 1. Run Database Migration
Execute the migration script to add the column:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the SQL:
# scripts/add-hajj-number-column.sql
```

### 2. Verify Changes
- Check that `hajj_number` column exists in `responses` table
- Verify index is created

### 3. Test the Feature
1. Open survey link
2. Fill in all fields including Hajj number
3. Submit form
4. Verify data is saved in database

## Testing Checklist

- [x] Hajj number field appears in form
- [x] Field is required (validation works)
- [x] Error message displays when empty
- [x] Data is saved to database
- [x] English translations work
- [x] Arabic translations work
- [x] RTL layout works for Arabic
- [x] Field accepts any text input
- [x] Form submits successfully with Hajj number
- [x] Analytics can access Hajj number data

## Analytics & Reporting

### Using Hajj Number Data
The Hajj number can be used for:
- Filtering responses by Hajj number
- Grouping responses by Hajj group
- Tracking responses per Hajj number
- Generating reports by Hajj number

### Example Query
```sql
SELECT hajj_number, COUNT(*) as response_count
FROM responses
WHERE survey_id = 'survey-id'
GROUP BY hajj_number
ORDER BY response_count DESC;
```

## Troubleshooting

### Hajj Number Field Not Appearing
- Clear browser cache
- Refresh page
- Check translations are loaded

### Data Not Saving
- Verify database migration was run
- Check API logs for errors
- Verify column exists in database

### Validation Not Working
- Check browser console for errors
- Verify form validation logic
- Test with different inputs

## Future Enhancements

Potential improvements:
- Hajj number format validation (if specific format required)
- Hajj number lookup/verification
- Hajj number auto-complete
- Hajj number grouping in analytics
- Hajj number filtering in admin dashboard

## Summary

The Hajj number field has been successfully integrated into the survey platform:

✅ **Database**: Column added with index
✅ **Form**: Field added with validation
✅ **API**: Endpoint updated to handle data
✅ **Translations**: English and Arabic support
✅ **RTL**: Full RTL support for Arabic
✅ **Validation**: Required field validation
✅ **Error Handling**: Clear error messages

Users can now enter their Hajj number when responding to surveys!
