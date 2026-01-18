# Setup Checklist - Survey Platform

## ✅ Application Status

- ✅ **Frontend**: Running on http://localhost:3000
- ✅ **Code**: All built and compiled
- ✅ **Configuration**: Environment variables set
- ⏳ **Database**: Needs initialization (2 minutes)
- ⏳ **Admin Account**: Needs creation (1 minute)

---

## 📋 What You Need to Do (3 minutes total)

### Step 1: Initialize Database (2 minutes)

**Go to Supabase:**
1. Open https://app.supabase.com
2. Click your project: `survey-platform`
3. Click **SQL Editor** in left sidebar
4. Click **New Query** button
5. Copy entire contents of `scripts/init-db.sql` file
6. Paste into the SQL editor
7. Click **Run** button
8. Wait for "Success" message

**What this does:**
- Creates all database tables
- Sets up relationships between tables
- Creates indexes for performance

### Step 2: Create Admin Account (1 minute)

**In the same SQL Editor:**
1. Click **New Query** button again
2. Paste this SQL:

```sql
INSERT INTO admins (email, password_hash) VALUES (
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm'
);
```

3. Click **Run** button
4. Wait for "Success" message

**What this does:**
- Creates admin account
- Email: `admin@example.com`
- Password: `password123` (hashed)

---

## 🚀 After Setup Complete

### Access the Application

**For Users (Public):**
- Go to http://localhost:3000
- See available surveys
- Click "Start Survey"
- Fill out and submit

**For Admins:**
- Go to http://localhost:3000/admin/login
- Email: `admin@example.com`
- Password: `password123`
- Click Login

### Create Your First Survey

1. Login to admin dashboard
2. Click "Create Survey" button
3. Fill in survey details:
   - Title (English & Arabic)
   - Description (English & Arabic)
   - Customer Type (Pilgrims or Staff)
4. Add questions:
   - Click "Add Question"
   - Choose question type
   - Enter question text
   - Add options (for multiple choice)
5. Click "Create Survey"

### Share Survey

1. Go to home page (http://localhost:3000)
2. See your survey card
3. Share the link with respondents
4. They can take the survey without login

### View Responses

1. Login to admin dashboard
2. Click "View Surveys"
3. Click on your survey
4. Click "Responses" tab
5. See all submitted responses

---

## ✅ Verification Checklist

After completing setup, verify everything works:

- [ ] Database initialized (no errors in Supabase)
- [ ] Admin account created (can see in Supabase Table Editor)
- [ ] Can access http://localhost:3000
- [ ] Can see survey cards on home page
- [ ] Can login with admin@example.com / password123
- [ ] Can create a new survey
- [ ] Can see survey on home page
- [ ] Can take survey as user
- [ ] Can see response in admin dashboard

---

## 🆘 If Something Goes Wrong

### "Database connection error"
- Check Supabase project is running
- Verify `.env.local` has correct credentials
- Try running SQL again in Supabase

### "Can't login"
- Verify admin account exists in Supabase Table Editor
- Check email is exactly `admin@example.com`
- Try creating admin account again

### "No surveys showing"
- Verify database tables exist in Supabase
- Try creating a survey in admin dashboard
- Check browser console for errors

### "Frontend won't load"
- Ensure `npm run dev` is running
- Check http://localhost:3000 in browser
- Clear browser cache (Ctrl+Shift+Delete)

---

## 📞 Quick Reference

**Frontend URL:** http://localhost:3000
**Admin Login:** http://localhost:3000/admin/login
**Admin Email:** admin@example.com
**Admin Password:** password123
**Supabase URL:** https://app.supabase.com

---

## 🎯 You're Almost There!

Just 2 more minutes of setup and your survey platform will be fully operational.

**Next Step:** Go to Supabase and run the SQL initialization script.

---

**Questions?** Check `READY_TO_RUN.md` for more details.
