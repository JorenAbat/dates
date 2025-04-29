-- Create the database if it doesn't exist
SELECT 'CREATE DATABASE dates_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dates_db')\gexec

-- Connect to the dates_db database
\c dates_db

-- Drop existing tables if they exist (in correct order)
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS date_categories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS dates CASCADE;
DROP TABLE IF EXISTS date_ideas CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table first
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create date_ideas table after users
CREATE TABLE date_ideas (
    "dateId" SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create dates table
CREATE TABLE dates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP NOT NULL,
    location TEXT,
    location_name VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    estimated_budget DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create profiles table
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    bio TEXT,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create locations table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create photos table
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    date_id INTEGER REFERENCES dates(id),
    url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create date_categories table (many-to-many relationship)
CREATE TABLE date_categories (
    date_id INTEGER REFERENCES dates(id),
    category_id INTEGER REFERENCES categories(id),
    PRIMARY KEY (date_id, category_id)
);

-- Create indexes
CREATE INDEX dates_user_id_idx ON dates(user_id);
CREATE INDEX dates_date_idx ON dates(date);
CREATE INDEX dates_location_idx ON dates(location_name);
CREATE INDEX dates_coordinates_idx ON dates(latitude, longitude);
CREATE INDEX idx_locations_name ON locations(name);
CREATE INDEX idx_photos_date_id ON photos(date_id); 