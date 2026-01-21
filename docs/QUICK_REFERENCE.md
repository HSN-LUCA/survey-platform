# Quick Reference Guide

## Essential Commands

### Development

```bash
# Start both frontend and backend
npm run dev:all

# Start frontend only (port 3000)
npm run dev

# Start backend only (port 3001)
npm run dev:server

# Build for production
npm build

# Start production server
npm start
```

### Database

```bash
# Initialize database (run SQL in Supabase)
# Copy scripts/init-db.sql to Supabase SQL Editor

# Create admin account (run in Supabase SQL Editor)
INSERT INTO admins (email, password_hash) VALUES (
  'admin@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm'
);
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- auth.test.ts
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint -- --fix
```

## URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Admin dashboard & surveys |
| Backend | http://localhost:3001 | API server |
| Health Check | http://localhost:3001/api/health | Backend status |
| Admin Login | http://localhost:3000/admin/login | Admin authentication |
| Supabase | https://app.supabase.com | Database management |

## Default Credentials

| Field | Value |
|-------|-------|
| Email | admin@example.com |
| Password | password123 |

## API Endpoints

### Authentication

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Logout
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer <token>"
```

### Admin Surveys

```bash
# List surveys
curl http://localhost:3001/api/admin/surveys \
  -H "Authorization: Bearer <token>"

# Create survey
curl -X POST http://localhost:3001/api/admin/surveys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title_en":"Survey Title",
    "title_ar":"عنوان الاستبيان",
    "description_en":"Description",
    "description_ar":"الوصف",
    "customer_type":"pilgrims",
    "questions":[...]
  }'

# Get survey
curl http://localhost:3001/api/admin/surveys/:id \
  -H "Authorization: Bearer <token>"

# Update survey
curl -X PUT http://localhost:3001/api/admin/surveys/:id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{...}'

# Delete survey
curl -X DELETE http://localhost:3001/api/admin/surveys/:id \
  -H "Authorization: Bearer <token>"

# Get analytics
curl http://localhost:3001/api/admin/surveys/:id/analytics \
  -H "Authorization: Bearer <token>"
```

### Public Surveys

```bash
# Get survey (public)
curl http://localhost:3001/api/surveys/:id

# Submit response
curl -X POST http://localhost:3001/api/surveys/:id/responses \
  -H "Content-Type: application/json" \
  -d '{
    "user_session_id":"session-123",
    "answers":[
      {"question_id":"q1","value":"option1"},
      {"question_id":"q2","value":"4"},
      {"question_id":"q3","value":"75"}
    ]
  }'

# Get responses
curl http://localhost:3001/api/surveys/:id/responses
```

## File Locations

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables |
| `scripts/init-db.sql` | Database schema |
| `src/app/` | Frontend pages |
| `src/components/` | React components |
| `src/i18n/` | Multi-language config |
| `server/routes/` | API endpoints |
| `server/middleware/` | Express middleware |
| `lib/auth.ts` | Authentication utilities |
| `lib/db.ts` | Database connection |

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://postgres:Survey123456@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres
DB_HOST=nbjuyltaeunxcishhwqu.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Survey123456

# Supabase
SUPABASE_URL=https://nbjuyltaeunxcishhwqu.supabase.co
SUPABASE_ANON_KEY=sb_publishable_9G1k4DgE52cnO-5VuvVoFA_Dv9XbX_Y
SUPABASE_SERVICE_ROLE_KEY=sb_secret_LUrBLwFvWXSgLoup5tMxNA_chkO4oXvZXCasdqwe

# API
API_PORT=3001
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=7d

# Environment
NODE_ENV=development
```

## Database Tables

| Table | Purpose |
|-------|---------|
| admins | Admin users |
| surveys | Survey definitions |
| questions | Survey questions |
| options | Multiple choice options |
| responses | User survey responses |
| answers | Individual question answers |
| star_range_mappings | Star rating mappings |

## Troubleshooting

### Backend won't start
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Kill process on port 3001
taskkill /PID <PID> /F

# Check environment variables
type .env.local
```

### Can't connect to database
```bash
# Test connection
psql postgresql://postgres:Survey123456@nbjuyltaeunxcishhwqu.supabase.co:5432/postgres

# Check Supabase status
# Go to https://app.supabase.com
```

### Frontend can't reach backend
```bash
# Test backend health
curl http://localhost:3001/api/health

# Check CORS headers
curl -i http://localhost:3001/api/health
```

### Tests failing
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test
npm test -- auth.test.ts

# Update snapshots
npm test -- -u
```

## Performance Tips

### Frontend
- Use React DevTools to check re-renders
- Check Network tab for slow requests
- Use Lighthouse for performance audit

### Backend
- Check database query performance
- Monitor connection pool usage
- Use request logging to identify slow endpoints

### Database
- Check indexes are being used
- Monitor query execution time
- Use EXPLAIN ANALYZE for slow queries

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use strong database password
- [ ] Enable HTTPS in production
- [ ] Set CORS origins correctly
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Monitor error logs
- [ ] Update dependencies regularly
- [ ] Use HTTPS for API calls

## Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Update NEXT_PUBLIC_API_URL to production URL
- [ ] Change JWT_SECRET
- [ ] Update database credentials
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test all endpoints
- [ ] Set up CI/CD
- [ ] Document deployment process

## Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [i18next Documentation](https://www.i18next.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Common Issues & Solutions

### Issue: "Event handlers cannot be passed to Client Component props"
**Solution**: Add `'use client'` directive at top of component

### Issue: "Unknown authenticationOk message type 9"
**Solution**: Use Supabase instead of local PostgreSQL 18

### Issue: "CORS error"
**Solution**: Check CORS origins in `server/index.ts`

### Issue: "JWT token expired"
**Solution**: Login again to get new token

### Issue: "Database connection refused"
**Solution**: Check `.env.local` credentials and Supabase status

---

**Keep this guide handy for quick reference!** 📋
