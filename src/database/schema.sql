-- Create database (run this manually first)
-- CREATE DATABASE beyougli_karshi;

-- Connect to the database and run the following:

-- Admin users table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meals table
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
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_meals_category_id ON meals(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Password is saved as plain text
INSERT INTO admins (username, password) 
VALUES ('alibek', 'ali_2001')
ON CONFLICT (username) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name) VALUES
('Milliy taomlar'),
('Go''sht taomlar'),
('Sho''rvalar'),
('Non mahsulotlari'),
('Salatlar'),
('Ichimliklar')
ON CONFLICT (name) DO NOTHING;

