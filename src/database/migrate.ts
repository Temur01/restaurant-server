import pool from '../config/database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  try {
    console.log('🚀 Starting database migration...');

    // Create admins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if meals table has old structure (category column exists)
    const mealsTableCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'meals' AND column_name = 'category'
    `);

    if (mealsTableCheck.rows.length > 0) {
      console.log('📋 Migrating existing meals data...');
      
      // Get unique categories from existing meals
      const existingCategories = await pool.query(`
        SELECT DISTINCT category FROM meals WHERE category IS NOT NULL
      `);

      // Insert existing categories into categories table
      for (const row of existingCategories.rows) {
        await pool.query(`
          INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING
        `, [row.category]);
      }

      // Add category_id column to meals table
      await pool.query(`
        ALTER TABLE meals ADD COLUMN IF NOT EXISTS category_id INTEGER
      `);

      // Update meals with category_id based on category name
      for (const row of existingCategories.rows) {
        const categoryResult = await pool.query(`
          SELECT id FROM categories WHERE name = $1
        `, [row.category]);
        
        if (categoryResult.rows.length > 0) {
          await pool.query(`
            UPDATE meals SET category_id = $1 WHERE category = $2
          `, [categoryResult.rows[0].id, row.category]);
        }
      }

      // Drop old category column and add foreign key constraint
      await pool.query(`ALTER TABLE meals DROP COLUMN IF EXISTS category`);
      await pool.query(`
        ALTER TABLE meals ALTER COLUMN category_id SET NOT NULL
      `);
      await pool.query(`
        ALTER TABLE meals ADD CONSTRAINT fk_meals_category 
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
      `);
    } else {
      // Create meals table with new structure
      await pool.query(`
        CREATE TABLE IF NOT EXISTS meals (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          image VARCHAR(500) NOT NULL,
          description TEXT NOT NULL,
          price INTEGER NOT NULL,
          category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
          ingredients TEXT[] NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_meals_category_id ON meals(category_id)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name)
    `);

    // Insert default categories
    await pool.query(`
      INSERT INTO categories (name) VALUES
      ('Milliy taomlar'),
      ('Go''sht taomlar'),
      ('Sho''rvalar'),
      ('Non mahsulotlari'),
      ('Salatlar'),
      ('Ichimliklar')
      ON CONFLICT (name) DO NOTHING
    `);

    // Insert default admin
    const adminUsername = process.env.ADMIN_USERNAME || 'alibek';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ali_2001';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await pool.query(
      `INSERT INTO admins (username, password) 
       VALUES ($1, $2) 
       ON CONFLICT (username) DO NOTHING`,
      [adminUsername, hashedPassword]
    );
    console.log('🎉 Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();

