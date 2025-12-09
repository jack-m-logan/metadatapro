<template>
  <div class="file-upload-container">
    <div
      v-if="!isUploading && !uploadComplete"
      class="upload-area"
      :class="{ 'drag-over': isDragOver }"
      @drop="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @click="triggerFileInput"
    >
      <div class="upload-content">
        <div class="upload-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line
              x1="12"
              y1="15"
              x2="12"
              y2="3"
            />
          </svg>
        </div>
        <h3>Upload Your Audio File</h3>
        <p>Drag & drop your track here, or click to browse</p>
        <p class="file-info">
          Supports MP3, WAV, FLAC, M4A • Max 50MB
        </p>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="audio/*"
        style="display: none"
        @change="handleFileSelect"
      >
    </div>

    <div
      v-if="isUploading"
      class="upload-progress"
    >
      <div class="progress-header">
        <h3>
          <span v-if="uploadState === 'uploading'">Processing Your Track</span>
          <span v-else-if="uploadState === 'retrying'">Retrying Upload</span>
          <span v-else-if="uploadState === 'processing'">Processing Metadata</span>
          <span v-else>Processing Your Track</span>
        </h3>
        <span class="progress-percent">{{ uploadProgress }}%</span>
      </div>

      <div
        v-if="currentStep"
        class="current-step"
      >
        <span class="step-text">{{ currentStep }}</span>
        <span
          v-if="retryCount > 0"
          class="retry-indicator"
        >
          (Retry {{ retryCount }})
        </span>
      </div>

      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: uploadProgress + '%' }"
          :class="{ 'progress-retrying': uploadState === 'retrying' }"
        />
      </div>

      <div class="progress-steps">
        <div
          class="step"
          :class="{
            active: uploadProgress >= 25,
            retrying: uploadState === 'retrying' && uploadProgress < 25
          }"
        >
          <span class="step-icon">📁</span>
          <span>Uploading file</span>
        </div>
        <div
          class="step"
          :class="{
            active: uploadProgress >= 50,
            retrying: uploadState === 'retrying' && uploadProgress >= 25 && uploadProgress < 50
          }"
        >
          <span class="step-icon">🎵</span>
          <span>Extracting metadata</span>
        </div>
        <div
          class="step"
          :class="{
            active: uploadProgress >= 75,
            retrying: uploadState === 'retrying' && uploadProgress >= 50 && uploadProgress < 75
          }"
        >
          <span class="step-icon">🔍</span>
          <span>Analyzing track</span>
        </div>
        <div
          class="step"
          :class="{
            active: uploadProgress >= 100,
            retrying: uploadState === 'retrying' && uploadProgress >= 75
          }"
        >
          <span class="step-icon">✅</span>
          <span>Complete</span>
        </div>
      </div>
    </div>

    <!-- success -->
    <div
      v-if="uploadComplete && trackData"
      class="upload-success"
    >
      <div class="success-icon">
        ✅
      </div>
      <h3>Upload Complete!</h3>
      <div class="track-info">
        <h4>File name: {{ trackData.filename || "test" }}</h4>
        <p v-if="extractedMetadata?.duration">
          Duration: {{ formatDuration(extractedMetadata.duration) }}
        </p>
      </div>

      <ArtistValidationBanner
        v-if="showArtistValidation && extractedMetadata?.artist"
        :artist-name="extractedMetadata.artist"
        :user-tier="userTier"
        context="upload"
        :upload-pattern="uploadPattern"
        @alias-added="onAliasAdded"
        @dismissed="dismissArtistValidation"
      />

      <div class="action-buttons">
        <button
          class="btn-primary"
          :disabled="validationBlocked"
          @click="startValidation"
        >
          {{ validationBlocked ? 'Artist Verification Required' : 'Validate Metadata' }}
        </button>
        <button
          class="btn-secondary"
          @click="resetUpload"
        >
          Upload Another Track
        </button>
      </div>
    </div>

    <!-- error -->
    <div
      v-if="uploadError"
      class="upload-error"
    >
      <div class="error-icon">
        {{ getErrorIcon(uploadError) }}
      </div>
      <h3>{{ getErrorTitle(uploadError) }}</h3>
      <div class="error-details">
        <p class="error-message">
          {{ getErrorMessage(uploadError) }}
        </p>
        <p
          v-if="getErrorSuggestion(uploadError)"
          class="error-suggestion"
        >
          💡 {{ getErrorSuggestion(uploadError) }}
        </p>
      </div>

      <!-- Actions based on error -->
      <div class="error-actions">
        <button
          v-if="canRetry && lastFile"
          class="btn-primary"
          :disabled="isUploading"
          @click="retryLastUpload"
        >
          <span v-if="isUploading">Retrying...</span>
          <span v-else>🔄 Retry Upload</span>
        </button>

        <button
          v-if="!canRetry || !lastFile"
          class="btn-secondary"
          @click="resetUpload"
        >
          Choose Different File
        </button>

        <button
          v-else
          class="btn-secondary"
          @click="resetUpload"
        >
          Start Over
        </button>
      </div>

      <!-- Network status -->
      <div
        v-if="showNetworkStatus"
        class="network-status"
      >
        <span
          class="status-indicator"
          :class="networkStatusClass"
        />
        <span class="status-text">{{ networkStatusText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  autoValidate?: boolean
}

interface Emits {
  (e: 'upload-complete', data: { track: unknown, metadata: unknown }): void
  (e: 'validation-requested', trackId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  autoValidate: true
})

const emit = defineEmits<Emits>()

const {
  uploadAudioFile,
  retryUpload,
  isUploading,
  uploadProgress,
  uploadState,
  currentStep,
  retryCount,
  canRetry,
  checkNetworkConnectivity
} = useFileUpload()
const { validateArtistPermission, analyzeUploadPattern } = useArtistValidation()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const uploadComplete = ref(false)
const uploadError = ref<unknown>(null)
const lastFile = ref<File | null>(null)
const showNetworkStatus = ref(false)
const networkOnline = ref(true)
const trackData = ref(null)
const extractedMetadata = ref(null)
const userTier = ref('artist')
const showArtistValidation = ref(false)
const validationBlocked = ref(false)
const uploadPattern = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  const file = event.dataTransfer?.files[0]
  if (file) {
    processFile(file)
  }
}

const processFile = async (file: File) => {
  try {
    uploadError.value = null
    lastFile.value = file
    showNetworkStatus.value = false
    
    const result = await uploadAudioFile(file)

    trackData.value = result.track
    extractedMetadata.value = result.metadata
    uploadComplete.value = true
    
    if (result.warning) {
      console.warn('Upload succeeded with warning:', result.warning)
    }
    
    emit('upload-complete', result)
    await checkArtistValidation()
    
    // auto-trigger validation if enabled and not blocked
    if (props.autoValidate && !validationBlocked.value) {
      nextTick(() => {
        startValidation()
      })
    }

  } catch (error) {
    console.error('Upload failed:', error)
    uploadError.value = error
    
    // if error check netowrk and show status
    if (isNetworkError(error)) {
      checkNetworkStatus()
    }
  }
}

const retryLastUpload = async () => {
  if (!lastFile.value || !canRetry.value) return

  try {
    uploadError.value = null
    const result = await retryUpload(lastFile.value)

    trackData.value = result.track
    extractedMetadata.value = result.metadata
    uploadComplete.value = true

    emit('upload-complete', result)
    await checkArtistValidation()

    if (props.autoValidate && !validationBlocked.value) {
      nextTick(() => {
        startValidation()
      })
    }
  } catch (error) {
    console.error('Retry failed:', error)
    uploadError.value = error
  }
}

const isNetworkError = (error: unknown): boolean => {
  const errorType = error?.type || ''
  const errorMessage = (error?.message || '').toLowerCase()

  return errorType === 'NETWORK_ERROR' ||
    errorMessage.includes('network') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('timeout')
}

const checkNetworkStatus = async () => {
  showNetworkStatus.value = true
  try {
    networkOnline.value = await checkNetworkConnectivity()
  } catch {
    networkOnline.value = false
  }
}

const getErrorIcon = (error: unknown): string => {
  if (!error) return '❌'

  const errorType = error.type || ''

  switch (errorType) {
    case 'NETWORK_ERROR':
      return '🌐'
    case 'FILE_TOO_LARGE':
      return '📦'
    case 'INVALID_FORMAT':
      return '🎵'
    case 'AUTH_REQUIRED':
      return '🔐'
    case 'UPLOAD_FAILED':
      return '☁️'
    default:
      return '❌'
  }
}

const getErrorTitle = (error: unknown): string => {
  if (!error) return 'Upload Failed'

  const errorType = error.type || ''

  switch (errorType) {
    case 'NETWORK_ERROR':
      return 'Connection Problem'
    case 'FILE_TOO_LARGE':
      return 'File Too Large'
    case 'INVALID_FORMAT':
      return 'Unsupported Format'
    case 'AUTH_REQUIRED':
      return 'Login Required'
    case 'UPLOAD_FAILED':
      return 'Upload Failed'
    case 'METADATA_EXTRACTION_FAILED':
      return 'Processing Error'
    default:
      return 'Upload Failed'
  }
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error
  }

  if (error?.message) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  // Fallback for objects
  if (typeof error === 'object' && error !== null) {
    return JSON.stringify(error)
  }

  return 'An unexpected error occurred'
}

const getErrorSuggestion = (error: unknown): string => {
  if (!error) return ''

  if (error.suggestion) {
    return error.suggestion
  }

  return ''
}

const startValidation = () => {
  if (trackData.value?.id) {
    emit('validation-requested', trackData.value.id)
  }
}

const resetUpload = () => {
  uploadComplete.value = false
  uploadError.value = null
  trackData.value = null
  extractedMetadata.value = null
  showArtistValidation.value = false
  validationBlocked.value = false
  uploadPattern.value = null
  lastFile.value = null
  showNetworkStatus.value = false
  
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const networkStatusClass = computed(() => {
  return networkOnline.value ? 'status-online' : 'status-offline'
})

const networkStatusText = computed(() => {
  return networkOnline.value ? 'Internet connection restored' : 'No internet connection'
})

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const fetchUserTier = async () => {
  try {
    if (!user.value) return

    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_type')
      .eq('id', user.value.id)
      .single()

    if (error) throw error
    userTier.value = data?.user_type || 'artist'
  } catch (error) {
    console.error('Error fetching user tier:', error)
    userTier.value = 'artist'
  }
}

const checkArtistValidation = async () => {
  if (!extractedMetadata.value?.artist || userTier.value !== 'artist') {
    showArtistValidation.value = false
    validationBlocked.value = false
    return
  }

  try {
    const permission = await validateArtistPermission(
      extractedMetadata.value.artist,
      userTier.value
    )

    if (!permission.allowed && permission.requiresVerification) {
      showArtistValidation.value = true
      validationBlocked.value = true

      uploadPattern.value = await analyzeUploadPattern()
    } else {
      showArtistValidation.value = false
      validationBlocked.value = false
    }
  } catch (error) {
    console.error('Error checking artist validation:', error)
    showArtistValidation.value = false
    validationBlocked.value = false
  }
}

const onAliasAdded = async () => {
  await checkArtistValidation()
}

const dismissArtistValidation = () => {
  showArtistValidation.value = false
}

onMounted(() => {
  if (user.value) {
    fetchUserTier()
  }
})

watch(user, (newUser) => {
  if (newUser) {
    fetchUserTier()
  }
})
</script>

<style scoped>
.file-upload-container {
  max-width: 600px;
  margin: 0 auto;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #3b82f6;
  background: #eff6ff;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  color: #6b7280;
}

.upload-area h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.upload-area p {
  color: #6b7280;
  margin: 0;
}

.file-info {
  font-size: 0.875rem;
  color: #9ca3af;
}

.upload-progress {
  padding: 2rem;
  text-align: center;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #111827;
}

.progress-percent {
  font-weight: 600;
  color: #3b82f6;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: width 0.3s ease;
}

.progress-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.step.active {
  opacity: 1;
}

.step-icon {
  font-size: 1.5rem;
}

.upload-success {
  text-align: center;
  padding: 2rem;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-success h3 {
  color: #059669;
  margin-bottom: 1.5rem;
}

.track-info {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.track-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  color: #111827;
}

.track-info p {
  margin: 0.25rem 0;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.upload-error {
  text-align: center;
  padding: 2rem;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-error h3 {
  color: #dc2626;
  margin-bottom: 1rem;
}

.upload-error p {
  color: #6b7280;
  margin-bottom: 2rem;
}

/* Enhanced error handling styles */
.current-step {
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.retry-indicator {
  color: #f59e0b;
  font-weight: 600;
}

.progress-fill.progress-retrying {
  background: linear-gradient(90deg, #f59e0b, #d97706);
  animation: pulse 2s infinite;
}

.step.retrying {
  opacity: 0.7;
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 0.7;
  }

  50% {
    opacity: 1;
  }
}

.error-details {
  margin-bottom: 2rem;
}

.error-message {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.error-suggestion {
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 6px;
  padding: 0.75rem;
  color: #92400e;
  font-size: 0.875rem;
  margin: 0;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.network-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 6px;
  background: #f3f4f6;
  font-size: 0.875rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-online {
  background: #10b981;
}

.status-offline {
  background: #ef4444;
}

.status-text {
  color: #374151;
}

@media (max-width: 640px) {
  .upload-area {
    padding: 2rem 1rem;
  }

  .progress-steps {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-buttons {
    flex-direction: column;
  }
}

.btn-primary:disabled {
  background: #d1d5db;
  color: #6b7280;
  cursor: not-allowed;
}

.btn-primary:disabled:hover {
  background: #d1d5db;
}
</style>