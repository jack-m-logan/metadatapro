-- Migration: Initial Schema and User Profile Trigger
-- This migration creates all the core tables and the user profile auto-creation trigger

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USER PROFILES TABLE
-- =============================================
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    user_type TEXT CHECK (user_type IN ('artist', 'venue', 'label')) DEFAULT 'artist',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Artist specific fields
    artist_name TEXT,
    sgae_member_id TEXT,
    aie_member_id TEXT,
    agedi_member_id TEXT
);

-- =============================================
-- TRACKS TABLE
-- =============================================
CREATE TABLE public.tracks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- File information
    filename TEXT NOT NULL,
    file_path TEXT, -- Supabase Storage path
    file_size BIGINT, -- in bytes
    file_format TEXT, -- 'mp3', 'wav', 'flac', etc.
    
    -- Extracted metadata
    original_metadata JSONB, -- Raw metadata from file
    title TEXT,
    artist TEXT,
    album TEXT,
    genre TEXT,
    year INTEGER,
    track_number INTEGER,
    isrc TEXT UNIQUE, -- Added UNIQUE constraint for ISRC
    duration_seconds NUMERIC(8,3), -- From audio file
    metadata_duration_seconds NUMERIC(8,3), -- From ID3 tags
    
    -- Phase 1: Critical metadata fields for Spanish PRO registration
    songwriter_credits JSONB, -- Array of {name, role, percentage, ipi_number}
    performer_credits JSONB, -- Array of {name, role, instruments, is_featured}
    iswc_code TEXT, -- International Standard Musical Work Code
    explicit_content BOOLEAN DEFAULT FALSE,
    language_code TEXT, -- ISO 639-1 code (es, en, fr, etc.)
    original_release_date DATE,
    
    -- Basic technical metadata for validation
    sample_rate INTEGER, -- e.g., 44100, 48000, 96000
    bit_depth INTEGER, -- e.g., 16, 24
    bitrate INTEGER, -- For compressed formats
    channels INTEGER, -- 1 = mono, 2 = stereo, etc.
    
    -- Validation status and results
    validation_status TEXT CHECK (validation_status IN ('pending', 'processing', 'completed', 'error', 'failed')) DEFAULT 'pending',
    validation_score INTEGER CHECK (validation_score >= 0 AND validation_score <= 100), -- Added 0-100 check
    validation_results JSONB, -- Detailed validation results
    has_critical_issues BOOLEAN DEFAULT FALSE,
    has_warnings BOOLEAN DEFAULT FALSE,
    
    -- Processing metadata
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- VALIDATION ISSUES TABLE
-- =============================================
CREATE TABLE public.validation_issues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE NOT NULL,
    
    -- Issue classification
    issue_type TEXT NOT NULL, -- 'isrc', 'duration', 'artwork', 'credits', 'format'
    issue_code TEXT NOT NULL, -- 'INVALID_ISRC_FORMAT', 'DURATION_MISMATCH', etc.
    severity TEXT CHECK (severity IN ('critical', 'warning', 'info')) NOT NULL,
    
    -- Issue description
    title TEXT NOT NULL, -- Short description
    description TEXT NOT NULL, -- Detailed explanation
    suggestion TEXT, -- How to fix it
    
    -- Fix tracking
    fixed BOOLEAN DEFAULT FALSE,
    fixed_at TIMESTAMP WITH TIME ZONE,
    
    -- For ordering and grouping
    category TEXT, -- Group related issues
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ARTWORK TABLE
-- =============================================
CREATE TABLE public.artwork (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE NOT NULL,
    
    -- File information
    file_path TEXT, -- Supabase Storage path
    file_size BIGINT,
    format TEXT, -- 'jpg', 'png', etc.
    width INTEGER,
    height INTEGER,
    
    -- Validation
    meets_requirements BOOLEAN DEFAULT FALSE,
    issues JSONB, -- Specific artwork issues
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- VALIDATION REPORTS TABLE
-- =============================================
CREATE TABLE public.validation_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Report details
    report_type TEXT CHECK (report_type IN ('basic', 'detailed', 'distributor_specific')) DEFAULT 'basic',
    distributor TEXT, -- 'distrokid', 'cdbaby', 'general', etc.
    
    -- Generated files
    pdf_path TEXT, -- Supabase Storage path to PDF
    json_data JSONB, -- Raw data used for report
    
    -- Tracking
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    downloaded_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER DEFAULT 0
);

-- =============================================
-- USAGE TRACKING TABLE
-- =============================================
CREATE TABLE public.usage_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Action tracking
    action_type TEXT NOT NULL, -- 'track_uploaded', 'validation_completed', 'report_generated'
    track_id UUID REFERENCES public.tracks(id) ON DELETE SET NULL,
    
    -- Billing related
    billable BOOLEAN DEFAULT FALSE,
    cost_cents INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artwork ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- User profiles - users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Tracks - users can only access their own tracks
CREATE POLICY "Users can view own tracks" ON public.tracks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tracks" ON public.tracks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tracks" ON public.tracks
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tracks" ON public.tracks
    FOR DELETE USING (auth.uid() = user_id);

-- Validation issues - users can only see issues for their tracks
CREATE POLICY "Users can view issues for own tracks" ON public.validation_issues
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tracks 
            WHERE tracks.id = validation_issues.track_id 
            AND tracks.user_id = auth.uid()
        )
    );

-- Similar policies for artwork, reports, and usage tracking
CREATE POLICY "Users can view artwork for own tracks" ON public.artwork
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tracks 
            WHERE tracks.id = artwork.track_id 
            AND tracks.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own reports" ON public.validation_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage" ON public.usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- User profiles
CREATE INDEX idx_user_profiles_user_type ON public.user_profiles(user_type);

-- Tracks
CREATE INDEX idx_tracks_user_id ON public.tracks(user_id);
CREATE INDEX idx_tracks_validation_status ON public.tracks(validation_status);
CREATE INDEX idx_tracks_created_at ON public.tracks(created_at DESC);
CREATE INDEX idx_tracks_has_critical_issues ON public.tracks(has_critical_issues);

-- Indexes for the new Phase 1 fields
CREATE INDEX idx_tracks_iswc ON public.tracks(iswc_code);
CREATE INDEX idx_tracks_language ON public.tracks(language_code);
CREATE INDEX idx_tracks_explicit ON public.tracks(explicit_content);
CREATE INDEX idx_tracks_sample_rate ON public.tracks(sample_rate);

-- GIN indexes for Phase 1 JSONB fields
CREATE INDEX idx_tracks_songwriter_credits_gin ON public.tracks USING GIN (songwriter_credits);
CREATE INDEX idx_tracks_performer_credits_gin ON public.tracks USING GIN (performer_credits);

-- Validation issues
CREATE INDEX idx_validation_issues_track_id ON public.validation_issues(track_id);
CREATE INDEX idx_validation_issues_severity ON public.validation_issues(severity);
CREATE INDEX idx_validation_issues_issue_type ON public.validation_issues(issue_type);

-- Validation reports
CREATE INDEX idx_validation_reports_track_id ON public.validation_reports(track_id);
CREATE INDEX idx_validation_reports_user_id ON public.validation_reports(user_id);

-- Usage tracking
CREATE INDEX idx_usage_tracking_user_id ON public.usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_created_at ON public.usage_tracking(created_at DESC);
CREATE INDEX idx_usage_tracking_action_type ON public.usage_tracking(action_type);

-- GIN indexes for JSONB columns
CREATE INDEX idx_tracks_original_metadata_gin ON public.tracks USING GIN (original_metadata);
CREATE INDEX idx_tracks_validation_results_gin ON public.tracks USING GIN (validation_results);
CREATE INDEX idx_artwork_issues_gin ON public.artwork USING GIN (issues);
CREATE INDEX idx_validation_reports_json_data_gin ON public.validation_reports USING GIN (json_data);
CREATE INDEX idx_usage_tracking_metadata_gin ON public.usage_tracking USING GIN (metadata);

-- =============================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =============================================

-- Function to update user profile updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at timestamps
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_tracks_updated_at
    BEFORE UPDATE ON public.tracks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Additional triggers for consistency
CREATE TRIGGER update_validation_issues_updated_at
    BEFORE UPDATE ON public.validation_issues
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_artwork_updated_at
    BEFORE UPDATE ON public.artwork
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_validation_reports_updated_at
    BEFORE UPDATE ON public.validation_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_usage_tracking_updated_at
    BEFORE UPDATE ON public.usage_tracking
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- USER PROFILE AUTO-CREATION TRIGGER
-- =============================================

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, artist_name, user_type)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'artist_name',
    'artist'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();