-- Migration: Add VIP user system support
-- Run this migration to add VIP functionality

-- 1. Add VIP support to existing user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS user_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS vip_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS vip_feedback_sessions_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS vip_notes TEXT;

-- Drop existing constraint if it exists, then add new one
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_tier_check;
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_user_tier_check 
    CHECK (user_tier IN ('free', 'pro_artist', 'pro_label', 'pro_venue', 'enterprise', 'vip'));

-- 2. Create VIP applications table
CREATE TABLE public.vip_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    user_type TEXT CHECK (user_type IN ('artist', 'label', 'venue')) NOT NULL,
    
    -- Background information
    experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
    current_tools TEXT, -- e.g. CD Baby, DistroKid, etc.
    monthly_releases INTEGER,
    artist_count INTEGER,
    
    -- Motivation and challenges
    biggest_challenges TEXT,
    why_interested TEXT,
    metadata_pain_points TEXT,
    
    -- Social proof
    music_links JSONB,
    social_links JSONB,
    
    -- Application management
    application_status TEXT CHECK (application_status IN ('pending', 'approved', 'rejected', 'converted_to_user')) DEFAULT 'pending',
    admin_notes TEXT,
    approved_by TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS on VIP applications table
ALTER TABLE public.vip_applications ENABLE ROW LEVEL SECURITY;

-- 4. Add RLS policies for VIP system
CREATE POLICY "Users can view own VIP application" ON public.vip_applications
    FOR SELECT USING (
        auth.uid()::text IN (
            SELECT id::text FROM public.user_profiles WHERE email = vip_applications.email
        )
    );

CREATE POLICY "Users can insert own VIP application" ON public.vip_applications
    FOR INSERT WITH CHECK (
        auth.uid()::text IN (
            SELECT id::text FROM public.user_profiles WHERE email = vip_applications.email
        ) OR auth.uid() IS NULL
    );

-- 5. Add indexes for performance
CREATE INDEX idx_user_profiles_user_tier ON public.user_profiles(user_tier);
CREATE INDEX idx_user_profiles_vip_expires ON public.user_profiles(vip_expires_at);
CREATE INDEX idx_vip_applications_status ON public.vip_applications(application_status);
CREATE INDEX idx_vip_applications_email ON public.vip_applications(email);

-- 6. Add updated_at trigger for vip_applications
CREATE TRIGGER update_vip_applications_updated_at
    BEFORE UPDATE ON public.vip_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();