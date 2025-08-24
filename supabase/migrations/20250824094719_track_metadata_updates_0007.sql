-- Track when metadata fields are updated
ALTER TABLE tracks ADD COLUMN metadata_last_updated_at TIMESTAMP WITH TIME ZONE;

-- Update this timestamp whenever core metadata fields change
CREATE OR REPLACE FUNCTION update_metadata_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if tracked fields changed
  IF (OLD.title IS DISTINCT FROM NEW.title) OR
     (OLD.artist IS DISTINCT FROM NEW.artist) OR
     (OLD.album IS DISTINCT FROM NEW.album) OR
     (OLD.isrc IS DISTINCT FROM NEW.isrc) OR
     (OLD.genre IS DISTINCT FROM NEW.genre) OR
     (OLD.year IS DISTINCT FROM NEW.year) THEN
    NEW.metadata_last_updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_metadata_update_trigger
  BEFORE UPDATE ON tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_metadata_timestamp();