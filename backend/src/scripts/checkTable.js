const { query } = require('../config/database');

async function checkTable() {
  try {
    // Check if table exists
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'date_ideas'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log('Table date_ideas does not exist');
      return;
    }

    // Get column information
    const columns = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'date_ideas';
    `);

    console.log('Current table structure:');
    console.log(columns.rows);

    process.exit(0);
  } catch (error) {
    console.error('Error checking table:', error);
    process.exit(1);
  }
}

checkTable(); 