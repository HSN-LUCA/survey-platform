# 🚀 Hostinger Deployment - Simple Steps

## Total Time: 20-30 Minutes

---

## OPTION 1: Deploy with GitHub (Easiest - Recommended)

### Step 1: Push Code to GitHub (5 minutes)

Your code is already on GitHub at: `https://github.com/HSN-LUCA/survey-platform`

✅ Done!

---

### Step 2: Create Hostinger Cloud Account (2 minutes)

1. Go to https://www.hostinger.com/cloud
2. Click **Sign Up**
3. Create account with your email
4. Verify email

✅ Account created!

---

### Step 3: Connect GitHub to Hostinger (3 minutes)

1. Log in to Hostinger Cloud
2. Click **Create Application**
3. Select **Node.js**
4. Click **Connect GitHub**
5. Authorize Hostinger to access your GitHub
6. Select repository: `survey-platform`
7. Select branch: `main`

✅ GitHub connected!

---

### Step 4: Configure Application (5 minutes)

**Build Settings:**
- Build Command: `npm run build`
- Start Command: `npm start`
- Node Version: 18
- Port: 3000

**Environment Variables** (Add these):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
JWT_SECRET=your-super-secret-random-string-here-make-it-long
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

**Where to find Supabase values:**
1. Go to Supabase Dashboard
2. Click your project
3. Go to Settings → API
4. Copy the values

✅ Application configured!

---

### Step 5: Deploy (5 minutes)

1. Click **Deploy**
2. Wait for build to complete (5-10 minutes)
3. You'll get a live URL like: `https://survey-platform-abc123.hostinger.app`

✅ Your app is LIVE!

---

### Step 6: Test Your App (2 minutes)

1. Open the URL in your browser
2. Select a language (English or العربية)
3. View surveys
4. Test admin login at `/admin/login`
   - Email: `admin@example.com`
   - Password: `password123`

✅ Everything works!

---

## OPTION 2: Deploy Without GitHub (Manual Upload)

### Step 1: Build Locally (5 minutes)

Open Command Prompt in survey-platform folder:

```bash
npm run build
```

This creates a `.next` folder with your built app.

✅ Built!

---

### Step 2: Get SFTP Credentials from Hostinger (2 minutes)

1. Log in to Hostinger Cloud
2. Go to your application
3. Click **Settings**
4. Find **SFTP Credentials**
5. Copy:
   - Host
   - Username
   - Password
   - Port

✅ Credentials copied!

---

### Step 3: Upload Files via SFTP (10 minutes)

Use an SFTP client (like FileZilla):

1. Download FileZilla: https://filezilla-project.org/
2. Open FileZilla
3. Go to File → Site Manager
4. Click **New Site**
5. Enter Hostinger SFTP credentials
6. Click **Connect**
7. Upload entire `survey-platform` folder to server

✅ Files uploaded!

---

### Step 4: Install Dependencies on Server (5 minutes)

Connect via SSH (or use Hostinger terminal):

```bash
cd survey-platform
npm install --production
```

✅ Dependencies installed!

---

### Step 5: Create .env.production File (2 minutes)

Create file on server at: `/survey-platform/.env.production`

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
JWT_SECRET=your-super-secret-random-string-here-make-it-long
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

✅ Environment file created!

---

### Step 6: Start Application (2 minutes)

```bash
npm start
```

Your app will start on port 3000.

✅ App running!

---

### Step 7: Configure Domain (5 minutes)

1. In Hostinger Cloud dashboard
2. Go to Application Settings
3. Add your custom domain
4. Update DNS records (Hostinger will show instructions)
5. Wait 24 hours for DNS to propagate

✅ Domain configured!

---

## 🎉 Done!

Your Survey Platform is now live on Hostinger!

**Your URL:**
```
https://your-domain.com
```

---

## Troubleshooting

### App won't start?
1. Check logs in Hostinger dashboard
2. Verify environment variables are set
3. Ensure Node.js version is 18+
4. Run `npm install` again

### Database connection error?
1. Verify Supabase credentials
2. Check Supabase project is active
3. Test connection in Supabase dashboard

### Surveys not loading?
1. Check Supabase API is accessible
2. Verify database has survey data
3. Check browser console (F12) for errors

### Admin login fails?
1. Verify JWT_SECRET is set
2. Check admin user exists
3. Clear browser cookies

---

## Your Credentials

```
Supabase URL: https://your-project.supabase.co
Supabase Anon Key: [your-anon-key]
Service Role Key: sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
Database Password: 52S7BkoypaKNqvw5
Admin Email: admin@example.com
Admin Password: password123
```

---

## After Deployment

### Create Surveys
1. Go to `/admin/login`
2. Login with `admin@example.com` / `password123`
3. Click "Create Survey"
4. Add questions and categories
5. Publish survey

### Monitor Responses
1. Go to Analytics
2. View survey responses
3. Export data

### Update Your App
When you make changes:
```bash
git add .
git commit -m "Update"
git push
```

Hostinger will automatically redeploy!

---

## Summary

| Option | Time | Difficulty | Best For |
|--------|------|-----------|----------|
| GitHub (Option 1) | 20 min | Easy | Automatic updates |
| Manual (Option 2) | 30 min | Medium | Full control |

**Recommendation:** Use Option 1 (GitHub) - it's easier and auto-updates!

