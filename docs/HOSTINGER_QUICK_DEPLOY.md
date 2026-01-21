# Hostinger Quick Deployment - Step by Step

## What You Need
- Hostinger Cloud account (you have this)
- Supabase account with database set up (you have this)
- Your app code ready (you have this)

## Your Credentials (Keep Safe!)
```
Supabase URL: https://your-project.supabase.co
Supabase Anon Key: eyJhbGc...
Service Role Key: sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
Database Password: 52S7BkoypaKNqvw5
Admin Email: admin@example.com
Admin Password: password123
```

---

## STEP 1: Prepare Your Code (5 minutes)

### 1.1 Build the app locally first
```bash
cd survey-platform
npm run build
```

This creates a `.next` folder with your compiled app.

### 1.2 Create `.env.production` file
In the `survey-platform` folder, create a new file called `.env.production` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
JWT_SECRET=your-super-secret-random-string-here-make-it-long
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Replace:**
- `your-project.supabase.co` with your actual Supabase URL
- `your_anon_key_here` with your Supabase Anon Key
- `your-domain.com` with your actual domain (or Hostinger's provided URL)

---

## STEP 2: Upload to Hostinger (10 minutes)

### Option A: Using Git (Easiest - Recommended)

#### 2A.1 Initialize Git
```bash
cd survey-platform
git init
git add .
git commit -m "Survey Platform - Ready for deployment"
```

#### 2A.2 Push to GitHub/GitLab
1. Create a new repository on GitHub (https://github.com/new)
2. Name it `survey-platform`
3. Copy the commands to push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/survey-platform.git
git branch -M main
git push -u origin main
```

#### 2A.3 Connect to Hostinger
1. Log in to Hostinger Cloud (https://hpanel.hostinger.com)
2. Click **Applications** in left menu
3. Click **Create Application**
4. Select **Node.js**
5. Choose your region (closest to you)
6. Click **Connect Repository**
7. Select GitHub and authorize
8. Choose your `survey-platform` repository
9. Click **Connect**

#### 2A.4 Configure Build Settings
Hostinger will show a form. Fill it like this:

| Field | Value |
|-------|-------|
| Build Command | `npm run build` |
| Start Command | `npm start` |
| Node Version | 18 |
| Port | 3000 |

#### 2A.5 Add Environment Variables
1. In Hostinger, go to **Application Settings**
2. Click **Environment Variables**
3. Add each variable from your `.env.production`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `NODE_ENV` = `production`
   - `NEXT_PUBLIC_APP_URL`

#### 2A.6 Deploy
1. Click **Deploy**
2. Wait 5-10 minutes for build to complete
3. You'll get a URL like: `https://survey-platform-abc123.hostinger.app`

---

### Option B: Manual Upload (If Git doesn't work)

#### 2B.1 Build locally
```bash
npm run build
```

#### 2B.2 Upload via SFTP
1. In Hostinger, go to **File Manager**
2. Upload the entire `survey-platform` folder
3. Upload `.env.production` file

#### 2B.3 Install and Start
In Hostinger terminal:
```bash
cd survey-platform
npm install --production
npm start
```

---

## STEP 3: Test Your App (5 minutes)

### 3.1 Open Your App
1. Go to the URL Hostinger gave you
2. You should see the **Language Selection Screen**
3. Click English or العربية
4. You should see **Available Surveys**

### 3.2 Test Admin Panel
1. Go to `https://your-url/admin/login`
2. Login with:
   - Email: `admin@example.com`
   - Password: `password123`
3. You should see the admin dashboard

### 3.3 Test Survey
1. Go back to home page
2. Click "Start Survey" on any survey
3. Fill in your details
4. Answer questions
5. Click "Submit Survey"
6. You should see success message

---

## STEP 4: Set Up Custom Domain (Optional - 5 minutes)

### 4.1 Add Domain in Hostinger
1. In Hostinger, go to **Application Settings**
2. Click **Domains**
3. Click **Add Domain**
4. Enter your domain name
5. Hostinger will show DNS records to add

### 4.2 Update DNS
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS settings
3. Add the records Hostinger showed you
4. Wait 24 hours for DNS to update

### 4.3 SSL Certificate
- Hostinger automatically provides free SSL
- Your domain will be `https://your-domain.com`

---

## STEP 5: Troubleshooting

### App won't start?
1. Check **Logs** in Hostinger dashboard
2. Look for error messages
3. Verify all environment variables are set
4. Make sure `.env.production` has correct values

### Surveys not loading?
1. Check Supabase is running
2. Verify database has survey data
3. Check browser console (F12) for errors
4. Verify Supabase credentials in `.env.production`

### Admin login fails?
1. Check JWT_SECRET is set
2. Verify admin user exists in database
3. Try clearing browser cookies
4. Check Supabase database connection

### Database connection error?
1. Verify Supabase URL is correct
2. Check Supabase project is active
3. Verify database tables exist
4. Test connection in Supabase dashboard

---

## STEP 6: Monitor Your App

### Check Logs
1. In Hostinger, click **Logs**
2. Look for any errors
3. Check application is running

### Monitor Performance
1. In Hostinger, click **Monitoring**
2. Check CPU and memory usage
3. Check response times

### Database Backups
1. Go to Supabase dashboard
2. Click **Backups**
3. Create manual backup
4. Download backup file

---

## Quick Reference

| Task | Time | Difficulty |
|------|------|------------|
| Prepare code | 5 min | Easy |
| Upload to Hostinger | 10 min | Easy |
| Test app | 5 min | Easy |
| Set up domain | 5 min | Easy |
| **Total** | **25 min** | **Easy** |

---

## You're Done! 🎉

Your Survey Platform is now live on Hostinger!

**Next Steps:**
1. Share your domain with users
2. Create surveys in admin panel
3. Monitor responses in analytics
4. Update surveys as needed

**Need Help?**
- Hostinger Support: https://support.hostinger.com
- Check application logs in Hostinger dashboard
- Review the full guide: `HOSTINGER_DEPLOYMENT_GUIDE.md`

