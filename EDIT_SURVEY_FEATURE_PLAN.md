# Edit Survey Feature Implementation Plan

## Overview

Add the ability for administrators to edit existing surveys. This feature allows admins to modify survey details (title, description, customer type) and manage questions/options before responses are collected.

## Feature Scope

### What Can Be Edited
- Survey title (English & Arabic)
- Survey description (English & Arabic)
- Customer type (Pilgrims/Staff)
- Questions (add, edit, remove)
- Question options (add, edit, remove)
- Question categories
- Question types (before responses collected)

### What Cannot Be Edited
- Survey ID (immutable)
- Questions that have responses (to maintain data integrity)
- Question types after responses are collected

## Implementation Components

### 1. API Endpoint - PUT /api/surveys/[id]
**File**: `src/app/api/surveys/[id]/route.ts`

Add PUT handler to update survey:
- Validate authentication token
- Check if survey has responses
- If responses exist, only allow editing title/description
- If no responses, allow full editing (questions, options, etc.)
- Update survey metadata
- Handle question/option updates (add, modify, delete)
- Return updated survey

### 2. Edit Survey Page
**File**: `src/app/admin/surveys/[id]/edit/page.tsx` (new)

Create edit page similar to create page:
- Load existing survey data
- Display form with all fields pre-filled
- Show warning if survey has responses
- Disable question type changes if responses exist
- Handle form submission to API
- Redirect to survey detail on success

### 3. Survey List - Add Edit Button
**File**: `src/components/SurveyList.tsx`

Update survey list table:
- Add "Edit" button next to "View" and "Delete" buttons
- Link to edit page: `/admin/surveys/{id}/edit`
- Show edit button only if survey has no responses (optional)

### 4. Survey Detail Page - Add Edit Button
**File**: `src/app/admin/surveys/[id]/page.tsx`

Add edit button to survey detail header:
- Link to edit page
- Show warning if survey has responses
- Disable edit if responses exist (optional)

### 5. Translations
**Files**: 
- `src/i18n/locales/en.json`
- `src/i18n/locales/ar.json`

Add translation keys:
- `admin.editSurvey` - "Edit Survey"
- `admin.editingDisabled` - "Editing disabled - survey has responses"
- `admin.surveyUpdated` - "Survey updated successfully"
- `messages.confirmEdit` - "Are you sure you want to update this survey?"

## Database Considerations

No schema changes needed. Existing tables support all required fields.

## User Flow

1. Admin views survey list
2. Admin clicks "Edit" button on a survey
3. System loads edit page with survey data pre-filled
4. Admin modifies survey details/questions
5. Admin clicks "Update Survey"
6. System validates and saves changes
7. Admin is redirected to survey detail page
8. Success message is displayed

## Error Handling

- Invalid survey ID → 404 error
- Unauthorized access → 401 error
- Survey has responses → Show warning, allow title/description edit only
- Validation errors → Display specific error messages
- Database errors → Display user-friendly error message

## Testing Checklist

- [ ] Edit survey title and description
- [ ] Edit question content
- [ ] Add new question to existing survey
- [ ] Remove question from survey
- [ ] Edit question options
- [ ] Add new option to question
- [ ] Remove option from question
- [ ] Verify edit disabled when survey has responses
- [ ] Verify RTL layout works on edit page
- [ ] Verify bilingual support on edit page
- [ ] Test error handling for invalid survey ID
- [ ] Test error handling for unauthorized access

## Files to Create/Modify

### New Files
- `src/app/admin/surveys/[id]/edit/page.tsx` - Edit survey page

### Modified Files
- `src/app/api/surveys/[id]/route.ts` - Add PUT handler
- `src/components/SurveyList.tsx` - Add edit button
- `src/app/admin/surveys/[id]/page.tsx` - Add edit button
- `src/i18n/locales/en.json` - Add translations
- `src/i18n/locales/ar.json` - Add translations

## Implementation Steps

1. Add PUT endpoint to API
2. Create edit survey page component
3. Add edit buttons to survey list and detail pages
4. Add translations
5. Test all functionality
6. Verify RTL and bilingual support
