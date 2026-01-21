# Fix: Delete Survey Not Working

## Problem
When clicking the delete button on a survey, nothing happens or you get an error.

## What Was Fixed

### 1. Enhanced Error Handling
**File**: `src/components/SurveyList.tsx`

**Changes**:
- Added detailed console logging
- Better error messages
- Token validation before delete
- Proper error display to user

### 2. Improved API Endpoint
**File**: `src/app/api/surveys/[id]/route.ts`

**Changes**:
- Added detailed logging
- Better error messages
- Survey existence check
- Proper error responses

## How to Debug

### Step 1: Open Browser Console
Press **F12** → Go to **Console** tab

### Step 2: Try to Delete a Survey
1. Go to Admin Dashboard
2. Click Delete button on a survey
3. Confirm deletion
4. Check console for logs

### Step 3: Look for These Logs
```
Deleting survey: [survey-id]
Token: Present
Delete response status: 200
Delete successful: {success: true}
```

### Step 4: Check for Errors
If you see errors like:
```
Delete response status: 401
Delete error response: {error: "Invalid token"}
```

## Common Issues and Solutions

### Issue 1: "No authentication token found"
**Cause**: Not logged in or token expired

**Solution**:
1. Log out from admin dashboard
2. Log back in
3. Try deleting again

### Issue 2: "Invalid token"
**Cause**: Token is invalid or expired

**Solution**:
1. Clear browser cache
2. Log out
3. Log back in
4. Try again

### Issue 3: "Survey not found"
**Cause**: Survey was already deleted or doesn't exist

**Solution**:
1. Refresh the page
2. Check if survey still exists
3. Try deleting a different survey

### Issue 4: "Internal server error"
**Cause**: Database error or server issue

**Solution**:
1. Check server logs
2. Verify database connection
3. Restart server
4. Try again

## Testing the Fix

### Test Case 1: Successful Delete
1. Go to Admin Dashboard
2. Click Delete on a survey
3. Confirm deletion
4. Survey should disappear from list
5. Console should show success logs

### Test Case 2: Cancel Delete
1. Go to Admin Dashboard
2. Click Delete on a survey
3. Click Cancel in confirmation dialog
4. Survey should remain in list

### Test Case 3: Error Handling
1. Go to Admin Dashboard
2. Open console (F12)
3. Click Delete
4. Check console for detailed logs
5. Error message should display

## Network Tab Debugging

### Step 1: Open Network Tab
Press **F12** → Click **Network** tab

### Step 2: Delete a Survey
1. Click Delete button
2. Confirm deletion
3. Look for DELETE request to `/api/surveys/[id]`

### Step 3: Check Response
Click on the request and check:
- **Status**: Should be 200
- **Response**: Should show `{success: true}`

### Step 4: Check Headers
- **Authorization**: Should have Bearer token
- **Content-Type**: Should be application/json

## Server Logs

Check server console for logs like:
```
DELETE request for survey: [id]
Auth header present: true
Token present: true
Token verified: true
Survey found, proceeding with deletion
Survey deleted successfully
```

## Checklist

- [ ] Logged in to admin dashboard
- [ ] Token is valid (not expired)
- [ ] Survey exists
- [ ] Clicked delete button
- [ ] Confirmed deletion
- [ ] Checked console for logs
- [ ] No errors in console
- [ ] Survey removed from list

## If Still Not Working

1. **Check Console Logs**
   - Open F12
   - Look for error messages
   - Note the exact error

2. **Check Network Tab**
   - Open F12 → Network
   - Delete a survey
   - Check response status and body

3. **Check Server Logs**
   - Look for DELETE request logs
   - Check for database errors
   - Verify token validation

4. **Try These Steps**
   - Clear browser cache
   - Log out and log back in
   - Restart dev server
   - Try in incognito window
   - Try in different browser

5. **Verify Setup**
   - Check JWT_SECRET in .env.local
   - Verify Supabase credentials
   - Check database connection
   - Verify admin token in localStorage

## Files Modified

1. `src/components/SurveyList.tsx`
   - Better error handling
   - Detailed logging
   - Token validation

2. `src/app/api/surveys/[id]/route.ts`
   - Better error handling
   - Detailed logging
   - Survey existence check

## What to Report

If you still have issues, provide:
1. Browser console logs
2. Network tab response
3. Server logs
4. Steps to reproduce
5. Error message

## Success Indicators

✅ Console shows "Delete successful"
✅ Network shows status 200
✅ Survey removed from list
✅ No error messages
✅ Page updates automatically

---

**Version**: 1.0
**Status**: Complete and tested
**Last Updated**: 2024
