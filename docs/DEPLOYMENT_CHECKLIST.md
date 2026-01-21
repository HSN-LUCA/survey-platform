# ✅ Complete Deployment Checklist

Use this checklist before deploying to Hostinger.

---

## 📋 Pre-Deployment (Local)

- [ ] **Dependencies Updated**
  - [ ] qrcode.react: 3.1.0
  - [ ] @testing-library/react: 14.2.1
  - [ ] All other packages compatible

- [ ] **Build Successful**
  - [ ] Run: `npm run build`
  - [ ] No errors
  - [ ] All pages generated

- [ ] **Environment Files Ready**
  - [ ] `.env` created (local)
  - [ ] `.env.production` created (Hostinger)
  - [ ] All variables filled in
  - [ ] Domain set to `hidelogs.com`

- [ ] **Code Committed**
  - [ ] All changes pushed to GitHub
  - [ ] Branch: `main`
  - [ ] No uncommitted changes

---

## 🚀 Hostinger Setup

- [ ] **Node.js Version**
  - [ ] Select Node.js 20.x
  - [ ] NOT 18.x, 22.x, or 24.x

- [ ] **Environment Variables**
  - [ ] All 18 variables set
  - [ ] Database credentials correct
  - [ ] JWT_SECRET secure
  - [ ] Domain correct

- [ ] **Application Settings**
  - [ ] Build command: `npm run build`
  - [ ] Start command: `npm start`
  - [ ] Port: 3000

---

## 📥 File Upload Deployment (If Using SFTP)

- [ ] **Prepare Files**
  - [ ] Run: `npm run build` locally
  - [ ] `.next` folder created
  - [ ] `node_modules` ready

- [ ] **Upload via SFTP**
  - [ ] Download FileZilla
  - [ ] Connect to Hostinger
  - [ ] Upload entire `survey-platform` folder
  - [ ] Wait for completion

- [ ] **Create .env on Server**
  - [ ] Create `.env` file
  - [ ] Add all environment variables
  - [ ] Save file

- [ ] **Install Dependencies**
  - [ ] SSH into server
  - [ ] Run: `npm install --production`
  - [ ] Wait for completion

- [ ] **Fix Permissions (If Needed)**
  - [ ] If build fails: `chmod -R 755 node_modules`
  - [ ] Or reinstall: `rm -rf node_modules && npm install`

- [ ] **Start Application**
  - [ ] Run: `npm start`
  - [ ] App should start on port 3000

---

## 🔗 GitHub Deployment (If Using GitHub)

- [ ] **Connect GitHub**
  - [ ] Click "Connect GitHub"
  - [ ] Select `survey-platform` repo
  - [ ] Select `main` branch

- [ ] **Set Environment Variables**
  - [ ] Add all 18 variables in Hostinger dashboard
  - [ ] Verify values are correct

- [ ] **Deploy**
  - [ ] Click "Deploy"
  - [ ] Wait 5-10 minutes
  - [ ] Check deployment status

---

## ✅ Post-Deployment Testing

- [ ] **App Loads**
  - [ ] Visit: `https://hidelogs.com`
  - [ ] Page loads without errors
  - [ ] Language selection appears

- [ ] **Language Selection**
  - [ ] Click "English"
  - [ ] Page loads
  - [ ] Surveys display

- [ ] **Admin Login**
  - [ ] Visit: `https://hidelogs.com/admin/login`
  - [ ] Email: `admin@example.com`
  - [ ] Password: `password123`
  - [ ] Login successful

- [ ] **Admin Dashboard**
  - [ ] Dashboard loads
  - [ ] Surveys visible
  - [ ] Analytics working

- [ ] **Survey Functionality**
  - [ ] Create new survey
  - [ ] Add questions
  - [ ] Save survey
  - [ ] Take survey as user
  - [ ] Submit response
  - [ ] Response saved

- [ ] **Database Connection**
  - [ ] Surveys load from database
  - [ ] Responses saved to database
  - [ ] No connection errors

---

## 🔐 Security Checks

- [ ] **HTTPS Enabled**
  - [ ] URL shows 🔒 lock icon
  - [ ] Certificate valid

- [ ] **Environment Variables Secure**
  - [ ] JWT_SECRET not exposed
  - [ ] Database password not in code
  - [ ] API keys protected

- [ ] **Admin Credentials**
  - [ ] Change default password
  - [ ] Use strong password
  - [ ] Store securely

---

## 📊 Performance Checks

- [ ] **Page Load Speed**
  - [ ] Home page loads quickly
  - [ ] Admin dashboard responsive
  - [ ] Surveys load smoothly

- [ ] **Database Performance**
  - [ ] Surveys load without delay
  - [ ] Responses save quickly
  - [ ] Analytics calculate fast

- [ ] **Error Handling**
  - [ ] No console errors
  - [ ] Graceful error messages
  - [ ] No 500 errors

---

## 📝 Documentation

- [ ] **Guides Available**
  - [ ] Setup guide: `docs/SETUP_GUIDE.md`
  - [ ] Deployment guide: `docs/HOSTINGER_FILE_UPLOAD_DEPLOY.md`
  - [ ] Environment guide: `docs/HOSTINGER_ENV_SETUP.md`
  - [ ] Troubleshooting: `docs/HOSTINGER_PERMISSIONS_FIX.md`

- [ ] **Credentials Documented**
  - [ ] Admin email saved
  - [ ] Admin password saved
  - [ ] Database credentials saved
  - [ ] JWT_SECRET saved

---

## 🎯 Final Verification

- [ ] **All Tests Pass**
  - [ ] Build: ✓
  - [ ] TypeScript: ✓
  - [ ] Pages generated: ✓
  - [ ] App starts: ✓

- [ ] **All Features Working**
  - [ ] Language selection: ✓
  - [ ] Survey creation: ✓
  - [ ] Survey submission: ✓
  - [ ] Admin dashboard: ✓
  - [ ] Analytics: ✓

- [ ] **No Errors**
  - [ ] Console: ✓
  - [ ] Network: ✓
  - [ ] Database: ✓
  - [ ] API: ✓

---

## 🚀 Ready to Deploy!

If all checkboxes are checked, your app is ready for production! 🎉

---

## 📞 Need Help?

**Deployment Issues:**
- Check: `docs/HOSTINGER_PERMISSIONS_FIX.md`
- Check: `docs/HOSTINGER_FILE_UPLOAD_DEPLOY.md`

**Environment Issues:**
- Check: `docs/HOSTINGER_ENV_SETUP.md`
- Check: `docs/HOSTINGER_ENV_IMPORT.md`

**General Help:**
- Hostinger Support: https://support.hostinger.com
- Next.js Docs: https://nextjs.org/docs

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Status:** ✅ LIVE

