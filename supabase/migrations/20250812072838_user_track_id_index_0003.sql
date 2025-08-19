CREATE INDEX IF NOT EXISTS idx_tracks_user_id_created_at 
ON public.tracks(user_id, created_at DESC);