# Backend Server Setup & Troubleshooting Guide

## Current Status

✅ **Backend Server**: Running on http://localhost:3001
✅ **Environment**: Configured with Supabase credentials
⚠️ **Database**: Needs initialization

## Why Backend Isn't Responding

The backend server is **running**, but it can't process requests because:

1. **Database tables don't exist** - The Supabase database hasn't been initialized with the schema
2. **No admin account** - Can't authenticate without an admin user
3. **API calls fail** - When the frontend tries to connect, it gets database errors

## Quick Fix: Initialize Supabase Database

### Step 1: Open Supabase SQL Editor

1. Go to https://app.supabase.com
2. Click on your `survey-platform` project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Create Database Schema

Copy the entire content from `survey-platform/scripts/init-db.sql` and paste it into the SQL Editor, then click **Run**.

You should see: `Success. No rows returned`

### Step 3: Create Admin Account

In the same SQL Editor, create a new query and run:

```sql
INSERT INTO admins (email, password_hash) VALUES (
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm'
);
```

This creates:
- **Email**: `admin@example.com`
- **Password**: `password123`

### Step 4: Verify Tables

Click **Table Editor** in Supabase. You should see these tables:
- ✅ admins
- ✅ surveys
- ✅ questions
- ✅ options
- ✅ star_range_mappings
- ✅ responses
- ✅ answers

## Test the Backend

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

### Test 2: Login

Use curl or Postman to test login:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

You should get a response with a JWT token.

### Test 3: Get Surveys

```bash
curl http://localhost:3001/api/surveys
```

Should return an empty array (no surveys yet).

## Start the Full Application

Once the database is initialized:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:server
```

Or both together:
```bash
npm run dev:all
```

Then go to http://localhost:3000/admin/login and login with:
- **Email**: `admin@example.com`
- **Password**: `password123`

## Troubleshooting

### Backend won't start
```bash
npm run dev:server
```

Check for errors in the console. Common issues:
- Missing `.env.local` file
- Incorrect Supabase credentials
- Port 3001 already in use

### Can't connect to database
- Verify `.env.local` has correct credentials
- Check Supabase project is active
- Verify database tables exist in Supabase Table Editor

### Login fails
- Verify admin exists: Go to Supabase → Table Editor → admins
- Check email is exactly: `admin@example.com`
- Recreate admin with the SQL query above

### Frontend can't reach backend
- Verify backend is running: `http://localhost:3001/api/health`
- Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:3001`
- Check browser console for CORS errors

## Environment Variables

Your `.env.local` should have:

```
DATABASE_URL=postgresql://postgres:Survey123456@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres
DB_HOST=nbjuyltaeunxcishhwqu.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Survey123456

API_PORT=3001
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001

JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=7d

NODE_ENV=development
```

## What's Next

1. ✅ Initialize Supabase database
2. ✅ Create admin account
3. ✅ Test backend endpoints
4. ✅ Start frontend and backend
5. ✅ Login to admin dashboard
6. ✅ Create surveys
7. ✅ Share survey links with users
8. ✅ View responses and analytics

---

**Your backend is ready! Just initialize the database and you're good to go.** 🚀
