import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const trackId = getRouterParam(event, 'id')
    const config = useRuntimeConfig()
    
    if (!trackId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Track ID is required'
      })
    }

    if (!config.public.supabase?.url || !config.supabase?.serviceKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Supabase configuration missing'
      })
    }

    const supabase = createClient(
      config.public.supabase.url,
      config.supabase.serviceKey
    )

    const body = await readBody(event).catch(() => ({}))
    const userId = body.userId || getQuery(event).userId

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    const { data: track, error: trackError } = await supabase
      .from('tracks')
      .select('*')
      .eq('id', trackId)
      .eq('user_id', userId)
      .single()

    if (trackError || !track) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Track not found or access denied'
      })
    }

    let issues = []

    if (track.validation_status === 'completed') {
      const { data: validationIssues, error: issuesError } = await supabase
        .from('validation_issues')
        .select('*')
        .eq('track_id', trackId)
        .order('severity', { ascending: false })

      if (issuesError) {
        console.error('Issues fetch error:', issuesError)
      } else {
        issues = validationIssues || []
      }
    }

    return {
      success: true,
      track,
      issues,
      validationResults: track.validation_status === 'completed' ? {
        success: true,
        validationScore: track.validation_score,
        track,
        metadata: track.original_metadata,
        issues
      } : null
    }

  } catch (error) {
    console.error('Error fetching track:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch track data: ${error.message}`
    })
  }
})