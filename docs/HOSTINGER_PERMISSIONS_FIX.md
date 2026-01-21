# 🔧 Fix Node Modules Permissions for Hostinger

If you get a build error about "next binary cannot be executed due to file permissions", follow this guide.

---

## The Problem

```
Error: The next binary in node_modules/.bin cannot be executed due to file permissions
```

This happens when npm binaries don't have execute permissions on the server.

---

## Solution

### Option 1: Quick Fix (Recommended)

Run these commands on your Hostinger server via SSH:

```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Reinstall with correct permissions
npm install

# Build again
npm run build
```

This recreates all binaries with correct permissions automatically.

---

### Option 2: Fix Existing Permissions

If you don't want to reinstall, fix permissions directly:

```bash
# Fix node_modules permissions
chmod -R 755 node_modules
chmod -R 755 node_modules/.bin

# Try building again
npm run build
```

---

## Step-by-Step for Hostinger

### Step 1: Connect via SSH

1. Log in to Hostinger
2. Go to **Account** → **SSH Access**
3. Copy your SSH credentials
4. Open terminal/PuTTY and connect:

```bash
ssh username@your-server.com
```

### Step 2: Navigate to Your Project

```bash
cd public_html/survey-platform
# or wherever your project is located
```

### Step 3: Run the Fix

```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Build
npm run build
```

### Step 4: Verify

You should see:

```
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages
```

---

## Why This Happens

- **Windows**: File permissions are handled automatically
- **Linux/Hostinger**: npm binaries need execute permissions (755)
- **Solution**: Reinstalling recreates binaries with correct permissions

---

## Prevention

To avoid this in the future:

1. **Always reinstall on the server:**
   ```bash
   npm install
   ```

2. **Don't upload node_modules** - Let npm create them with correct permissions

3. **Use .gitignore** - Ensure node_modules is ignored:
   ```
   node_modules/
   .next/
   ```

---

## Troubleshooting

### Still getting permission errors?

Try with sudo:

```bash
sudo chmod -R 755 node_modules
sudo chmod -R 755 node_modules/.bin
npm run build
```

### Build still fails?

Check Node.js version:

```bash
node --version
npm --version
```

Should be:
- Node.js 20.x or higher
- npm 10.x or higher

---

## Summary

| Issue | Solution |
|-------|----------|
| Permission denied | `rm -rf node_modules && npm install` |
| next binary error | `chmod -R 755 node_modules/.bin` |
| Build fails | Reinstall dependencies |

---

**After fixing permissions, your build should work perfectly!** ✅
