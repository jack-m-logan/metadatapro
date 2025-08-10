<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Email Confirmation
        </h2>
        
        <div
          v-if="loading"
          class="mt-4"
        >
          <div class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600">
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
            Confirming your email...
          </div>
        </div>

        <!-- success -->
        <div
          v-else-if="confirmed"
          class="mt-4"
        >
          <div class="bg-green-50 border border-green-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  Email confirmed successfully!
                </h3>
                <div class="mt-2 text-sm text-green-700">
                  <p>Your account is now active. You'll be redirected to your dashboard shortly.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <NuxtLink
              to="/dashboard"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Dashboard
            </NuxtLink>
          </div>
        </div>

        <!-- error -->
        <div
          v-else-if="error"
          class="mt-4"
        >
          <div class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Email confirmation failed
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{{ error }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <NuxtLink
              to="/auth/user-signup"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Signing Up Again
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// email confirmation doesn't require auth, added to nuxt.config.js supabase redirect exclusions
definePageMeta({
  auth: false
})

const route = useRoute()
const supabase = useSupabaseClient()

const loading = ref(true)
const confirmed = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    const tokenHash = route.query.token_hash
    const type = route.query.type

    if (!tokenHash || !type) {
      throw new Error('Missing confirmation parameters')
    }

    const { data, error: confirmError } = await supabase.auth.verifyOtp({
      token_hash: String(tokenHash),
      type: String(type)
    })

    if (confirmError) {
      throw confirmError
    }

    if (data.user) {
      confirmed.value = true
      
      // redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigateTo('/dashboard')
      }, 2000)
    }

  } catch (err) {
    console.error('Email confirmation error:', err)
    error.value = err?.message || 'An unexpected error occurred during email confirmation'
  } finally {
    loading.value = false
  }
})
</script>