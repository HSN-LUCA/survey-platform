# Supabase Initialization Guide

Your Supabase project is ready! Here's how to initialize it with the database schema.

## Your Supabase Credentials

- **Project URL**: https://nbjuyltaeunxcishhwqu.supabase.co
- **Project ID**: nbjuyltaeunxcishhwqu
- **Database User**: postgres
- **Database Password**: @#12345
- **Database Name**: postgres
- **Port**: 5432

## Step 1: Initialize Database Schema

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project `survey-platform`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire SQL schema below and paste it into the editor:

```sql
-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- Create surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  customer_type VARCHAR(50) NOT NULL CHECK (customer_type IN ('pilgrims', 'staff')),
  created_by UUID NOT NULL REFERENCES admins(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_archived BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_surveys_customer_type ON surveys(customer_type);
CREATE INDEX IF NOT EXISTS idx_surveys_created_by ON surveys(created_by);
CREATE INDEX IF NOT EXISTS idx_surveys_is_archived ON surveys(is_archived);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('multiple_choice', 'star_rating', 'percentage_range')),
  content_ar TEXT NOT NULL,
  content_en TEXT NOT NULL,
  required BOOLEAN DEFAULT TRUE,
  order_num INTEGER NOT NULL,
  star_count INTEGER,
  percentage_min INTEGER DEFAULT 0,
  percentage_max INTEGER DEFAULT 100,
  percentage_step INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_questions_survey_id ON questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(survey_id, order_num);

-- Create options table
CREATE TABLE IF NOT EXISTS options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  text_ar VARCHAR(255) NOT NULL,
  text_en VARCHAR(255) NOT NULL,
  order_num INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_options_question_id ON options(question_id);
CREATE INDEX IF NOT EXISTS idx_options_order ON options(question_id, order_num);

-- Create star_range_mappings table
CREATE TABLE IF NOT EXISTS star_range_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  star_level INTEGER NOT NULL,
  min_percentage INTEGER NOT NULL,
  max_percentage INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(question_id, star_level)
);

CREATE INDEX IF NOT EXISTS idx_star_mappings_question_id ON star_range_mappings(question_id);

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  user_session_id VARCHAR(255) NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(survey_id, user_session_id)
);

CREATE INDEX IF NOT EXISTS idx_responses_survey_id ON responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_responses_submitted_at ON responses(submitted_at);
CREATE INDEX IF NOT EXISTS idx_responses_session ON responses(user_session_id);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id),
  value VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_answers_response_id ON answers(response_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
```

6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success" - all tables are now created!

### Option B: Using psql Command Line

If you have PostgreSQL installed locally:

```bash
psql -h nbjuyltaeunxcishhwqu.supabase.co -U postgres -d postgres -f survey-platform/scripts/init-db.sql
```

When prompted, enter password: `@#12345`

## Step 2: Create Test Admin Account

In Supabase SQL Editor, run this query to create a test admin:

```sql
INSERT INTO admins (email, password_hash) VALUES (
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm'
);
```

This creates an admin with:
- **Email**: `admin@example.com`
- **Password**: `password123`

## Step 3: Verify Tables Were Created

In Supabase, click **Table Editor** in the left sidebar. You should see:

- ✅ admins
- ✅ surveys
- ✅ questions
- ✅ options
- ✅ star_range_mappings
- ✅ responses
- ✅ answers

## Step 4: Test Connection

Your `.env.local` is already configured with Supabase credentials. Test the connection:

```bash
npm run dev:server
```

You should see:
```
Server running on http://localhost:3001
```

If you see database errors, check:
1. ✅ Host: `nbjuyltaeunxcishhwqu.supabase.co`
2. ✅ Port: `5432`
3. ✅ Database: `postgres`
4. ✅ User: `postgres`
5. ✅ Password: `@#12345`

## Step 5: Start the Application

Open two terminals:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:server
```

## Step 6: Test Login

1. Go to http://localhost:3000/admin/login
2. Login with:
   - **Email**: `admin@example.com`
   - **Password**: `password123`
3. You should see the survey list page

## Troubleshooting

### "Connection refused"
- Check that Supabase project is running (check dashboard)
- Verify host is correct: `nbjuyltaeunxcishhwqu.supabase.co`
- Check password is correct: `@#12345`

### "Tables already exist"
- This is fine - the schema was already created
- You can proceed to testing

### "Authentication failed"
- Verify password is exactly: `@#12345`
- Check username is: `postgres`
- Try resetting password in Supabase dashboard

### "Admin can't login"
- Verify admin exists in Table Editor → admins table
- Check email is exactly: `admin@example.com`
- Try creating admin again with the SQL query above

## Environment Variables

Your `.env.local` is configured with:

```env
# Database - Supabase
DB_HOST=nbjuyltaeunxcishhwqu.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=@#12345

# Supabase
SUPABASE_URL=https://nbjuyltaeunxcishhwqu.supabase.co
SUPABASE_ANON_KEY=sb_publishable_9G1k4DgE52cnO-5VuvVoFA_Dv9XbX_Y
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXvZXCasdqwe
```

## Next Steps

1. ✅ Initialize database schema (SQL Editor)
2. ✅ Create test admin account
3. ✅ Verify tables exist
4. ✅ Test connection with `npm run dev:server`
5. ✅ Start application with `npm run dev:all`
6. ✅ Test login at http://localhost:3000/admin/login

## Useful Links

- **Supabase Dashboard**: https://app.supabase.com
- **Project URL**: https://nbjuyltaeunxcishhwqu.supabase.co
- **Documentation**: https://supabase.com/docs
- **SQL Editor**: In your Supabase dashboard

## Security Notes

⚠️ **Important**: Never commit `.env.local` to git - it contains sensitive credentials!

The credentials in `.env.local` are:
- Database password
- Supabase keys
- JWT secret

Keep these safe and never share them publicly.

---

You're all set! Follow the steps above to initialize your Supabase database and start using the survey platform.
