import { Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function initDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl || databaseUrl.includes('username:password')) {
    console.error('❌ Please update DATABASE_URL in .env.local with your actual Neon connection string');
    console.error('   You can find this in your Neon dashboard after creating a database');
    process.exit(1);
  }
  
  console.log('🔄 Connecting to Neon database...');
  
  const pool = new Pool({ connectionString: databaseUrl });
  
  try {
    // Read schema file
    const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📝 Running database schema...');
    
    // Execute schema
    await pool.query(schema);
    
    console.log('✅ Database initialized successfully!');
    console.log('   - Created games table');
    console.log('   - Created high_scores table');
    console.log('   - Inserted initial games data');
    
    // Test the connection
    const result = await pool.query('SELECT COUNT(*) FROM games');
    console.log(`\n📊 Found ${result.rows[0].count} games in the database`);
    
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the initialization
initDatabase();