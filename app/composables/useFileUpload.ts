export const useFileUpload = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const uploadState = ref('idle') // 'idle', 'uploading', 'processing', 'retrying', 'error', 'success'
  const currentStep = ref('')
  const retryCount = ref(0)
  const lastError = ref(null)
  const canRetry = ref(false)

  const checkNetworkConnectivity = async () => {
    try {
      const response = await fetch('/api/system/health-check', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      })
      return response.ok
    } catch {
      return false
    }
  }

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
    const minSize = 1024 // 1KB minimum

    if (!allowedTypes.includes(file.type)) {
      const supportedFormats = 'MP3, WAV, FLAC, M4A, or AAC'
      const error = new Error(`Unsupported file format: ${file.type || 'unknown'}`)
      error.type = 'INVALID_FORMAT'
      error.suggestion = `Please convert your file to one of these supported formats: ${supportedFormats}`
      error.canRetry = false
      throw error
    }

    if (file.size > maxSize) {
      const currentSizeMB = (file.size / 1024 / 1024).toFixed(1)
      const error = new Error(`File is too large: ${currentSizeMB}MB`)
      error.type = 'FILE_TOO_LARGE'
      error.suggestion = 'Please compress your audio file or choose a file smaller than 50MB'
      error.canRetry = false
      throw error
    }

    if (file.size < minSize) {
      const error = new Error('File appears to be empty or corrupted')
      error.type = 'FILE_TOO_SMALL'
      error.suggestion = 'Please check your file and try uploading a different audio file'
      error.canRetry = false
      throw error
    }

    if (file.name.length > 255) {
      const error = new Error('Filename is too long')
      error.type = 'FILENAME_TOO_LONG'
      error.suggestion = 'Please rename your file to be shorter than 255 characters'
      error.canRetry = false
      throw error
    }

    return true
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const retryOperation = async <T>(operation: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> => {
    let lastError: unknown

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error

        if (attempt === maxRetries) {
          throw error
        }

        const shouldRetry = isRetryableError(error)
        if (!shouldRetry) {
          throw error
        }

        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
        retryCount.value = attempt + 1
        uploadState.value = 'retrying'
        currentStep.value = `Retrying in ${Math.ceil(delay / 1000)} seconds... (${attempt + 1}/${maxRetries})`

        await sleep(delay)
      }
    }

    throw lastError
  }

  const isRetryableError = (error: unknown): boolean => {
    const retryablePatterns = [
      'network',
      'timeout',
      'connection',
      'ECONNRESET',
      'ENOTFOUND',
      'ETIMEDOUT',
      'fetch',
      '5'
    ]

    const errorMessage = error?.message?.toLowerCase() || ''
    const errorCode = error?.code || ''
    const httpStatus = error?.status || 0

    // don't retry for client errors except 408 and 429
    if (httpStatus >= 400 && httpStatus < 500 && httpStatus !== 408 && httpStatus !== 429) {
      return false
    }

    return retryablePatterns.some(pattern =>
      errorMessage.includes(pattern) ||
      errorCode.includes(pattern) ||
      (httpStatus >= 500 && httpStatus < 600)
    )
  }

  const ensureUserProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        const enhancedError = new Error('User profile not found')
        enhancedError.type = 'PROFILE_NOT_FOUND'
        enhancedError.suggestion = 'Please try logging out and back in, or contact support if the issue persists'
        enhancedError.canRetry = false
        throw enhancedError
      }
      const enhancedError = new Error('Unable to access your profile')
      enhancedError.type = 'PROFILE_ACCESS_ERROR'
      enhancedError.suggestion = 'Please check your internet connection and try again'
      enhancedError.canRetry = true
      throw enhancedError
    }

    return profile
  }

  const uploadAudioFile = async (file: File) => {
    try {
      isUploading.value = true
      uploadProgress.value = 0
      uploadState.value = 'uploading'
      retryCount.value = 0
      lastError.value = null
      canRetry.value = false

      // Step 1: Authentication check
      currentStep.value = 'Checking authentication...'
      if (!user.value) {
        const error = new Error('You must be logged in to upload files')
        error.type = 'AUTH_REQUIRED'
        error.suggestion = 'Please log in and try again'
        error.canRetry = false
        throw error
      }

      // Step 2: Network connectivity check
      currentStep.value = 'Checking network connection...'
      const isOnline = await checkNetworkConnectivity()
      if (!isOnline) {
        const error = new Error('No internet connection detected')
        error.type = 'NETWORK_ERROR'
        error.suggestion = 'Please check your internet connection and try again'
        error.canRetry = true
        throw error
      }

      // Step 3: User profile verification
      currentStep.value = 'Verifying user profile...'
      await retryOperation(() => ensureUserProfile(user.value.id))

      // Step 4: File validation
      currentStep.value = 'Validating file...'
      validateAudioFile(file)

      uploadProgress.value = 10

      // Step 5: File upload with retry
      currentStep.value = 'Uploading file...'
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.value.id}/${Date.now()}_${crypto.randomUUID()}.${fileExt}`

      const { data: uploadData } = await retryOperation(async () => {
        const result = await supabase.storage
          .from('audio-files')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (result.error) {
          const enhancedError = new Error('File upload failed')
          enhancedError.type = 'UPLOAD_FAILED'
          enhancedError.suggestion = getUploadErrorSuggestion(result.error)
          enhancedError.canRetry = isRetryableError(result.error)
          enhancedError.originalError = result.error
          throw enhancedError
        }

        return result
      })

      uploadProgress.value = 50

      // Step 6: Database record creation with cleanup on failure
      currentStep.value = 'Creating database record...'
      const { data: trackData } = await retryOperation(async () => {
        const result = await supabase
          .from('tracks')
          .insert({
            user_id: user.value.id,
            filename: file.name.replace(/\.[^/.]+$/, ""),
            file_path: uploadData.path,
            file_size: file.size,
            file_format: fileExt,
            validation_status: 'pending'
          })
          .select()
          .single()

        if (result.error) {
          try {
            await supabase.storage.from('audio-files').remove([uploadData.path])
          } catch (cleanupError) {
            console.warn('Failed to cleanup uploaded file:', cleanupError)
          }

          const enhancedError = new Error('Failed to save track information')
          enhancedError.type = 'DATABASE_ERROR'
          enhancedError.suggestion = 'This might be a temporary issue. Please try again'
          enhancedError.canRetry = true
          enhancedError.originalError = result.error
          throw enhancedError
        }

        return result
      })

      uploadProgress.value = 75

      // Step 7: Metadata extraction with graceful degradation
      currentStep.value = 'Extracting metadata...'
      uploadState.value = 'processing'

      let extractionResult
      try {
        extractionResult = await retryOperation(async () => {
          const result = await $fetch('/api/metadata-extraction/extract-metadata', {
            method: 'POST',
            body: {
              filePath: uploadData.path,
              trackId: trackData.id
            }
          })

          if (!result.success) {
            const enhancedError = new Error('Failed to extract metadata')
            enhancedError.type = 'METADATA_EXTRACTION_FAILED'
            enhancedError.suggestion = 'Your file was uploaded successfully, but metadata extraction failed. You can add metadata manually'
            enhancedError.canRetry = true
            enhancedError.originalError = result.error
            throw enhancedError
          }

          return result
        })
      } catch (metadataError) {
        // Graceful degradation - file uploaded successfully but metadata failed
        console.warn('Metadata extraction failed, but file upload succeeded:', metadataError)

        uploadProgress.value = 100
        uploadState.value = 'success'

        return {
          success: true,
          track: trackData,
          metadata: null,
          warning: 'File uploaded successfully, but metadata extraction failed. You can add metadata manually.'
        }
      }

      uploadProgress.value = 100
      uploadState.value = 'success'
      currentStep.value = 'Upload completed successfully!'

      return {
        success: true,
        track: trackData,
        metadata: extractionResult.metadata
      }

    } catch (error) {
      console.error('=== TEST === Upload failed raw object:', JSON.stringify(error, null, 2))

      console.error('Upload process error:', error)

      let enhancedError = error

      // generic errors
      if (typeof error === 'string') {
        enhancedError = {
          type: 'UNKNOWN_ERROR',
          message: error,
          suggestion: 'Please try again or contact support if the issue persists',
          canRetry: true
        }
      } else if (error instanceof Error && !error.type) {
        // native Error objects
        enhancedError = {
          type: 'UNKNOWN_ERROR',
          message: error.message,
          suggestion: 'Please try again or contact support if the issue persists',
          canRetry: true,
          originalError: error
        }
      }

      lastError.value = enhancedError
      canRetry.value = enhancedError?.canRetry || isRetryableError(enhancedError)
      uploadState.value = 'error'

      throw enhancedError
    } finally {
      isUploading.value = false
    }
  }

  const getUploadErrorSuggestion = (error: unknown): string => {
    const errorMessage = error?.message?.toLowerCase() || ''

    if (errorMessage.includes('storage')) {
      return 'Storage service is temporarily unavailable. Please try again in a few minutes.'
    }
    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      return 'You may have reached your storage limit. Please contact support or upgrade your plan.'
    }
    if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
      return 'Permission denied. Please try logging out and back in.'
    }
    if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
      return 'Network issue detected. Please check your internet connection and try again.'
    }

    return 'Upload failed due to an unexpected error. Please try again.'
  }

  const retryUpload = async (file: File) => {
    if (!canRetry.value) {
      throw new Error('This operation cannot be retried')
    }

    return uploadAudioFile(file)
  }

  return {
    uploadAudioFile,
    retryUpload,
    isUploading: readonly(isUploading),
    uploadProgress: readonly(uploadProgress),
    uploadState: readonly(uploadState),
    currentStep: readonly(currentStep),
    retryCount: readonly(retryCount),
    lastError: readonly(lastError),
    canRetry: readonly(canRetry),
    validateAudioFile,
    checkNetworkConnectivity
  }
}