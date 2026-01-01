-- ============================================
-- Add Netflix Content Support to Movies Table
-- ============================================
-- Run this in Supabase SQL Editor to add platform and content_type columns

-- Add new columns to movies table
ALTER TABLE movies 
ADD COLUMN IF NOT EXISTS platform TEXT,
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'Movie';

-- Create index for platform filtering
CREATE INDEX IF NOT EXISTS idx_movies_platform ON movies(platform);
CREATE INDEX IF NOT EXISTS idx_movies_content_type ON movies(content_type);

-- Add check constraint for content_type
ALTER TABLE movies 
ADD CONSTRAINT content_type_valid 
CHECK (content_type IN ('Movie', 'TV Show'));

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Movies table updated successfully!';
    RAISE NOTICE '📺 Added columns: platform, content_type';
    RAISE NOTICE '🎬 You can now store Netflix content!';
END $$;
