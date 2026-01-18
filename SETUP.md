# Survey Platform - Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### Option A: Using PostgreSQL CLI

```bash
# Create database
createdb survey_platform

# Initialize schema
psql -U postgres -d survey_platform -f scripts/init-db.sql
```

#### Option B: Using psql directly

```bash
psql -U postgres
```

Then run:

```sql
CREATE DATABASE survey_platform;
\c survey_platform
\i scripts/init-db.sql
```

### 3. Environment Configuration

The `.env.local` file is already created with default values. Update if needed:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/survey_platform
DB_HOST=localhost
DB_PORT=5432
DB_NAME=survey_platform
DB_USER=postgres
DB_PASSWORD=password
API_PORT=3001
JWT_SECRET=your_jwt_secret_key_change_in_production
```

### 4. Running the Application

#### Development Mode (Both Frontend and Backend)

```bash
npm run dev:all
```

This will start:
- Next.js frontend on http://localhost:3000
- Express backend on http://localhost:3001

#### Frontend Only

```bash
npm run dev
```

#### Backend Only

```bash
npm run dev:server
```

### 5. Verify Setup

Check if the API is running:

```bash
curl http://localhost:3001/api/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-13T10:00:00.000Z"
}
```

## Project Structure

```
survey-platform/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utility functions (db, auth, etc.)
├── server/                 # Express server
├── types/                  # TypeScript type definitions
├── scripts/                # Database scripts
├── public/                 # Static assets
├── .env.local              # Environment variables
├── tsconfig.server.json    # TypeScript config for server
└── package.json            # Dependencies
```

## Database Schema

The database includes the following tables:
- `admins` - Admin users
- `surveys` - Survey definitions
- `questions` - Survey questions
- `options` - Multiple choice options
- `star_range_mappings` - Star rating range configurations
- `responses` - User survey responses
- `answers` - Individual answers to questions

## Next Steps

1. Create admin authentication endpoints (Task 2)
2. Implement survey management API (Task 3)
3. Build user survey interface (Task 6)
4. Create admin dashboard (Task 7)
5. Implement real-time updates (Task 9)

## Troubleshooting

### Database Connection Error

If you get a connection error, verify:
1. PostgreSQL is running
2. Database `survey_platform` exists
3. Credentials in `.env.local` are correct

### Port Already in Use

If port 3001 is already in use, change `API_PORT` in `.env.local`

### Module Not Found

Run `npm install` again to ensure all dependencies are installed
