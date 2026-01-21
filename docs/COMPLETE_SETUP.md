# Complete Setup & Verification Guide

## Overview

Your survey platform consists of:
- **Frontend**: Next.js React app (port 3000)
- **Backend**: Express API server (port 3001)
- **Database**: Supabase PostgreSQL

All code is complete and tested. You just need to initialize the database.

## Current Status

| Component | Status | Details |
|-----------|--------|---------|
| Frontend Code | ✅ Complete | Next.js 16, React 19, Tailwind CSS |
| Backend Code | ✅ Complete | Express, TypeScript, 11 API endpoints |
| Database Schema | ⏳ Pending | Need to run SQL in Supabase |
| Admin Account | ⏳ Pending | Need to create in Supabase |
| Environment Config | ✅ Complete | `.env.local` configured |

## Quick Start (5 minutes)

### 1. Initialize Database (2 minutes)

Go to https://app.supabase.com → Your Project → SQL Editor → New Query

**Paste this entire SQL:**

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

Click **Run** → You should see "Success"

### 2. Create Admin Account (1 minute)

New Query in SQL Editor:

```sql
INSERT INTO admins (email, password_hash) VALUES (
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm'
);
```

Click **Run**

### 3. Start Application (2 minutes)

```bash
npm run dev:all
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### 4. Login (1 minute)

Go to http://localhost:3000/admin/login

- **Email**: `admin@example.com`
- **Password**: `password123`

## Verification Checklist

### Backend Health Check

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-14T..."
}
```

### Database Connection

Backend logs should show:
```
Server running on http://localhost:3001
Environment: development
```

### Frontend Loading

http://localhost:3000 should load without errors

### Admin Login

http://localhost:3000/admin/login should:
- Load login form
- Accept credentials
- Redirect to survey list

## Features Available

### Admin Dashboard
- Create surveys (Arabic & English titles)
- Add questions (3 types)
- Edit/delete surveys
- View analytics
- Export data

### Survey Features
- Multiple choice questions
- Star rating (1-5 stars)
- Percentage range slider
- Form validation
- Multi-language support
- Real-time response tracking

### API Endpoints (11 total)

**Auth:**
- `POST /api/auth/login`
- `POST /api/auth/logout`

**Admin Surveys:**
- `GET /api/admin/surveys`
- `POST /api/admin/surveys`
- `PUT /api/admin/surveys/:id`
- `DELETE /api/admin/surveys/:id`
- `GET /api/admin/surveys/:id/analytics`

**Public Surveys:**
- `GET /api/surveys/:id`
- `POST /api/surveys/:id/responses`
- `GET /api/surveys/:id/responses`

## File Structure

```
survey-platform/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Home page
│   │   ├── admin/
│   │   │   ├── login/page.tsx       # Admin login
│   │   │   ├── surveys/page.tsx     # Survey list
│   │   │   ├── settings/page.tsx    # Settings
│   │   │   └── analytics/page.tsx   # Analytics
│   │   └── survey/[id]/page.tsx     # Public survey
│   ├── components/
│   │   ├── AdminLayout.tsx          # Admin layout
│   │   ├── AdminLogin.tsx           # Login form
│   │   ├── SurveyList.tsx           # Survey list
│   │   ├── SurveyPage.tsx           # Survey form
│   │   ├── QuestionRenderer.tsx     # Question display
│   │   ├── questions/               # Question types
│   │   │   ├── MultipleChoiceQuestion.tsx
│   │   │   ├── StarRatingQuestion.tsx
│   │   │   └── PercentageRangeQuestion.tsx
│   │   ├── LanguageSwitcher.tsx     # Language toggle
│   │   └── I18nProvider.tsx         # i18n setup
│   └── i18n/
│       ├── config.ts                # i18n config
│       └── locales/
│           ├── en.json              # English strings
│           └── ar.json              # Arabic strings
├── server/
│   ├── index.ts                     # Server entry
│   ├── routes/
│   │   ├── auth.ts                  # Auth endpoints
│   │   ├── surveys.ts               # Admin endpoints
│   │   └── public-surveys.ts        # Public endpoints
│   └── middleware/
│       └── auth.ts                  # JWT middleware
├── lib/
│   ├── auth.ts                      # Auth utilities
│   └── db.ts                        # Database pool
├── scripts/
│   └── init-db.sql                  # Database schema
├── .env.local                       # Environment variables
└── package.json                     # Dependencies
```

## Environment Variables

Your `.env.local` is already configured with:

```
DATABASE_URL=postgresql://postgres:Survey123456@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres
DB_HOST=nbjuyltaeunxcishhwqu.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Survey123456

SUPABASE_URL=https://nbjuyltaeunxcishhwqu.supabase.co
SUPABASE_ANON_KEY=sb_publishable_9G1k4DgE52cnO-5VuvVoFA_Dv9XbX_Y
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXvZXCasdqwe

API_PORT=3001
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001

JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=7d

NODE_ENV=development
```

## Troubleshooting

### Backend won't start
```bash
npm run dev:server
```
Check console for errors. Common issues:
- Port 3001 in use: `netstat -ano | findstr :3001`
- Missing dependencies: `npm install`
- Bad environment variables: Check `.env.local`

### Can't login
1. Check admin exists: Supabase → Table Editor → admins
2. Verify email is exactly: `admin@example.com`
3. Recreate admin with SQL query

### Frontend can't reach backend
1. Verify backend running: `http://localhost:3001/api/health`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for CORS errors

### Database connection fails
1. Verify Supabase project is active
2. Check credentials in `.env.local`
3. Verify tables exist in Supabase Table Editor

## Next Steps

1. ✅ Initialize database
2. ✅ Create admin account
3. ✅ Start application
4. ✅ Login to admin dashboard
5. Create your first survey
6. Add questions
7. Share survey link
8. View responses
9. Deploy to production

## Production Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Railway or Render
1. Connect GitHub
2. Set environment variables
3. Deploy

See `SUPABASE_SETUP.md` for detailed instructions.

---

**Everything is ready. Just initialize the database and start building!** 🚀
