-- Add artist validation fields to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS primary_artist_name TEXT,
ADD COLUMN IF NOT EXISTS verified_artist_names JSONB DEFAULT '[]'::jsonb;

-- Create artist_name_verifications table for audit trail
CREATE TABLE IF NOT EXISTS public.artist_name_verifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Verification details
    artist_name TEXT NOT NULL,
    verification_method TEXT CHECK (verification_method IN ('self_declared', 'social_media', 'streaming_profile', 'manual_review')) DEFAULT 'self_declared',
    verification_evidence TEXT, -- URLs, notes, etc.
    
    -- Status tracking
    status TEXT CHECK (status IN ('active', 'deactivated', 'pending', 'rejected')) DEFAULT 'active',
    is_primary BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deactivated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_artist_verifications_user_id ON public.artist_name_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_artist_verifications_artist_name ON public.artist_name_verifications(artist_name);
CREATE INDEX IF NOT EXISTS idx_artist_verifications_status ON public.artist_name_verifications(status);

-- RLS Policies for artist_name_verifications
ALTER TABLE public.artist_name_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own artist verifications" ON public.artist_name_verifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own artist verifications" ON public.artist_name_verifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own artist verifications" ON public.artist_name_verifications
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Update trigger for artist_name_verifications
CREATE TRIGGER update_artist_verifications_updated_at
    BEFORE UPDATE ON public.artist_name_verifications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to sync verified_artist_names JSONB field
CREATE OR REPLACE FUNCTION public.sync_verified_artist_names()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the JSONB array in user_profiles when verifications change
    UPDATE public.user_profiles 
    SET verified_artist_names = (
        SELECT COALESCE(jsonb_agg(artist_name), '[]'::jsonb)
        FROM public.artist_name_verifications 
        WHERE user_id = NEW.user_id AND status = 'active'
    )
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to keep JSONB field in sync
CREATE TRIGGER sync_verified_artist_names_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.artist_name_verifications
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_verified_artist_names();

-- Migrate existing data (set primary artist name from current artist_name)
UPDATE public.user_profiles 
SET primary_artist_name = artist_name 
WHERE primary_artist_name IS NULL AND artist_name IS NOT NULL;

-- Insert initial verification records for existing users
INSERT INTO public.artist_name_verifications (user_id, artist_name, is_primary, verification_method)
SELECT id, artist_name, true, 'self_declared'
FROM public.user_profiles 
WHERE artist_name IS NOT NULL 
AND NOT EXISTS (
    SELECT 1 FROM public.artist_name_verifications 
    WHERE user_id = public.user_profiles.id AND artist_name = public.user_profiles.artist_name
);