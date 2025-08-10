export const useFileUpload = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  
  const validateAudioFile = (file: File) => {
    const allowedTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/flac',
      'audio/mp4',
      'audio/x-m4a',
      'audio/aac'
    ]
    
    const maxSize = 50 * 1024 * 1024 // 50MB
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type: ${file.type}. Please upload MP3, WAV, FLAC, or M4A files.`)
    }
    
    if (file.size > maxSize) {
      throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum size is 50MB.`)
    }
    
    if (file.size === 0) {
      throw new Error('File appears to be empty.')
    }
    
    return true
  }
  
const ensureUserProfile = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', userId)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      console.error('User profile missing for authenticated user. This suggests the signup trigger failed.')
      throw new Error('User profile not found. Please contact support or try logging out and back in.')
    }
    throw new Error(`Error accessing user profile: ${error.message}`)
  }
  
  return profile
}
  
  const uploadAudioFile = async (file: File) => {
    try {
      isUploading.value = true
      uploadProgress.value = 0
      
      if (!user.value) {
        throw new Error('You must be logged in to upload files')
      }
            
      await ensureUserProfile(user.value.id)
      
      validateAudioFile(file)
      
      // unique file name based on user id and timestamp
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.value.id}/${Date.now()}_${crypto.randomUUID()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }
      
      uploadProgress.value = 50
      
      const { data: trackData, error: trackError } = await supabase
        .from('tracks')
        .insert({
          user_id: user.value.id,
          filename: file.name.replace(/\.[^/.]+$/, ""), // remove file extension
          file_path: uploadData.path,
          file_size: file.size,
          file_format: fileExt,
          validation_status: 'pending'
        })
        .select()
        .single()
      
      if (trackError) {
        console.error('Database error:', trackError)
        // Clean up uploaded file
        await supabase.storage.from('audio-files').remove([uploadData.path])
        throw new Error(`Database error: ${trackError.message}`)
      }
      
      uploadProgress.value = 75
      
      // metadata extraction
      const extractionResult = await $fetch('/api/metadata-extraction/extract-metadata', {
        method: 'POST',
        body: {
          filePath: uploadData.path,
          trackId: trackData.id
        }
      })
      
      if (!extractionResult.success) {
        throw new Error(`Metadata extraction failed: ${extractionResult.error}`)
      }
      
      uploadProgress.value = 100
      
      return {
        success: true,
        track: trackData,
        metadata: extractionResult.metadata
      }
      
    } catch (error) {
      console.error('Upload process error:', error)
      throw error
    } finally {
      isUploading.value = false
    }
  }
  
  return {
    uploadAudioFile,
    isUploading: readonly(isUploading),
    uploadProgress: readonly(uploadProgress),
    validateAudioFile
  }
}