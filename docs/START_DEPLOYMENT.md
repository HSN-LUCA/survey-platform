# 🚀 START HERE - Deploy to Hostinger in 25 Minutes

## What You Have
✅ Survey Platform fully built and tested
✅ Supabase database ready
✅ Admin panel ready
✅ All features working

## What You Need to Do
1. Build your app
2. Create environment file
3. Push to GitHub
4. Connect to Hostinger
5. Deploy

**Total time: 25 minutes**

---

## STEP 1: Build Your App (2 minutes)

Open Command Prompt/Terminal and run:

```bash
cd survey-platform
npm run build
```

You should see: `✓ Compiled successfully`

---

## STEP 2: Create Environment File (3 minutes)

In the `survey-platform` folder, create a new file called `.env.production`

Copy this content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
JWT_SECRET=your-super-secret-random-string-here-make-it-long
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Replace these:**
- `your-project.supabase.co` → Your Supabase URL
- `your_anon_key_here` → Your Supabase Anon Key
- `your-super-secret-random-string-here-make-it-long` → Any random string
- `your-domain.com` → Will be provided by Hostinger

---

## STEP 3: Push to GitHub (5 minutes)

Run these commands:

```bash
cd survey-platform
git init
git add .
git commit -m "Survey Platform - Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/survey-platform.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## STEP 4: Deploy to Hostinger (10 minutes)

1. Go to https://hpanel.hostinger.com
2. Click **Applications** → **Create Application**
3. Select **Node.js**
4. Choose your region
5. Click **Connect Repository**
6. Select GitHub and authorize
7. Choose `survey-platform` repository
8. Fill in:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Node Version: `18`
   - Port: `3000`
9. Click **Next**
10. Add Environment Variables from your `.env.production`
11. Click **Deploy**
12. Wait 5-10 minutes

---

## STEP 5: Test Your App (5 minutes)

1. Hostinger will give you a URL like: `https://survey-platform-abc123.hostinger.app`
2. Open it in your browser
3. You should see the language selection screen
4. Click English or العربية
5. You should see available surveys
6. Test admin login: `/admin/login` with `admin@example.com` / `password123`

---

## Done! 🎉

Your Survey Platform is now live!

**Share this URL with users:**
```
https://survey-platform-abc123.hostinger.app
```

---

## Need More Details?

Read these guides in order:

1. **HOSTINGER_QUICK_DEPLOY.md** - Full step-by-step guide
2. **DEPLOY_COMMANDS.md** - All commands with explanations
3. **HOSTINGER_VISUAL_STEPS.md** - Visual guide with descriptions
4. **HOSTINGER_DEPLOYMENT_GUIDE.md** - Complete reference

---

## Troubleshooting

### Build fails?
```bash
npm install
npm run build
```

### App won't start?
- Check Hostinger logs
- Verify environment variables
- Check Supabase is running

### Surveys not loading?
- Check Supabase database has data
- Verify Supabase credentials
- Check browser console (F12)

### Admin login fails?
- Check JWT_SECRET is set
- Verify admin user exists
- Clear browser cookies

---

## Questions?

1. Check the deployment guides
2. Check Hostinger logs
3. Contact Hostinger support: https://support.hostinger.com

---

## You're Ready! 🚀

Follow the 5 steps above and your app will be live in 25 minutes.

**Start with Step 1 now!**

