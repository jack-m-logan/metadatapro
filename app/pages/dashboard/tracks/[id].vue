<template>
  <div class="min-h-screen bg-gray-50">
    <DashboardNav
      title="Track Validation"
      back-link="/dashboard"
      :user-profile="userProfile"
      :show-sign-out="true"
    />

    <div
      v-if="isLoading"
      class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8"
    >
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-8 text-center">
            <LoadingSpinner
              message="Loading track validation..."
              inline
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="error"
      class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8"
    >
      <div class="px-4 py-6 sm:px-0">
        <AlertBanner
          type="error"
          title="Error Loading Track"
          :message="error"
        >
          <template #action>
            <NuxtLink
              to="/dashboard"
              class="mt-2 text-sm text-red-600 underline hover:text-red-500"
            >
              Back to Dashboard
            </NuxtLink>
          </template>
        </AlertBanner>
      </div>
    </div>

    <div
      v-else-if="track && !isValidated"
      class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8"
    >
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-8 text-center">
            <div class="text-4xl mb-4">
              🎵
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ track.title || track.filename }}
            </h3>
            <p class="text-gray-600 mb-6">
              This track hasn't been validated yet.
            </p>
            <button
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              :disabled="isValidating"
              @click="validateTrack"
            >
              <svg
                v-if="isValidating"
                class="animate-spin -ml-1 mr-3 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {{ isValidating ? 'Validating...' : 'Start Validation' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- validation results -->
    <div
      v-else-if="track && validationResults"
      class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8"
    >
      <div class="px-4 py-6 sm:px-0">
        <ValidationResults 
          :results="validationResults"
          :show-back-button="false"
          @back-to-upload="goToDashboard"
          @re-validate="handleReValidate"
        />
        
        <!-- additional actions -->
        <div class="mt-6 bg-white shadow rounded-lg">
          <div class="px-6 py-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Actions
            </h3>
            <div class="flex flex-wrap gap-3">
              <button
                v-if="validationResults.hasChangedSinceValidation"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                :disabled="isValidating"
                @click="handleReValidate"
              >
                <svg
                  v-if="isValidating"
                  class="animate-spin -ml-1 mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {{ isValidating ? 'Re-validating...' : '🔄 Re-validate' }}
              </button>
              <button
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                @click="downloadReport"
              >
                📄 Download Report
              </button>
              <button
                v-if="hasCorrectableIssues"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                @click="fixMetadata"
              >
                🔧 Fix Metadata
              </button>
              <NuxtLink
                :to="`/dashboard/metadata-manager#track-${track.id}`"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                ✏️ Edit Metadata
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Toast
      :visible="!!toastMessage.text"
      :message="toastMessage.text"
      :type="toastMessage.type"
      @close="clearToast"
    />
  </div>
</template>

<script setup>
import ValidationResults from '/components/validation-results.vue'
import Toast from '/components/toast-messages.vue'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { showToast, clearToast, message: toastMessage } = useToast()

const trackId = route.params.id
const isLoading = ref(true)
const isValidating = ref(false)
const error = ref(null)
const track = ref(null)
const userProfile = ref(null)
const validationResults = ref(null)
const validationIssues = ref([])

const isValidated = computed(() => {
  return track.value?.validation_status === 'completed' && track.value?.validation_score !== null
})

const hasCorrectableIssues = computed(() => {
  return validationIssues.value.some(issue => 
    ['missing_title', 'missing_artist', 'missing_isrc', 'invalid_isrc'].includes(issue.issue_code)
  )
})

const fetchTrackData = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
    
    userProfile.value = profile

    const results = await $fetch(`/api/tracks/${trackId}?userId=${user.value.id}`)

    if (results.success) {
      track.value = results.track
      validationIssues.value = results.issues
      validationResults.value = results.validationResults
    } else {
      throw new Error('Failed to fetch track data')
    }

  } catch (err) {
    console.error('Error fetching track:', err)
    error.value = err.message
    showToast('Failed to load track data', 'error')
  } finally {
    isLoading.value = false
  }
}

const validateTrack = async () => {
  try {
    isValidating.value = true
    
    const results = await $fetch('/api/validation/validate-track', {
      method: 'POST',
      body: { trackId: trackId }
    })
    
    if (results.success) {
      await fetchTrackData()
      showToast('Track validation completed successfully', 'success')
    }
    
  } catch (err) {
    console.error('Validation failed:', err)
    error.value = 'Validation failed. Please try again.'
    showToast('Validation failed. Please try again.', 'error')
  } finally {
    isValidating.value = false
  }
}

const handleReValidate = async () => {
  await validateTrack()
}

const downloadReport = () => {
  console.log('Download report for track:', trackId)
  showToast('Report download feature coming soon', 'info')
}

const fixMetadata = () => {
  console.log('Fix metadata for track:', trackId)
  showToast('Metadata correction service coming soon', 'info')
}

const goToDashboard = () => {
  navigateTo('/dashboard')
}

onMounted(async () => {
  if (user.value) {
    await fetchTrackData()
  }
})

watchEffect(() => {
  if (user.value === null) {
    navigateTo('/auth/user-login')
  }
})
</script>