# Windows Setup Guide - PostgreSQL 18 SCRAM-SHA-256 Issue

## Problem
PostgreSQL 18 uses SCRAM-SHA-256 authentication which requires special handling. The `npm run db:init` command may fail with:
```
Error: Unknown authenticationOk message type 9
```

## Solution: Use pgAdmin (Recommended for Windows)

### Step 1: Open pgAdmin
1. Search for "pgAdmin" in Windows Start menu
2. Click to open (usually runs on http://localhost:5050)
3. If not installed, download from https://www.pgadmin.org/download/

### Step 2: Login to pgAdmin
- **Username**: postgres
- **Password**: Care@5628

### Step 3: Create Database
1. In left panel, expand "Servers" → "PostgreSQL 18"
2. Right-click on "Databases"
3. Select "Create" → "Database"
4. **Name**: `survey_platform`
5. Click "Save"

### Step 4: Initialize Schema
1. Right-click on `survey_platform` database
2. Select "Query Tool"
3. Open file: `survey-platform/scripts/init-db.sql`
4. Copy all contents
5. Paste into Query Tool
6. Press **F5** or click "Execute" button
7. You should see: "Query returned successfully"

### Step 5: Verify Tables
1. Expand `survey_platform` → Schemas → public → Tables
2. You should see these tables:
   - admins
   - surveys
   - questions
   - options
   - star_range_mappings
   - responses
   - answers

### Step 6: Verify Test Admin
1. Right-click on `admins` table
2. Select "View/Edit Data" → "All Rows"
3. You should see one row with:
   - email: `admin@example.com`
   - password_hash: (long hash)

## Step 7: Install Dependencies

```bash
npm install
```

## Step 8: Start Development Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Runs on: http://localhost:3000

**Terminal 2 - Backend:**
```bash
npm run dev:server
```
Runs on: http://localhost:3001

**Or both together:**
```bash
npm run dev:all
```

## Step 9: Test the Application

### Admin Login
1. Go to http://localhost:3000/admin/login
2. Enter:
   - Email: `admin@example.com`
   - Password: `password123`
3. Click "Login"
4. Should see survey list

### Create Survey
1. Click "Create New Survey"
2. Fill in details
3. Add questions
4. Save

### Take Survey
1. Go to http://localhost:3000
2. Enter Survey ID
3. Answer questions
4. Submit

## Troubleshooting

### pgAdmin Won't Connect
- Ensure PostgreSQL service is running
- Check Windows Services (services.msc)
- Look for "postgresql-x64-18"
- If not running, right-click and select "Start"

### Can't Find pgAdmin
- Download from: https://www.pgadmin.org/download/
- Install and run
- Default port: 5050

### Query Tool Shows Error
- Check SQL syntax
- Ensure database is selected
- Try running one statement at a time

### Still Getting Authentication Error
- Check PostgreSQL is running
- Verify password is correct: `Care@5628`
- Try restarting PostgreSQL service

## Alternative: Fix PostgreSQL Authentication

If you want to use `npm run db:init`, you can modify PostgreSQL authentication:

### Step 1: Find pg_hba.conf
```
C:\Program Files\PostgreSQL\18\data\pg_hba.conf
```

### Step 2: Edit File
Find this line:
```
host    all             all             127.0.0.1/32            scram-sha-256
```

Change to:
```
host    all             all             127.0.0.1/32            md5
```

### Step 3: Restart PostgreSQL
1. Open Services (services.msc)
2. Find "postgresql-x64-18"
3. Right-click → Restart

### Step 4: Run Init Script
```bash
npm run db:init
```

## Quick Commands

```bash
# Install dependencies
npm install

# Start frontend only
npm run dev

# Start backend only
npm run dev:server

# Start both
npm run dev:all

# Run tests
npm test

# Build for production
npm run build
```

## Environment Variables

Create `.env.local` in survey-platform directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=survey_platform
DB_USER=postgres
DB_PASSWORD=Care@5628

# API
API_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=7d
```

## Test Credentials

```
Email: admin@example.com
Password: password123
```

## Support

If you still have issues:
1. Check DATABASE_SETUP.md
2. Check SETUP_GUIDE.md
3. Verify PostgreSQL is running
4. Check .env.local configuration
5. Review error messages in console
