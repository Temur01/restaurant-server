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

-- Uploads table for storing file metadata
CREATE TABLE IF NOT EXISTS uploads (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mimetype VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    ordernumber INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meals table
CREATE TABLE IF NOT EXISTS meals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(500) DEFAULT '',
    image_id INTEGER REFERENCES uploads(id) ON DELETE SET NULL,
    description TEXT DEFAULT '',
    price INTEGER NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    ordernumber INTEGER DEFAULT 0,
    ingredients TEXT[] DEFAULT '{}',
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
INSERT INTO categories (name, ordernumber) VALUES
('Milliy taomlar', 1),
('Go''sht taomlar', 2),
('Sho''rvalar', 3),
('Non mahsulotlari', 4),
('Salatlar', 5),
('Ichimliklar', 6)
ON CONFLICT (name) DO NOTHING;

