import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration for PostgreSQL
const connectionString = process.env.DATABASE_URL;
const shouldUseSSL = 
  process.env.NODE_ENV === 'production'; 

const pool = new Pool({
  connectionString,
  ssl: shouldUseSSL ? { rejectUnauthorized: false } : false,
  max: 20, 
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 10000, 
});

// Log pool events for debugging
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

// Test the connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection test failed:', err.message);
    console.error('Please check your DATABASE_URL configuration');
  } else {
    console.log('✅ Database connection test successful:', res.rows[0].now);
  }
});

export default pool;