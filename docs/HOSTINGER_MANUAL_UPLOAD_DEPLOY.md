# 🚀 Hostinger Manual Upload Deployment (No GitHub)

Complete step-by-step guide for uploading your app directly to Hostinger without GitHub.

---

## 📋 What You Need

- FileZilla (SFTP client) - Download: https://filezilla-project.org/download.php
- Your Hostinger SFTP credentials
- Your app built locally
- About 30-40 minutes

---

## Step 1: Build Your App Locally (5 minutes)

On your computer, open Command Prompt in the `survey-platform` folder:

```bash
npm run build
```

Wait for it to complete. You should see:
```
✓ Compiled successfully
✓ Finished TypeScript
✓ All pages generated
```

---

## Step 2: Get Hostinger SFTP Credentials (2 minutes)

1. Log in to Hostinger
2. Go to **Hosting** → **Manage**
3. Click **File Manager** or **SFTP Access**
4. Copy these credentials:
   - **Host/Server:** (e.g., `ftp.hidelogs.com` or IP address)
   - **Username:** (e.g., `u147074571`)
   - **Password:** (your password)
   - **Port:** Usually `22` for SFTP

---

## Step 3: Connect via SFTP (3 minutes)

### Using FileZilla:

1. Open FileZilla
2. Go to **File** → **Site Manager**
3. Click **New Site**
4. Fill in:
   - **Protocol:** SFTP
   - **Host:** Your Hostinger host
   - **Port:** 22
   - **Username:** Your username
   - **Password:** Your password
5. Click **Connect**

You should see your server files on the right side.

---

## Step 4: Navigate to Public Directory (1 minute)

In FileZilla (right side - server):

1. Look for `public_html` folder
2. Double-click to open it
3. You should see your domain folder or be in the root

---

## Step 5: Upload Your App (15 minutes)

### What to Upload:

From your computer (`survey-platform` folder), upload:

```
survey-platform/
├── .next/                    ← Built app
├── public/                   ← Static files
├── src/                      ← Source code
├── server/                   ← Backend code
├── lib/                      ← Libraries
├── scripts/                  ← Database scripts
├── package.json              ← Dependencies list
├── package-lock.json         ← Lock file
├── next.config.ts            ← Next.js config
├── tsconfig.json             ← TypeScript config
├── .npmrc                     ← NPM config (IMPORTANT!)
├── .node-version             ← Node version (IMPORTANT!)
└── .env.production           ← Environment variables
```

### How to Upload:

1. In FileZilla, left side (your computer):
   - Navigate to `survey-platform` folder
   - Select all files (Ctrl+A)

2. Right side (server):
   - Make sure you're in `public_html`

3. Drag and drop from left to right
   - Or right-click → Upload

4. Wait for upload to complete (5-10 minutes)

---

## Step 6: Create .env File on Server (2 minutes)

1. In FileZilla, right side (server):
   - Navigate to your app folder
   - Right-click → **Create new file**
   - Name it: `.env`

2. Right-click the `.env` file → **Edit**

3. Paste this content:

```
# Database Configuration
DATABASE_URL=postgresql://postgres:52S7BkoypaKNqvw5@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres?sslmode=require
DB_HOST=nbjuyltaeunxcishhwqu.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=52S7BkoypaKNqvw5

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://nbjuyltaeunxcishhwqu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_9G1k4DgE52cnO-5VuvVoFA_Dv9XbX_Y
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv

# API Configuration
API_PORT=3000
API_URL=https://hidelogs.com
NEXT_PUBLIC_API_URL=https://hidelogs.com

# JWT Configuration
JWT_SECRET=HVNDrRS1M09SPH4DDrpWYdwVUnScoDygISM3tDl9n7CLbdffw7/Z3C8p610db3KlDc9eAVDKHHxt1NDB4ZcLgg==
JWT_EXPIRY=7d

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://hidelogs.com

# Next.js Configuration
NEXT_TELEMETRY_DISABLED=1
```

4. Save and close

---

## Step 7: Install Dependencies on Server (5 minutes)

1. In Hostinger, go to **Hosting** → **Terminal** (or use SSH)

2. Navigate to your app:
   ```bash
   cd public_html/survey-platform
   ```

3. Install dependencies:
   ```bash
   npm install --production
   ```

   Wait for it to complete. You should see:
   ```
   added 876 packages
   found 0 vulnerabilities
   ```

---

## Step 8: Fix Permissions (If Needed) (2 minutes)

If you get permission errors, run:

```bash
chmod -R 755 node_modules
chmod -R 755 node_modules/.bin
```

---

## Step 9: Start Your Application (2 minutes)

```bash
npm start
```

Your app should start on port 3000. You should see:
```
ready - started server on 0.0.0.0:3000
```

---

## Step 10: Configure Domain (5 minutes)

1. In Hostinger dashboard
2. Go to **Domains** or **DNS**
3. Point your domain to the app
4. Wait for DNS to propagate (up to 24 hours)

---

## Step 11: Test Your App (5 minutes)

1. Open your browser
2. Visit: `https://hidelogs.com`
3. You should see the language selection screen
4. Click **English** or **العربية**
5. Surveys should load

### Test Admin Login:

1. Visit: `https://hidelogs.com/admin/login`
2. Email: `admin@example.com`
3. Password: `password123`
4. You should see the admin dashboard

---

## ✅ Your App is LIVE!

If everything works, congratulations! 🎉

---

## 🐛 Troubleshooting

### App won't start?
```bash
# Check logs
npm start

# If permission error:
chmod -R 755 node_modules/.bin

# Reinstall:
rm -rf node_modules
npm install --production
npm start
```

### Database connection error?
- Check `.env` file has correct credentials
- Verify Supabase project is active
- Test connection in Supabase dashboard

### Surveys not loading?
- Check browser console (F12)
- Verify Supabase API is accessible
- Check database has survey data

### Admin login fails?
- Verify JWT_SECRET in `.env`
- Check admin user exists in database
- Clear browser cookies

---

## 📋 Checklist

- [ ] App built locally (`npm run build`)
- [ ] SFTP credentials obtained
- [ ] FileZilla installed and connected
- [ ] All files uploaded
- [ ] `.env` file created on server
- [ ] Dependencies installed (`npm install --production`)
- [ ] Permissions fixed (if needed)
- [ ] App started (`npm start`)
- [ ] Domain configured
- [ ] App tested and working

---

## 📞 Need Help?

**Hostinger Support:**
- https://support.hostinger.com
- https://docs.hostinger.com

**Supabase Support:**
- https://supabase.com/docs

**Next.js Documentation:**
- https://nextjs.org/docs

---

## Summary

| Step | Time | What to do |
|------|------|-----------|
| 1 | 5 min | Build locally |
| 2 | 2 min | Get SFTP credentials |
| 3 | 3 min | Connect FileZilla |
| 4 | 1 min | Navigate to public_html |
| 5 | 15 min | Upload files |
| 6 | 2 min | Create .env file |
| 7 | 5 min | Install dependencies |
| 8 | 2 min | Fix permissions |
| 9 | 2 min | Start app |
| 10 | 5 min | Configure domain |
| 11 | 5 min | Test app |
| **TOTAL** | **47 min** | **LIVE** |

---

**Your Survey Platform is now live on Hostinger!** 🚀
