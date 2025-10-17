import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration for PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default pool;