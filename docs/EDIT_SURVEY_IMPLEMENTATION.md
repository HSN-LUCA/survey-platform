# Edit Survey Feature - Implementation Complete

## Overview

The edit survey feature has been successfully implemented, allowing administrators to modify existing surveys. This feature includes full bilingual support (Arabic/English) and RTL layout support.

## Features Implemented

### 1. Edit Survey API Endpoint
**File**: `src/app/api/surveys/[id]/route.ts`

Added PUT handler that:
- Validates authentication token
- Checks if survey has responses
- Updates survey metadata (title, description, customer type)
- Handles question updates (add, modify, delete)
- Manages options for multiple choice questions
- Returns updated survey with all related data

**Key Logic**:
- If survey has responses: Only allows editing title/description
- If no responses: Allows full editing including questions and options
- Properly handles cascading deletes for removed questions/options

### 2. Edit Survey Page
**File**: `src/app/admin/surveys/[id]/edit/page.tsx`

New page component that:
- Loads existing survey data on mount
- Pre-fills all form fields with current values
- Shows warning if survey has responses
- Supports adding/editing/removing questions
- Supports adding/editing/removing options
- Uses PUT method to update survey
- Redirects to survey detail page on success
- Handles errors with detailed messages

**Features**:
- Full bilingual support (English/Arabic)
- RTL layout for Arabic
- Preset options dropdown
- Custom option input
- Category support
- Question type selection
- Required field validation

### 3. Edit Button in Survey List
**File**: `src/components/SurveyList.tsx`

Added "Edit" button to survey list table:
- Green button with "Edit Survey" text
- Links to `/admin/surveys/{id}/edit`
- Positioned before "View" and "Delete" buttons
- Fully bilingual

### 4. Edit Button in Survey Detail Page
**File**: `src/app/admin/surveys/[id]/page.tsx`

Added "Edit" button to survey header:
- Green button in top right of header
- Links to `/admin/surveys/{id}/edit`
- Visible on all surveys
- Fully bilingual

### 5. Translations
**Files**: 
- `src/i18n/locales/en.json`
- `src/i18n/locales/ar.json`

Added translation keys:
- `admin.editSurvey` - "Edit Survey" / "تعديل الاستبيان"

## User Flow

### Editing a Survey

1. **From Survey List**:
   - Admin clicks "Edit" button on survey row
   - System loads edit page with survey data
   - Admin modifies survey details/questions
   - Admin clicks "Update Survey"
   - System saves changes and redirects to survey detail

2. **From Survey Detail**:
   - Admin clicks "Edit Survey" button in header
   - System loads edit page with survey data
   - Admin modifies survey details/questions
   - Admin clicks "Update Survey"
   - System saves changes and redirects to survey detail

### Editing Restrictions

- **Survey with responses**: Only title/description can be edited
- **Survey without responses**: Full editing allowed (questions, options, etc.)
- **Warning message**: Displayed when survey has responses

## API Endpoints

### GET /api/surveys/[id]
- Retrieves survey with all questions and options
- Used to load data for edit page

### PUT /api/surveys/[id]
- Updates survey metadata and questions
- Validates authentication
- Checks for responses
- Returns updated survey

### DELETE /api/surveys/[id]
- Existing endpoint for deleting surveys
- Unchanged from previous implementation

## Error Handling

The implementation includes comprehensive error handling:

1. **Authentication Errors**:
   - Missing token → Redirect to login
   - Invalid token → Redirect to login

2. **Validation Errors**:
   - Missing title → "Title in both languages is required"
   - Missing question content → "Question X: Content in both languages is required"
   - Missing options → "Question X: Please add at least one option"

3. **Server Errors**:
   - Survey not found → 404 error
   - Database errors → Detailed error message
   - Update failures → Specific error message

4. **Client-Side Errors**:
   - Network errors → "Network error" message
   - Form validation → Prevents submission with invalid data

## Testing Checklist

- [x] Load existing survey data
- [x] Edit survey title (English)
- [x] Edit survey title (Arabic)
- [x] Edit survey description
- [x] Edit customer type
- [x] Add new question
- [x] Edit existing question
- [x] Remove question
- [x] Add question option
- [x] Edit question option
- [x] Remove question option
- [x] Use preset options
- [x] Edit category
- [x] Verify RTL layout
- [x] Verify bilingual support
- [x] Test with survey that has responses
- [x] Test with survey without responses
- [x] Error handling for invalid survey ID
- [x] Error handling for unauthorized access
- [x] Redirect to survey detail on success

## Files Modified

1. **API**:
   - `src/app/api/surveys/[id]/route.ts` - Added PUT handler

2. **Pages**:
   - `src/app/admin/surveys/[id]/edit/page.tsx` - New edit page
   - `src/app/admin/surveys/[id]/page.tsx` - Added edit button and Link import

3. **Components**:
   - `src/components/SurveyList.tsx` - Added edit button

4. **Translations**:
   - `src/i18n/locales/en.json` - Added editSurvey key
   - `src/i18n/locales/ar.json` - Added editSurvey key

## How to Use

### For Administrators

1. **Edit from Survey List**:
   - Go to Admin Dashboard → Surveys
   - Click "Edit" button on any survey
   - Modify survey details and questions
   - Click "Update Survey"

2. **Edit from Survey Detail**:
   - Go to Admin Dashboard → Surveys
   - Click "View Survey" on any survey
   - Click "Edit Survey" button in header
   - Modify survey details and questions
   - Click "Update Survey"

### Restrictions

- Cannot edit questions if survey has responses
- Can always edit title and description
- Must provide content in both languages
- Multiple choice questions must have at least one option

## Technical Details

### State Management
- Uses React hooks (useState, useEffect)
- Manages form state for all fields
- Tracks loading and error states
- Handles page loading state separately

### Data Flow
1. Component mounts → Load survey data
2. User modifies form → Update local state
3. User submits → Validate and send PUT request
4. Success → Redirect to survey detail
5. Error → Display error message

### API Integration
- Uses fetch API with Bearer token authentication
- Sends JSON payload with survey data
- Handles both success and error responses
- Provides detailed error messages

## Future Enhancements

Potential improvements for future versions:
- Auto-save functionality
- Undo/redo for changes
- Bulk edit multiple surveys
- Question templates
- Survey versioning
- Change history tracking
