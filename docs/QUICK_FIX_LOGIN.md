# Quick Fix: Login Error (2 Minutes)

## The Error You're Seeing

```
Failed to fetch
```

## Why It's Happening

Backend is crashing because **database tables don't exist yet**.

## How to Fix It (2 Minutes)

### Step 1: Go to Supabase (30 seconds)

1. Open: https://app.supabase.com
2. Click your project
3. Click **SQL Editor** in left sidebar
4. Click **New Query**

### Step 2: Run Database Schema (1 minute)

Copy this entire SQL and paste it into the SQL Editor:

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

Click **Run** button

You should see: ✅ **Success. No rows returned**

### Step 3: Create Admin Account (30 seconds)

Click **New Query** again and paste:

```sql
INSERT INTO admins (email, password_hash) VALUES (
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm'
);
```

Click **Run** button

You should see: ✅ **Success. 1 row inserted**

### Step 4: Restart Backend (30 seconds)

In your terminal:
1. Stop backend: Press **Ctrl+C**
2. Restart backend: `npm run dev:server`

You should see:
```
Server running on http://localhost:3001
Environment: development
```

---

## Done! ✅

Now try logging in again:

1. Go to: http://localhost:3000/admin/login
2. Email: `admin@example.com`
3. Password: `password123`
4. Click **Login**

You should be redirected to the survey dashboard!

---

## If It Still Doesn't Work

### Check Backend is Running
```
http://localhost:3001/api/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### Check Tables Exist
1. Go to Supabase → **Table Editor**
2. You should see 7 tables

### Check Admin Exists
1. Go to Supabase → **Table Editor** → **admins**
2. You should see admin@example.com

---

**That's it! Your login should work now.** 🎉
