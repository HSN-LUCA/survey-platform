# 🚀 Hostinger File Upload Deployment - Step by Step

## Total Time: 30-40 Minutes

---

## Step 1: Build Your App Locally (5 minutes)

Open Command Prompt in survey-platform folder:

```bash
npm run build
```

This creates a `.next` folder with your built app.

**Wait for it to complete successfully.**

---

## Step 2: Get Hostinger SFTP Credentials (2 minutes)

1. Log in to Hostinger
2. Go to your application settings
3. Find **SFTP Credentials** or **File Manager**
4. Copy:
   - Host/Server
   - Username
   - Password
   - Port (usually 22 for SFTP)

---

## Step 3: Download SFTP Client (2 minutes)

Download FileZilla (free):
https://filezilla-project.org/download.php

Or use any SFTP client you prefer.

---

## Step 4: Connect to Hostinger via SFTP (3 minutes)

**Using FileZilla:**

1. Open FileZilla
2. Go to **File → Site Manager**
3. Click **New Site**
4. Enter:
   - **Host:** Your Hostinger SFTP host
   - **Port:** 22 (or your port)
   - **Protocol:** SFTP
   - **Username:** Your username
   - **Password:** Your password
5. Click **Connect**

---

## Step 5: Upload Your Files (10 minutes)

**What to upload:**

1. **Entire `survey-platform` folder** (all files and folders)
   - src/
   - public/
   - server/
   - lib/
   - scripts/
   - package.json
   - package-lock.json
   - next.config.ts
   - tsconfig.json
   - .env.production (rename to .env)
   - And all other files

**How to upload:**

1. In FileZilla, navigate to your server's public directory
2. Drag and drop the `survey-platform` folder
3. Wait for upload to complete (may take 5-10 minutes)

---

## Step 6: Create .env File on Server (2 minutes)

1. In FileZilla, navigate to the `survey-platform` folder
2. Right-click → **Create new file**
3. Name it: `.env`
4. Edit it and add:

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
API_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com

# JWT Configuration
JWT_SECRET=HVNDrRS1M09SPH4DDrpWYdwVUnScoDygISM3tDl9n7CLbdffw7/Z3C8p610db3KlDc9eAVDKHHxt1NDB4ZcLgg==
JWT_EXPIRY=7d

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Next.js Configuration
NEXT_TELEMETRY_DISABLED=1
```

**Replace `your-domain.com` with your actual domain!**

---

## Step 7: Install Dependencies on Server (5 minutes)

Connect via SSH (or use Hostinger terminal):

```bash
cd survey-platform
npm install --production
```

Wait for it to complete.

---

## Step 8: Start Your Application (2 minutes)

```bash
npm start
```

Your app will start on port 3000.

---

## Step 9: Configure Domain (5 minutes)

1. In Hostinger dashboard
2. Go to Application Settings
3. Add your custom domain
4. Update DNS records (Hostinger will show instructions)
5. Wait 24 hours for DNS to propagate

---

## Step 10: Test Your App (5 minutes)

1. Open your domain in browser
2. You should see language selection screen
3. Click English or العربية
4. Verify surveys load
5. Test admin login at `/admin/login`
   - Email: `admin@example.com`
   - Password: `password123`

---

## ✅ Your App is LIVE!

---

## Troubleshooting

### App won't start?
- Check logs in Hostinger
- Verify .env file is correct
- Ensure Node.js 18+ is installed
- Run `npm install` again

### Database connection error?
- Verify Supabase credentials in .env
- Check Supabase project is active
- Test connection in Supabase dashboard

### Surveys not loading?
- Check Supabase API is accessible
- Verify database has survey data
- Check browser console (F12) for errors

### Admin login fails?
- Verify JWT_SECRET is set
- Check admin user exists
- Clear browser cookies

---

## Your Credentials

```
Supabase URL: https://nbjuyltaeunxcishhwqu.supabase.co
Supabase Anon Key: sb_publishable_9G1k4DgE52cnO-5VuvVoFA_Dv9XbX_Y
Service Role Key: sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
JWT Secret: HVNDrRS1M09SPH4DDrpWYdwVUnScoDygISM3tDl9n7CLbdffw7/Z3C8p610db3KlDc9eAVDKHHxt1NDB4ZcLgg==
Admin Email: admin@example.com
Admin Password: password123
```

---

## Summary

| Step | Time | What to do |
|------|------|-----------|
| 1 | 5 min | Build locally |
| 2 | 2 min | Get SFTP credentials |
| 3 | 2 min | Download SFTP client |
| 4 | 3 min | Connect to Hostinger |
| 5 | 10 min | Upload files |
| 6 | 2 min | Create .env file |
| 7 | 5 min | Install dependencies |
| 8 | 2 min | Start application |
| 9 | 5 min | Configure domain |
| 10 | 5 min | Test app |
| **TOTAL** | **41 min** | **LIVE** |

---

## 🎉 Done!

Your Survey Platform is now live on Hostinger!

