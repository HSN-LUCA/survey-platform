# 📅 Deployment Day Checklist

**Date:** [Your Deployment Date]  
**Target:** IONOS VPS with Ubuntu 22.04  
**Domain:** hidelogs.com  
**Estimated Duration:** 42 minutes

---

## ⏰ Before You Start

- [ ] Have your IONOS VPS IP address ready
- [ ] Have your SSH username and password/key ready
- [ ] Have your domain registrar login ready
- [ ] Have a terminal/SSH client open
- [ ] Have 45 minutes of uninterrupted time
- [ ] Have this checklist open in another window

---

## 🚀 Deployment Steps

### Phase 1: Connection & System Setup (7 minutes)

- [ ] **Step 1:** SSH into VPS
  ```bash
  ssh username@your-vps-ip
  ```
  - [ ] Connection successful
  - [ ] Logged in as correct user

- [ ] **Step 2:** Update system
  ```bash
  sudo apt update
  sudo apt upgrade -y
  ```
  - [ ] Updates completed
  - [ ] No errors

---

### Phase 2: Node.js & Git Installation (7 minutes)

- [ ] **Step 3:** Install Node.js 20.x
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
  ```
  - [ ] Installation completed
  - [ ] Verify: `node --version` shows v20.x.x
  - [ ] Verify: `npm --version` shows 10.x.x

- [ ] **Step 4:** Install Git
  ```bash
  sudo apt install -y git
  ```
  - [ ] Installation completed

---

### Phase 3: Repository & Environment (4 minutes)

- [ ] **Step 5:** Clone repository
  ```bash
  cd /home/username
  git clone https://github.com/HSN-LUCA/survey-platform.git
  cd survey-platform
  ```
  - [ ] Repository cloned
  - [ ] In correct directory

- [ ] **Step 6:** Create .env file
  ```bash
  nano .env
  ```
  - [ ] File created
  - [ ] All credentials pasted
  - [ ] File saved (Ctrl+X → Y → Enter)
  - [ ] Verify: `cat .env` shows correct content

---

### Phase 4: Build & Test (8 minutes)

- [ ] **Step 7:** Install dependencies
  ```bash
  npm install
  ```
  - [ ] Installation completed
  - [ ] No errors
  - [ ] node_modules created

- [ ] **Step 8:** Build application
  ```bash
  npm run build
  ```
  - [ ] Build completed successfully
  - [ ] No errors
  - [ ] .next folder created

- [ ] **Step 9:** Test locally
  ```bash
  npm start
  ```
  - [ ] App starts
  - [ ] Shows: "ready - started server on 0.0.0.0:3000"
  - [ ] Press Ctrl+C to stop

---

### Phase 5: Process Management & Firewall (4 minutes)

- [ ] **Step 10:** Install PM2
  ```bash
  sudo npm install -g pm2
  pm2 start npm --name "survey-platform" -- start
  pm2 startup
  pm2 save
  ```
  - [ ] PM2 installed
  - [ ] App started with PM2
  - [ ] Verify: `pm2 status` shows app running

- [ ] **Step 11:** Configure firewall
  ```bash
  sudo ufw allow 22/tcp
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```
  - [ ] Firewall rules added
  - [ ] Firewall enabled
  - [ ] Verify: `sudo ufw status` shows rules

---

### Phase 6: Web Server & SSL (8 minutes)

- [ ] **Step 12:** Install & configure Nginx
  ```bash
  sudo apt install -y nginx
  sudo nano /etc/nginx/sites-available/survey-platform
  ```
  - [ ] Nginx installed
  - [ ] Config file created
  - [ ] Config pasted and saved
  - [ ] Verify: `sudo nginx -t` shows OK
  - [ ] Verify: `sudo systemctl restart nginx` succeeds

- [ ] **Step 13:** Setup SSL certificate
  ```bash
  sudo apt install -y certbot python3-certbot-nginx
  sudo certbot --nginx -d hidelogs.com -d www.hidelogs.com
  sudo systemctl enable certbot.timer
  ```
  - [ ] Certbot installed
  - [ ] Certificate obtained
  - [ ] Auto-renewal enabled
  - [ ] Verify: `sudo certbot certificates` shows certificate

---

### Phase 7: Domain Configuration (5 minutes)

- [ ] **Step 14:** Configure domain
  ```bash
  hostname -I
  ```
  - [ ] VPS IP obtained
  - [ ] Note the IP address: _______________

- [ ] Update DNS records at domain registrar:
  - [ ] A record: `hidelogs.com` → [Your VPS IP]
  - [ ] A record: `www.hidelogs.com` → [Your VPS IP]
  - [ ] DNS records saved
  - [ ] Note time: _______________

- [ ] Wait for DNS propagation:
  - [ ] Check after 5 minutes: `nslookup hidelogs.com`
  - [ ] Check after 15 minutes if not resolved
  - [ ] DNS should resolve to your VPS IP

---

## ✅ Post-Deployment Verification

### Immediate Tests (5 minutes)

- [ ] **Test 1:** Check app is running
  ```bash
  pm2 status
  ```
  - [ ] App shows "online"

- [ ] **Test 2:** Check Nginx is running
  ```bash
  sudo systemctl status nginx
  ```
  - [ ] Nginx shows "active (running)"

- [ ] **Test 3:** Test locally
  ```bash
  curl http://localhost:3000
  ```
  - [ ] Returns HTML content

- [ ] **Test 4:** Check DNS resolution
  ```bash
  nslookup hidelogs.com
  ```
  - [ ] Resolves to your VPS IP

### Browser Tests (5 minutes)

- [ ] **Test 5:** Visit domain
  - [ ] Open browser
  - [ ] Go to: `https://hidelogs.com`
  - [ ] Page loads successfully
  - [ ] HTTPS shows secure (green lock)

- [ ] **Test 6:** Admin login
  - [ ] Click "Admin Login"
  - [ ] Email: `admin@example.com`
  - [ ] Password: `password123`
  - [ ] Login successful
  - [ ] Dashboard loads

- [ ] **Test 7:** Create survey
  - [ ] Click "Create Survey"
  - [ ] Fill in survey details
  - [ ] Add a question
  - [ ] Save survey
  - [ ] Survey appears in list

- [ ] **Test 8:** Submit survey
  - [ ] Go to home page
  - [ ] Select survey
  - [ ] Answer questions
  - [ ] Submit survey
  - [ ] Confirmation message appears

- [ ] **Test 9:** View analytics
  - [ ] Go to admin dashboard
  - [ ] Click on survey
  - [ ] Analytics show response
  - [ ] Charts display correctly

---

## 🐛 Troubleshooting During Deployment

### If npm install fails:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### If build fails:
```bash
chmod -R 755 node_modules/.bin
npm run build
```

### If app won't start:
```bash
pm2 logs survey-platform
```

### If Nginx won't start:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### If SSL fails:
```bash
sudo certbot --nginx -d hidelogs.com -d www.hidelogs.com
```

---

## 📊 Deployment Timeline

| Phase | Steps | Time | Status |
|-------|-------|------|--------|
| Connection & System | 1-2 | 7 min | [ ] |
| Node.js & Git | 3-4 | 7 min | [ ] |
| Repository & Env | 5-6 | 4 min | [ ] |
| Build & Test | 7-9 | 8 min | [ ] |
| PM2 & Firewall | 10-11 | 4 min | [ ] |
| Web Server & SSL | 12-13 | 8 min | [ ] |
| Domain Config | 14 | 5 min | [ ] |
| **TOTAL** | **14** | **42 min** | [ ] |

---

## 🎉 Success Criteria

All of these should be true:

- [ ] SSH connection successful
- [ ] Node.js 20.x installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Build completed without errors
- [ ] App running with PM2
- [ ] Firewall configured
- [ ] Nginx running
- [ ] SSL certificate obtained
- [ ] Domain resolves to VPS IP
- [ ] https://hidelogs.com accessible
- [ ] Admin login works
- [ ] Survey creation works
- [ ] Survey submission works
- [ ] Analytics dashboard works

---

## 📝 Notes & Issues

**Issues encountered:**
```
[Space for notes]




```

**Solutions applied:**
```
[Space for notes]




```

**Time taken:** _____ minutes

**Deployment completed at:** _____ (time)

---

## 🎊 Deployment Complete!

**Your Survey Platform is now LIVE!**

- **Domain:** https://hidelogs.com
- **Admin Email:** admin@example.com
- **Admin Password:** password123

---

## 📞 Next Steps

1. **Share with users:**
   - Send domain link: https://hidelogs.com
   - Users can start taking surveys

2. **Monitor the app:**
   ```bash
   pm2 logs survey-platform
   ```

3. **Check analytics:**
   - Login to admin dashboard
   - View survey responses in real-time

4. **Backup database:**
   - Set up regular backups with Supabase

5. **Monitor performance:**
   ```bash
   pm2 monit
   ```

---

## 🆘 Emergency Contacts

- **IONOS Support:** https://www.ionos.com/hosting/support
- **Supabase Support:** https://supabase.com/docs
- **Ubuntu Support:** https://ubuntu.com/support

---

**Deployment Date:** _________________

**Deployed By:** _________________

**Status:** ✅ COMPLETE

