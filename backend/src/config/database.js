const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ssl: false
});

// Test the connection
pool.connect(async (err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to the database');
    
    // Create date_ideas table if it doesn't exist
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS date_ideas (
          "dateId" SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          username VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Date ideas table created or already exists');
    } catch (err) {
      console.error('Error creating date_ideas table:', err);
    }
    
    release();
  }
});

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params)
}; 