import { Pool } from '@neondatabase/serverless';

// Initialize connection pool - will use DATABASE_URL env var
let pool: Pool | null = null;

export function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

// Helper function for single queries
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query(sql, params);
  return result.rows;
}

// Anonymous auth - we'll generate a session token for each user
export function generateAnonToken(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}