# Quick Testing Guide

## 1. Database Setup (5 minutes)

### Using pgAdmin (Windows)
```
1. Open pgAdmin → http://localhost:5050
2. Login: postgres / Care@5628
3. Right-click Databases → Create → Database
4. Name: survey_platform
5. Right-click survey_platform → Query Tool
6. Copy contents of scripts/init-db.sql
7. Execute (F5)
8. Done!
```

### Using Command Line
```bash
npm run db:init
```

## 2. Start Servers (2 terminals)

### Terminal 1 - Frontend
```bash
npm run dev
# Runs on http://localhost:3000
```

### Terminal 2 - Backend
```bash
npm run dev:server
# Runs on http://localhost:3001
```

### Or Both Together
```bash
npm run dev:all
```

## 3. Test Admin Login

1. Open http://localhost:3000/admin/login
2. Enter credentials:
   - Email: `admin@example.com`
   - Password: `password123`
3. Click "Login"
4. Should redirect to http://localhost:3000/admin/surveys

## 4. Create a Test Survey

1. On admin dashboard, click "Create New Survey"
2. Fill in:
   - **Title (English)**: "Customer Satisfaction Survey"
   - **Title (Arabic)**: "استبيان رضا العملاء"
   - **Description (English)**: "Please rate your experience"
   - **Description (Arabic)**: "يرجى تقييم تجربتك"
   - **Customer Type**: "Pilgrims"

3. Add Question 1 (Multiple Choice):
   - **Type**: Multiple Choice
   - **Question (EN)**: "How satisfied are you?"
   - **Question (AR)**: "كم أنت راضٍ؟"
   - **Options**:
     - EN: "Very Satisfied" / AR: "راضٍ جداً"
     - EN: "Satisfied" / AR: "راضٍ"
     - EN: "Not Satisfied" / AR: "غير راضٍ"

4. Add Question 2 (Star Rating):
   - **Type**: Star Rating
   - **Question (EN)**: "Rate your experience"
   - **Question (AR)**: "قيّم تجربتك"
   - **Stars**: 5
   - **Range Mappings**:
     - 1 star: 0-20%
     - 2 stars: 21-40%
     - 3 stars: 41-60%
     - 4 stars: 61-80%
     - 5 stars: 81-100%

5. Add Question 3 (Percentage):
   - **Type**: Percentage Range
   - **Question (EN)**: "What's your satisfaction percentage?"
   - **Question (AR)**: "ما نسبة رضاك؟"
   - **Min**: 0
   - **Max**: 100
   - **Step**: 5

6. Click "Save Survey"
7. **Copy the Survey ID** from the response

## 5. Take the Survey as User

1. Open http://localhost:3000
2. Paste the Survey ID
3. Click "Start Survey"
4. Answer all questions:
   - Select an option for Question 1
   - Click stars for Question 2
   - Drag slider for Question 3
5. Click "Submit Survey"
6. See success message

## 6. View Results in Admin

1. Go to http://localhost:3000/admin/surveys
2. See survey in list with response count = 1
3. Click "View Survey" to see details

## 7. Test Language Switching

1. Click "AR" button (top-right)
2. All text should switch to Arabic
3. Layout should switch to RTL
4. Click "EN" to switch back

## 8. Test Duplicate Prevention

1. Go back to survey page (http://localhost:3000)
2. Enter same Survey ID
3. Try to submit again
4. Should see error: "Survey already submitted"

## 9. Run Tests

```bash
# Run all tests
npm test

# Run specific test
npm test -- auth.test.ts

# Watch mode
npm test:watch
```

## 10. API Testing with cURL

### Get JWT Token
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### List Surveys
```bash
curl http://localhost:3001/api/admin/surveys \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Public Survey
```bash
curl http://localhost:3001/api/surveys/SURVEY_ID
```

### Submit Response
```bash
curl -X POST http://localhost:3001/api/surveys/SURVEY_ID/responses \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"question_id": "Q1_ID", "value": "OPTION_ID"},
      {"question_id": "Q2_ID", "value": 5},
      {"question_id": "Q3_ID", "value": 75}
    ]
  }'
```

## Troubleshooting

### "Database connection refused"
- Check PostgreSQL is running
- Verify credentials in .env.local
- Run: `npm run db:init`

### "Cannot find module '@/types'"
- Run: `npm install`
- Restart dev server

### "401 Unauthorized"
- Check token is valid
- Login again to get new token
- Check JWT_SECRET in .env.local

### "Survey not found"
- Verify Survey ID is correct
- Check survey exists in database
- Try creating a new survey

### "Port already in use"
- Frontend: Change port in package.json dev script
- Backend: Change API_PORT in .env.local

## Expected Results

✅ **Admin Login**: Redirects to survey list
✅ **Create Survey**: Returns survey ID
✅ **Take Survey**: Shows success message
✅ **View Results**: Shows response count
✅ **Language Switch**: UI changes to Arabic/English
✅ **Duplicate Prevention**: Shows error on second submission
✅ **Tests**: All pass with no errors

## Performance Checks

- **Login**: < 500ms
- **Create Survey**: < 1s
- **Submit Response**: < 500ms
- **List Surveys**: < 500ms
- **Language Switch**: Instant

## Next Steps

1. ✅ Test all features above
2. ✅ Run test suite
3. ✅ Check browser console for errors
4. ✅ Verify database has data
5. ✅ Try different question types
6. ✅ Test with multiple surveys
7. ✅ Test with multiple responses

## Support

If you encounter issues:
1. Check SETUP_GUIDE.md
2. Check DATABASE_SETUP.md
3. Review error messages in console
4. Check .env.local configuration
5. Verify database is initialized
