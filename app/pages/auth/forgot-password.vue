<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your email and we'll send you a reset link
        </p>
      </div>
      
      <form
        class="mt-8 space-y-6"
        @submit.prevent="handleReset"
      >
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="your@email.com"
          >
        </div>

        <div
          v-if="errorMessage"
          class="text-red-600 text-sm text-center"
        >
          {{ errorMessage }}
        </div>

        <div
          v-if="successMessage"
          class="text-green-600 text-sm text-center"
        >
          {{ successMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading">Sending reset link...</span>
            <span v-else>Send Reset Link</span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Remember your password?
            <NuxtLink
              to="/auth/user-login"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in here
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  auth: false
})

const supabase = useSupabaseClient()

const email = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleReset = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    
    if (error) {
      errorMessage.value = error.message
    } else {
      successMessage.value = 'Password reset email sent! Check your inbox.'
      email.value = ''
    }
  } catch (err) {
    errorMessage.value = 'An unexpected error occurred'
    console.error('Password reset error:', err)
  } finally {
    loading.value = false
  }
}
</script>