# Fix: Empty Error Object in Survey Submission

## Problem
When submitting a survey, you see an error in the console:
```
Survey submission error: {}
```

The error object is empty, making it hard to debug what went wrong.

## Root Causes

1. **Missing Database Columns** - The most common cause
   - The `responses` table doesn't have the user details columns
   - Supabase returns an error but it's not being displayed properly

2. **Network Issue** - Less common
   - Response is not valid JSON
   - Connection timeout
   - Server not responding

3. **Invalid Request** - Rare
   - Missing required fields
   - Malformed JSON

## Solution

### Step 1: Check Browser Console (F12)

Open Developer Tools and look for detailed logs:

```
Submitting survey with user details: {
  survey_id: "...",
  responses: [...],
  userDetails: {...}
}
Response status: 500
Response headers: {
  contentType: "application/json"
}
Response data: {
  error: "column \"email\" of relation \"responses\" does not exist"
}
Survey submission error: {
  status: 500,
  statusText: "Internal Server Error",
  error: "column \"email\" of relation \"responses\" does not exist",
  fullResponse: {...}
}
```

### Step 2: Identify the Error

Look for the `error` field in the response data. Common errors:

| Error | Solution |
|-------|----------|
| `column "email" does not exist` | Run migration SQL |
| `column "age_range" does not exist` | Run migration SQL |
| `permission denied` | Check API key |
| `relation "responses" does not exist` | Run init-db.sql |
| `Failed to parse server response` | Server error or network issue |

### Step 3: Fix the Issue

#### If it's a missing column error:

1. Go to Supabase SQL Editor
2. Run this SQL:
```sql
ALTER TABLE responses
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS age_range VARCHAR(50),
ADD COLUMN IF NOT EXISTS education_level VARCHAR(100),
ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);
```

3. Restart dev server
4. Try submitting again

#### If it's a permission error:

1. Check `.env.local` has correct Service Role Key:
```
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
```

2. Restart dev server
3. Try again

#### If it's a network error:

1. Check if dev server is running
2. Check if Supabase is accessible
3. Check internet connection
4. Try in incognito window

## What Changed

### Improved Error Logging
The API now logs:
- Request body details
- Response payload details
- Specific database error messages
- Error stack traces

### Better Error Messages
The client now shows:
- Response status and status text
- Full error response
- Helpful error messages

### More Robust Parsing
The client now:
- Handles JSON parse errors
- Logs response headers
- Provides fallback error messages

## Testing

After applying the fix:

1. **Check Console Logs**
   - Open F12
   - Submit survey
   - Look for detailed error messages

2. **Verify Error Message**
   - Should see specific error like "column email does not exist"
   - Not just empty object

3. **Apply Fix**
   - Based on the error message
   - Run appropriate SQL
   - Restart server

4. **Test Again**
   - Submit survey
   - Should see success message

## Debugging Checklist

- [ ] Opened browser console (F12)
- [ ] Submitted survey
- [ ] Found detailed error message
- [ ] Identified the problem
- [ ] Applied the fix
- [ ] Restarted dev server
- [ ] Tested again
- [ ] Success!

## Common Scenarios

### Scenario 1: Column doesn't exist
```
Response data: {
  error: "column \"email\" of relation \"responses\" does not exist"
}
```
**Fix**: Run migration SQL to add columns

### Scenario 2: Permission denied
```
Response data: {
  error: "permission denied for schema public"
}
```
**Fix**: Check SUPABASE_SERVICE_ROLE_KEY in .env.local

### Scenario 3: Table doesn't exist
```
Response data: {
  error: "relation \"responses\" does not exist"
}
```
**Fix**: Run init-db.sql to create tables

### Scenario 4: Network error
```
Response data: {
  error: "Failed to parse server response"
}
```
**Fix**: Check server is running, check internet connection

## Advanced Debugging

### Check Server Logs

Look for logs like:
```
Received request: { survey_id: "...", responses: 5, userDetails: {...} }
Inserting response with payload: {...}
Response insert error: {
  message: "column \"email\" of relation \"responses\" does not exist",
  code: "42703",
  details: "..."
}
```

### Check Network Tab

1. Open Developer Tools
2. Go to Network tab
3. Submit survey
4. Find POST request to `/api/responses`
5. Check Response tab for error details

### Check Supabase Logs

1. Go to Supabase dashboard
2. Check Logs section
3. Look for database errors
4. Check API errors

## Files Updated

- `src/app/api/responses/route.ts` - Better error handling and logging
- `src/components/SurveyPage.tsx` - Better error display and logging

## Next Steps

1. **Check Console** - See detailed error message
2. **Identify Problem** - Match error to table above
3. **Apply Fix** - Run appropriate SQL or check config
4. **Restart Server** - Restart dev server
5. **Test** - Submit survey again
6. **Verify** - Check database for saved data

## Still Having Issues?

1. Check all console logs carefully
2. Look for the actual error message (not just empty object)
3. Match error to the table above
4. Apply the corresponding fix
5. Restart dev server
6. Test again

If you still can't find the error:
1. Check server logs
2. Check network tab response
3. Check Supabase logs
4. Try in incognito window
5. Clear browser cache
