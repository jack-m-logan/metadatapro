<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your MetadataPRO account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Start validating your music metadata today
        </p>
      </div>
      
      <form
        class="mt-8 space-y-6"
        @submit.prevent="handleSignUp"
      >
        <div class="space-y-4">
          <div>
            <label
              for="full-name"
              class="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="full-name"
              v-model="fullName"
              name="full-name"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Your full name"
            >
          </div>
          
          <div>
            <label
              for="artist-name"
              class="block text-sm font-medium text-gray-700"
            >
              Artist/Band Name
            </label>
            <input
              id="artist-name"
              v-model="artistName"
              name="artist-name"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Your artist or band name"
            >
          </div>
          
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
          
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Choose a strong password"
            >
          </div>
        </div>

        <AlertBanner
          v-if="errorMessage"
          type="error"
          :message="errorMessage"
          variant="minimal"
          :show-icon="false"
          class="text-center"
        />

        <AlertBanner
          v-if="successMessage"
          type="success"
          :message="successMessage"
          variant="minimal"
          :show-icon="false"
          class="text-center"
        />

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading">Creating account...</span>
            <span v-else>Create Account</span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
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
// redirect if already authenticated
definePageMeta({
  auth: false
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const fullName = ref('')
const artistName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// redirect if already logged in
watchEffect(() => {
  if (user.value) {
    navigateTo('/dashboard')
  }
})

const handleSignUp = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
        
    // signup with supabase auth (db trigger handles create profile)
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: fullName.value,
          artist_name: artistName.value,
        }
      }
    })
    
    if (error) {
      if (error.message.includes('already been registered')) {
        errorMessage.value = 'An account with this email already exists. Please try signing in instead.'
      } else if (error.message.includes('email')) {
        errorMessage.value = 'Please enter a valid email address.'
      } else if (error.message.includes('password')) {
        errorMessage.value = 'Password must be at least 6 characters long.'
      } else {
        errorMessage.value = error.message
      }
      console.error('Signup error:', error.message)
    } else if (data.user) {
      if (data.user.email_confirmed_at) {
        successMessage.value = 'Account created and confirmed! You can now sign in.'
      } else {
        successMessage.value = 'Account created! Please check your email to verify your account.'
      }
      console.log('Signup successful for:', email.value)
    }
  } catch (err) {
    errorMessage.value = 'An unexpected error occurred. Please try again.'
    console.error('Signup error:', err.message || 'Unknown error')
  } finally {
    loading.value = false
  }
}
</script>