# Visual Setup Guide

## Step-by-Step Visual Instructions

### Step 1: Initialize Database in Supabase

#### 1.1 Open Supabase Dashboard
```
Go to: https://app.supabase.com
```

#### 1.2 Select Your Project
```
┌─────────────────────────────────────┐
│  My Projects                        │
├─────────────────────────────────────┤
│  ☐ survey-platform  ← Click here   │
│  ☐ other-project                   │
└─────────────────────────────────────┘
```

#### 1.3 Open SQL Editor
```
Left Sidebar:
├── Dashboard
├── SQL Editor  ← Click here
├── Table Editor
├── Authentication
└── ...
```

#### 1.4 Create New Query
```
┌─────────────────────────────────────┐
│  SQL Editor                         │
├─────────────────────────────────────┤
│  [New Query] ← Click here           │
│  [Recent Queries]                   │
└─────────────────────────────────────┘
```

#### 1.5 Paste Database Schema
```
┌─────────────────────────────────────┐
│  Query Editor                       │
├─────────────────────────────────────┤
│  CREATE TABLE IF NOT EXISTS admins (│
│    id UUID PRIMARY KEY ...          │
│    ...                              │
│  );                                 │
│                                     │
│  [Run] ← Click here                 │
└─────────────────────────────────────┘
```

**Result:**
```
✅ Success. No rows returned
```

### Step 2: Create Admin Account

#### 2.1 New Query
```
[New Query] ← Click here
```

#### 2.2 Paste Admin Creation SQL
```
INSERT INTO admins (email, password_hash) VALUES (
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm'
);
```

#### 2.3 Run Query
```
[Run] ← Click here
```

**Result:**
```
✅ Success. 1 row inserted
```

### Step 3: Verify Tables

#### 3.1 Open Table Editor
```
Left Sidebar:
├── Dashboard
├── SQL Editor
├── Table Editor  ← Click here
└── ...
```

#### 3.2 Check Tables
```
┌─────────────────────────────────────┐
│  Tables                             │
├─────────────────────────────────────┤
│  ✅ admins                          │
│  ✅ surveys                         │
│  ✅ questions                       │
│  ✅ options                         │
│  ✅ responses                       │
│  ✅ answers                         │
│  ✅ star_range_mappings             │
└─────────────────────────────────────┘
```

### Step 4: Start Application

#### 4.1 Open Terminal
```
Windows: Press Win + R, type "cmd", press Enter
Mac: Press Cmd + Space, type "terminal", press Enter
Linux: Press Ctrl + Alt + T
```

#### 4.2 Navigate to Project
```bash
cd survey-platform
```

#### 4.3 Start Both Servers
```bash
npm run dev:all
```

**Output:**
```
> npm run dev:all

> next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000

> nodemon --exec ts-node --project tsconfig.server.json server/index.ts
Server running on http://localhost:3001
Environment: development
```

### Step 5: Login to Admin Dashboard

#### 5.1 Open Browser
```
Go to: http://localhost:3000/admin/login
```

#### 5.2 Login Form
```
┌─────────────────────────────────────┐
│  Admin Login                        │
├─────────────────────────────────────┤
│  Email:                             │
│  [admin@example.com]                │
│                                     │
│  Password:                          │
│  [password123]                      │
│                                     │
│  [Login] ← Click here               │
└─────────────────────────────────────┘
```

#### 5.3 Dashboard
```
✅ You're logged in!

┌─────────────────────────────────────┐
│  Survey Platform                    │
├─────────────────────────────────────┤
│  [Create Survey] ← Click here       │
│                                     │
│  Recent Surveys:                    │
│  (none yet)                         │
└─────────────────────────────────────┘
```

### Step 6: Create Your First Survey

#### 6.1 Click Create Survey
```
[Create Survey] ← Click here
```

#### 6.2 Fill Survey Details
```
┌─────────────────────────────────────┐
│  Create Survey                      │
├─────────────────────────────────────┤
│  Title (English):                   │
│  [Customer Satisfaction Survey]     │
│                                     │
│  Title (Arabic):                    │
│  [استبيان رضا العملاء]              │
│                                     │
│  Description (English):             │
│  [Please rate your experience]      │
│                                     │
│  Description (Arabic):              │
│  [يرجى تقييم تجربتك]                │
│                                     │
│  Customer Type:                     │
│  [Pilgrims ▼]                       │
│                                     │
│  [Next] ← Click here                │
└─────────────────────────────────────┘
```

#### 6.3 Add Questions
```
┌─────────────────────────────────────┐
│  Add Questions                      │
├─────────────────────────────────────┤
│  Question Type:                     │
│  [Multiple Choice ▼]                │
│                                     │
│  Question (English):                │
│  [How satisfied are you?]           │
│                                     │
│  Question (Arabic):                 │
│  [ما مدى رضاك؟]                     │
│                                     │
│  Options:                           │
│  ☐ Very Satisfied                   │
│  ☐ Satisfied                        │
│  ☐ Neutral                          │
│  ☐ Dissatisfied                     │
│                                     │
│  [Add Question] [Publish] ← Click   │
└─────────────────────────────────────┘
```

#### 6.4 Survey Published
```
✅ Survey published successfully!

Survey Link:
http://localhost:3000/survey/[survey-id]

Share this link with users to collect responses.
```

### Step 7: View Analytics

#### 7.1 Go to Dashboard
```
[Dashboard] ← Click here
```

#### 7.2 Click Survey
```
┌─────────────────────────────────────┐
│  Surveys                            │
├─────────────────────────────────────┤
│  Customer Satisfaction Survey       │
│  [View] [Edit] [Analytics] [Delete] │
│         ← Click Analytics           │
└─────────────────────────────────────┘
```

#### 7.3 View Analytics
```
┌─────────────────────────────────────┐
│  Analytics                          │
├─────────────────────────────────────┤
│  Total Responses: 5                 │
│  Response Rate: 50%                 │
│                                     │
│  Question 1: How satisfied?         │
│  ▓▓▓▓▓ Very Satisfied (3)           │
│  ▓▓ Satisfied (2)                   │
│  ░ Neutral (0)                      │
│  ░ Dissatisfied (0)                 │
│                                     │
│  [Export Data]                      │
└─────────────────────────────────────┘
```

## Troubleshooting Visual Guide

### Issue: Backend Not Responding

```
Problem:
http://localhost:3001 → No response

Solution:
1. Check database is initialized
   ✅ Go to Supabase → Table Editor
   ✅ Verify all 7 tables exist

2. Check admin account exists
   ✅ Go to Supabase → Table Editor → admins
   ✅ Verify admin@example.com exists

3. Restart backend
   ✅ Stop: Ctrl+C
   ✅ Start: npm run dev:server

4. Test health endpoint
   ✅ Go to http://localhost:3001/api/health
   ✅ Should see: {"status":"ok",...}
```

### Issue: Can't Login

```
Problem:
Login fails with error

Solution:
1. Verify admin exists
   ✅ Go to Supabase → Table Editor → admins
   ✅ Check email is: admin@example.com

2. Check password
   ✅ Password is: password123
   ✅ (case-sensitive)

3. Recreate admin if needed
   ✅ Go to Supabase → SQL Editor
   ✅ Run admin creation SQL again

4. Check backend is running
   ✅ Terminal should show: Server running on http://localhost:3001
```

### Issue: Frontend Can't Reach Backend

```
Problem:
Frontend shows API errors

Solution:
1. Check backend is running
   ✅ http://localhost:3001/api/health
   ✅ Should respond with JSON

2. Check environment variable
   ✅ Open .env.local
   ✅ Verify: NEXT_PUBLIC_API_URL=http://localhost:3001

3. Check browser console
   ✅ Press F12 → Console tab
   ✅ Look for CORS errors

4. Restart frontend
   ✅ Stop: Ctrl+C
   ✅ Start: npm run dev
```

## Quick Status Check

### Everything Working?

```
✅ Database initialized
   → Go to Supabase → Table Editor
   → See all 7 tables

✅ Admin account created
   → Go to Supabase → Table Editor → admins
   → See admin@example.com

✅ Backend running
   → Terminal shows: Server running on http://localhost:3001
   → http://localhost:3001/api/health responds

✅ Frontend running
   → Terminal shows: ready - started server on 0.0.0.0:3000
   → http://localhost:3000 loads

✅ Can login
   → http://localhost:3000/admin/login
   → Login with admin@example.com / password123
   → See survey dashboard

✅ Can create surveys
   → Click [Create Survey]
   → Fill in details
   → Add questions
   → Publish survey

✅ Can view analytics
   → Click [Analytics]
   → See response data
```

## Common Commands Reference

```bash
# Start everything
npm run dev:all

# Start frontend only
npm run dev

# Start backend only
npm run dev:server

# Run tests
npm test

# Build for production
npm build

# Start production
npm start
```

## URLs Reference

```
Frontend:        http://localhost:3000
Admin Login:     http://localhost:3000/admin/login
Backend:         http://localhost:3001
Health Check:    http://localhost:3001/api/health
Supabase:        https://app.supabase.com
```

## Credentials Reference

```
Email:    admin@example.com
Password: password123
```

---

**Follow these visual steps and you'll have the survey platform running in 5 minutes!** 🚀
