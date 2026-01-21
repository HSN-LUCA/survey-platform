# Hostinger + GitHub Deployment (Recommended)

## Why This Method?

✅ Automatic deployments when you push code  
✅ No manual file uploads needed  
✅ Easy to update your app  
✅ Professional workflow  

---

## Prerequisites

- GitHub account (you have this)
- Hostinger Cloud account (free tier available)
- Your code on GitHub (already done)

---

## Step-by-Step Guide

### Step 1: Create Hostinger Cloud Account

1. Go to https://www.hostinger.com/cloud
2. Click **Sign Up**
3. Create account with your email
4. Verify your email
5. Log in to Hostinger Cloud dashboard

**Time: 5 minutes**

---

### Step 2: Create New Application

1. In Hostinger Cloud dashboard
2. Click **Create Application**
3. Select **Node.js** as runtime
4. Choose your region (closest to your users)
5. Click **Next**

**Time: 2 minutes**

---

### Step 3: Connect GitHub Repository

1. Click **Connect GitHub**
2. Hostinger will ask for permission
3. Click **Authorize Hostinger**
4. GitHub will ask for permission - click **Authorize**
5. Select your repository: `survey-platform`
6. Select branch: `main`
7. Click **Connect**

**Time: 3 minutes**

---

### Step 4: Configure Build Settings

**Build Command:**
```
npm run build
```

**Start Command:**
```
npm start
```

**Node Version:** 18 or higher

**Port:** 3000

Click **Next**

**Time: 2 minutes**

---

### Step 5: Add Environment Variables

Click **Add Environment Variable** for each:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key from Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv` |
| `JWT_SECRET` | Generate random string (32+ chars) |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.com` |
| `NODE_ENV` | `production` |

**How to get Supabase values:**
1. Go to Supabase Dashboard
2. Click your project
3. Go to Settings → API
4. Copy the values

**Time: 5 minutes**

---

### Step 6: Deploy

1. Review all settings
2. Click **Deploy**
3. Wait for build to complete (5-10 minutes)
4. You'll see a live URL like: `https://survey-platform-abc123.hostinger.app`

**Time: 10 minutes**

---

### Step 7: Test Your App

1. Open the URL in your browser
2. You should see language selection screen
3. Click English or العربية
4. Verify surveys load
5. Test admin login at `/admin/login`
   - Email: `admin@example.com`
   - Password: `password123`

**Time: 2 minutes**

---

## Total Time: ~30 minutes

---

## After Deployment

### Update Your App

When you make changes to your code:

```bash
git add .
git commit -m "Your message"
git push origin main
```

Hostinger will automatically:
1. Detect the push
2. Pull the latest code
3. Build the app
4. Deploy it

**No manual steps needed!**

---

## Add Custom Domain

1. In Hostinger Cloud dashboard
2. Go to Application Settings
3. Click **Add Domain**
4. Enter your domain
5. Update DNS records (Hostinger will show instructions)
6. Wait 24 hours for DNS to propagate

---

## Troubleshooting

### Build fails?
1. Check Hostinger build logs
2. Verify environment variables are set
3. Ensure package.json is correct
4. Try pushing again

### App won't start?
1. Check application logs in Hostinger
2. Verify all environment variables
3. Check Node.js version is 18+
4. Restart application

### Database connection error?
1. Verify Supabase credentials
2. Check Supabase project is active
3. Test connection in Supabase dashboard

### Surveys not loading?
1. Check Supabase API is accessible
2. Verify database has survey data
3. Open browser console (F12) for errors

---

## Useful Hostinger Commands

**View logs:**
```
Hostinger Dashboard → Application → Logs
```

**Restart application:**
```
Hostinger Dashboard → Application → Restart
```

**View environment variables:**
```
Hostinger Dashboard → Settings → Environment Variables
```

---

## Security Tips

1. ✅ Change default admin password
2. ✅ Use strong JWT_SECRET
3. ✅ Keep dependencies updated
4. ✅ Enable HTTPS (automatic)
5. ✅ Monitor access logs
6. ✅ Set up database backups

---

## Monitoring

### Check Application Health
1. Go to Hostinger Dashboard
2. View application status
3. Check CPU/Memory usage
4. Review error logs

### Monitor Database
1. Go to Supabase Dashboard
2. Check query performance
3. Monitor storage usage
4. Review access logs

---

## Backup Your Database

1. Go to Supabase Dashboard
2. Go to Backups
3. Create manual backup
4. Download backup file

Do this weekly!

---

## Update Dependencies

Periodically update your dependencies:

```bash
npm update
git add package.json package-lock.json
git commit -m "Update dependencies"
git push origin main
```

Hostinger will automatically redeploy!

---

## Performance Tips

1. Enable caching in Next.js
2. Optimize images
3. Use database indexes
4. Monitor Supabase performance
5. Check Hostinger metrics

---

## Support

**Hostinger Support:**
- https://support.hostinger.com
- https://docs.hostinger.com/cloud

**Application Issues:**
- Check Hostinger logs
- Review Supabase documentation
- Check Next.js documentation

---

## Summary

This setup gives you:
- ✅ Automatic deployments
- ✅ Easy updates
- ✅ Professional workflow
- ✅ Scalable infrastructure
- ✅ 24/7 uptime

**Your app is now production-ready!**

