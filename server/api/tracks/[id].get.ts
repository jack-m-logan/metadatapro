import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const trackId = getRouterParam(event, 'id')
    const userId = getQuery(event).userId
    
    if (!trackId || !userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing trackId or userId'
      })
    }
    
    const config = useRuntimeConfig()
    const supabase = createClient(
      config.public.supabase.url,
      config.supabase.serviceKey
    )
    
    const { data: track, error: trackError } = await supabase
      .from('tracks')
      .select('*')
      .eq('id', trackId)
      .eq('user_id', userId)
      .single()
    
    if (trackError || !track) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Track not found'
      })
    }
    
    const { data: issues, error: issuesError } = await supabase
      .from('validation_issues')
      .select('*')
      .eq('track_id', trackId)
      .order('severity', { ascending: true })
    
    if (issuesError) {
      console.error('Error fetching issues:', issuesError)
    }
    
    const hasChangedSinceValidation = checkIfMetadataChanged(track)
    
    // If there's been a validation, format the results
    let validationResults = null
    if (track.validation_status === 'completed' && track.validation_score !== null) {
      validationResults = {
        success: true,
        track,
        validationScore: track.validation_score,
        validationStatus: track.validation_status,
        validatedAt: track.processing_completed_at,
        issues: issues || [],
        metadata: track.original_metadata,
        hasChangedSinceValidation,
        // current metadata state for comparison
        currentMetadata: {
          title: track.title,
          artist: track.artist,
          album: track.album,
          isrc: track.isrc,
          genre: track.genre,
          year: track.year
        }
      }
    }
    
    return {
      success: true,
      track,
      issues: issues || [],
      validationResults,
      hasChangedSinceValidation
    }
    
  } catch (error) {
    console.error('Track fetch error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch track: ${error.message}`
    })
  }
})

// Helper function to detect metadata changes since last validation
function checkIfMetadataChanged(track: unknown): boolean {
  // If never validated, no comparison possible
  if (track.validation_status !== 'completed' || !track.validation_results) {
    return false
  }
  
  const validatedMetadata = track.validation_results?.currentMetadata || {}
  
  const currentFields = {
    title: track.title,
    artist: track.artist,
    album: track.album,
    isrc: track.isrc,
    genre: track.genre,
    year: track.year
  }
  
  // Compare current fields with validated metadata snapshot
  return Object.entries(currentFields).some(([key, value]) => {
    const validated = validatedMetadata[key]
    // Normalize empty strings and null values
    const normalizedCurrent = value || null
    const normalizedValidated = validated || null
    return normalizedCurrent !== normalizedValidated
  })
}