# PostgreSQL 18 Setup with pgAdmin - Step by Step

## The Problem
PostgreSQL 18 uses SCRAM-SHA-256 authentication by default, which causes:
```
Error: Unknown authenticationOk message type 9
```

This is a known compatibility issue with Node.js pg driver and PostgreSQL 18.

## The Solution: Use pgAdmin (5 minutes)

### Step 1: Open pgAdmin

**If pgAdmin is already installed:**
1. Search for "pgAdmin" in Windows Start menu
2. Click to open
3. It will open in your browser at http://localhost:5050

**If pgAdmin is NOT installed:**
1. Download from: https://www.pgadmin.org/download/windows
2. Run the installer
3. Follow installation wizard
4. When asked for password, use: `Care@5628`
5. After installation, pgAdmin will open automatically

### Step 2: Login to pgAdmin

When pgAdmin opens, you'll see a login screen:
- **Email**: postgres
- **Password**: Care@5628

Click "Login"

### Step 3: Create the Database

1. In the left panel, you'll see "Servers"
2. Expand "Servers" → "PostgreSQL 18" (or your PostgreSQL version)
3. Right-click on "Databases"
4. Select "Create" → "Database"
5. In the dialog:
   - **Name**: `survey_platform`
   - Leave other fields as default
6. Click "Save"

You should see `survey_platform` appear in the Databases list.

### Step 4: Initialize the Database Schema

1. Right-click on `survey_platform` database
2. Select "Query Tool"
3. A new window opens with a SQL editor
4. Open the file: `survey-platform/scripts/init-db.sql`
5. Copy ALL the contents
6. Paste into the pgAdmin Query Tool
7. Press **F5** or click the "Execute" button (play icon)
8. You should see: "Query returned successfully"

### Step 5: Verify the Setup

1. In the left panel, expand:
   - `survey_platform` → Schemas → public → Tables
2. You should see these 7 tables:
   - admins
   - answers
   - options
   - questions
   - responses
   - star_range_mappings
   - surveys

3. To verify the test admin was created:
   - Right-click on `admins` table
   - Select "View/Edit Data" → "All Rows"
   - You should see one row with email: `admin@example.com`

### Step 6: Install Node Dependencies

Open Command Prompt or PowerShell in the survey-platform folder:

```bash
npm install
```

### Step 7: Create .env.local File

Create a file named `.env.local` in the `survey-platform` folder with:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=survey_platform
DB_USER=postgres
DB_PASSWORD=Care@5628
API_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=7d
```

### Step 8: Start the Application

**Open TWO Command Prompt/PowerShell windows in the survey-platform folder:**

**Window 1 - Frontend:**
```bash
npm run dev
```
Wait for it to say: "ready - started server on 0.0.0.0:3000"

**Window 2 - Backend:**
```bash
npm run dev:server
```
Wait for it to say: "Server running on http://localhost:3001"

### Step 9: Test the Application

1. Open browser to http://localhost:3000
2. You should see the home page
3. Click "Admin Login"
4. Enter:
   - Email: `admin@example.com`
   - Password: `password123`
5. Click "Login"
6. You should see the admin dashboard with survey list

## Troubleshooting

### pgAdmin Won't Open
- Check if PostgreSQL service is running
- Open Services (services.msc)
- Look for "postgresql-x64-18"
- If stopped, right-click and select "Start"

### Can't Connect to PostgreSQL in pgAdmin
- Verify PostgreSQL is running (Services)
- Check password is correct: `Care@5628`
- Try restarting PostgreSQL service

### Query Tool Shows Error
- Make sure you're in the correct database (`survey_platform`)
- Check that all SQL is selected
- Try running one statement at a time

### npm run dev Won't Start
- Check .env.local exists and has correct values
- Check port 3000 is not in use
- Try: `npm install` first

### npm run dev:server Won't Start
- Check .env.local exists
- Check port 3001 is not in use
- Check PostgreSQL is running

### Can't Login to Admin
- Verify test admin exists in pgAdmin
- Check email is: `admin@example.com`
- Check password is: `password123`
- Check database connection in .env.local

## Quick Reference

### Test Credentials
```
Email: admin@example.com
Password: password123
```

### URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- pgAdmin: http://localhost:5050

### Database Credentials
```
Host: localhost
Port: 5432
Database: survey_platform
User: postgres
Password: Care@5628
```

## Next Steps

1. ✅ Database is set up
2. ✅ Dependencies are installed
3. ✅ Servers are running
4. Go to http://localhost:3000
5. Login with test credentials
6. Create a survey
7. Take the survey
8. View results

## Still Having Issues?

1. Check WINDOWS_SETUP.md
2. Check SETUP_GUIDE.md
3. Check DATABASE_SETUP.md
4. Verify PostgreSQL is running
5. Verify pgAdmin can connect to PostgreSQL
6. Check .env.local file exists and has correct values
7. Check ports 3000, 3001, 5050 are not in use

## Alternative: Fix PostgreSQL Authentication

If you want to use `npm run db:init` instead of pgAdmin:

1. Find: `C:\Program Files\PostgreSQL\18\data\pg_hba.conf`
2. Find line: `host    all             all             127.0.0.1/32            scram-sha-256`
3. Change to: `host    all             all             127.0.0.1/32            md5`
4. Save file
5. Restart PostgreSQL service
6. Run: `npm run db:init`

But pgAdmin is easier and recommended!
