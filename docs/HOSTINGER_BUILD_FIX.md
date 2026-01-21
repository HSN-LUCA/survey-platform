# 🔧 Fix Hostinger Build Permission Error

If you see this error on Hostinger:

```
Permission denied: /home/u147074571/domains/hidelogs.com/public_html/.builds/source/survey-platform/node_modules/.bin/next
ERROR: Failed to build the application
```

Follow this guide to fix it.

---

## ✅ Solution Applied

We've added configuration files to fix this issue:

### 1. `.npmrc` File
```
unsafe-perm=true
```
This tells npm to allow installing packages with execute permissions.

### 2. `.node-version` File
```
20.11.0
```
This ensures Hostinger uses Node.js 20.x.

---

## 🚀 What to Do Now

### Option 1: Redeploy (Recommended)

If you're using GitHub deployment:

1. **Commit the new files:**
   ```bash
   git add .npmrc .node-version
   git commit -m "Add npm and node configuration for Hostinger"
   git push origin main
   ```

2. **Redeploy on Hostinger:**
   - Go to Hostinger dashboard
   - Click "Redeploy" or "Deploy"
   - Wait 5-10 minutes
   - Build should now succeed ✅

### Option 2: Manual Fix via SSH

If you're using file upload deployment:

1. **Connect via SSH:**
   ```bash
   ssh username@your-server.com
   cd public_html/survey-platform
   ```

2. **Create .npmrc file:**
   ```bash
   echo "unsafe-perm=true" > .npmrc
   ```

3. **Create .node-version file:**
   ```bash
   echo "20.11.0" > .node-version
   ```

4. **Reinstall and rebuild:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

5. **Start the app:**
   ```bash
   npm start
   ```

---

## 📋 Files Added

| File | Purpose |
|------|---------|
| `.npmrc` | Allows npm to install with execute permissions |
| `.node-version` | Specifies Node.js 20.x |

Both files are now in your repository and will be used automatically on Hostinger.

---

## ✅ Verification

After redeploying, you should see:

```
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

No more permission errors! ✅

---

## 🔍 Why This Works

**The Problem:**
- Hostinger's build environment has strict file permissions
- npm tries to create executable binaries
- Permission denied error occurs

**The Solution:**
- `.npmrc` with `unsafe-perm=true` allows npm to bypass permission checks
- `.node-version` ensures correct Node.js version
- Binaries are created with proper permissions

---

## 📞 Still Having Issues?

### Check Node.js Version
```bash
node --version
npm --version
```

Should show:
- Node.js v20.x.x
- npm 10.x.x

### Check File Permissions
```bash
ls -la node_modules/.bin/next
```

Should show:
```
-rwxr-xr-x (755 permissions)
```

### Force Reinstall
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

---

## 🎯 Summary

| Step | Status |
|------|--------|
| Add `.npmrc` | ✅ Done |
| Add `.node-version` | ✅ Done |
| Commit to Git | ⏳ Do this |
| Redeploy on Hostinger | ⏳ Do this |
| Verify build succeeds | ⏳ Do this |

---

**After these changes, your build should work perfectly on Hostinger!** 🚀
