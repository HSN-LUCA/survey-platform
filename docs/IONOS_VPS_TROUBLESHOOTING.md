# 🔧 IONOS VPS Troubleshooting Guide

Common issues and solutions for deploying Survey Platform on IONOS VPS.

---

## 🚨 Critical Issues

### Issue 1: SSH Connection Fails

**Symptoms:** Cannot connect to VPS via SSH

**Solutions:**

1. Verify VPS is running in IONOS dashboard
2. Check IP address is correct
3. Verify SSH port (usually 22):
   ```bash
   ssh -v username@your-vps-ip
   ```
4. Check firewall allows SSH:
   ```bash
   sudo ufw allow 22/tcp
   ```
5. Verify SSH key permissions (if using key):
   ```bash
   chmod 600 ~/.ssh/id_rsa
   chmod 700 ~/.ssh
   ```

---

### Issue 2: Node.js Installation Fails

**Symptoms:** `curl` command fails or Node.js not found after installation

**Solutions:**

1. Ensure system is updated:
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

2. Try alternative Node.js installation:
   ```bash
   sudo apt install -y nodejs npm
   ```

3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

4. If still failing, check disk space:
   ```bash
   df -h
   ```

---

### Issue 3: npm install Fails

**Symptoms:** `npm install` hangs or fails with permission errors

**Solutions:**

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Try with verbose output:
   ```bash
   npm install --verbose
   ```

3. Check disk space:
   ```bash
   df -h
   ```

4. Increase npm timeout:
   ```bash
   npm install --fetch-timeout=120000
   ```

5. If permission denied, check `.npmrc`:
   ```bash
   cat .npmrc
   ```
   Should contain: `unsafe-perm=true`

---

### Issue 4: Build Fails with "next: Permission denied"

**Symptoms:** `npm run build` fails with permission error on next binary

**Solutions:**

1. Fix permissions:
   ```bash
   chmod -R 755 node_modules/.bin
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Verify `.npmrc` exists:
   ```bash
   cat .npmrc
   ```

4. Try build again:
   ```bash
   npm run build
   ```

---

### Issue 5: App Starts but Port 3000 Not Accessible

**Symptoms:** App runs locally but can't access from browser

**Solutions:**

1. Check if app is actually running:
   ```bash
   pm2 status
   pm2 logs survey-platform
   ```

2. Check if port 3000 is listening:
   ```bash
   sudo lsof -i :3000
   ```

3. Check firewall allows port 3000:
   ```bash
   sudo ufw allow 3000/tcp
   ```

4. Test locally:
   ```bash
   curl http://localhost:3000
   ```

5. Check Nginx is forwarding correctly:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

### Issue 6: Nginx Returns 502 Bad Gateway

**Symptoms:** Browser shows "502 Bad Gateway" error

**Solutions:**

1. Verify app is running:
   ```bash
   pm2 status
   ```

2. Check app logs:
   ```bash
   pm2 logs survey-platform
   ```

3. Verify Nginx config:
   ```bash
   sudo nginx -t
   ```

4. Check Nginx error log:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

5. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

6. Verify port 3000 is listening:
   ```bash
   sudo lsof -i :3000
   ```

---

### Issue 7: SSL Certificate Not Working

**Symptoms:** HTTPS shows certificate error or won't load

**Solutions:**

1. Check certificate status:
   ```bash
   sudo certbot certificates
   ```

2. Verify domain is correct:
   ```bash
   sudo certbot --nginx -d hidelogs.com -d www.hidelogs.com
   ```

3. Check certificate renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

4. View Nginx SSL config:
   ```bash
   sudo cat /etc/nginx/sites-available/survey-platform
   ```

5. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

---

### Issue 8: DNS Not Resolving

**Symptoms:** Domain shows "This site can't be reached"

**Solutions:**

1. Verify DNS records are set:
   - A record: `hidelogs.com` → Your VPS IP
   - A record: `www.hidelogs.com` → Your VPS IP

2. Check DNS propagation:
   ```bash
   nslookup hidelogs.com
   dig hidelogs.com
   ```

3. Wait for propagation (up to 24 hours)

4. Test with IP directly:
   ```bash
   curl http://your-vps-ip
   ```

---

## ⚠️ Common Issues

### Issue 9: App Crashes After Deployment

**Symptoms:** App starts but crashes after a few requests

**Solutions:**

1. Check logs:
   ```bash
   pm2 logs survey-platform
   ```

2. Check environment variables:
   ```bash
   cat .env
   ```

3. Verify database connection:
   ```bash
   psql -h nbjuyltaeunxcishhwqu.supabase.co -U postgres -d postgres
   ```

4. Check Node.js version:
   ```bash
   node --version
   ```

5. Restart app:
   ```bash
   pm2 restart survey-platform
   ```

---

### Issue 10: High Memory Usage

**Symptoms:** App becomes slow or unresponsive

**Solutions:**

1. Check memory usage:
   ```bash
   free -h
   top
   ```

2. Check app memory:
   ```bash
   pm2 monit
   ```

3. Restart app:
   ```bash
   pm2 restart survey-platform
   ```

4. Check for memory leaks in logs:
   ```bash
   pm2 logs survey-platform | grep -i error
   ```

---

### Issue 11: Database Connection Timeout

**Symptoms:** App shows database connection errors

**Solutions:**

1. Verify database credentials in `.env`:
   ```bash
   cat .env | grep DATABASE
   ```

2. Test connection:
   ```bash
   psql -h nbjuyltaeunxcishhwqu.supabase.co -U postgres -d postgres
   ```

3. Check Supabase status: https://status.supabase.com

4. Verify firewall allows outbound connections:
   ```bash
   sudo ufw status
   ```

5. Restart app:
   ```bash
   pm2 restart survey-platform
   ```

---

### Issue 12: Static Files Not Loading

**Symptoms:** CSS/JS files return 404 errors

**Solutions:**

1. Verify public folder exists:
   ```bash
   ls -la public/
   ```

2. Check Nginx config for static files:
   ```bash
   sudo cat /etc/nginx/sites-available/survey-platform
   ```

3. Rebuild app:
   ```bash
   npm run build
   ```

4. Restart app:
   ```bash
   pm2 restart survey-platform
   ```

---

## 🔍 Diagnostic Commands

### Check System Status
```bash
# CPU and memory
top

# Disk space
df -h

# System info
uname -a
lsb_release -a
```

### Check Services
```bash
# Node.js app
pm2 status
pm2 logs survey-platform

# Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log

# Firewall
sudo ufw status
```

### Check Network
```bash
# Port listening
sudo lsof -i :3000
sudo lsof -i :80
sudo lsof -i :443

# DNS resolution
nslookup hidelogs.com
dig hidelogs.com

# Connection test
curl http://localhost:3000
curl https://hidelogs.com
```

### Check Files
```bash
# Environment variables
cat .env

# Node version
cat .node-version

# NPM config
cat .npmrc

# App directory
ls -la
```

---

## 📞 Getting Help

**IONOS Support:** https://www.ionos.com/hosting/support

**Ubuntu Documentation:** https://ubuntu.com/support

**Node.js Issues:** https://nodejs.org/docs

**Nginx Issues:** https://nginx.org/en/docs

**Supabase Issues:** https://supabase.com/docs

---

## 🚀 Quick Recovery

If everything fails, here's the nuclear option:

```bash
# Stop app
pm2 stop survey-platform

# Remove app from PM2
pm2 delete survey-platform

# Clean everything
rm -rf node_modules package-lock.json .next

# Reinstall
npm install

# Rebuild
npm run build

# Start fresh
pm2 start npm --name "survey-platform" -- start
pm2 save
```

---

**Still stuck? Check the logs first!**

```bash
pm2 logs survey-platform
sudo tail -f /var/log/nginx/error.log
```

