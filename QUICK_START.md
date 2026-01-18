# Quick Start Guide - Survey Platform with Supabase

## 🚀 Get Started in 5 Minutes

### 1. Initialize Supabase Database (2 minutes)

1. Go to https://app.supabase.com
2. Select your `survey-platform` project
3. Click **SQL Editor** → **New Query**
4. Copy entire contents of `scripts/init-db.sql`
5. Paste and click **Run**
6. ✅ Done!

### 2. Create Test Admin (30 seconds)

In SQL Editor, run:
```sql
INSERT INTO admins (email, password_hash) VALUES (
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm'
);
```

### 3. Start the Application (1 minute)

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
npm run dev:server
```

### 4. Login (30 seconds)

1. Go to http://localhost:3000/admin/login
2. Email: `admin@example.com`
3. Password: `password123`
4. ✅ You're in!

## 📋 What You Get

- ✅ Multi-language surveys (Arabic/English)
- ✅ Multiple question types (multiple choice, star rating, percentage range)
- ✅ Admin dashboard with analytics
- ✅ Real-time response tracking
- ✅ Cloud database (Supabase)
- ✅ JWT authentication
- ✅ Responsive design

## 🔧 Configuration

Your `.env.local` is already configured with:
- Supabase database connection
- API endpoints
- JWT settings

No additional setup needed!

## 📚 Full Documentation

- `SUPABASE_READY.md` - Complete setup status
- `SUPABASE_INIT.md` - Detailed initialization guide
- `README.md` - Project overview
- `IMPLEMENTATION_SUMMARY.md` - Feature details

## 🆘 Troubleshooting

**Server won't start?**
```bash
npm install
npm run dev:server
```

**Can't login?**
- Check admin exists in Supabase Table Editor
- Verify email is `admin@example.com`
- Try creating admin again

**Database connection error?**
- Verify Supabase project is running
- Check `.env.local` has correct credentials
- Verify password is `@#12345`

## 🎯 Next Steps

1. Create your first survey in the admin dashboard
2. Share survey link with respondents
3. View responses in real-time
4. Export data for analysis
5. Deploy to production (Vercel, Railway, or Render)

---

**That's it! Your survey platform is ready to use.** 🎉
