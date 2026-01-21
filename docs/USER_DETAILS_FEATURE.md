# User Details Collection Feature

## Overview

Users now must provide their personal information before starting a survey. This allows you to collect demographic data along with survey responses.

## What's New

### User Details Form

When a user clicks "Start Survey" on the home page, they now see a form asking for:

1. **Email Address** (required)
   - Must be a valid email format
   - Stored with the response

2. **Gender** (required)
   - Options: Male, Female
   - Dropdown selection

3. **Age Range** (required)
   - Options:
     - 8 - 29 years
     - 30 - 39 years
     - 40 - 55 years
     - 56 - 60 years
     - 60+ years
   - Dropdown selection

4. **Education Level** (required)
   - Options:
     - Primary
     - Secondary
     - Diploma
     - Bachelor's Degree
     - Master's Degree
     - PhD
   - Dropdown selection

5. **Nationality** (required)
   - Free text input
   - Any country name

### Form Validation

All fields are required. The form validates:
- Email format (must be valid email)
- All dropdowns must have a selection
- Nationality must not be empty

If validation fails, error messages appear below each field.

### Multi-Language Support

The form is fully bilingual:
- **English**: All labels and options in English
- **Arabic**: All labels and options in Arabic

Language switching works seamlessly - users can switch languages while filling the form.

## Database Changes

### Updated `responses` Table

New columns added to store user details:

```sql
email VARCHAR(255)
gender VARCHAR(50)
age_range VARCHAR(50)
education_level VARCHAR(100)
nationality VARCHAR(100)
```

These columns are populated when a response is submitted.

### Migration

If you have an existing database, run this SQL to add the new columns:

```sql
ALTER TABLE responses ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE responses ADD COLUMN IF NOT EXISTS gender VARCHAR(50);
ALTER TABLE responses ADD COLUMN IF NOT EXISTS age_range VARCHAR(50);
ALTER TABLE responses ADD COLUMN IF NOT EXISTS education_level VARCHAR(100);
ALTER TABLE responses ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_responses_email ON responses(email);
```

## User Flow

1. User goes to home page (http://localhost:3000)
2. User sees survey cards
3. User clicks "Start Survey" button
4. **NEW**: User details form appears
5. User fills in all required fields
6. User clicks "Start Survey" button on the form
7. Survey questions appear
8. User answers questions
9. User submits survey
10. Success message appears

## Admin Dashboard

### Viewing Responses

When viewing survey responses in the admin dashboard, you can now see:

- User's email address
- Gender
- Age range
- Education level
- Nationality

This information appears alongside the survey answers.

### Filtering and Analysis

You can now:
- Filter responses by email
- Analyze responses by demographic (age, gender, education)
- Export demographic data with responses
- Create reports by nationality or education level

## API Changes

### POST /api/responses

The request body now includes user details:

```json
{
  "survey_id": "uuid",
  "responses": [
    {
      "question_id": "uuid",
      "value": "answer"
    }
  ],
  "userDetails": {
    "email": "user@example.com",
    "gender": "male",
    "ageRange": "30-39",
    "educationLevel": "bachelor",
    "nationality": "Saudi Arabia"
  }
}
```

### GET /api/responses

Response now includes user details:

```json
{
  "responses": [
    {
      "id": "uuid",
      "survey_id": "uuid",
      "user_session_id": "uuid",
      "email": "user@example.com",
      "gender": "male",
      "age_range": "30-39",
      "education_level": "bachelor",
      "nationality": "Saudi Arabia",
      "submitted_at": "2024-01-15T10:30:00Z",
      "answers": [...]
    }
  ]
}
```

## Files Changed

### New Files
- `src/components/UserDetailsForm.tsx` - User details form component

### Modified Files
- `src/components/SurveyPage.tsx` - Added user details form before survey
- `src/app/api/responses/route.ts` - Updated to handle user details
- `scripts/init-db.sql` - Added columns to responses table
- `src/i18n/locales/en.json` - Added English translations
- `src/i18n/locales/ar.json` - Added Arabic translations

## Translation Keys

### English
```json
"survey": {
  "userDetails": "Your Information",
  "userDetailsDescription": "Please provide your information before starting the survey",
  "email": "Email Address",
  "gender": "Gender",
  "male": "Male",
  "female": "Female",
  "ageRange": "Age Range",
  "age8to29": "8 - 29 years",
  "age30to39": "30 - 39 years",
  "age40to55": "40 - 55 years",
  "age56to60": "56 - 60 years",
  "age60plus": "60+ years",
  "educationLevel": "Education Level",
  "primary": "Primary",
  "secondary": "Secondary",
  "diploma": "Diploma",
  "bachelor": "Bachelor's Degree",
  "master": "Master's Degree",
  "phd": "PhD",
  "nationality": "Nationality",
  "startSurvey": "Start Survey"
}
```

### Arabic
```json
"survey": {
  "userDetails": "معلوماتك",
  "userDetailsDescription": "يرجى تقديم معلوماتك قبل بدء الاستبيان",
  "email": "عنوان البريد الإلكتروني",
  "gender": "الجنس",
  "male": "ذكر",
  "female": "أنثى",
  "ageRange": "نطاق العمر",
  "age8to29": "8 - 29 سنة",
  "age30to39": "30 - 39 سنة",
  "age40to55": "40 - 55 سنة",
  "age56to60": "56 - 60 سنة",
  "age60plus": "60+ سنة",
  "educationLevel": "مستوى التعليم",
  "primary": "ابتدائي",
  "secondary": "ثانوي",
  "diploma": "دبلوم",
  "bachelor": "درجة البكالوريوس",
  "master": "درجة الماجستير",
  "phd": "دكتوراه",
  "nationality": "الجنسية",
  "startSurvey": "ابدأ الاستبيان"
}
```

## Testing

### Test the Feature

1. Go to http://localhost:3000
2. Click "Start Survey" on any survey card
3. You should see the user details form
4. Try submitting without filling fields - validation errors appear
5. Fill in all fields with valid data
6. Click "Start Survey"
7. Survey questions should appear
8. Complete and submit the survey
9. Check admin dashboard to see user details with response

### Test Validation

- Try submitting with invalid email - error appears
- Try submitting with empty fields - errors appear
- Try submitting with valid data - form submits

### Test Multi-Language

1. Fill the form in English
2. Click language switcher to Arabic
3. Form labels and options should be in Arabic
4. Continue filling and submit
5. Switch back to English
6. Form should work correctly

## Future Enhancements

Possible improvements:
1. Add more demographic fields (phone, address, etc.)
2. Make some fields optional
3. Add custom demographic fields per survey
4. Add demographic filtering in admin dashboard
5. Add demographic reports and charts
6. Export demographic data separately

## Troubleshooting

### Form not appearing
- Clear browser cache
- Refresh the page
- Check browser console for errors

### Validation not working
- Check browser console for JavaScript errors
- Verify all translation keys are present
- Check that form component is properly imported

### User details not saving
- Check database has new columns
- Check API response for errors
- Verify Supabase connection is working

### Language not switching
- Check i18n configuration
- Verify translation keys exist in both languages
- Clear browser localStorage

## Support

For issues or questions about this feature, check:
- `src/components/UserDetailsForm.tsx` - Form component
- `src/components/SurveyPage.tsx` - Integration with survey
- `src/app/api/responses/route.ts` - API endpoint
- `scripts/init-db.sql` - Database schema
