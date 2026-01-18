# Supabase Authentication Issue - SCRAM-SHA-256 Problem

## The Problem

You're getting this error:
```
Error: Unknown authenticationOk message type 9
```

This is because **Supabase uses SCRAM-SHA-256 authentication** which the Node.js `pg` driver doesn't support properly.

## The Solution

You need to change your Supabase database password to use **MD5 authentication** instead of SCRAM-SHA-256.

### Step 1: Go to Supabase Dashboard

1. Open https://app.supabase.com
2. Click your project
3. Click **Settings** in the left sidebar
4. Click **Database** tab

### Step 2: Reset Database Password

1. Scroll down to "Database Password"
2. Click **Reset password**
3. Copy the new password
4. Click **I understand, reset password**

### Step 3: Update .env.local

Update your `.env.local` file with the new password:

```
DATABASE_URL=postgresql://postgres:NEW_PASSWORD@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres?sslmode=disable
DB_PASSWORD=NEW_PASSWORD
```

Replace `NEW_PASSWORD` with the password you just copied.

### Step 4: Restart Backend

Stop and restart the backend:

```bash
# Stop: Ctrl+C
# Restart:
npm run dev:server
```

### Step 5: Test Login

Try logging in again:

```bash
node test-login.js
```

You should see:
```
Status: 200
✅ Login successful!
```

---

## Why This Works

- **SCRAM-SHA-256**: Modern authentication method that pg driver doesn't support
- **MD5**: Older authentication method that pg driver supports
- Resetting the password in Supabase changes the authentication method to MD5

---

## If It Still Doesn't Work

### Option 1: Use Supabase Connection Pooler

Supabase provides a connection pooler that handles authentication:

1. Go to Supabase Dashboard
2. Click **Settings** → **Database**
3. Look for "Connection pooling"
4. Copy the "Connection string" (with pooling)
5. Update `.env.local`:

```
DATABASE_URL=postgresql://postgres:PASSWORD@nbjuyltaeunxcishhwqu.pooler.supabase.com:6543/postgres?sslmode=disable
```

### Option 2: Use Local PostgreSQL Instead

If Supabase continues to have issues, use a local PostgreSQL database instead:

1. Install PostgreSQL locally
2. Create a database
3. Update `.env.local`:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/survey_platform
```

4. Run the schema:

```bash
psql -U postgres -d survey_platform -f scripts/init-db.sql
```

---

## Current Configuration

Your current `.env.local` has:

```
DATABASE_URL=postgresql://postgres:Survey123456@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres?sslmode=disable
```

This should work once you reset the Supabase password.

---

**Follow Step 1-5 above and your login will work!** ✅
