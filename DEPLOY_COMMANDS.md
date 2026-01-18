# Exact Commands to Deploy to Hostinger

Copy and paste these commands in order. Replace the values in `[brackets]` with your actual values.

---

## STEP 1: Build Your App

```bash
cd survey-platform
npm run build
```

**Expected output:** You should see "compiled successfully" message.

---

## STEP 2: Create Environment File

Create a file called `.env.production` in the `survey-platform` folder with this content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
JWT_SECRET=[generate-a-random-string-like-abc123xyz789]
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://[your-domain-or-hostinger-url]
```

**Where to find these values:**

1. **NEXT_PUBLIC_SUPABASE_URL**: 
   - Go to Supabase Dashboard
   - Click your project
   - Go to Settings → API
   - Copy "Project URL"

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**:
   - Same page as above
   - Copy "Anon public key"

3. **SUPABASE_SERVICE_ROLE_KEY**:
   - Same page as above
   - Copy "Service role key"
   - Already provided: `sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv`

4. **JWT_SECRET**:
   - Generate a random string (at least 32 characters)
   - Example: `your-super-secret-random-string-make-it-long-and-random`

5. **NEXT_PUBLIC_APP_URL**:
   - Will be provided by Hostinger after deployment
   - Or your custom domain if you have one
   - Example: `https://survey-platform-abc123.hostinger.app`

---

## STEP 3: Initialize Git Repository

```bash
cd survey-platform
git init
git add .
git commit -m "Survey Platform - Ready for deployment"
```

---

## STEP 4: Create GitHub Repository

1. Go to https://github.com/new
2. Name it: `survey-platform`
3. Click "Create repository"
4. Copy the commands shown (they'll look like below)

Then run these commands:

```bash
git remote add origin https://github.com/[YOUR_USERNAME]/survey-platform.git
git branch -M main
git push -u origin main
```

**Replace `[YOUR_USERNAME]` with your actual GitHub username**

---

## STEP 5: Deploy to Hostinger

### Via Hostinger Dashboard:

1. Go to https://hpanel.hostinger.com
2. Click **Applications** → **Create Application**
3. Select **Node.js**
4. Choose your region
5. Click **Connect Repository**
6. Select GitHub and authorize
7. Choose `survey-platform` repository
8. Fill in these settings:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Node Version: `18`
   - Port: `3000`

9. Click **Next**
10. Add Environment Variables (copy from your `.env.production`):
    - `NEXT_PUBLIC_SUPABASE_URL` = `https://[your-project].supabase.co`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `[your-anon-key]`
    - `SUPABASE_SERVICE_ROLE_KEY` = `sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv`
    - `JWT_SECRET` = `[your-random-string]`
    - `NODE_ENV` = `production`
    - `NEXT_PUBLIC_APP_URL` = `https://[your-url]`

11. Click **Deploy**
12. Wait 5-10 minutes for deployment to complete

---

## STEP 6: Test Your Deployment

Once Hostinger gives you a URL (like `https://survey-platform-abc123.hostinger.app`):

1. Open the URL in your browser
2. You should see the **Language Selection Screen**
3. Click English or العربية
4. You should see **Available Surveys**
5. Test admin login: `https://[your-url]/admin/login`
   - Email: `admin@example.com`
   - Password: `password123`

---

## STEP 7: Set Up Custom Domain (Optional)

If you have a custom domain:

1. In Hostinger, go to **Application Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain name
4. Hostinger will show DNS records
5. Go to your domain registrar (GoDaddy, Namecheap, etc.)
6. Add the DNS records Hostinger showed
7. Wait 24 hours for DNS to update

---

## Troubleshooting Commands

### Check if build works locally
```bash
npm run build
npm start
```

Then open http://localhost:3000

### Check for errors
```bash
npm run lint
```

### Verify environment variables are set
```bash
cat .env.production
```

### Check Node version
```bash
node --version
```

Should be 18 or higher.

---

## Quick Checklist

- [ ] Built app locally: `npm run build`
- [ ] Created `.env.production` file
- [ ] Initialized Git: `git init`
- [ ] Committed code: `git commit -m "..."`
- [ ] Created GitHub repository
- [ ] Pushed to GitHub: `git push -u origin main`
- [ ] Connected GitHub to Hostinger
- [ ] Set build/start commands in Hostinger
- [ ] Added environment variables in Hostinger
- [ ] Clicked Deploy in Hostinger
- [ ] Waited for deployment (5-10 minutes)
- [ ] Tested app in browser
- [ ] Tested admin login
- [ ] (Optional) Set up custom domain

---

## Your Deployment URL

After deployment, Hostinger will give you a URL like:
```
https://survey-platform-abc123.hostinger.app
```

Share this URL with users to access your surveys!

---

## Need Help?

1. Check Hostinger logs: **Applications** → **Logs**
2. Check Supabase status: https://status.supabase.com
3. Check Node.js version: `node --version` (should be 18+)
4. Verify environment variables are set correctly
5. Check browser console (F12) for errors

