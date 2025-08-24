-- Add the validation_results column to store snapshots
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS validation_results JSONB;

-- Update existing validated tracks to have proper structure
UPDATE tracks 
SET validation_results = jsonb_build_object(
  'validationScore', validation_score,
  'validatedAt', processing_completed_at,
  'currentMetadata', jsonb_build_object(
    'title', title,
    'artist', artist,
    'album', album,
    'isrc', isrc,
    'genre', genre,
    'year', year
  ),
  'originalMetadata', original_metadata
)
WHERE validation_status = 'completed' AND validation_results IS NULL;