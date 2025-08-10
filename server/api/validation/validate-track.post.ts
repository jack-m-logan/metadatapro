import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const { trackId } = await readBody(event)
    
    if (!trackId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing trackId'
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
      .single()
    
    if (trackError || !track) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Track not found'
      })
    }
    
    const issues = []
    let validationScore = 100
    
    if (!track.title) {
      issues.push({
        id: 'missing-title',
        severity: 'warning',
        title: 'Missing Track Title',
        description: 'No title was found in the metadata',
        suggestion: 'Add a title to your track metadata before distribution'
      })
      validationScore -= 15
    }
    
    if (!track.artist) {
      issues.push({
        id: 'missing-artist',
        severity: 'warning', 
        title: 'Missing Artist Name',
        description: 'No artist name was found in the metadata',
        suggestion: 'Add artist information to your track metadata'
      })
      validationScore -= 15
    }
    
    if (!track.isrc) {
      issues.push({
        id: 'missing-isrc',
        severity: 'info',
        title: 'Missing ISRC Code',
        description: 'No ISRC code found - this is required for royalty collection',
        suggestion: 'Generate an ISRC code for this track before distribution'
      })
      validationScore -= 10
    }
    
    if (track.sample_rate && track.sample_rate < 44100) {
      issues.push({
        id: 'low-sample-rate',
        severity: 'warning',
        title: 'Low Sample Rate',
        description: `Sample rate is ${track.sample_rate}Hz - most platforms prefer 44.1kHz or higher`,
        suggestion: 'Consider re-encoding at 44.1kHz or 48kHz for better compatibility'
      })
      validationScore -= 20
    }
    
    if (track.duration_seconds && track.duration_seconds < 30) {
      issues.push({
        id: 'short-duration',
        severity: 'warning',
        title: 'Short Track Duration',
        description: `Track is only ${track.duration_seconds} seconds - some platforms have minimum duration requirements`,
        suggestion: 'Ensure your track meets platform minimum duration requirements'
      })
      validationScore -= 10
    }
    
    validationScore = Math.max(0, validationScore)
    
    await supabase
      .from('tracks')
      .update({
        validation_status: 'completed',
        validation_score: validationScore,
        has_critical_issues: issues.some(i => i.severity === 'critical'),
        has_warnings: issues.some(i => i.severity === 'warning')
      })
      .eq('id', trackId)
    
    if (issues.length > 0) {
      const issueRecords = issues.map(issue => ({
        track_id: trackId,
        issue_type: issue.id.split('-')[0],
        issue_code: issue.id.toUpperCase().replace('-', '_'),
        severity: issue.severity,
        title: issue.title,
        description: issue.description,
        suggestion: issue.suggestion || null
      }))
      
      await supabase
        .from('validation_issues')
        .insert(issueRecords)
    }
    
    return {
      success: true,
      track,
      validationScore,
      issues,
      metadata: track.original_metadata
    }
    
  } catch (error) {
    console.error('Validation error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Validation failed: ${error.message}`
    })
  }
})