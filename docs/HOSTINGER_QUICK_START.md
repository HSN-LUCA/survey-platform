# Hostinger Deployment - Quick Start (5 Minutes)

## The Fastest Way to Deploy

---

## What You Need

✅ GitHub account (you have this)  
✅ Hostinger account (free tier available)  
✅ Supabase credentials (you have this)  

---

## 5-Minute Setup

### 1. Create Hostinger Account (2 min)

Go to: https://www.hostinger.com/cloud

- Click **Sign Up**
- Create account
- Verify email
- Log in

### 2. Create Application (1 min)

- Click **Create Application**
- Select **Node.js**
- Click **Next**

### 3. Connect GitHub (1 min)

- Click **Connect GitHub**
- Authorize Hostinger
- Select: `survey-platform`
- Select branch: `main`

### 4. Add Environment Variables (1 min)

Add these 6 variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
SUPABASE_SERVICE_ROLE_KEY = sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
JWT_SECRET = your-super-secret-random-string-here-make-it-long
NEXT_PUBLIC_APP_URL = https://your-domain.com
NODE_ENV = production
```

### 5. Deploy (Click Button!)

- Click **Deploy**
- Wait 10 minutes
- Your app is LIVE! 🎉

---

## Get Supabase Values

1. Go to Supabase Dashboard
2. Click your project
3. Go to **Settings → API**
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Test Your App

1. Open the URL from Hostinger
2. Select language
3. View surveys
4. Test admin: `/admin/login`
   - Email: `admin@example.com`
   - Password: `password123`

---

## Update Your App

```bash
git add .
git commit -m "Your message"
git push origin main
```

**Hostinger automatically redeploys!** ✅

---

## That's It!

Your app is now live on Hostinger!

**Need help?** See `HOSTINGER_GITHUB_DEPLOY.md` for detailed steps.

