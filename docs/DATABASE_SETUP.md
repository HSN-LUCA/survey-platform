# Database Setup Guide for PostgreSQL 18

Due to PostgreSQL 18's SCRAM-SHA-256 authentication, we need to set up the database manually using pgAdmin.

## Option 1: Using pgAdmin (Recommended)

1. **Open pgAdmin**
   - Search for "pgAdmin" in your Windows Start menu
   - Open it (usually runs on http://localhost:5050)

2. **Login to pgAdmin**
   - Default username: `postgres`
   - Default password: `Care@5628`

3. **Create Database**
   - Right-click on "Databases" in the left panel
   - Select "Create" → "Database"
   - Name: `survey_platform`
   - Click "Save"

4. **Initialize Schema**
   - Right-click on `survey_platform` database
   - Select "Query Tool"
   - Copy and paste the entire contents of `scripts/init-db.sql`
   - Click the "Execute" button (or press F5)
   - You should see "Query returned successfully"

5. **Verify Setup**
   - Expand `survey_platform` → Schemas → public → Tables
   - You should see these tables:
     - admins
     - surveys
     - questions
     - options
     - star_range_mappings
     - responses
     - answers

## Option 2: Using Command Line (Alternative)

If you prefer command line, you can modify PostgreSQL authentication:

1. **Find pg_hba.conf file**
   - Location: `C:\Program Files\PostgreSQL\18\data\pg_hba.conf`

2. **Edit the file**
   - Find the line: `host    all             all             127.0.0.1/32            scram-sha-256`
   - Change it to: `host    all             all             127.0.0.1/32            md5`
   - Save the file

3. **Restart PostgreSQL**
   - Open Services (services.msc)
   - Find "postgresql-x64-18"
   - Right-click and select "Restart"

4. **Run the initialization script**
   ```bash
   npm run db:init
   ```

## Verify Database Connection

Once the database is set up, test the connection:

```bash
npm run dev:server
```

You should see:
```
Server running on http://localhost:3001
```

And in the logs:
```
Connected to PostgreSQL...
```

## Troubleshooting

**"Database already exists"**
- The database was already created. This is fine.

**"Tables already exist"**
- The schema was already initialized. This is fine.

**Connection refused**
- Make sure PostgreSQL service is running
- Check that port 5432 is not blocked

**Authentication failed**
- Verify the password is correct: `Care@5628`
- Check that the username is `postgres`
