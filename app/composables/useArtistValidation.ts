export const useArtistValidation = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  const isLoading = ref(false)
  const verifiedArtists = ref<string[]>([])
  
  const getVerifiedArtistNames = async (userId?: string) => {
    const targetUserId = userId || user.value?.id
    if (!targetUserId) return []

    try {
        const { data, error } = await supabase
        .from('artist_name_verifications')
        .select('artist_name, is_primary')
        .eq('user_id', targetUserId)
        .eq('status', 'active')
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true })
        
        if (error) throw error
        
        const names = data?.map(v => v.artist_name) || []
        verifiedArtists.value = names
        return names
    } catch (error) {
        console.error('Error fetching verified artists:', error)
        return []
    }
}

const getVerifiedArtistsWithDetails = async (userId?: string) => {
  const targetUserId = userId || user.value?.id
  if (!targetUserId) return []
  
  try {
    const { data, error } = await supabase
      .from('artist_name_verifications')
      .select('artist_name, is_primary')
      .eq('user_id', targetUserId)
      .eq('status', 'active')
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true })
    
    if (error) throw error
    
    return (data || []).map(item => ({
      name: item.artist_name,
      isPrimary: item.is_primary || false
    }))
  } catch (error) {
    console.error('Error fetching verified artists with details:', error)
    return []
  }
}
  const validateArtistPermission = async (artistName: string, userTier: string = 'artist') => {
    if (!artistName?.trim()) {
      return { allowed: true, reason: null }
    }
    
    // Label and venue tiers can manage any artist
    if (userTier === 'label' || userTier === 'venue') {
      return { allowed: true, reason: null }
    }
    
    // check verification on artist tier
    if (userTier === 'artist') {
      const verified = await getVerifiedArtistNames()
      const isVerified = verified.some(name => 
        name.toLowerCase().trim() === artistName.toLowerCase().trim()
      )
      
      if (!isVerified) {
        return { 
          allowed: false, 
          reason: 'Artist name not verified. Add as alias or upgrade to Label tier.',
          requiresVerification: true
        }
      }
    }
    
    return { allowed: true, reason: null }
  }
  
const addArtistAlias = async (artistName: string, verificationEvidence?: string) => {
  if (!user.value || !artistName?.trim()) {
    throw new Error('Missing user or artist name')
  }
  
  isLoading.value = true
  
  try {
    // Check if already exists - use maybeSingle() to avoid error when no rows found
    const { data: existing, error: existingError } = await supabase
      .from('artist_name_verifications')
      .select('id')
      .eq('user_id', user.value.id)
      .eq('artist_name', artistName.trim())
      .eq('status', 'active')
      .maybeSingle()
    
    if (existingError) throw existingError
    
    if (existing) {
      throw new Error('Artist name already verified')
    }
    
    const { data, error } = await supabase
      .from('artist_name_verifications')
      .insert({
        user_id: user.value.id,
        artist_name: artistName.trim(),
        verification_method: verificationEvidence ? 'social_media' : 'self_declared',
        verification_evidence: verificationEvidence,
        status: 'active'
      })
      .select()
      .single()
    
    if (error) throw error
    
    await getVerifiedArtistNames()
    
    return data
  } catch (error) {
    console.error('Error adding artist alias:', error)
    throw error
  } finally {
    isLoading.value = false
  }
}
  
const removeArtistAlias = async (artistName: string) => {
  if (!user.value) throw new Error('User not authenticated')
  
  isLoading.value = true
  
  try {
    // check if this is the primary artist
    const { data: verification, error: checkError } = await supabase
      .from('artist_name_verifications')
      .select('is_primary')
      .eq('user_id', user.value.id)
      .eq('artist_name', artistName)
      .eq('status', 'active')
      .single()
    
    if (checkError) throw checkError
    
    if (verification?.is_primary) {
      throw new Error('Cannot remove primary artist. Please set another artist as primary first.')
    }
    
    const { error } = await supabase
      .from('artist_name_verifications')
      .update({ 
        status: 'deactivated',
        deactivated_at: new Date().toISOString()
      })
      .eq('user_id', user.value.id)
      .eq('artist_name', artistName)
      .eq('status', 'active')
    
    if (error) throw error
    
    await getVerifiedArtistNames()
  } catch (error) {
    console.error('Error removing artist alias:', error)
    throw error
  } finally {
    isLoading.value = false
  }
}
  
  const setPrimaryArtist = async (artistName: string) => {
    if (!user.value) throw new Error('User not authenticated')
    
    try {
      const verified = await getVerifiedArtistNames()
      
      if (!verified.includes(artistName)) {
        throw new Error('Artist must be verified first')
      }
      
      // Update all verifications to not primary
      await supabase
        .from('artist_name_verifications')
        .update({ is_primary: false })
        .eq('user_id', user.value.id)
        .eq('status', 'active')
      
      // Set the new primary
      const { error } = await supabase
        .from('artist_name_verifications')
        .update({ is_primary: true })
        .eq('user_id', user.value.id)
        .eq('artist_name', artistName)
        .eq('status', 'active')
      
      if (error) throw error
      
      // Update profile
      await supabase
        .from('user_profiles')
        .update({ primary_artist_name: artistName })
        .eq('id', user.value.id)
      
    } catch (error) {
      console.error('Error setting primary artist:', error)
      throw error
    }
  }
  
  // Detect patterns that suggest label behavior
  const analyzeUploadPattern = async () => {
    if (!user.value) return { multiArtistBehavior: false, uniqueArtists: 0, shouldUpgrade: false }
    
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: tracks, error: tracksError } = await supabase
        .from('tracks')
        .select('artist, original_metadata')
        .eq('user_id', user.value.id)
        .gte('created_at', thirtyDaysAgo.toISOString())

      if (tracksError) throw tracksError
      if (!tracks?.length) return { multiArtistBehavior: false, uniqueArtists: 0, shouldUpgrade: false }
      
      const artistNames = new Set<string>()
      
      tracks.forEach(track => {
        if (track.artist?.trim()) {
          artistNames.add(track.artist.toLowerCase().trim())
        }
        if (track.original_metadata?.artist?.trim()) {
          artistNames.add(track.original_metadata.artist.toLowerCase().trim())
        }
      })
      
      const uniqueArtists = Array.from(artistNames).filter(name => name.length > 0)
      const verified = await getVerifiedArtistNames()
      const verifiedLower = verified.map(name => name.toLowerCase().trim())
      
      const unverifiedArtists = uniqueArtists.filter(artist => 
        !verifiedLower.includes(artist)
      )
      
      const multiArtistBehavior = unverifiedArtists.length >= 3
      const shouldUpgrade = multiArtistBehavior
      
      return {
        multiArtistBehavior,
        uniqueArtists: uniqueArtists.length,
        unverifiedCount: unverifiedArtists.length,
        shouldUpgrade
      }
    } catch (err) {
      console.error('Error analyzing upload pattern:', err)
      return { multiArtistBehavior: false, uniqueArtists: 0, shouldUpgrade: false }
    }
  }
  
  onMounted(() => {
    if (user.value) {
      getVerifiedArtistNames()
    }
  })
  
  watch(user, (newUser) => {
    if (newUser) {
      getVerifiedArtistNames()
    } else {
      verifiedArtists.value = []
    }
  })
  
  return {
    isLoading: readonly(isLoading),
    verifiedArtists: readonly(verifiedArtists),
    getVerifiedArtistNames,
    getVerifiedArtistsWithDetails,
    validateArtistPermission,
    addArtistAlias,
    removeArtistAlias,
    setPrimaryArtist,
    analyzeUploadPattern
  }
}