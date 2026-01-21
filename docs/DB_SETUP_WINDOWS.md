# PostgreSQL 18 Database Setup for Windows

## Method 1: Using pgAdmin (Easiest)

1. **Open pgAdmin**
   - Search for "pgAdmin" in Windows Start Menu
   - Open it (usually opens in browser at http://localhost:5050)

2. **Create Database**
   - Right-click on "Databases" in the left panel
   - Select "Create" → "Database"
   - Name: `survey_platform`
   - Click "Save"

3. **Initialize Schema**
   - Right-click on `survey_platform` database
   - Select "Query Tool"
   - Open file: `survey-platform/scripts/init-db.sql`
   - Copy all content and paste into Query Tool
   - Click "Execute" (or press F5)

4. **Verify**
   - Expand `survey_platform` → Schemas → public → Tables
   - You should see: admins, surveys, questions, options, responses, answers, star_range_mappings

---

## Method 2: Using Command Line (psql)

1. **Open Command Prompt**
   - Press `Win + R`
   - Type `cmd` and press Enter

2. **Navigate to PostgreSQL bin folder**
   ```bash
   cd "C:\Program Files\PostgreSQL\18\bin"
   ```

3. **Create database**
   ```bash
   psql -U postgres -c "CREATE DATABASE survey_platform;"
   ```
   - Enter your postgres password when prompted

4. **Initialize schema**
   ```bash
   psql -U postgres -d survey_platform -f "C:\Users\luca\Desktop\Hmsurvey\survey-platform\scripts\init-db.sql"
   ```

5. **Verify**
   ```bash
   psql -U postgres -d survey_platform -c "\dt"
   ```
   - You should see all 7 tables listed

---

## Method 3: Using Node.js Script (Automated)

If you know your postgres password, update `.env.local`:

```env
DB_PASSWORD=your_actual_postgres_password
```

Then run:
```bash
npm run db:init
```

---

## Troubleshooting

### "psql: command not found"
Use full path:
```bash
"C:\Program Files\PostgreSQL\18\bin\psql" -U postgres
```

### "password authentication failed"
- Use the password you set during PostgreSQL installation
- If you forgot it, you may need to reinstall PostgreSQL

### "could not connect to server"
- PostgreSQL service isn't running
- Start it from Windows Services or pgAdmin

### "database already exists"
- The database was already created
- You can drop it and recreate:
  ```bash
  psql -U postgres -c "DROP DATABASE survey_platform;"
  psql -U postgres -c "CREATE DATABASE survey_platform;"
  ```

---

## Next Steps

Once database is created, run:
```bash
npm run dev:all
```

This starts both frontend (port 3000) and backend (port 3001).
