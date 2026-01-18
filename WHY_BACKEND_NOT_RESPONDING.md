# Why Backend Isn't Responding - Explained

## The Situation

You ran `npm run dev:server` and saw:
```
Server running on http://localhost:3001
```

But when you try to access http://localhost:3001, it doesn't respond or gives errors.

## The Root Cause

**The backend IS running, but it can't process requests because the database hasn't been initialized.**

Here's what happens:

1. Backend starts successfully ✅
2. You try to access http://localhost:3001/api/health ✅ (this works - no database needed)
3. You try to login or get surveys ❌ (fails - database tables don't exist)
4. Frontend can't communicate with backend ❌ (API errors)

## Why Database Initialization is Critical

The backend code tries to:
- Query the `admins` table to authenticate users
- Query the `surveys` table to get survey data
- Query the `questions` table to get questions
- Query the `responses` table to store answers

**If these tables don't exist, every API call fails.**

## The Solution: 3 Simple Steps

### Step 1: Create Database Tables

Go to https://app.supabase.com → Your Project → SQL Editor → New Query

Paste the entire SQL from `scripts/init-db.sql` and click **Run**

This creates:
- admins
- surveys
- questions
- options
- star_range_mappings
- responses
- answers

### Step 2: Create Admin Account

New Query:

```sql
INSERT INTO admins (email, password_hash) VALUES (
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm'
);
```

Click **Run**

### Step 3: Restart Backend

Stop the backend (Ctrl+C) and restart:

```bash
npm run dev:server
```

Now it can process requests!

## How to Verify It's Working

### Test 1: Health Check (No Database)

```bash
curl http://localhost:3001/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-14T..."
}
```

This works even without database.

### Test 2: Login (Requires Database)

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

**Before database initialization:**
```
Error: connect ECONNREFUSED (database connection fails)
```

**After database initialization:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "email": "admin@example.com"
  }
}
```

### Test 3: Get Surveys (Requires Database)

```bash
curl http://localhost:3001/api/surveys
```

**Before database initialization:**
```
Error: relation "surveys" does not exist
```

**After database initialization:**
```json
[]
```

(Empty array because no surveys created yet)

## What's Happening Behind the Scenes

### Backend Code Flow

```
Request comes in
    ↓
Express receives it
    ↓
Route handler executes
    ↓
Tries to query database
    ↓
❌ Database tables don't exist → ERROR
    ✅ Database tables exist → SUCCESS
```

### Database Connection

Your `.env.local` has:
```
DATABASE_URL=postgresql://postgres:Survey123456@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres
```

This tells the backend where to connect. But if the tables don't exist, queries fail.

## Common Mistakes

### Mistake 1: Not Running SQL in Supabase

❌ Wrong: Trying to run `npm run db:init` (doesn't work with PostgreSQL 18)

✅ Right: Go to Supabase SQL Editor and paste the SQL there

### Mistake 2: Creating Admin in Wrong Place

❌ Wrong: Creating admin in local PostgreSQL

✅ Right: Creating admin in Supabase (where the backend connects)

### Mistake 3: Not Restarting Backend

❌ Wrong: Initialize database but don't restart backend

✅ Right: Initialize database, then restart backend with `npm run dev:server`

## The Complete Flow

```
1. Initialize Database (Supabase SQL Editor)
   ↓
2. Create Admin Account (Supabase SQL Editor)
   ↓
3. Restart Backend (npm run dev:server)
   ↓
4. Start Frontend (npm run dev)
   ↓
5. Login (http://localhost:3000/admin/login)
   ↓
6. Create Surveys
   ↓
7. View Analytics
```

## Why This Design?

The backend is designed to:
- Be stateless (no data stored in memory)
- Connect to a real database (Supabase)
- Be scalable (can run multiple instances)
- Be secure (JWT authentication)

This is why database initialization is required before the backend can work.

## Next Steps

1. Go to Supabase SQL Editor
2. Paste SQL from `scripts/init-db.sql`
3. Click Run
4. Create admin account with SQL query
5. Restart backend
6. Test with `curl http://localhost:3001/api/health`
7. Start frontend
8. Login and create surveys

---

**Once you initialize the database, everything will work perfectly!** 🚀
