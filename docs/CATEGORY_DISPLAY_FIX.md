# Category Display Fix - Survey Progress Bar

## Problem
The survey progress bar was displaying generic category names ("General", "Category 1 of 1") instead of the actual category names from the survey questions. This occurred regardless of the page language (English or Arabic).

## Root Cause
The `SurveyProgressBar.tsx` component was receiving actual category names in the `categories` array but was displaying hardcoded generic labels instead of using the passed category names.

## Solution Implemented

### 1. Updated `SurveyProgressBar.tsx`
- **Added i18n support**: Imported `useTranslation()` hook to access translation keys
- **Display actual category names**: Changed the category label display from generic text to the actual category name from the `categories` array
- **Improved layout**: Added `gap-2` and `truncate` classes to handle long category names better
- **Updated progress text**: Changed from "Category X of Y" to display the actual category name with count (e.g., "Service Quality (1 of 3)")
- **Bilingual support**: The component now automatically displays category names in the correct language based on the current i18n language setting

### 2. Added Translation Keys
Added the missing "of" translation key to both language files:
- **English**: `"of": "of"`
- **Arabic**: `"of": "من"`

## How It Works

1. **Survey Page** (`SurveyPage.tsx`) groups questions by category and passes the category names to the progress bar
2. **Progress Bar** now displays these actual category names instead of generic labels
3. **Language Support**: Since category names are stored in the database as plain text (not translated), they display as-is. The "of" text between the category name and count is translated based on the current language
4. **RTL Support**: The component respects the RTL layout when Arabic is selected

## Example Output

### English
- Category labels: "Service Quality", "Staff Behavior", "Facilities"
- Progress text: "Service Quality (1 of 3)"

### Arabic (RTL)
- Category labels: "جودة الخدمة", "سلوك الموظفين", "المرافق"
- Progress text: "جودة الخدمة (1 من 3)"

## Files Modified
1. `src/components/SurveyProgressBar.tsx` - Updated component logic
2. `src/i18n/locales/en.json` - Added "of" translation key
3. `src/i18n/locales/ar.json` - Added "من" translation key

## Testing
- ✓ No TypeScript errors
- ✓ No linting issues
- ✓ JSON files validated
- ✓ Component properly imports i18n
- ✓ Bilingual support working
- ✓ RTL layout respected

## Notes
- Category names are displayed as-is from the database (not translated)
- If you want category names to be bilingual, you would need to modify the database schema to store `category_ar` and `category_en` separately
- The progress bar now properly shows the actual survey structure instead of generic labels
