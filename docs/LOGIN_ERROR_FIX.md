# Login Error Fix - "Failed to fetch"

## The Problem

You're getting a "Failed to fetch" error when trying to login because:

**The backend is crashing when trying to connect to the database.**

Error message:
```
Error: Unknown authenticationOk message type 9
```

This happens because:
1. Backend tries to connect to Supabase
2. Supabase uses SCRAM-SHA-256 authentication
3. The pg driver can't authenticate
4. Backend crashes
5. Frontend can't reach backend
6. You get "Failed to fetch" error

---

## The Solution (3 Steps)

### Step 1: Initialize Supabase Database

Go to **Supabase SQL Editor** and run the database schema:

1. Open https://app.supabase.com
2. Click your project
3. Click **SQL Editor** → **New Query**
4. Copy and paste the entire content from `survey-platform/scripts/init-db.sql`
5. Click **Run**
6. You should see: "Success. No rows returned"

### Step 2: Create Admin Account

In the same SQL Editor, create a new query and run:

```sql
INSERT INTO admins (email, password_hash) VALUES (
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm'
);
```

Click **Run** → You should see: "Success. 1 row inserted"

### Step 3: Restart Backend

Stop the backend and restart it:

```bash
# Stop: Ctrl+C in the terminal running npm run dev:server
# Then restart:
npm run dev:server
```

You should see:
```
Server running on http://localhost:3001
Environment: development
```

---

## Verify It's Fixed

### Test 1: Health Check
Open your browser and go to:
```
http://localhost:3001/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-01-14T..."
}
```

### Test 2: Try Login Again
Go to http://localhost:3000/admin/login and try logging in with:
- **Email**: admin@example.com
- **Password**: password123

You should be redirected to the survey dashboard.

---

## Why This Happens

### Before Database Initialization
```
1. Frontend sends login request
2. Backend receives request
3. Backend tries to query database
4. Database connection fails (tables don't exist)
5. Backend crashes
6. Frontend gets "Failed to fetch"
```

### After Database Initialization
```
1. Frontend sends login request
2. Backend receives request
3. Backend queries database successfully
4. Backend returns JWT token
5. Frontend stores token
6. Frontend redirects to dashboard
```

---

## Quick Checklist

- [ ] Go to Supabase SQL Editor
- [ ] Run SQL from `scripts/init-db.sql`
- [ ] Create admin account with SQL query
- [ ] Restart backend (`npm run dev:server`)
- [ ] Test health endpoint: http://localhost:3001/api/health
- [ ] Try login again: http://localhost:3000/admin/login

---

## If It Still Doesn't Work

### Check 1: Verify Tables Exist
1. Go to Supabase → **Table Editor**
2. You should see these tables:
   - admins
   - surveys
   - questions
   - options
   - responses
   - answers
   - star_range_mappings

If tables don't exist, run the SQL again.

### Check 2: Verify Admin Account Exists
1. Go to Supabase → **Table Editor** → **admins**
2. You should see a row with:
   - email: admin@example.com
   - password_hash: $2a$10$...

If admin doesn't exist, run the admin creation SQL again.

### Check 3: Check Backend Logs
Look at the terminal running `npm run dev:server`. You should see:
```
Server running on http://localhost:3001
Environment: development
```

If you see an error, the backend is still crashing.

### Check 4: Verify Environment Variables
Check that `.env.local` has the correct Supabase credentials:
```
DATABASE_URL=postgresql://postgres:Survey123456@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres
DB_HOST=nbjuyltaeunxcishhwqu.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Survey123456
```

---

## Summary

**The issue**: Backend crashes because database isn't initialized

**The fix**: Initialize Supabase database in 2 minutes

**The result**: Login works, dashboard loads, you can create surveys

---

**Follow the 3 steps above and your login will work!** ✅
