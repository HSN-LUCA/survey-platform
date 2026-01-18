# Supabase Credentials Verification Needed

## Current Status
✅ Architecture migrated to Option 1 (Supabase JS Client + Next.js API Routes)
✅ Backend Express server removed
✅ All API routes created and working
❌ Service Role Key is invalid

## What's Working
- Frontend running on http://localhost:3000
- Next.js API routes responding
- Supabase connection attempted

## What's Needed
The current Service Role Key is returning "Invalid API key" error:
```
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXvZXCasdqwe
```

## How to Fix
1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `nbjuyltaeunxcishhwqu`
3. Go to Settings → API
4. Copy the **Service Role Key** (the secret one, not the anon key)
5. Update `.env.local` with the correct key:
   ```
   SUPABASE_SERVICE_ROLE_KEY=<your_correct_key>
   ```
6. Restart the development server

## Current .env.local
```
NEXT_PUBLIC_SUPABASE_URL=https://nbjuyltaeunxcishhwqu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_9G1k4DgE52cnO-5VuvVoFA_Dv9XbX_Y
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXvZXCasdqwe
```

## Once Fixed
After updating the Service Role Key:
1. Run: `node survey-platform/scripts/seed-admin.js`
2. Test login at: http://localhost:3000/admin/login
3. Use credentials:
   - Email: admin@example.com
   - Password: password123
