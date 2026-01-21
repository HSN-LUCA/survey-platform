# ⚡ Vercel Quick Reference - Copy & Paste Commands

## The 5 Commands You Need

### Command 1: Initialize Git
```bash
cd survey-platform
git init
```

### Command 2: Add Files
```bash
git add .
```

### Command 3: Commit
```bash
git commit -m "Survey Platform - Ready for Vercel"
```

### Command 4: Add GitHub Remote
```bash
git remote add origin https://github.com/YOUR_USERNAME/survey-platform.git
git branch -M main
```

### Command 5: Push to GitHub
```bash
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username**

---

## Environment Variables to Add in Vercel

Copy these exactly:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY = sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
JWT_SECRET = your-super-secret-random-string-here-make-it-long
NEXT_PUBLIC_APP_URL = https://your-domain.com
```

---

## URLs You Need

1. **GitHub:** https://github.com/new
2. **Vercel:** https://vercel.com
3. **Supabase:** https://supabase.com

---

## Your Credentials

```
Supabase URL: https://your-project.supabase.co
Supabase Anon Key: [your-anon-key]
Service Role Key: sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
Admin Email: admin@example.com
Admin Password: password123
```

---

## Testing URLs

- **Home:** `https://your-url.vercel.app`
- **Admin Login:** `https://your-url.vercel.app/admin/login`

---

## Admin Credentials

- Email: `admin@example.com`
- Password: `password123`

---

## Timeline

- 5 min: Push to GitHub
- 2 min: Go to Vercel
- 2 min: Import project
- 3 min: Add environment variables
- 3 min: Deploy
- 2 min: Test
- **Total: 17 minutes**

---

## Full Guide

Read: `VERCEL_STEP_BY_STEP.md`

