const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Database connection configuration
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Care@5628',
  ssl: false,
  allowExitOnIdle: true,
});

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log('Connected to PostgreSQL...');

    // Check if survey_platform database exists
    const dbCheckResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'survey_platform'"
    );

    if (dbCheckResult.rows.length === 0) {
      console.log('Creating survey_platform database...');
      await client.query('CREATE DATABASE survey_platform');
      console.log('✓ Database created');
    } else {
      console.log('✓ Database already exists');
    }

    // Disconnect from postgres database
    await client.end();

    // Connect to survey_platform database
    const surveyPool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'survey_platform',
      user: 'postgres',
      password: 'Care@5628',
      ssl: false,
    });

    const surveyClient = await surveyPool.connect();

    // Read and execute schema file
    const schemaPath = path.join(__dirname, 'init-db.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Initializing database schema...');
    await surveyClient.query(schema);
    console.log('✓ Schema initialized successfully');

    // Create test admin user
    console.log('Creating test admin user...');
    const testEmail = 'admin@example.com';
    const testPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(testPassword, salt);

    await surveyClient.query(
      'INSERT INTO admins (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
      [testEmail, passwordHash]
    );
    console.log(`✓ Test admin created: ${testEmail} / ${testPassword}`);

    await surveyClient.end();
    await surveyPool.end();

    console.log('\n✓ Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error.message);
    console.error('Make sure PostgreSQL is running and the password is correct.');
    process.exit(1);
  }
}

initializeDatabase();
