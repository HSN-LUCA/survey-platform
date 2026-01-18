# Fix: Delete Survey Internal Server Error

## Problem
When trying to delete a survey from the admin dashboard, users were getting an "Internal server error" message instead of the survey being deleted.

## Root Cause
The issue was caused by foreign key constraints and the order of deletion. The API was trying to delete the survey directly without first deleting the related records (responses, answers, questions, options), which violated foreign key constraints in the database.

## Solution

### 1. Updated Supabase Client Configuration
**File**: `lib/supabase.ts`

Added configuration options to the Supabase client to ensure it works properly with the service role key:
```typescript
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
```

### 2. Implemented Cascading Delete Logic
**File**: `src/app/api/surveys/[id]/route.ts`

Changed the DELETE endpoint to delete records in the correct order:
1. **Fetch all responses** for the survey
2. **Delete answers** associated with those responses
3. **Delete responses** for the survey
4. **Fetch all questions** for the survey
5. **Delete options** associated with those questions
6. **Delete questions** for the survey
7. **Finally delete the survey**

This respects foreign key constraints and ensures all related data is cleaned up.

### 3. Enhanced Error Logging
Added detailed error logging to help diagnose any remaining issues:
- Logs error code, message, details, and hints from Supabase
- Logs the full error stack trace
- Returns specific error messages instead of generic "Internal server error"

## How It Works Now

### Successful Delete Flow
1. User clicks delete button on a survey
2. Confirmation dialog appears
3. DELETE request sent to `/api/surveys/{id}`
4. API verifies authentication token
5. API checks if survey exists
6. API deletes all related records in order:
   - Answers → Responses → Options → Questions → Survey
7. Response returns `{ success: true }` with status 200
8. Survey is removed from the UI list
9. Console shows "Survey deleted successfully"

### Error Handling
If any step fails:
- Specific error message is returned
- Error details are logged to console
- User sees the actual error instead of generic message

## Testing

### Test 1: Delete a Survey
1. Go to Admin Dashboard
2. Click the Delete button on any survey
3. Click OK to confirm
4. Survey should disappear from the list
5. Check browser console (F12) for "Survey deleted successfully"

### Test 2: Verify Related Data is Deleted
1. Create a survey with questions
2. Submit some responses to the survey
3. Delete the survey
4. Verify the survey, questions, responses, and answers are all gone

### Test 3: Error Handling
1. Open browser console (F12)
2. Try to delete a survey
3. Check for detailed error logs if something fails
4. Error message should be specific and helpful

## Console Output

### Success
```
DELETE request for survey: abc123
Auth header present: true
Token present: true
Token verified: true
Survey found, proceeding with deletion
Survey deleted successfully
```

### Error
```
DELETE request for survey: abc123
Auth header present: true
Token present: true
Token verified: true
Survey found, proceeding with deletion
Delete error details: {
  code: "...",
  message: "...",
  details: "...",
  hint: "..."
}
```

## Files Modified
1. `lib/supabase.ts` - Added configuration options to Supabase client
2. `src/app/api/surveys/[id]/route.ts` - Implemented cascading delete logic with proper error handling

## Status
✅ Delete survey functionality now works correctly with proper cascading deletion of related records.

## Next Steps
If you still encounter issues:
1. Check the browser console (F12) for detailed error messages
2. Verify the Supabase service role key is correctly set in `.env.local`
3. Ensure all database tables have proper foreign key constraints
4. Check Supabase dashboard for any RLS policies that might be blocking deletion
