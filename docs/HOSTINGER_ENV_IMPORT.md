# 📥 Import .env File to Hostinger

Yes! You can import environment variables directly from a `.env` file. This is actually faster than entering them one by one.

---

## Option 1: Upload .env File via SFTP (File Upload Deployment)

### Step 1: Prepare .env File Locally

On your computer, create a file named `.env` with this content:

```
DATABASE_URL=postgresql://postgres:52S7BkoypaKNqvw5@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres?sslmode=require
DB_HOST=nbjuyltaeunxcishhwqu.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=52S7BkoypaKNqvw5
NEXT_PUBLIC_SUPABASE_URL=https://nbjuyltaeunxcishhwqu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_9G1k4DgE52cnO-5VuvVoFA_Dv9XbX_Y
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXv
API_PORT=3000
API_URL=https://hidelogs.com
NEXT_PUBLIC_API_URL=https://hidelogs.com
JWT_SECRET=HVNDrRS1M09SPH4DDrpWYdwVUnScoDygISM3tDl9n7CLbdffw7/Z3C8p610db3KlDc9eAVDKHHxt1NDB4ZcLgg==
JWT_EXPIRY=7d
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://hidelogs.com
NEXT_TELEMETRY_DISABLED=1
```

### Step 2: Upload via SFTP

1. Open FileZilla
2. Connect to Hostinger via SFTP
3. Navigate to your `survey-platform` folder
4. Drag and drop the `.env` file from your computer
5. Wait for upload to complete

### Step 3: Verify

Connect via SSH and run:

```bash
cat .env
```

You should see all variables listed.

---

## Option 2: Use Hostinger Dashboard Import (If Available)

Some Hostinger plans allow importing environment variables:

### Step 1: Go to Environment Variables

1. Log in to Hostinger
2. Go to **Applications** → Your App
3. Click **Settings** or **Environment Variables**

### Step 2: Look for Import Option

- Click **Import** or **Upload .env**
- Select your `.env` file from your computer
- Click **Import**

### Step 3: Verify

All variables should appear in the dashboard.

---

## Option 3: Copy-Paste from .env.production

We already created `.env.production` in your project:

### Step 1: Open .env.production

In your project folder, open `survey-platform/.env.production`

### Step 2: Copy All Content

Select all and copy (Ctrl+A, Ctrl+C)

### Step 3: Create .env on Server

Via SFTP or SSH:

```bash
# Via SSH
cat > .env << 'EOF'
[PASTE YOUR CONTENT HERE]
EOF
```

Or via SFTP:
1. Create new file named `.env`
2. Right-click → Edit
3. Paste the content
4. Save

---

## ✅ Quick Comparison

| Method | Speed | Difficulty | Best For |
|--------|-------|-----------|----------|
| **SFTP Upload** | Fast | Easy | File upload deployment |
| **Dashboard Import** | Very Fast | Very Easy | GitHub deployment |
| **Copy-Paste** | Medium | Easy | Any deployment |
| **Manual Entry** | Slow | Hard | Not recommended |

---

## 🎯 Recommended Approach

### For File Upload Deployment:
1. Use the `.env.production` file we created
2. Upload it via SFTP to your server
3. Rename it to `.env` on the server
4. Done! ✅

### For GitHub Deployment:
1. Use Hostinger Dashboard
2. Click **Import** (if available)
3. Select `.env.production` file
4. Click **Import**
5. Done! ✅

---

## 📝 Steps to Import .env.production

### Step 1: Locate the File

In your project:
```
survey-platform/
├── .env.production  ← This file
├── .env
└── ...
```

### Step 2: Copy Content

Open `.env.production` and copy all content

### Step 3: Upload to Server

**Via SFTP:**
1. Open FileZilla
2. Connect to Hostinger
3. Navigate to `survey-platform` folder
4. Create new file: `.env`
5. Edit and paste content
6. Save

**Via SSH:**
```bash
# Create .env file with content
cat > .env << 'EOF'
[PASTE CONTENT HERE]
EOF

# Verify
cat .env
```

### Step 4: Restart App

```bash
npm start
```

---

## ⚠️ Important

- ✅ `.env` file should be in the root of `survey-platform` folder
- ✅ File name must be exactly `.env` (with the dot)
- ✅ Don't commit `.env` to Git (already in .gitignore)
- ✅ Keep it secure - don't share the file
- ✅ Update domain if you change from `hidelogs.com`

---

## 🚀 After Importing

1. Restart your app:
   ```bash
   npm start
   ```

2. Verify variables are loaded:
   ```bash
   cat .env
   ```

3. Test your app:
   - Visit your domain
   - Try admin login
   - Check if surveys load

---

## Summary

**Fastest way to import .env:**

1. Copy content from `survey-platform/.env.production`
2. Upload to server as `.env` file
3. Restart app
4. Done! ✅

**That's it!** Your environment variables are now imported and ready to use.

---

**Next Step:** Follow [HOSTINGER_FILE_UPLOAD_DEPLOY.md](HOSTINGER_FILE_UPLOAD_DEPLOY.md) to complete deployment.
