# Hostinger Deployment - Visual Step-by-Step

## Step 1: Create Hostinger Account

```
Go to: https://www.hostinger.com/cloud

┌─────────────────────────────────┐
│  Sign Up                        │
│  ┌─────────────────────────────┐│
│  │ Email: your@email.com       ││
│  │ Password: ••••••••••        ││
│  │ [Create Account]            ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘

✅ Account created
✅ Email verified
✅ Logged in
```

---

## Step 2: Create Application

```
Hostinger Cloud Dashboard

┌─────────────────────────────────┐
│  [Create Application]           │
│                                 │
│  Select Runtime:                │
│  ○ Python                       │
│  ○ Node.js  ← SELECT THIS       │
│  ○ PHP                          │
│                                 │
│  Select Region:                 │
│  ○ US East                      │
│  ○ Europe  ← OR THIS            │
│  ○ Asia                         │
│                                 │
│  [Next]                         │
└─────────────────────────────────┘

✅ Node.js selected
✅ Region selected
```

---

## Step 3: Connect GitHub

```
┌─────────────────────────────────┐
│  Connect Repository             │
│                                 │
│  [Connect GitHub]               │
│                                 │
│  GitHub Authorization:          │
│  ✓ Authorized                   │
│                                 │
│  Select Repository:             │
│  ○ antco-backend                │
│  ○ survey-platform ← SELECT     │
│  ○ other-repo                   │
│                                 │
│  Select Branch:                 │
│  ○ develop                      │
│  ○ main ← SELECT                │
│                                 │
│  [Connect]                      │
└─────────────────────────────────┘

✅ GitHub connected
✅ Repository selected
✅ Branch selected
```

---

## Step 4: Configure Build

```
┌─────────────────────────────────┐
│  Build Configuration            │
│                                 │
│  Build Command:                 │
│  npm run build                  │
│                                 │
│  Start Command:                 │
│  npm start                      │
│                                 │
│  Node Version:                  │
│  18 (or higher)                 │
│                                 │
│  Port:                          │
│  3000                           │
│                                 │
│  [Next]                         │
└─────────────────────────────────┘

✅ Build command set
✅ Start command set
✅ Node version set
```

---

## Step 5: Add Environment Variables

```
┌─────────────────────────────────┐
│  Environment Variables          │
│                                 │
│  [Add Variable]                 │
│  ┌─────────────────────────────┐│
│  │ Name: NEXT_PUBLIC_SUPABASE_ ││
│  │       URL                   ││
│  │ Value: https://your-project ││
│  │        .supabase.co         ││
│  │ [Add]                       ││
│  └─────────────────────────────┘│
│                                 │
│  [Add Variable]                 │
│  ┌─────────────────────────────┐│
│  │ Name: NEXT_PUBLIC_SUPABASE_ ││
│  │       ANON_KEY              ││
│  │ Value: your_anon_key        ││
│  │ [Add]                       ││
│  └─────────────────────────────┘│
│                                 │
│  [Add Variable]                 │
│  ┌─────────────────────────────┐│
│  │ Name: SUPABASE_SERVICE_ROLE ││
│  │       _KEY                  ││
│  │ Value: sb_secret_LUrBLwFvWX ││
│  │        SgLoup5tMxNA_chkO4oXv││
│  │ [Add]                       ││
│  └─────────────────────────────┘│
│                                 │
│  [Add Variable]                 │
│  ┌─────────────────────────────┐│
│  │ Name: JWT_SECRET            ││
│  │ Value: your-super-secret-   ││
│  │        random-string-here   ││
│  │ [Add]                       ││
│  └─────────────────────────────┘│
│                                 │
│  [Add Variable]                 │
│  ┌─────────────────────────────┐│
│  │ Name: NEXT_PUBLIC_APP_URL   ││
│  │ Value: https://your-domain. ││
│  │        com                  ││
│  │ [Add]                       ││
│  └─────────────────────────────┘│
│                                 │
│  [Add Variable]                 │
│  ┌─────────────────────────────┐│
│  │ Name: NODE_ENV              ││
│  │ Value: production           ││
│  │ [Add]                       ││
│  └─────────────────────────────┘│
│                                 │
│  [Deploy]                       │
└─────────────────────────────────┘

✅ All 6 variables added
```

---

## Step 6: Deploy

```
┌─────────────────────────────────┐
│  Deployment Status              │
│                                 │
│  [Deploy]                       │
│                                 │
│  Building...                    │
│  ████████░░░░░░░░░░ 50%        │
│                                 │
│  Installing dependencies...     │
│  Building application...        │
│  Deploying...                   │
│                                 │
│  ✓ Deployment Complete!         │
│                                 │
│  Your app is live at:           │
│  https://survey-platform-      │
│  abc123.hostinger.app           │
│                                 │
│  [Open Application]             │
└─────────────────────────────────┘

⏱️  Wait 10 minutes
✅ Deployment complete
```

---

## Step 7: Test Your App

```
Open: https://survey-platform-abc123.hostinger.app

┌─────────────────────────────────┐
│  Select Language                │
│                                 │
│  [English]  [العربية]           │
│                                 │
│  Click English or Arabic        │
└─────────────────────────────────┘

↓

┌─────────────────────────────────┐
│  Available Surveys              │
│                                 │
│  Survey 1: Customer Feedback    │
│  [Start Survey]                 │
│                                 │
│  Survey 2: Product Review       │
│  [Start Survey]                 │
│                                 │
│  Survey 3: Service Quality      │
│  [Start Survey]                 │
└─────────────────────────────────┘

✅ App is working!
```

---

## Step 8: Test Admin Login

```
Go to: https://survey-platform-abc123.hostinger.app/admin/login

┌─────────────────────────────────┐
│  Admin Login                    │
│                                 │
│  Email:                         │
│  admin@example.com              │
│                                 │
│  Password:                      │
│  password123                    │
│                                 │
│  [Login]                        │
└─────────────────────────────────┘

↓

┌─────────────────────────────────┐
│  Admin Dashboard                │
│                                 │
│  [Create Survey]                │
│  [View Surveys]                 │
│  [Analytics]                    │
│  [Settings]                     │
│                                 │
│  Surveys: 3                     │
│  Responses: 42                  │
│  Users: 15                      │
└─────────────────────────────────┘

✅ Admin panel works!
```

---

## Step 9: Update Your App

```
Make changes to your code:

$ git add .
$ git commit -m "Update survey questions"
$ git push origin main

↓

Hostinger automatically:
1. Detects the push
2. Pulls latest code
3. Builds the app
4. Deploys it

↓

Your app is updated! ✅

No manual steps needed!
```

---

## Summary

```
┌─────────────────────────────────┐
│  Deployment Complete!           │
│                                 │
│  ✅ Account created             │
│  ✅ Application created         │
│  ✅ GitHub connected            │
│  ✅ Build configured            │
│  ✅ Environment variables added │
│  ✅ Application deployed        │
│  ✅ App tested                  │
│  ✅ Admin login tested          │
│                                 │
│  Your app is LIVE!              │
│                                 │
│  URL: https://survey-platform- │
│       abc123.hostinger.app      │
│                                 │
│  Share this URL with users!     │
└─────────────────────────────────┘
```

---

## Troubleshooting

### Build fails?
```
Check Hostinger logs:
Dashboard → Application → Logs

Look for error messages
Fix the issue
Push to GitHub again
```

### App won't start?
```
Check application logs:
Dashboard → Application → Logs

Verify environment variables
Restart application
```

### Surveys not loading?
```
Check browser console (F12)
Verify Supabase credentials
Check database has data
```

---

## Next Steps

1. ✅ Deploy to Hostinger
2. ✅ Test your app
3. ✅ Create surveys
4. ✅ Share URL with users
5. ✅ Monitor responses

**You're done!** 🎉

