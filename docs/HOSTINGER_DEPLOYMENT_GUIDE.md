# Hostinger Cloud Deployment Guide

## Overview
This guide explains how to deploy the Survey Platform to Hostinger Cloud.

## Prerequisites
- Hostinger Cloud account
- Git installed locally
- Node.js 18+ installed locally
- Supabase account (for database)

## Step 1: Prepare Your Application

### 1.1 Build the Application
```bash
cd survey-platform
npm run build
```

### 1.2 Create .env.production file
Create a `.env.production` file in the root directory with production environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Secret (change this to a secure random string)
JWT_SECRET=your_secure_random_jwt_secret_here

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 1.3 Get Supabase Credentials
1. Go to Supabase Dashboard
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 2: Deploy to Hostinger Cloud

### Option A: Using Git (Recommended)

#### 2A.1 Create Git Repository
```bash
git init
git add .
git commit -m "Initial commit"
```

#### 2A.2 Connect to Hostinger
1. Log in to Hostinger Cloud
2. Go to Applications
3. Click "Create Application"
4. Select "Node.js"
5. Choose your deployment region
6. Connect your Git repository (GitHub, GitLab, or Bitbucket)

#### 2A.3 Configure Build Settings
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18 or higher
- **Port**: 3000

#### 2A.4 Set Environment Variables
In Hostinger Cloud dashboard:
1. Go to Application Settings
2. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `NODE_ENV=production`

#### 2A.5 Deploy
1. Click "Deploy"
2. Wait for build to complete (5-10 minutes)
3. Your app will be live at the provided URL

### Option B: Manual Upload

#### 2B.1 Build Locally
```bash
npm run build
```

#### 2B.2 Upload Files
1. Connect via SFTP to Hostinger
2. Upload entire `survey-platform` folder
3. Upload `.env.production` file

#### 2B.3 Install Dependencies
```bash
npm install --production
```

#### 2B.4 Start Application
```bash
npm start
```

## Step 3: Database Setup

### 3.1 Run Migrations
Connect to your Hostinger server and run:
```bash
npm run migrate
```

Or manually run the SQL scripts in `scripts/` folder in Supabase SQL Editor.

### 3.2 Verify Database Connection
Check that surveys table exists in Supabase:
1. Go to Supabase Dashboard
2. Select your project
3. Go to SQL Editor
4. Run: `SELECT * FROM surveys LIMIT 1;`

## Step 4: Configure Domain

### 4.1 Add Custom Domain
1. In Hostinger Cloud dashboard
2. Go to Application Settings
3. Add your custom domain
4. Update DNS records (Hostinger will provide instructions)

### 4.2 SSL Certificate
Hostinger automatically provides free SSL certificate. No additional setup needed.

## Step 5: Verify Deployment

### 5.1 Test Application
1. Open your domain in browser
2. You should see the language selection screen
3. Select a language
4. Verify surveys load

### 5.2 Test Admin Panel
1. Go to `https://your-domain.com/admin/login`
2. Login with credentials: `admin@example.com` / `password123`
3. Create a test survey

### 5.3 Test Survey Submission
1. Go to home page
2. Select a survey
3. Fill in user details
4. Answer questions
5. Submit survey
6. Verify response appears in admin analytics

## Troubleshooting

### Issue: Application won't start
**Solution:**
1. Check logs in Hostinger dashboard
2. Verify environment variables are set
3. Ensure Node.js version is 18+
4. Run `npm install` again

### Issue: Database connection error
**Solution:**
1. Verify Supabase credentials in `.env.production`
2. Check Supabase project is active
3. Verify database tables exist
4. Test connection: `npm run test:db`

### Issue: Surveys not loading
**Solution:**
1. Check Supabase API is accessible
2. Verify CORS settings in Supabase
3. Check browser console for errors
4. Verify database has survey data

### Issue: Admin login fails
**Solution:**
1. Verify JWT_SECRET is set
2. Check admin user exists in database
3. Verify credentials are correct
4. Check browser cookies are enabled

## Performance Optimization

### 1. Enable Caching
Add to `next.config.ts`:
```typescript
headers: async () => [
  {
    source: '/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=3600'
      }
    ]
  }
]
```

### 2. Database Indexing
Run in Supabase SQL Editor:
```sql
CREATE INDEX idx_surveys_created_at ON surveys(created_at);
CREATE INDEX idx_questions_survey_id ON questions(survey_id);
CREATE INDEX idx_responses_survey_id ON responses(survey_id);
```

### 3. Monitor Performance
1. Use Hostinger monitoring tools
2. Check Supabase query performance
3. Monitor application logs

## Maintenance

### Regular Tasks
- Monitor application logs weekly
- Check database performance
- Update dependencies monthly
- Backup database regularly

### Update Application
```bash
git pull origin main
npm install
npm run build
# Hostinger will auto-redeploy
```

### Backup Database
1. Go to Supabase Dashboard
2. Go to Backups
3. Create manual backup
4. Download backup file

## Security Checklist

- ✅ Change default admin password
- ✅ Use strong JWT_SECRET
- ✅ Enable HTTPS (automatic with Hostinger)
- ✅ Set up database backups
- ✅ Monitor access logs
- ✅ Keep dependencies updated
- ✅ Use environment variables for secrets
- ✅ Enable rate limiting (if available)

## Support

For Hostinger-specific issues:
- Hostinger Support: https://support.hostinger.com
- Hostinger Cloud Docs: https://docs.hostinger.com/cloud

For application issues:
- Check application logs in Hostinger dashboard
- Review Supabase documentation
- Check Next.js documentation

## Useful Commands

```bash
# Build application
npm run build

# Start application
npm start

# Check for errors
npm run lint

# Run tests
npm test

# View logs (on Hostinger server)
tail -f /var/log/application.log
```

## Next Steps

1. Deploy application to Hostinger
2. Configure custom domain
3. Set up database backups
4. Monitor application performance
5. Create admin user account
6. Start creating surveys
