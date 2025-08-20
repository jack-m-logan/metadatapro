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
        <h3>Processing Your Track</h3>
        <span class="progress-percent">{{ uploadProgress }}%</span>
      </div>
      
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: uploadProgress + '%' }"
        />
      </div>
      
      <div class="progress-steps">
        <div
          class="step"
          :class="{ active: uploadProgress >= 25 }"
        >
          <span class="step-icon">📁</span>
          <span>Uploading file</span>
        </div>
        <div
          class="step"
          :class="{ active: uploadProgress >= 50 }"
        >
          <span class="step-icon">🎵</span>
          <span>Extracting metadata</span>
        </div>
        <div
          class="step"
          :class="{ active: uploadProgress >= 75 }"
        >
          <span class="step-icon">🔍</span>
          <span>Analyzing track</span>
        </div>
        <div
          class="step"
          :class="{ active: uploadProgress >= 100 }"
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
        <h4>{{ trackData.title }}</h4>
        <p v-if="extractedMetadata?.artist">
          by {{ extractedMetadata.artist }}
        </p>
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
        ❌
      </div>
      <h3>Upload Failed</h3>
      <p>{{ uploadError }}</p>
      <button
        class="btn-secondary"
        @click="resetUpload"
      >
        Try Again
      </button>
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

const { uploadAudioFile, isUploading, uploadProgress } = useFileUpload()
const { validateArtistPermission, analyzeUploadPattern } = useArtistValidation()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const uploadComplete = ref(false)
const uploadError = ref<string | null>(null)
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
    
    const result = await uploadAudioFile(file)
    
    trackData.value = result.track
    extractedMetadata.value = result.metadata
    uploadComplete.value = true
    
    emit('upload-complete', result)

    // success handled by parent component
  
    await checkArtistValidation()
    
    // auto-trigger validation if enabled and not blocked
    if (props.autoValidate && !validationBlocked.value) {
      nextTick(() => {
        startValidation()
      })
    }
    
  } catch (error) {
    console.error('Upload failed:', error)
    uploadError.value = error instanceof Error ? error.message : 'Upload failed'
  }
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
  
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

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