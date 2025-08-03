import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function addSubmissionsTable() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl || databaseUrl.includes('username:password')) {
    console.error('❌ Please update DATABASE_URL in .env.local');
    process.exit(1);
  }
  
  console.log('🔄 Connecting to Neon database...');
  
  const pool = new Pool({ connectionString: databaseUrl });
  
  try {
    // Create game submissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_submissions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        description TEXT,
        preview_gif TEXT NOT NULL,
        game_url TEXT NOT NULL,
        submitted_by TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP,
        review_notes TEXT
      )
    `);
    
    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_submissions_status ON game_submissions(status)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_submissions_author ON game_submissions(author)');
    
    console.log('✅ Game submissions table created successfully!');
    
    // Check if table exists
    const result = await pool.query(`
      SELECT COUNT(*) FROM game_submissions
    `);
    console.log(`📊 Found ${result.rows[0].count} game submissions`);
    
  } catch (error) {
    console.error('❌ Failed to create submissions table:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the migration
addSubmissionsTable();