<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set new password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>
      
      <form
        class="mt-8 space-y-6"
        @submit.prevent="handlePasswordUpdate"
      >
        <div class="space-y-4">
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter new password"
            >
          </div>
          
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirm new password"
            >
          </div>
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
            <span v-if="loading">Updating password...</span>
            <span v-else>Update Password</span>
          </button>
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

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handlePasswordUpdate = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Passwords do not match'
      return
    }
    
    if (password.value.length < 6) {
      errorMessage.value = 'Password must be at least 6 characters'
      return
    }
    
    const { error } = await supabase.auth.updateUser({
      password: password.value
    })
    
    if (error) {
      errorMessage.value = error.message
    } else {
      successMessage.value = 'Password updated successfully! Redirecting...'
      setTimeout(() => {
        navigateTo('/dashboard')
      }, 2000)
    }
  } catch (err) {
    errorMessage.value = 'An unexpected error occurred'
    console.error('Password update error:', err)
  } finally {
    loading.value = false
  }
}
</script>