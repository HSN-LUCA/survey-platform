# Environment Files Setup Guide

## Files Created

I've created two environment files for you:

1. **`.env`** - For local development
2. **`.env.production`** - For Hostinger production deployment

---

## What's Already Configured

✅ **Database Connection**
- Supabase URL
- Database credentials
- Connection string

✅ **Supabase API Keys**
- Anon key
- Service role key

✅ **JWT Configuration**
- JWT secret (needs to be changed for production)
- JWT expiry

✅ **API Configuration**
- API port
- API URLs

---

## What You Need to Update

### For Local Development (`.env`)

No changes needed! This file is ready to use locally.

### For Hostinger Production (`.env.production`)

Replace `your-domain.com` with your actual domain:

```
API_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Example:**
```
API_URL=https://surveys.example.com
NEXT_PUBLIC_API_URL=https://surveys.example.com
NEXT_PUBLIC_APP_URL=https://surveys.example.com
```

---

## JWT_SECRET - Important!

The JWT_SECRET is currently set to a placeholder:
```
JWT_SECRET=your-super-secret-random-string-here-make-it-long-32-characters-minimum
```

### For Production, Generate a Secure Secret

**Option 1: Use Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Use OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Use Online Generator**
Go to: https://www.random.org/strings/

Generate a random string of at least 32 characters.

### Update the JWT_SECRET

Replace the placeholder with your generated secret:
```
JWT_SECRET=your-generated-random-string-here-32-characters-or-more
```

---

## Environment Variables Explained

### Database Configuration
```
DATABASE_URL - Full PostgreSQL connection string
DB_HOST - Database host
DB_PORT - Database port (5432)
DB_NAME - Database name (postgres)
DB_USER - Database user (postgres)
DB_PASSWORD - Database password
```

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL - Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY - Public anon key for client-side
SUPABASE_SERVICE_ROLE_KEY - Secret key for server-side operations
```

### API Configuration
```
API_PORT - Port the API runs on (3000)
API_URL - Full URL to your API (for server)
NEXT_PUBLIC_API_URL - Full URL to your API (for client)
```

### JWT Configuration
```
JWT_SECRET - Secret key for signing JWT tokens
JWT_EXPIRY - How long tokens are valid (7d = 7 days)
```

### Application Configuration
```
NODE_ENV - Environment (development or production)
NEXT_PUBLIC_APP_URL - Your application URL
```

---

## Using These Files

### Local Development

The `.env` file is automatically loaded by Next.js:

```bash
npm run dev
```

### Hostinger Deployment

**Option 1: Using GitHub (Recommended)**

Add environment variables in Hostinger dashboard:
1. Go to Application Settings
2. Add each variable from `.env.production`
3. Deploy

**Option 2: Manual Upload**

1. Upload `.env.production` to your server
2. Rename it to `.env`
3. Start the application

---

## Security Notes

⚠️ **IMPORTANT:**

1. **Never commit `.env` files to Git**
   - They're already in `.gitignore`
   - Keep them local only

2. **Change JWT_SECRET for production**
   - Generate a new secure random string
   - Don't use the placeholder

3. **Keep credentials safe**
   - Don't share `.env` files
   - Don't post them online
   - Use Hostinger's secure environment variables

4. **Use HTTPS only**
   - All URLs should use `https://`
   - Hostinger provides free SSL

---

## Verification Checklist

- [ ] `.env` file created
- [ ] `.env.production` file created
- [ ] Domain name updated in `.env.production`
- [ ] JWT_SECRET generated and updated
- [ ] All URLs use `https://`
- [ ] Database credentials verified
- [ ] Supabase keys verified

---

## Troubleshooting

### App won't start?
- Check `.env` file exists
- Verify all required variables are set
- Check for typos in variable names

### Database connection error?
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Verify database credentials

### API not responding?
- Check API_URL is correct
- Verify NEXT_PUBLIC_API_URL is correct
- Check API port (3000)

### JWT errors?
- Verify JWT_SECRET is set
- Check JWT_SECRET is not empty
- Ensure JWT_SECRET is at least 32 characters

---

## Next Steps

1. ✅ `.env` files created
2. Update domain in `.env.production`
3. Generate secure JWT_SECRET
4. Deploy to Hostinger
5. Test your app

---

## Files

- `.env` - Local development
- `.env.production` - Hostinger production
- `.env.local` - Original local config (keep as backup)

---

## Support

If you have issues:
1. Check this guide
2. Verify all variables are set
3. Check Hostinger logs
4. Review Supabase documentation

