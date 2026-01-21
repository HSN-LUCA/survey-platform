# 🚀 Deploy to Hostinger WITHOUT GitHub - Direct Upload Method

## Overview
Deploy your Survey Platform directly to Hostinger using SFTP or File Manager. No GitHub needed!

**Total time: 30-40 minutes**

---

## STEP 1: Build Your App Locally (5 minutes)

### 1.1 Build the application
```bash
cd survey-platform
npm run build
```

You should see: `✓ Compiled successfully`

This creates a `.next` folder with your compiled app.

---

## STEP 2: Create Environment File (3 minutes)

### 2.1 Create `.env.production` file

In the `survey-platform` folder, create a new file called `.env.production`

Add this content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
JWT_SECRET=your-super-secret-random-string-here-make-it-long
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Replace these values:**
- `your-project.supabase.co` → Your Supabase URL
- `your_anon_key_here` → Your Supabase Anon Key
- `your-super-secret-random-string-here-make-it-long` → Any random string (at least 32 characters)
- `your-domain.com` → Will be provided by Hostinger

---

## STEP 3: Prepare Files for Upload (5 minutes)

### 3.1 What to upload

You need to upload these folders and files:

```
survey-platform/
├── .next/                    (compiled app)
├── node_modules/             (dependencies)
├── public/                   (static files)
├── src/                      (source code)
├── .env.production           (environment file)
├── package.json              (dependencies list)
├── package-lock.json         (dependencies lock)
├── next.config.ts            (Next.js config)
├── tsconfig.json             (TypeScript config)
└── [other config files]
```

### 3.2 What NOT to upload

❌ `.git` folder (not needed)
❌ `.kiro` folder (not needed)
❌ `.vscode` folder (not needed)
❌ `node_modules/.bin` (will be recreated)

---

## STEP 4: Upload to Hostinger (15-20 minutes)

### Option A: Using Hostinger File Manager (Easiest)

#### 4A.1 Log in to Hostinger
1. Go to https://hpanel.hostinger.com
2. Log in with your credentials
3. Click **File Manager** in the left menu

#### 4A.2 Create application folder
1. Click **Create Folder**
2. Name it: `survey-platform`
3. Click **Create**

#### 4A.3 Upload files
1. Open the `survey-platform` folder
2. Click **Upload Files**
3. Select all files from your local `survey-platform` folder
4. Click **Upload**

**Note:** This may take 10-15 minutes depending on file size

#### 4A.4 Verify upload
1. Check that all folders are uploaded:
   - `.next/` ✓
   - `src/` ✓
   - `public/` ✓
   - `node_modules/` ✓
   - `.env.production` ✓
   - `package.json` ✓

---

### Option B: Using SFTP (Faster for large files)

#### 4B.1 Get SFTP credentials
1. In Hostinger, go to **File Manager**
2. Click **SFTP Accounts** (or **SSH/SFTP**)
3. Create new SFTP account or use existing
4. Note down:
   - Host: `your-server.hostinger.com`
   - Username: `your-username`
   - Password: `your-password`
   - Port: `22` (or as shown)

#### 4B.2 Connect via SFTP
Use an SFTP client like:
- **FileZilla** (free, Windows/Mac/Linux)
- **WinSCP** (free, Windows)
- **Cyberduck** (free, Mac)

Steps:
1. Open SFTP client
2. Click **New Connection**
3. Enter:
   - Host: `your-server.hostinger.com`
   - Username: `your-username`
   - Password: `your-password`
   - Port: `22`
4. Click **Connect**

#### 4B.3 Upload files
1. Navigate to `/home/your-username/public_html/`
2. Create folder: `survey-platform`
3. Drag and drop all files from your local folder
4. Wait for upload to complete

---

## STEP 5: Install Dependencies on Server (5 minutes)

### 5.1 Connect via SSH Terminal

#### Using Hostinger Terminal:
1. In Hostinger, go to **File Manager**
2. Click **Terminal** (or **SSH Terminal**)
3. You'll see a command prompt

#### Using local terminal (if you have SSH access):
```bash
ssh your-username@your-server.hostinger.com
```

### 5.2 Install dependencies
```bash
cd public_html/survey-platform
npm install --production
```

This installs only production dependencies (faster than full install).

**Wait for it to complete** (2-5 minutes)

---

## STEP 6: Configure Hostinger Application (5 minutes)

### 6.1 Create Node.js application in Hostinger

1. In Hostinger, go to **Applications**
2. Click **Create Application**
3. Select **Node.js**
4. Choose your region
5. Fill in:
   - **Application Name:** `survey-platform`
   - **Application Root:** `/public_html/survey-platform`
   - **Build Command:** `npm run build` (or leave empty if already built)
   - **Start Command:** `npm start`
   - **Node Version:** `18`
   - **Port:** `3000`

6. Click **Create**

### 6.2 Add Environment Variables

1. In Hostinger, go to **Applications**
2. Click your application
3. Go to **Environment Variables**
4. Add each variable from your `.env.production`:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your_anon_key_here`
   - `SUPABASE_SERVICE_ROLE_KEY` = `sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv`
   - `JWT_SECRET` = `your-random-string`
   - `NODE_ENV` = `production`
   - `NEXT_PUBLIC_APP_URL` = `https://your-url`

5. Click **Save**

---

## STEP 7: Start Your Application (2 minutes)

### 7.1 Start the app

1. In Hostinger, go to **Applications**
2. Click your application
3. Click **Start** button
4. Wait for status to show **Running**

---

## STEP 8: Test Your App (5 minutes)

### 8.1 Get your URL

1. In Hostinger, go to **Applications**
2. Click your application
3. You'll see a URL like: `https://survey-platform-abc123.hostinger.app`

### 8.2 Test in browser

1. Open the URL in your browser
2. You should see the **Language Selection Screen**
3. Click **English** or **العربية**
4. You should see **Available Surveys**

### 8.3 Test admin login

1. Go to: `https://your-url/admin/login`
2. Login with:
   - Email: `admin@example.com`
   - Password: `password123`
3. You should see the **Admin Dashboard**

### 8.4 Test survey submission

1. Go back to home page
2. Click **Start Survey**
3. Fill in your details
4. Answer questions
5. Click **Submit Survey**
6. You should see success message

---

## STEP 9: Set Up Custom Domain (Optional - 5 minutes)

### 9.1 Add domain in Hostinger

1. In Hostinger, go to **Applications**
2. Click your application
3. Go to **Domains**
4. Click **Add Domain**
5. Enter your domain name
6. Click **Add**

### 9.2 Update DNS

1. Hostinger will show DNS records to add
2. Go to your domain registrar (GoDaddy, Namecheap, etc.)
3. Find DNS settings
4. Add the records Hostinger showed
5. Save changes
6. Wait 24 hours for DNS to update

---

## Troubleshooting

### Issue: Files won't upload
**Solution:**
- Check file size (should be under 500MB)
- Try uploading in smaller batches
- Use SFTP instead of File Manager

### Issue: npm install fails
**Solution:**
```bash
cd public_html/survey-platform
npm cache clean --force
npm install --production
```

### Issue: App won't start
**Solution:**
1. Check Hostinger logs
2. Verify environment variables are set
3. Check `.env.production` file exists
4. Verify Node version is 18+

### Issue: Surveys not loading
**Solution:**
1. Check Supabase database has data
2. Verify Supabase credentials in environment variables
3. Check browser console (F12) for errors

### Issue: Admin login fails
**Solution:**
1. Check JWT_SECRET is set
2. Verify admin user exists in database
3. Clear browser cookies

---

## Updating Your App

### When you make changes locally:

1. Build locally:
```bash
npm run build
```

2. Upload new `.next` folder via SFTP/File Manager

3. Restart application in Hostinger

---

## Monitoring Your App

### Check logs
1. In Hostinger, go to **Applications**
2. Click your application
3. Click **Logs**
4. Look for any error messages

### Monitor performance
1. In Hostinger, go to **Monitoring**
2. Check CPU usage
3. Check memory usage
4. Check response times

---

## Backup Your App

### Backup files
1. Use SFTP to download your files
2. Keep a local copy

### Backup database
1. Go to Supabase Dashboard
2. Click **Backups**
3. Create manual backup
4. Download backup file

---

## Summary

| Step | Time | What to do |
|------|------|-----------|
| 1 | 5 min | Build app locally |
| 2 | 3 min | Create `.env.production` |
| 3 | 5 min | Prepare files |
| 4 | 15-20 min | Upload to Hostinger |
| 5 | 5 min | Install dependencies |
| 6 | 5 min | Configure application |
| 7 | 2 min | Start application |
| 8 | 5 min | Test app |
| 9 | 5 min | Set up domain (optional) |
| **TOTAL** | **40-50 min** | **LIVE** |

---

## Your App is Live! 🎉

**URL:** `https://survey-platform-abc123.hostinger.app`

**Share this URL with users to access surveys!**

---

## Next Steps

1. Create surveys in admin panel
2. Share URL with users
3. Monitor responses in analytics
4. Update surveys as needed

---

## Support

- Hostinger Support: https://support.hostinger.com
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

