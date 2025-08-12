<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink
              to="/dashboard"
              class="text-indigo-600 hover:text-indigo-500 mr-4"
            >
              ← Back to Dashboard
            </NuxtLink>
            <h1 class="text-xl font-semibold text-gray-900">
              Metadata Validation
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">
              Welcome, {{ userProfile?.artist_name || userProfile?.full_name || 'Artist' }}
            </span>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div
          v-if="isValidating"
          class="bg-white shadow rounded-lg"
        >
          <div class="px-6 py-8 text-center">
            <div class="inline-flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600"
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
              <span>Validating metadata...</span>
            </div>
          </div>
        </div>

        <div
          v-if="validationError"
          class="bg-red-50 border border-red-200 rounded-md p-4 mb-6"
        >
          <h4 class="font-medium text-red-800">
            Validation Error:
          </h4>
          <p class="text-red-700 mt-1">
            {{ validationError }}
          </p>
          <button 
            class="mt-2 text-sm text-red-600 underline hover:text-red-500" 
            @click="clearError"
          >
            Try Again
          </button>
        </div>

        <div
          v-if="!showValidationResults && !isValidating"
          class="space-y-6"
        >
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Validate Your Music Metadata
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Ensure your tracks are ready for distribution across all major platforms 
              and meet requirements for royalty collection organizations.
            </p>
          </div>

          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-8">
              <FileUpload 
                :auto-validate="false"
                @upload-complete="handleUploadComplete"
                @validation-requested="handleValidationRequest"
              />
            </div>
          </div>

          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-8">
              <h3 class="text-lg font-medium text-gray-900 mb-6">
                What We Validate
              </h3>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          class="w-4 h-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-3">
                      <h4 class="text-sm font-medium text-gray-900">
                        Distribution Readiness
                      </h4>
                      <p class="text-sm text-gray-500">
                        DistroKid, CD Baby, TuneCore compatibility
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          class="w-4 h-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-3">
                      <h4 class="text-sm font-medium text-gray-900">
                        Technical Quality
                      </h4>
                      <p class="text-sm text-gray-500">
                        Audio specs, duration, file format
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          class="w-4 h-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-3">
                      <h4 class="text-sm font-medium text-gray-900">
                        Rights & Credits
                      </h4>
                      <p class="text-sm text-gray-500">
                        Songwriter, performer, publisher info
                      </p>
                    </div>
                  </div>
                </div>
                
                <div class="space-y-4">
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          class="w-4 h-4 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-3">
                      <h4 class="text-sm font-medium text-gray-900">
                        ISRC Validation
                      </h4>
                      <p class="text-sm text-gray-500">
                        Proper formatting and uniqueness
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          class="w-4 h-4 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-3">
                      <h4 class="text-sm font-medium text-gray-900">
                        Metadata Consistency
                      </h4>
                      <p class="text-sm text-gray-500">
                        File tags vs. user input comparison
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg
                          class="w-4 h-4 text-purple-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-3">
                      <h4 class="text-sm font-medium text-gray-900">
                        Regional PRO Support
                      </h4>
                      <p class="text-sm text-gray-500">
                        SGAE, PRS, SACEM requirements
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showValidationResults && validationResults && validationResults.success">
          <ValidationResults 
            :results="validationResults"
            @back-to-upload="resetValidation"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import ValidationResults from '/components/validation-results.vue'

definePageMeta({
  middleware: 'auth'
})

const user = useSupabaseUser()
const userProfile = ref(null)
const showValidationResults = ref(false)
const validationResults = ref(null)
const isValidating = ref(false)
const validationError = ref(null)

onMounted(async () => {
  if (user.value) {
    const { data } = await useSupabaseClient()
      .from('user_profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
    
    userProfile.value = data
  }
})

const handleUploadComplete = (  ) => {
  // todo upload complete handler
}

const handleValidationRequest = async (trackId) => {
  try {
    isValidating.value = true
    validationError.value = null
    
    const results = await $fetch('/api/validation/validate-track', {
      method: 'POST',
      body: { trackId }
    })
    
    if (results.success) {
      validationResults.value = results
      showValidationResults.value = true
    } else {
      throw new Error('Validation was not successful')
    }
    
  } catch (error) {
    validationError.value = error.message || 'Validation failed'
  } finally {
    isValidating.value = false
  }
}

const resetValidation = () => {
  showValidationResults.value = false
  validationResults.value = null
  validationError.value = null
}

const clearError = () => {
  validationError.value = null
}
</script>