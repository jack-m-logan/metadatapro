<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to metaPRO
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Validate your music metadata for Spanish PROs
        </p>
      </div>

      <form
        class="mt-8 space-y-6"
        @submit.prevent="handleSignIn"
      >
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label
              for="email"
              class="sr-only"
            >Email address</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            >
          </div>
          <div>
            <label
              for="password"
              class="sr-only"
            >Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
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

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </div>

        <div class="text-center space-y-2">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <NuxtLink
              to="/auth/user-signup"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up here
            </NuxtLink>
          </p>
          <p class="text-sm text-gray-600">
            <NuxtLink
              to="/auth/forgot-password"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// redirect if already authed
definePageMeta({
  auth: false
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

// redirect if already logged in
watchEffect(() => {
  if (user.value) {
    navigateTo('/dashboard')
  }
})

const handleSignIn = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      errorMessage.value = error.message
    } else {
      // success - redirected by auth state change
      await navigateTo('/dashboard')
    }
  } catch (err) {
    errorMessage.value = 'An unexpected error occurred'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>