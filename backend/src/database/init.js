const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

const initDatabase = async () => {
  const client = await pool.connect();
  try {
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split the SQL file into individual statements and filter out empty ones
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      try {
        await client.query(statement);
        console.log('Executed:', statement.split('\n')[0]);
      } catch (error) {
        console.error('Error executing statement:', error.message);
        throw error;
      }
    }

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    client.release();
  }
};

// Run the initialization
initDatabase(); 