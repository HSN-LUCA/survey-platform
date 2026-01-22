# Respondents Dashboard - API Fix & Bilingual Implementation

## Overview
Fixed the 500 error in the Respondents Dashboard API and implemented full bilingual (Arabic/English) support for the respondents management page.

## Issues Fixed

### 1. API 500 Error
**Problem:** `/api/respondents` endpoint was returning 500 error when trying to fetch respondent data.

**Root Cause:** 
- The API was using specific column selection which could fail if columns didn't exist or if there were Supabase connection issues
- No proper error logging to diagnose the issue

**Solution:**
- Updated `src/app/api/respondents/route.ts` with improved error handling:
  - Added connection verification before fetching data
  - Changed from specific column selection to wildcard select (`*`) to get all available columns
  - Added detailed console logging for debugging
  - Improved error messages with connection details
  - Graceful fallback for missing columns (using `|| 'N/A'`)

### 2. Bilingual UI Implementation
**Problem:** Respondents page had hardcoded English text, no Arabic translations.

**Solution:**
- Added comprehensive i18n translations to both `en.json` and `ar.json`:
  - `respondentsTitle`: "Respondents" / "المستجيبون"
  - `respondentsDescription`: "View and manage survey respondents" / "عرض وإدارة مستجيبي الاستبيان"
  - `respondentEmail`, `respondentPhone`, `respondentHajjNumber`, etc.
  - `exportCSV`, `searchPlaceholder`, `allSurveys`, `noRespondentsFound`
  - `showingRespondents`, `respondentsOf`

- Updated `src/app/admin/respondents/page.tsx` to use `t()` function for all UI text:
  - Page title and description
  - Table headers
  - Filter labels
  - Export button
  - Error messages
  - Empty state message
  - Summary text

- Added "search" to common translations for consistency

## Files Modified

1. **`src/app/api/respondents/route.ts`**
   - Improved error handling and logging
   - Changed to wildcard column selection
   - Added connection verification

2. **`src/app/admin/respondents/page.tsx`**
   - Replaced all hardcoded English text with `t()` function calls
   - Now fully supports Arabic/English based on user's language preference

3. **`src/i18n/locales/en.json`**
   - Added 16 new respondents-related translations
   - Added "search" to common section

4. **`src/i18n/locales/ar.json`**
   - Added 16 new Arabic translations for respondents
   - Added "search" to common section

## How to Test

1. **Verify API is working:**
   - Open browser DevTools → Network tab
   - Navigate to Admin Dashboard → Respondents
   - Check that `/api/respondents` returns 200 status with respondent data

2. **Test bilingual support:**
   - Switch language to Arabic using the language switcher
   - All respondents page text should display in Arabic
   - Switch back to English to verify English text

3. **Test with actual data:**
   - Submit a survey with respondent details (email, hajj number, etc.)
   - Navigate to Respondents page
   - Verify the submitted respondent appears in the table

4. **Test filtering and export:**
   - Use search box to filter by email, phone, hajj number, or nationality
   - Use survey dropdown to filter by specific survey
   - Click "Export CSV" to download respondent data

## Database Requirements

The following columns must exist in the `responses` table:
- `id` (UUID)
- `survey_id` (UUID)
- `user_session_id` (VARCHAR)
- `email` (VARCHAR)
- `gender` (VARCHAR)
- `age_range` (VARCHAR)
- `education_level` (VARCHAR)
- `nationality` (VARCHAR)
- `hajj_number` (VARCHAR)
- `submitted_at` (TIMESTAMP)

If these columns don't exist, run the migration scripts:
```bash
# Add hajj_number column
psql -U postgres -h nbjuyltaeunxcishhwqu.supabase.co -d postgres -f scripts/add-hajj-number-column.sql

# Add user details columns
psql -U postgres -h nbjuyltaeunxcishhwqu.supabase.co -d postgres -f scripts/add-user-details-columns.sql
```

## Next Steps

1. Deploy changes to Vercel
2. Test with live respondent data
3. Monitor API logs for any errors
4. Verify bilingual UI works correctly in production

## Troubleshooting

If you still see "No respondents found":
1. Check that surveys have been submitted with respondent details
2. Verify the `responses` table has data in Supabase
3. Check browser console for any error messages
4. Check Vercel function logs for API errors

If you see API 500 error:
1. Check Vercel environment variables are set correctly
2. Verify Supabase credentials in `.env.production`
3. Check Supabase database is accessible
4. Review Vercel function logs for detailed error messages
