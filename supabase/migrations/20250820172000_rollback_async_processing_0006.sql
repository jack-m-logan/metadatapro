-- Rollback: Remove async processing support for metadata extraction
-- This migration removes the async processing fields added in 20250820171600_async_processing.sql

-- Remove indexes first
DROP INDEX IF EXISTS idx_tracks_processing_status;
DROP INDEX IF EXISTS idx_tracks_user_processing;

-- Remove the added columns
ALTER TABLE public.tracks 
DROP COLUMN IF EXISTS processing_status,
DROP COLUMN IF EXISTS processing_progress,
DROP COLUMN IF EXISTS processing_stage,
DROP COLUMN IF EXISTS processing_job_id;