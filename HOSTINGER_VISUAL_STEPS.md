# Hostinger Deployment - Visual Step-by-Step Guide

## Overview
This guide shows you exactly what to do with screenshots descriptions.

---

## PHASE 1: Prepare Your Code (5 minutes)

### Step 1.1: Build Your App
**What to do:**
1. Open Command Prompt or Terminal
2. Navigate to your project:
   ```bash
   cd survey-platform
   ```
3. Build the app:
   ```bash
   npm run build
   ```

**What you should see:**
```
> next build
  ▲ Next.js 14.0.0
  ✓ Compiled successfully
```

---

### Step 1.2: Create `.env.production` File

**What to do:**
1. In the `survey-platform` folder, create a new file
2. Name it: `.env.production` (exactly this name)
3. Copy this content into it:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
JWT_SECRET=your-super-secret-random-string-here-make-it-long
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Replace these values:**
- `your-project.supabase.co` → Your actual Supabase URL
- `your_anon_key_here` → Your Supabase Anon Key
- `your-super-secret-random-string-here-make-it-long` → Any random string (at least 32 characters)
- `your-domain.com` → Your domain or Hostinger URL (you'll get this after deployment)

**Where to find Supabase values:**
1. Go to https://supabase.com
2. Log in to your account
3. Click your project
4. Go to **Settings** → **API**
5. Copy the values shown

---

## PHASE 2: Upload to Hostinger (10 minutes)

### Step 2.1: Create GitHub Repository

**What to do:**
1. Go to https://github.com/new
2. Fill in:
   - Repository name: `survey-platform`
   - Description: `Survey Platform App`
   - Visibility: **Public** (or Private if you prefer)
3. Click **Create repository**

**What you'll see:**
```
Quick setup — if you've done this kind of thing before
or
…or create a new repository on the command line
```

---

### Step 2.2: Push Your Code to GitHub

**What to do:**
1. Open Command Prompt/Terminal
2. Go to your project folder:
   ```bash
   cd survey-platform
   ```
3. Initialize Git:
   ```bash
   git init
   ```
4. Add all files:
   ```bash
   git add .
   ```
5. Create first commit:
   ```bash
   git commit -m "Survey Platform - Ready for deployment"
   ```
6. Add GitHub as remote (copy from GitHub page):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/survey-platform.git
   git branch -M main
   git push -u origin main
   ```

**Replace `YOUR_USERNAME` with your GitHub username**

**What you should see:**
```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
...
To https://github.com/YOUR_USERNAME/survey-platform.git
 * [new branch]      main -> main
```

---

### Step 2.3: Connect to Hostinger

**What to do:**
1. Go to https://hpanel.hostinger.com
2. Log in with your Hostinger account
3. Click **Applications** in the left menu
4. Click **Create Application** button
5. Select **Node.js** from the list
6. Choose your region (closest to you)
7. Click **Connect Repository**

**What you'll see:**
```
Select Git Provider
- GitHub
- GitLab
- Bitbucket
```

---

### Step 2.4: Authorize GitHub

**What to do:**
1. Click **GitHub**
2. Click **Authorize Hostinger**
3. GitHub will ask for permission
4. Click **Authorize hostinger-cloud**
5. You'll be redirected back to Hostinger

**What you'll see:**
```
Select Repository
- survey-platform
```

---

### Step 2.5: Select Your Repository

**What to do:**
1. Click on `survey-platform` repository
2. Click **Connect**

**What you'll see:**
```
Build Settings
Build Command: [text field]
Start Command: [text field]
Node Version: [dropdown]
Port: [text field]
```

---

### Step 2.6: Configure Build Settings

**What to do:**
Fill in these exact values:

| Field | Value |
|-------|-------|
| Build Command | `npm run build` |
| Start Command | `npm start` |
| Node Version | `18` |
| Port | `3000` |

**What it looks like:**
```
Build Command: npm run build
Start Command: npm start
Node Version: 18
Port: 3000
```

---

### Step 2.7: Add Environment Variables

**What to do:**
1. Click **Next** or **Environment Variables**
2. You'll see a form to add variables
3. Click **Add Variable** for each one:

**Add these variables:**

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_anon_key_here` |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv` |
| `JWT_SECRET` | `your-random-string-here` |
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_APP_URL` | `https://your-url.hostinger.app` |

**What it looks like:**
```
Environment Variables
[+] Add Variable

NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY = sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
JWT_SECRET = your-random-string-here
NODE_ENV = production
NEXT_PUBLIC_APP_URL = https://your-url.hostinger.app
```

---

### Step 2.8: Deploy

**What to do:**
1. Click **Deploy** button
2. Wait for deployment to complete (5-10 minutes)
3. You'll see a progress bar

**What you'll see:**
```
Deployment in progress...
Building application... 30%
Installing dependencies... 60%
Starting application... 90%
Deployment complete! ✓
```

**After deployment, you'll get a URL like:**
```
https://survey-platform-abc123.hostinger.app
```

---

## PHASE 3: Test Your App (5 minutes)

### Step 3.1: Open Your App

**What to do:**
1. Copy the URL Hostinger gave you
2. Open it in your browser
3. You should see the language selection screen

**What you should see:**
```
🌐
Select Language
اختر اللغة

[English] [العربية]
```

---

### Step 3.2: Test Language Selection

**What to do:**
1. Click **English** or **العربية**
2. Wait for page to load
3. You should see available surveys

**What you should see:**
```
Available Surveys
الاستبيانات المتاحة

[Survey Card 1]
[Survey Card 2]
[Survey Card 3]
```

---

### Step 3.3: Test Admin Login

**What to do:**
1. Go to: `https://your-url/admin/login`
2. Enter:
   - Email: `admin@example.com`
   - Password: `password123`
3. Click **Login**

**What you should see:**
```
Admin Dashboard
Surveys | Analytics | Settings
```

---

### Step 3.4: Test Survey Submission

**What to do:**
1. Go back to home page
2. Click **Start Survey** on any survey
3. Fill in your details
4. Answer all questions
5. Click **Submit Survey**

**What you should see:**
```
✓
Success
Survey submitted successfully

[Back]
```

---

## PHASE 4: Set Up Custom Domain (Optional - 5 minutes)

### Step 4.1: Add Domain in Hostinger

**What to do:**
1. In Hostinger, go to **Application Settings**
2. Click **Domains**
3. Click **Add Domain**
4. Enter your domain name
5. Click **Add**

**What you'll see:**
```
DNS Records to Add:
Type: A
Name: @
Value: 1.2.3.4

Type: CNAME
Name: www
Value: survey-platform.hostinger.app
```

---

### Step 4.2: Update DNS at Your Registrar

**What to do:**
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS settings
3. Add the records Hostinger showed you
4. Save changes
5. Wait 24 hours for DNS to update

**What it looks like:**
```
DNS Records
Type | Name | Value
A    | @    | 1.2.3.4
CNAME| www  | survey-platform.hostinger.app
```

---

### Step 4.3: Verify SSL Certificate

**What to do:**
1. Wait 24 hours for DNS to update
2. Open your domain in browser
3. You should see `https://` (green lock icon)

**What you should see:**
```
https://your-domain.com ✓
```

---

## PHASE 5: Monitor Your App

### Step 5.1: Check Logs

**What to do:**
1. In Hostinger, click **Applications**
2. Click your application
3. Click **Logs**
4. Look for any error messages

**What you should see:**
```
Logs
[INFO] Application started successfully
[INFO] Connected to database
[INFO] Server running on port 3000
```

---

### Step 5.2: Monitor Performance

**What to do:**
1. In Hostinger, click **Monitoring**
2. Check CPU usage (should be low)
3. Check memory usage (should be under 50%)
4. Check response times (should be under 1 second)

**What you should see:**
```
CPU: 5%
Memory: 25%
Response Time: 200ms
```

---

## Troubleshooting

### Problem: App won't load

**Solution:**
1. Check Hostinger logs for errors
2. Verify all environment variables are set
3. Check Supabase is running
4. Try refreshing the page

---

### Problem: Surveys not showing

**Solution:**
1. Check Supabase database has survey data
2. Verify Supabase credentials in environment variables
3. Check browser console (F12) for errors
4. Try logging out and back in

---

### Problem: Admin login fails

**Solution:**
1. Check JWT_SECRET is set
2. Verify admin user exists in database
3. Try clearing browser cookies
4. Check Supabase connection

---

## Success Checklist

- [ ] App builds locally without errors
- [ ] `.env.production` file created
- [ ] Code pushed to GitHub
- [ ] GitHub connected to Hostinger
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Deployment completed
- [ ] App loads in browser
- [ ] Language selection works
- [ ] Surveys display
- [ ] Admin login works
- [ ] Survey submission works
- [ ] (Optional) Custom domain set up

---

## You're Done! 🎉

Your Survey Platform is now live on Hostinger!

**Your URL:** `https://your-url.hostinger.app` (or your custom domain)

**Share this URL with users to access surveys!**

