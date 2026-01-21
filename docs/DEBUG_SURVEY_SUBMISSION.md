# Debug Survey Submission Error

## How to Check the Error

### Step 1: Open Browser Developer Tools
Press **F12** or right-click → **Inspect**

### Step 2: Go to Console Tab
Click the **Console** tab

### Step 3: Submit the Survey
1. Fill in user details
2. Answer survey questions
3. Click Submit
4. Look at the console output

## What You'll See

### Success Case
```
Submitting survey with user details: {
  survey_id: "...",
  responses: [...],
  userDetails: {...}
}
Survey submitted successfully
```

### Error Case
```
Submitting survey with user details: {...}
Survey submission error: {
  status: 500,
  error: "column \"email\" of relation \"responses\" does not exist"
}
```

## Common Errors and Solutions

### Error: "column \"email\" of relation \"responses\" does not exist"
**Solution**: Run the migration SQL to add the columns (see QUICK_FIX_SURVEY_SUBMISSION.md)

### Error: "column \"age_range\" of relation \"responses\" does not exist"
**Solution**: Same as above - run the migration SQL

### Error: "permission denied for schema public"
**Solution**: Make sure you're using the Service Role Key in `.env.local`:
```
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
```

### Error: "relation \"responses\" does not exist"
**Solution**: Run the full database initialization script:
```bash
psql "postgresql://postgres:52S7BkoypaKNqvw5@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres?sslmode=require" < scripts/init-db.sql
```

## Network Tab Debugging

### Step 1: Open Network Tab
Click the **Network** tab in Developer Tools

### Step 2: Submit Survey
Fill and submit the survey

### Step 3: Find the Request
Look for a POST request to `/api/responses`

### Step 4: Check Response
Click on the request and look at the **Response** tab:

**Success (201)**:
```json
{
  "success": true
}
```

**Error (500)**:
```json
{
  "error": "column \"email\" of relation \"responses\" does not exist"
}
```

## Server Logs

The API now logs detailed information. Check your server console for:

```
Inserting response with payload: {
  survey_id: "...",
  user_session_id: "...",
  email: "...",
  gender: "...",
  age_range: "...",
  education_level: "...",
  nationality: "..."
}
```

If there's an error, you'll see:
```
Response insert error: {
  message: "column \"email\" of relation \"responses\" does not exist",
  ...
}
```

## Step-by-Step Debugging

1. **Check Console** - Look for error messages
2. **Check Network** - Look at the response body
3. **Check Server Logs** - Look for detailed error info
4. **Run Migration** - Add missing columns
5. **Test Again** - Submit survey again

## Quick Checklist

- [ ] Browser console shows no errors
- [ ] Network response is 201 (success)
- [ ] Database columns exist (run verification query)
- [ ] Environment variables are correct
- [ ] Supabase credentials are valid
- [ ] Survey submits successfully

## Still Having Issues?

1. Check the error message carefully
2. Search for the error in the documentation
3. Run the migration SQL again
4. Restart the development server
5. Clear browser cache (Ctrl+Shift+Delete)
6. Try in an incognito window
