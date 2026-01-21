# 🚀 IONOS VPS Deployment - Quick Start

Your Survey Platform is ready to deploy on IONOS VPS. Follow these steps to get live in ~42 minutes.

---

## ✅ Pre-Deployment Checklist

- [x] Code built and tested locally
- [x] All dependencies fixed (React 18 compatible)
- [x] Environment variables configured
- [x] `.npmrc` and `.node-version` files created
- [x] GitHub repository ready: `https://github.com/HSN-LUCA/survey-platform`
- [x] IONOS VPS obtained with Ubuntu 22.04

---

## 🔑 Your Credentials

**Domain:** `hidelogs.com`

**Admin Login:**
- Email: `admin@example.com`
- Password: `password123`

**Database (Supabase):**
- URL: `https://nbjuyltaeunxcishhwqu.supabase.co`
- User: `postgres`
- Password: `52S7BkoypaKNqvw5`

**JWT Secret:**
```
HVNDrRS1M09SPH4DDrpWYdwVUnScoDygISM3tDl9n7CLbdffw7/Z3C8p610db3KlDc9eAVDKHHxt1NDB4ZcLgg==
```

---

## 📋 Deployment Steps (42 minutes)

### 1. SSH into IONOS VPS (1 min)

Get your VPS IP from IONOS dashboard, then:

```bash
ssh username@your-vps-ip
```

Or use PuTTY on Windows.

---

### 2. Update System (3 min)

```bash
sudo apt update
sudo apt upgrade -y
```

---

### 3. Install Node.js 20.x (5 min)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

---

### 4. Install Git (2 min)

```bash
sudo apt install -y git
```

---

### 5. Clone Repository (2 min)

```bash
cd /home/username
git clone https://github.com/HSN-LUCA/survey-platform.git
cd survey-platform
```

---

### 6. Create .env File (2 min)

```bash
nano .env
```

Paste this (all pre-configured):

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

### 7. Install Dependencies (5 min)

```bash
npm install
```

---

### 8. Build Application (3 min)

```bash
npm run build
```

Should complete with no errors.

---

### 9. Test Locally (1 min)

```bash
npm start
```

Should show: `ready - started server on 0.0.0.0:3000`

Press `Ctrl+C` to stop.

---

### 10. Install PM2 (Keep App Running) (2 min)

```bash
sudo npm install -g pm2
pm2 start npm --name "survey-platform" -- start
pm2 startup
pm2 save
pm2 status
```

---

### 11. Setup Firewall (2 min)

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

### 12. Install & Configure Nginx (5 min)

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/survey-platform
```

Paste:

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

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/survey-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### 13. Setup SSL Certificate (3 min)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d hidelogs.com -d www.hidelogs.com
sudo systemctl enable certbot.timer
```

---

### 14. Configure Domain (5 min)

1. Get VPS IP:
   ```bash
   hostname -I
   ```

2. Update DNS at your domain registrar:
   - A record: `hidelogs.com` → Your VPS IP
   - A record: `www.hidelogs.com` → Your VPS IP

3. Wait for DNS propagation (up to 24 hours)

---

## ✅ Your App is LIVE!

Visit: `https://hidelogs.com`

**Admin Login:**
- Email: `admin@example.com`
- Password: `password123`

---

## 📊 Useful Commands

```bash
# Check app status
pm2 status
pm2 logs survey-platform

# Restart app
pm2 restart survey-platform

# Stop app
pm2 stop survey-platform

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check port 3000
sudo lsof -i :3000
```

---

## 🐛 Troubleshooting

**App won't start?**
```bash
pm2 logs survey-platform
```

**Port 3000 in use?**
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

**Nginx not working?**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

**SSL issues?**
```bash
sudo certbot renew --dry-run
```

---

## 📈 Time Breakdown

| Step | Time |
|------|------|
| SSH & System Update | 4 min |
| Node.js Installation | 5 min |
| Git & Repository | 4 min |
| Environment Setup | 2 min |
| Dependencies & Build | 8 min |
| PM2 Setup | 2 min |
| Firewall & Nginx | 7 min |
| SSL Certificate | 3 min |
| Domain Configuration | 5 min |
| **TOTAL** | **42 min** |

---

## 📚 Full Documentation

For detailed information, see:
- `docs/VPS_UBUNTU_DEPLOYMENT.md` - Complete guide with explanations
- `DEPLOYMENT_READY_MANUAL.md` - Pre-deployment checklist
- `docs/DEPLOYMENT_CHECKLIST.md` - Full checklist

---

**Ready to deploy? Let's go! 🚀**

