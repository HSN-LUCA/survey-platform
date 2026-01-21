# 🚀 VPS Ubuntu 22.04 Deployment Guide

Complete guide to deploy your Survey Platform on Ubuntu 22.04 VPS.

---

## ✅ Why VPS is Better

- ✅ Full Node.js support
- ✅ Complete control
- ✅ Better performance
- ✅ No restrictions
- ✅ Easy to scale

---

## 📋 Prerequisites

- VPS with Ubuntu 22.04
- SSH access
- Domain name (optional, can use IP)
- About 20 minutes

---

## Step 1: Connect to VPS (1 minute)

```bash
ssh username@your-vps-ip
```

Or use PuTTY if on Windows.

---

## Step 2: Update System (3 minutes)

```bash
sudo apt update
sudo apt upgrade -y
```

---

## Step 3: Install Node.js 20.x (5 minutes)

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

Should show:
- Node.js v20.x.x
- npm 10.x.x

---

## Step 4: Install Git (2 minutes)

```bash
sudo apt install -y git
```

---

## Step 5: Clone Your Repository (2 minutes)

```bash
cd /home/username
git clone https://github.com/HSN-LUCA/survey-platform.git
cd survey-platform
```

---

## Step 6: Create .env File (2 minutes)

```bash
nano .env
```

Paste this content:

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

Save: `Ctrl+X` → `Y` → `Enter`

---

## Step 7: Install Dependencies (5 minutes)

```bash
npm install
```

---

## Step 8: Build Application (3 minutes)

```bash
npm run build
```

You should see:
```
✓ Compiled successfully
✓ Finished TypeScript
✓ All pages generated
```

---

## Step 9: Test Application (1 minute)

```bash
npm start
```

You should see:
```
ready - started server on 0.0.0.0:3000
```

Press `Ctrl+C` to stop.

---

## Step 10: Install PM2 (Keep App Running) (2 minutes)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start app with PM2
pm2 start npm --name "survey-platform" -- start

# Make it auto-start on reboot
pm2 startup
pm2 save

# Check status
pm2 status
```

---

## Step 11: Configure Firewall (2 minutes)

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

---

## Step 12: Setup Nginx Reverse Proxy (5 minutes)

```bash
# Install Nginx
sudo apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/survey-platform
```

Paste this:

```nginx
server {
    listen 80;
    server_name hidelogs.com www.hidelogs.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save: `Ctrl+X` → `Y` → `Enter`

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/survey-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 13: Setup SSL Certificate (Free with Let's Encrypt) (3 minutes)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d hidelogs.com -d www.hidelogs.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## Step 14: Configure Domain (5 minutes)

1. Get your VPS IP:
   ```bash
   hostname -I
   ```

2. Update DNS records:
   - A record: `hidelogs.com` → Your VPS IP
   - A record: `www.hidelogs.com` → Your VPS IP

3. Wait for DNS propagation (up to 24 hours)

---

## ✅ Your App is LIVE!

Visit: `https://hidelogs.com`

---

## 📊 Useful Commands

### Check App Status
```bash
pm2 status
pm2 logs survey-platform
```

### Restart App
```bash
pm2 restart survey-platform
```

### Stop App
```bash
pm2 stop survey-platform
```

### View Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Check Port 3000
```bash
sudo lsof -i :3000
```

---

## 🐛 Troubleshooting

### App won't start?
```bash
pm2 logs survey-platform
```

### Port 3000 already in use?
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Nginx not working?
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### SSL certificate issues?
```bash
sudo certbot renew --dry-run
```

---

## 📈 Performance Tips

1. **Enable Gzip compression** in Nginx
2. **Use CDN** for static files
3. **Monitor with PM2 Plus** (optional)
4. **Setup backups** for database

---

## 🔒 Security Tips

1. ✅ Use strong SSH key
2. ✅ Disable root login
3. ✅ Use firewall
4. ✅ Keep system updated
5. ✅ Use HTTPS only
6. ✅ Secure .env file

---

## 📞 Support

**Ubuntu:** https://ubuntu.com/support  
**Node.js:** https://nodejs.org/docs  
**Nginx:** https://nginx.org/en/docs  
**PM2:** https://pm2.keymetrics.io/docs  
**Let's Encrypt:** https://letsencrypt.org/docs  

---

## Summary

| Step | Time | Command |
|------|------|---------|
| 1 | 1 min | SSH connect |
| 2 | 3 min | apt update |
| 3 | 5 min | Install Node.js |
| 4 | 2 min | Install Git |
| 5 | 2 min | Clone repo |
| 6 | 2 min | Create .env |
| 7 | 5 min | npm install |
| 8 | 3 min | npm run build |
| 9 | 1 min | npm start |
| 10 | 2 min | Install PM2 |
| 11 | 2 min | Setup firewall |
| 12 | 5 min | Setup Nginx |
| 13 | 3 min | Setup SSL |
| 14 | 5 min | Configure domain |
| **TOTAL** | **42 min** | **LIVE** |

---

**Your Survey Platform is now live on VPS!** 🚀
