# Survey Platform Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Next.js Frontend (Port 3000)                     │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Admin Dashboard                                   │  │   │
│  │  │  - Survey Management                              │  │   │
│  │  │  - Analytics                                       │  │   │
│  │  │  - Settings                                        │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Public Survey Interface                           │  │   │
│  │  │  - Survey Form                                     │  │   │
│  │  │  - Question Rendering                             │  │   │
│  │  │  - Response Submission                            │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Multi-Language Support (i18next)                 │  │   │
│  │  │  - English                                         │  │   │
│  │  │  - Arabic (RTL)                                    │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↕ HTTP/REST                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS BACKEND (Port 3001)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API Routes                                              │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  /api/auth                                         │  │   │
│  │  │  - POST /login                                     │  │   │
│  │  │  - POST /logout                                    │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  /api/admin/surveys (Protected)                    │  │   │
│  │  │  - GET /                                           │  │   │
│  │  │  - POST /                                          │  │   │
│  │  │  - PUT /:id                                        │  │   │
│  │  │  - DELETE /:id                                     │  │   │
│  │  │  - GET /:id/analytics                              │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  /api/surveys (Public)                             │  │   │
│  │  │  - GET /:id                                        │  │   │
│  │  │  - POST /:id/responses                             │  │   │
│  │  │  - GET /:id/responses                              │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Middleware                                              │   │
│  │  - CORS                                                  │   │
│  │  - JWT Authentication                                   │   │
│  │  - Error Handling                                        │   │
│  │  - Request Logging                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Socket.IO (Real-time Updates)                           │   │
│  │  - Survey updates                                        │   │
│  │  - Response notifications                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↕ PostgreSQL                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              SUPABASE DATABASE (PostgreSQL)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Tables                                                  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  admins                                            │  │   │
│  │  │  - id (UUID)                                       │  │   │
│  │  │  - email (VARCHAR)                                 │  │   │
│  │  │  - password_hash (VARCHAR)                         │  │   │
│  │  │  - created_at, updated_at                          │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  surveys                                           │  │   │
│  │  │  - id (UUID)                                       │  │   │
│  │  │  - title_ar, title_en (VARCHAR)                    │  │   │
│  │  │  - description_ar, description_en (TEXT)           │  │   │
│  │  │  - customer_type (VARCHAR)                         │  │   │
│  │  │  - created_by (FK → admins)                        │  │   │
│  │  │  - is_archived (BOOLEAN)                           │  │   │
│  │  │  - created_at, updated_at                          │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  questions                                         │  │   │
│  │  │  - id (UUID)                                       │  │   │
│  │  │  - survey_id (FK → surveys)                        │  │   │
│  │  │  - type (VARCHAR: multiple_choice, star_rating,   │  │   │
│  │  │           percentage_range)                        │  │   │
│  │  │  - content_ar, content_en (TEXT)                   │  │   │
│  │  │  - required (BOOLEAN)                              │  │   │
│  │  │  - order_num (INTEGER)                             │  │   │
│  │  │  - star_count, percentage_min/max/step (INTEGER)   │  │   │
│  │  │  - created_at                                      │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  options                                           │  │   │
│  │  │  - id (UUID)                                       │  │   │
│  │  │  - question_id (FK → questions)                    │  │   │
│  │  │  - text_ar, text_en (VARCHAR)                      │  │   │
│  │  │  - order_num (INTEGER)                             │  │   │
│  │  │  - created_at                                      │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  responses                                         │  │   │
│  │  │  - id (UUID)                                       │  │   │
│  │  │  - survey_id (FK → surveys)                        │  │   │
│  │  │  - user_session_id (VARCHAR)                       │  │   │
│  │  │  - submitted_at (TIMESTAMP)                        │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  answers                                           │  │   │
│  │  │  - id (UUID)                                       │  │   │
│  │  │  - response_id (FK → responses)                    │  │   │
│  │  │  - question_id (FK → questions)                    │  │   │
│  │  │  - value (VARCHAR)                                 │  │   │
│  │  │  - created_at                                      │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  star_range_mappings                               │  │   │
│  │  │  - id (UUID)                                       │  │   │
│  │  │  - question_id (FK → questions)                    │  │   │
│  │  │  - star_level (INTEGER)                            │  │   │
│  │  │  - min_percentage, max_percentage (INTEGER)        │  │   │
│  │  │  - created_at                                      │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Admin Creating a Survey

```
1. Admin fills form in browser
   ↓
2. Frontend sends POST /api/admin/surveys
   ↓
3. Backend receives request
   ↓
4. JWT middleware validates token
   ↓
5. Backend inserts into surveys table
   ↓
6. Backend inserts questions into questions table
   ↓
7. Backend inserts options into options table
   ↓
8. Database returns survey ID
   ↓
9. Backend returns response to frontend
   ↓
10. Frontend shows success message
```

### User Submitting a Survey

```
1. User fills survey form in browser
   ↓
2. Frontend validates form
   ↓
3. Frontend sends POST /api/surveys/:id/responses
   ↓
4. Backend receives request (no auth needed)
   ↓
5. Backend creates response record
   ↓
6. Backend inserts answers for each question
   ↓
7. Database returns response ID
   ↓
8. Backend returns success
   ↓
9. Frontend shows thank you message
   ↓
10. Socket.IO notifies admin of new response
```

### Admin Viewing Analytics

```
1. Admin clicks Analytics
   ↓
2. Frontend sends GET /api/admin/surveys/:id/analytics
   ↓
3. Backend receives request
   ↓
4. JWT middleware validates token
   ↓
5. Backend queries responses table
   ↓
6. Backend queries answers table
   ↓
7. Backend calculates statistics
   ↓
8. Backend returns analytics data
   ↓
9. Frontend renders charts
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Internationalization**: i18next
- **Charts**: Recharts
- **Real-time**: Socket.IO Client

### Backend
- **Framework**: Express 5
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.IO
- **Testing**: Jest + Supertest

### Database
- **Provider**: Supabase (PostgreSQL)
- **Connection**: pg (Node.js driver)
- **Pooling**: Built-in connection pooling
- **Migrations**: SQL scripts

## Security Features

### Authentication
- JWT tokens with 7-day expiry
- bcrypt password hashing (10 rounds)
- Secure token storage in localStorage

### Authorization
- Protected admin routes with JWT middleware
- Public survey endpoints (no auth required)
- Role-based access control (admin only)

### Data Protection
- CORS enabled for frontend origin
- SQL injection prevention (parameterized queries)
- Input validation on all endpoints
- Error messages don't leak sensitive info

### Database
- Foreign key constraints
- Unique constraints on email
- Indexes for performance
- Automatic timestamps

## Performance Optimizations

### Database
- Connection pooling (pg)
- Indexes on frequently queried columns
- Efficient queries with proper joins
- Pagination support

### Frontend
- Code splitting with Next.js
- Image optimization
- CSS-in-JS with Tailwind
- Client-side caching

### Backend
- Request logging
- Error handling
- CORS optimization
- Socket.IO namespacing

## Scalability

### Horizontal Scaling
- Stateless backend (can run multiple instances)
- Database connection pooling
- Load balancing ready

### Vertical Scaling
- Efficient database queries
- Optimized indexes
- Connection pooling

### Deployment
- Vercel (frontend)
- Railway/Render (backend)
- Supabase (database)

## File Organization

```
survey-platform/
├── src/                          # Frontend code
│   ├── app/                      # Next.js pages
│   │   ├── page.tsx              # Home
│   │   ├── admin/                # Admin routes
│   │   │   ├── login/page.tsx
│   │   │   ├── surveys/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── analytics/page.tsx
│   │   └── survey/[id]/page.tsx  # Public survey
│   ├── components/               # React components
│   │   ├── AdminLayout.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── SurveyList.tsx
│   │   ├── SurveyPage.tsx
│   │   ├── QuestionRenderer.tsx
│   │   ├── questions/            # Question types
│   │   ├── LanguageSwitcher.tsx
│   │   └── I18nProvider.tsx
│   └── i18n/                     # Internationalization
│       ├── config.ts
│       └── locales/
│           ├── en.json
│           └── ar.json
├── server/                       # Backend code
│   ├── index.ts                  # Server entry
│   ├── routes/                   # API routes
│   │   ├── auth.ts
│   │   ├── surveys.ts
│   │   └── public-surveys.ts
│   └── middleware/               # Express middleware
│       └── auth.ts
├── lib/                          # Shared utilities
│   ├── auth.ts                   # Auth helpers
│   └── db.ts                     # Database pool
├── scripts/                      # Database scripts
│   └── init-db.sql
├── types/                        # TypeScript types
├── .env.local                    # Environment variables
└── package.json                  # Dependencies
```

## Environment Variables

```
# Database
DATABASE_URL=postgresql://...
DB_HOST=...
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=...

# Supabase
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# API
API_PORT=3001
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001

# JWT
JWT_SECRET=...
JWT_EXPIRY=7d

# Environment
NODE_ENV=development
```

---

This architecture is designed for scalability, security, and maintainability.
