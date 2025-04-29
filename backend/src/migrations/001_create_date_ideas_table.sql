-- Drop the existing table if it exists
DROP TABLE IF EXISTS date_ideas;

-- Create the table with the correct structure
CREATE TABLE date_ideas (
    "dateId" SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 