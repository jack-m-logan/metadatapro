ALTER TABLE tracks 
ADD COLUMN IF NOT EXISTS file_type VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_tracks_file_type ON tracks(file_type);