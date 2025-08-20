-- Migration: Add async processing support for metadata extraction
-- Adds fields to track processing progress and status for background jobs

-- Add new processing status field that's separate from validation status
ALTER TABLE public.tracks 
ADD COLUMN processing_status TEXT CHECK (processing_status IN ('pending', 'uploading', 'extracting', 'completed', 'failed')) DEFAULT 'pending',
ADD COLUMN processing_progress INTEGER CHECK (processing_progress >= 0 AND processing_progress <= 100) DEFAULT 0,
ADD COLUMN processing_stage TEXT, -- Human-readable processing stage description
ADD COLUMN processing_job_id TEXT; -- Optional: track external job ID

-- Add index for efficient querying of processing status
CREATE INDEX IF NOT EXISTS idx_tracks_processing_status ON public.tracks(processing_status);
CREATE INDEX IF NOT EXISTS idx_tracks_user_processing ON public.tracks(user_id, processing_status);

-- Add comment for clarity
COMMENT ON COLUMN public.tracks.processing_status IS 'Tracks the metadata extraction process status';
COMMENT ON COLUMN public.tracks.processing_progress IS 'Progress percentage (0-100) of metadata extraction';
COMMENT ON COLUMN public.tracks.processing_stage IS 'Human-readable description of current processing stage';