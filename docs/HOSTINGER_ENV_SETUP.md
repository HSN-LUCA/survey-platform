# 🔐 Environment Variables Setup for Hostinger

## Overview

Environment variables are configuration settings that your app needs to run. In Hostinger, you can set them in two ways:
1. **Via Hostinger Dashboard** (Recommended for GitHub deployment)
2. **Via .env file** (For file upload deployment)

---

## Method 1: Via Hostinger Dashboard (GitHub Deployment)

### Step 1: Go to Application Settings

1. Log in to Hostinger
2. Go to **Applications** or **Cloud**
3. Select your application
4. Click **Settings** or **Environment Variables**

### Step 2: Add Environment Variables

Click **Add Variable** and add each of these:

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://nbjuyltaeunxcishhwqu.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sb_publishable_9G1k4DgE52cnO-5VuvVoFA_Dv9XbX_Y

SUPABASE_SERVICE_ROLE_KEY
Value: sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv

JWT_SECRET
Value: HVNDrRS1M09SPH4DDrpWYdwVUnScoDygISM3tDl9n7CLbdffw7/Z3C8p610db3KlDc9eAVDKHHxt1NDB4ZcLgg==

NEXT_PUBLIC_APP_URL
Value: https://hidelogs.com

NODE_ENV
Value: production

API_PORT
Value: 3000

DATABASE_URL
Value: postgresql://postgres:52S7BkoypaKNqvw5@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres?sslmode=require

DB_HOST
Value: nbjuyltaeunxcishhwqu.supabase.co

DB_PORT
Value: 5432

DB_NAME
Value: postgres

DB_USER
Value: postgres

DB_PASSWORD
Value: 52S7BkoypaKNqvw5

API_URL
Value: https://hidelogs.com

NEXT_PUBLIC_API_URL
Value: https://hidelogs.com

JWT_EXPIRY
Value: 7d

NEXT_TELEMETRY_DISABLED
Value: 1
```

### Step 3: Save and Deploy

1. Click **Save**
2. Hostinger will automatically redeploy your app
3. Wait 5-10 minutes for deployment to complete

---

## Method 2: Via .env File (File Upload Deployment)

### Step 1: Create .env File on Server

If you uploaded files via SFTP:

1. Connect to Hostinger via SFTP (FileZilla)
2. Navigate to your `survey-platform` folder
3. Right-click → **Create new file**
4. Name it: `.env`

### Step 2: Add All Variables

Copy and paste this entire content into the `.env` file:

```
# ============================================
# DATABASE CONFIGURATION - SUPABASE
# ============================================
DATABASE_URL=postgresql://postgres:52S7BkoypaKNqvw5@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres?sslmode=require
DB_HOST=nbjuyltaeunxcishhwqu.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=52S7BkoypaKNqvw5

# ============================================
# SUPABASE CONFIGURATION
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://nbjuyltaeunxcishhwqu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_9G1k4DgE52cnO-5VuvVoFA_Dv9XbX_Y
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv

# ============================================
# API CONFIGURATION
# ============================================
API_PORT=3000
API_URL=https://hidelogs.com
NEXT_PUBLIC_API_URL=https://hidelogs.com

# ============================================
# JWT CONFIGURATION
# ============================================
JWT_SECRET=HVNDrRS1M09SPH4DDrpWYdwVUnScoDygISM3tDl9n7CLbdffw7/Z3C8p610db3KlDc9eAVDKHHxt1NDB4ZcLgg==
JWT_EXPIRY=7d

# ============================================
# APPLICATION CONFIGURATION
# ============================================
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://hidelogs.com

# ============================================
# NEXT.JS CONFIGURATION
# ============================================
NEXT_TELEMETRY_DISABLED=1
```

### Step 3: Save the File

1. Right-click the `.env` file
2. Click **Edit**
3. Paste the content above
4. Save and close

---

## 📋 Environment Variables Explained

### Database Variables
| Variable | Purpose | Value |
|----------|---------|-------|
| `DATABASE_URL` | Full database connection string | PostgreSQL URL |
| `DB_HOST` | Database server address | Supabase host |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | postgres |
| `DB_USER` | Database username | postgres |
| `DB_PASSWORD` | Database password | Your password |

### Supabase Variables
| Variable | Purpose | Value |
|----------|---------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key | Anon key from Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API key | Service role key |

### API Variables
| Variable | Purpose | Value |
|----------|---------|-------|
| `API_PORT` | Port your app runs on | 3000 |
| `API_URL` | Your domain URL | https://hidelogs.com |
| `NEXT_PUBLIC_API_URL` | Public API URL | https://hidelogs.com |

### JWT Variables
| Variable | Purpose | Value |
|----------|---------|-------|
| `JWT_SECRET` | Secret for signing tokens | Your secure secret |
| `JWT_EXPIRY` | Token expiration time | 7d (7 days) |

### Application Variables
| Variable | Purpose | Value |
|----------|---------|-------|
| `NODE_ENV` | Environment mode | production |
| `NEXT_PUBLIC_APP_URL` | App URL for clients | https://hidelogs.com |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | 1 |

---

## 🔍 Verify Environment Variables

### Via Hostinger Dashboard

1. Go to **Settings** → **Environment Variables**
2. You should see all variables listed
3. Values should be hidden (for security)

### Via SSH Terminal

Connect via SSH and run:

```bash
cat .env
```

You should see all variables listed.

---

## ⚠️ Important Notes

### Security
- ✅ Never commit `.env` to Git (already in .gitignore)
- ✅ Keep JWT_SECRET secure
- ✅ Don't share credentials
- ✅ Use HTTPS only (Hostinger provides free SSL)

### NEXT_PUBLIC Variables
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Only put non-sensitive data here
- Database passwords should NOT start with `NEXT_PUBLIC_`

### Domain Update
If you change your domain from `hidelogs.com` to something else:

1. Update these variables:
   - `API_URL`
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_APP_URL`

2. Redeploy your app

---

## 🚀 After Setting Variables

### For GitHub Deployment
1. Variables are set in Hostinger dashboard
2. Click **Deploy** or **Redeploy**
3. Wait 5-10 minutes
4. Your app will use the new variables

### For File Upload Deployment
1. Create `.env` file on server
2. Restart your app:
   ```bash
   npm start
   ```
3. App will use the new variables

---

## ✅ Verification Checklist

After setting environment variables:

- [ ] All 18 variables are set
- [ ] Database connection works
- [ ] Supabase API is accessible
- [ ] JWT_SECRET is secure
- [ ] Domain is correct
- [ ] App starts without errors
- [ ] Admin login works
- [ ] Surveys load correctly

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` is correct
- Verify Supabase project is active
- Check database password

### "Supabase API error"
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Ensure Supabase project is running

### "Admin login fails"
- Verify `JWT_SECRET` is set
- Check `JWT_EXPIRY` is valid
- Clear browser cookies

### "App won't start"
- Check all variables are set
- Verify no typos in variable names
- Check values don't have extra spaces
- Restart the app

---

## 📞 Need Help?

**Hostinger Support:**
- https://support.hostinger.com
- https://docs.hostinger.com/cloud

**Supabase Support:**
- https://supabase.com/docs

**Next.js Documentation:**
- https://nextjs.org/docs/basic-features/environment-variables

---

## Summary

| Method | When to Use | Difficulty |
|--------|------------|-----------|
| **Dashboard** | GitHub deployment | Easy |
| **.env file** | File upload deployment | Medium |

**Recommended:** Use Hostinger Dashboard if deploying via GitHub, use `.env` file if uploading files manually.

---

**Your environment variables are ready to use!** 🎉
