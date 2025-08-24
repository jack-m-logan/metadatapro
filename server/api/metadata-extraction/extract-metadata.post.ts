import { createClient } from '@supabase/supabase-js'
import { parseBuffer } from 'music-metadata'

export default defineEventHandler(async (event) => {
  try {
    const { filePath, trackId } = await readBody(event)
    
    if (!filePath || !trackId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing filePath or trackId'
      })
    }
    
    const config = useRuntimeConfig()
    
    if (!config.public.supabase?.url || !config.supabase?.serviceKey) {
      console.error('Supabase config missing:', {
        url: !!config.public.supabase?.url,
        serviceKey: !!config.supabase?.serviceKey
      })
      throw createError({
        statusCode: 500,
        statusMessage: 'Supabase configuration missing'
      })
    }
    
    const supabase = createClient(
      config.public.supabase.url,
      config.supabase.serviceKey
    )
    
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('audio-files')
      .download(filePath)
    
    if (downloadError || !fileData) {
      throw createError({
        statusCode: 404,
        statusMessage: `File not found: ${downloadError?.message || 'Unknown error'}`
      })
    }
    
    // Convert blob to buffer for music-metadata
    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const metadata = await parseBuffer(buffer, {
      duration: true,
      skipCovers: false, // We want artwork info
      skipPostHeaders: true // Skip unnecessary data for performance
    })

    const extractedMetadata = {
      // Basic track info
      title: metadata.common.title || null,
      artist: metadata.common.artist || null,
      album: metadata.common.album || null,
      albumartist: metadata.common.albumartist || null,
      
      // Track details
      track_number: metadata.common.track?.no || null,
      total_tracks: metadata.common.track?.of || null,
      disc_number: metadata.common.disk?.no || null,
      
      // Timing
      duration: metadata.format.duration ? Math.round(metadata.format.duration) : null,
      year: metadata.common.year || null,
      date: metadata.common.date || null,
      
      // Identifiers
      isrc: metadata.common.isrc || null,
      musicbrainz_trackid: metadata.common.musicbrainz_trackid || null,
      
      // Genre and mood
      genre: metadata.common.genre?.[0] || null,
      genres: metadata.common.genre || [],
      
      // Credits (from ID3 tags if available)
      composer: metadata.common.composer?.[0] || null,
      lyricist: metadata.common.lyricist?.[0] || null,
      
      // Technical specs
      sample_rate: metadata.format.sampleRate || null,
      bit_depth: metadata.format.bitsPerSample || null,
      bitrate: metadata.format.bitrate ? Math.round(metadata.format.bitrate) : null,
      codec: metadata.format.codec || null,
      container: metadata.format.container || null,
      lossless: metadata.format.lossless || false,
      channels: metadata.format.numberOfChannels || null,
      
      // File info
      file_size: buffer.length,
      
      // Artwork info
      has_artwork: metadata.common.picture && metadata.common.picture.length > 0,
      artwork_count: metadata.common.picture?.length || 0,
      
      // Raw metadata for debugging (limit size)
      raw_common: JSON.stringify(metadata.common).slice(0, 2000),
      raw_format: JSON.stringify(metadata.format).slice(0, 1000)
    }

    const { error: updateError } = await supabase
      .from('tracks')
      .update({ 
        original_metadata: extractedMetadata,
        validation_status: 'pending', // metadata extracted, ready for validation
        duration_seconds: extractedMetadata.duration,
        metadata_duration_seconds: extractedMetadata.duration,
        title: extractedMetadata.title || null,
        artist: extractedMetadata.artist || null,
        album: extractedMetadata.album || null,
        genre: extractedMetadata.genre || null,
        year: extractedMetadata.year || null,
        track_number: extractedMetadata.track_number || null,
        isrc: extractedMetadata.isrc || null,
        sample_rate: extractedMetadata.sample_rate || null,
        bit_depth: extractedMetadata.bit_depth || null,
        bitrate: extractedMetadata.bitrate || null,
        channels: extractedMetadata.channels || null,
        processing_completed_at: new Date().toISOString()
      })
      .eq('id', trackId)
      
    if (updateError) {
      console.error('Database update error:', updateError)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to save metadata: ${updateError.message}`
      })
    }
    
    return { 
      success: true, 
      metadata: extractedMetadata,
      trackId 
    }
    
  } catch (error) {
    console.error('Metadata extraction error:', error)
    
    if (error.statusCode) {
      throw error // Re-throw HTTP errors
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Metadata extraction failed: ${error.message}`
    })
  }
})