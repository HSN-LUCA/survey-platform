# Supabase Setup Guide - Cloud PostgreSQL Database

Supabase is a cloud-hosted PostgreSQL database with a great UI. Perfect for deploying your survey platform!

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with email or GitHub
4. Verify your email

## Step 2: Create a New Project

1. Click "New Project"
2. Fill in:
   - **Project Name**: `survey-platform`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
3. Click "Create new project"
4. Wait 2-3 minutes for project to initialize

## Step 3: Get Connection Details

1. Go to Project Settings (gear icon)
2. Click "Database"
3. You'll see connection details:
   - **Host**: `[project-id].supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: The one you created

4. Copy the connection string (looks like):
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```

## Step 4: Initialize Database Schema

### Option A: Using Supabase SQL Editor (Easiest)

1. In Supabase dashboard, click "SQL Editor"
2. Click "New Query"
3. Copy contents of `survey-platform/scripts/init-db.sql`
4. Paste into the SQL editor
5. Click "Run"
6. You should see "Success"

### Option B: Using psql Command Line

```bash
# Install psql if needed (comes with PostgreSQL)
# Then run:
psql -h [HOST] -U postgres -d postgres -f survey-platform/scripts/init-db.sql
```

When prompted for password, enter the one you created.

## Step 5: Update .env.local

Update your `.env.local` file with Supabase credentials:

```env
# Database - Supabase
DB_HOST=[project-id].supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[your-password]

# API
API_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=7d
```

Replace:
- `[project-id]` - Your Supabase project ID (from URL)
- `[your-password]` - The password you created

## Step 6: Test Connection

```bash
# Install dependencies if not done
npm install

# Test the connection
npm run dev:server
```

You should see:
```
Server running on http://localhost:3001
```

If you see database errors, check:
1. Host is correct
2. Password is correct
3. Port is 5432
4. Database name is `postgres`

## Step 7: Create Test Admin

In Supabase SQL Editor, run:

```sql
INSERT INTO admins (email, password_hash) VALUES (
  'admin@example.com',
  '$2a$10$...' -- bcrypt hash of 'password123'
);
```

Or use this simpler approach - run in your terminal:

```bash
node -e "
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('password123', 10);
console.log('INSERT INTO admins (email, password_hash) VALUES (\\'admin@example.com\\', \\'' + hash + '\\');');
"
```

Copy the output and run it in Supabase SQL Editor.

## Step 8: Start Application

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

## Step 9: Test

1. Go to http://localhost:3000/admin/login
2. Login with:
   - Email: `admin@example.com`
   - Password: `password123`
3. Should see survey list

## Supabase Features

### View Data
1. Click "Table Editor" in Supabase
2. Select any table to view data
3. Add/edit/delete rows directly

### Run Queries
1. Click "SQL Editor"
2. Write custom SQL queries
3. Great for debugging

### Backups
- Automatic daily backups
- Manual backups available
- Point-in-time recovery

### Monitoring
- View database logs
- Monitor performance
- Check connection stats

## Deployment to Production

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `JWT_SECRET`
5. Deploy

### Option 2: Railway

1. Go to https://railway.app
2. Create new project
3. Connect GitHub repo
4. Add environment variables
5. Deploy

### Option 3: Render

1. Go to https://render.com
2. Create new web service
3. Connect GitHub
4. Add environment variables
5. Deploy

## Security Best Practices

1. **Strong Password**: Use 16+ characters with mixed case, numbers, symbols
2. **Environment Variables**: Never commit .env.local to git
3. **JWT Secret**: Use a strong random string
4. **SSL**: Supabase uses SSL by default
5. **Backups**: Enable automatic backups
6. **Access Control**: Limit database access to your app

## Troubleshooting

### Can't Connect
- Check host is correct (from Supabase dashboard)
- Check password is correct
- Check port is 5432
- Check database name is `postgres`
- Try connecting with psql first to verify

### Tables Not Created
- Check SQL ran without errors in Supabase SQL Editor
- Verify tables exist in Table Editor
- Check for error messages

### Admin Can't Login
- Verify admin exists in `admins` table
- Check password hash is correct
- Try creating admin again

### Slow Queries
- Check Supabase monitoring
- Add indexes if needed
- Check query performance in SQL Editor

## Useful Supabase URLs

- **Dashboard**: https://app.supabase.com
- **Documentation**: https://supabase.com/docs
- **SQL Editor**: In your project dashboard
- **Table Editor**: In your project dashboard

## Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]
```

Example:
```
postgresql://postgres:MyPassword123@abc123.supabase.co:5432/postgres
```

## Environment Variables Reference

```env
# Supabase Connection
DB_HOST=your-project.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-strong-password

# Application
API_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001

# Security
JWT_SECRET=your-random-secret-key-min-32-chars
JWT_EXPIRY=7d
```

## Next Steps

1. ✅ Create Supabase account
2. ✅ Create project
3. ✅ Get connection details
4. ✅ Initialize schema
5. ✅ Update .env.local
6. ✅ Test connection
7. ✅ Create test admin
8. ✅ Start application
9. ✅ Test login
10. ✅ Deploy to production

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.io
- GitHub Issues: https://github.com/supabase/supabase/issues

## Quick Commands

```bash
# Test Supabase connection
npm run dev:server

# View logs
npm run dev:server

# Run tests
npm test

# Build for production
npm run build
```

Enjoy your cloud-hosted survey platform! 🚀
