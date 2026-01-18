# 🚀 Getting Started with Survey Platform

Your survey platform is **fully built and ready to use**. Follow these steps to get it running.

## Prerequisites

- Node.js 18+ installed
- npm installed
- Supabase account (free at https://supabase.com)

## Step 1: Install Dependencies

```bash
cd survey-platform
npm install
```

## Step 2: Initialize Supabase Database

### 2a. Go to Supabase Dashboard

1. Open https://app.supabase.com
2. Select your `survey-platform` project
3. Click **SQL Editor** → **New Query**

### 2b. Create Database Schema

Copy all content from `scripts/init-db.sql` and paste into the SQL Editor, then click **Run**.

### 2c. Create Admin Account

Create a new query and run:

```sql
INSERT INTO admins (email, password_hash) VALUES (
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm'
);
```

## Step 3: Start the Application

### Option A: Run Both Servers Together

```bash
npm run dev:all
```

### Option B: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:server
```

## Step 4: Access the Application

### Admin Dashboard
- **URL**: http://localhost:3000/admin/login
- **Email**: `admin@example.com`
- **Password**: `password123`

### Public Survey
- **URL**: http://localhost:3000/survey/[survey-id]
- (Create a survey in admin dashboard first)

## What You Can Do

### Admin Features
- ✅ Create surveys (Arabic & English)
- ✅ Add questions (Multiple Choice, Star Rating, Percentage Range)
- ✅ Manage surveys (edit, archive, delete)
- ✅ View responses and analytics
- ✅ Export survey data

### Survey Features
- ✅ Multi-language support (Arabic/English)
- ✅ Three question types
- ✅ Form validation
- ✅ Real-time response tracking
- ✅ Analytics dashboard

## Project Structure

```
survey-platform/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   └── i18n/            # Multi-language config
├── server/
│   ├── routes/          # API endpoints
│   └── middleware/      # Auth & validation
├── lib/
│   ├── auth.ts          # Authentication
│   └── db.ts            # Database connection
├── scripts/
│   └── init-db.sql      # Database schema
└── .env.local           # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Surveys (Admin)
- `GET /api/admin/surveys` - List all surveys
- `POST /api/admin/surveys` - Create survey
- `PUT /api/admin/surveys/:id` - Update survey
- `DELETE /api/admin/surveys/:id` - Delete survey
- `GET /api/admin/surveys/:id/analytics` - Get analytics

### Surveys (Public)
- `GET /api/surveys/:id` - Get survey details
- `POST /api/surveys/:id/responses` - Submit response

## Troubleshooting

### Backend not responding
1. Check if backend is running: `http://localhost:3001/api/health`
2. Verify `.env.local` has correct Supabase credentials
3. Check Supabase database tables exist

### Can't login
1. Verify admin exists in Supabase Table Editor
2. Check email is exactly: `admin@example.com`
3. Recreate admin with SQL query above

### Frontend can't reach backend
1. Verify backend is running on port 3001
2. Check `NEXT_PUBLIC_API_URL=http://localhost:3001` in `.env.local`
3. Check browser console for CORS errors

## Documentation

- `BACKEND_SETUP_GUIDE.md` - Backend setup & troubleshooting
- `SUPABASE_SETUP.md` - Supabase configuration
- `IMPLEMENTATION_SUMMARY.md` - Feature overview
- `QUICK_TEST.md` - Testing guide

## Next Steps

1. ✅ Initialize database
2. ✅ Start application
3. ✅ Login to admin dashboard
4. ✅ Create your first survey
5. ✅ Share survey link with users
6. ✅ View responses and analytics
7. ✅ Deploy to production (Vercel, Railway, Render)

## Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Railway or Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy

See `SUPABASE_SETUP.md` for detailed deployment instructions.

---

**You're all set! Start building surveys.** 🎉
