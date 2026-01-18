# Survey Platform - Setup & Testing Guide

## Quick Start

### 1. Database Setup

**Option A: Using pgAdmin (Recommended for Windows)**

1. Open pgAdmin (http://localhost:5050)
2. Login with: `postgres` / `Care@5628`
3. Create database: Right-click Databases → Create → Database → Name: `survey_platform`
4. Open Query Tool on the new database
5. Copy contents of `scripts/init-db.sql` and execute
6. Verify tables are created

**Option B: Using Command Line**

```bash
npm run db:init
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env.local` in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=survey_platform
DB_USER=postgres
DB_PASSWORD=Care@5628

# API
API_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=7d
```

### 4. Start Development Servers

**Terminal 1 - Frontend (Next.js)**
```bash
npm run dev
```
Runs on: http://localhost:3000

**Terminal 2 - Backend (Express)**
```bash
npm run dev:server
```
Runs on: http://localhost:3001

**Or run both together:**
```bash
npm run dev:all
```

## Testing the Application

### Test Admin Credentials

```
Email: admin@example.com
Password: password123
```

### User Survey Flow

1. **Create a Survey (Admin)**
   - Go to http://localhost:3000/admin/login
   - Login with test credentials
   - Click "Create New Survey"
   - Fill in survey details (Arabic & English)
   - Add questions (multiple choice, star rating, percentage)
   - Save survey
   - Note the Survey ID

2. **Take a Survey (User)**
   - Go to http://localhost:3000
   - Enter the Survey ID
   - Click "Start Survey"
   - Answer all questions
   - Submit survey
   - See confirmation message

3. **View Results (Admin)**
   - Go to http://localhost:3000/admin/surveys
   - See survey in list with response count
   - Click "View Survey" to see details

### API Testing with cURL

**Login**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

**Create Survey**
```bash
curl -X POST http://localhost:3001/api/admin/surveys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title_ar": "استبيان",
    "title_en": "Survey",
    "customer_type": "pilgrims",
    "questions": [
      {
        "type": "multiple_choice",
        "content_ar": "سؤال",
        "content_en": "Question",
        "options": [
          {"text_ar": "خيار 1", "text_en": "Option 1"},
          {"text_ar": "خيار 2", "text_en": "Option 2"}
        ]
      }
    ]
  }'
```

**Get Survey (Public)**
```bash
curl http://localhost:3001/api/surveys/SURVEY_ID
```

**Submit Response**
```bash
curl -X POST http://localhost:3001/api/surveys/SURVEY_ID/responses \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"question_id": "QUESTION_ID", "value": "OPTION_ID"}
    ]
  }'
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run specific test file
npm test -- auth.test.ts
```

## Features Implemented

### Backend
- ✅ Admin authentication with JWT
- ✅ Survey CRUD operations
- ✅ All question types (multiple choice, star rating, percentage)
- ✅ Response submission with validation
- ✅ Duplicate submission prevention
- ✅ Bilingual content support
- ✅ Protected admin endpoints
- ✅ Comprehensive error handling

### Frontend
- ✅ Multi-language UI (Arabic/English)
- ✅ Language switcher with RTL support
- ✅ Survey page with all question types
- ✅ Admin login page
- ✅ Admin dashboard with survey list
- ✅ Form validation
- ✅ Responsive design

### Database
- ✅ PostgreSQL schema
- ✅ All required tables
- ✅ Proper indexes
- ✅ Referential integrity
- ✅ Test data initialization

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check credentials in `.env.local`
- Verify database `survey_platform` exists
- Check port 5432 is not blocked

### API Not Responding
- Ensure backend server is running on port 3001
- Check `npm run dev:server` output for errors
- Verify `.env.local` has correct API_PORT

### Frontend Not Loading
- Ensure frontend server is running on port 3000
- Check `npm run dev` output for errors
- Clear browser cache and reload

### Authentication Issues
- Verify test admin exists in database
- Check JWT_SECRET in `.env.local`
- Clear localStorage and login again

## Next Steps

1. **Analytics Dashboard** - Real-time response analytics
2. **Survey Builder UI** - Drag-and-drop survey creation
3. **Export Results** - CSV/PDF export functionality
4. **WebSocket Real-time Updates** - Live dashboard updates
5. **User Management** - Multiple admin accounts
6. **Advanced Filtering** - Date range, customer type filters

## Project Structure

```
survey-platform/
├── server/              # Express backend
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth middleware
│   └── index.ts        # Server entry point
├── src/
│   ├── app/            # Next.js pages
│   ├── components/     # React components
│   ├── i18n/           # i18next config & translations
│   └── styles/         # CSS
├── lib/                # Utilities
├── types/              # TypeScript types
├── scripts/            # Database scripts
└── public/             # Static files
```

## Support

For issues or questions, check:
1. DATABASE_SETUP.md - Database configuration
2. Design document - Architecture details
3. Requirements document - Feature specifications
