-- SQL to remove 'type' and 'progress' columns from the chapters table
-- Run this in your Supabase SQL Editor

-- Remove the 'type' column from the chapters table
ALTER TABLE chapters DROP COLUMN IF EXISTS type;

-- Remove the 'progress' column from the chapters table  
ALTER TABLE chapters DROP COLUMN IF EXISTS progress;

-- Optional: If you want to verify the changes, you can run:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'chapters' 
-- ORDER BY ordinal_position;