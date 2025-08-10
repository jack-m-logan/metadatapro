<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation TODO make component --> 
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold text-indigo-600">
                metaPRO
              </h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/auth/user-login"
              class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/auth/user-signup"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Get Started
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span class="block">Validate Your Music</span>
          <span class="block text-indigo-600">Metadata for Spain</span>
        </h1>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Ensure your music metadata meets SGAE, AIE, and AGEDI requirements. 
          Validate, fix, and export distribution-ready files in minutes.
        </p>
        <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div class="rounded-md shadow">
            <NuxtLink
              to="auth/user-signup"
              class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              Start Validating
            </NuxtLink>
          </div>
          <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <NuxtLink
              to="#features"
              class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Learn More
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div
        id="features"
        class="mt-20"
      >
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900">
            Everything you need for Spanish PRO registration
          </h2>
          <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            MetaPRO handles the complexity of Spanish music rights management
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Feature 1 -->
          <div class="pt-6">
            <div class="flow-root bg-gray-50 rounded-lg px-6 pb-8">
              <div class="-mt-6">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <span class="text-white text-xl">🔍</span>
                  </span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Smart Metadata Validation
                </h3>
                <p class="mt-5 text-base text-gray-500">
                  AI-powered validation checks ISRC codes, credits, duration, and artwork against distributor requirements.
                </p>
              </div>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="pt-6">
            <div class="flow-root bg-gray-50 rounded-lg px-6 pb-8">
              <div class="-mt-6">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <span class="text-white text-xl">🏛️</span>
                  </span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  PRO Registration Guidance
                </h3>
                <p class="mt-5 text-base text-gray-500">
                  Step-by-step guidance for SGAE, AIE, and AGEDI registration with pre-filled forms and document generation.
                </p>
              </div>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="pt-6">
            <div class="flow-root bg-gray-50 rounded-lg px-6 pb-8">
              <div class="-mt-6">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <span class="text-white text-xl">📤</span>
                  </span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Export Ready Files
                </h3>
                <p class="mt-5 text-base text-gray-500">
                  Generate distribution-ready packages for DistroKid, CD Baby, TuneCore, and other major platforms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-20 bg-indigo-700 rounded-lg">
        <div class="px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
          <div class="text-center">
            <h2 class="text-3xl font-extrabold text-white">
              Ready to validate your music metadata?
            </h2>
            <p class="mt-4 text-lg text-indigo-200">
              Join Spanish independent artists who trust metaPRO for their metadata validation.
            </p>
            <div class="mt-8">
              <NuxtLink
                to="/auth/user-signup"
                class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
              >
                Create Free Account
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-20">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="text-center text-gray-500">
          <p>&copy; 2025 metaPRO. Built for Spanish independent artists.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
definePageMeta({
  auth: false
})

const user = useSupabaseUser()

watchEffect(() => {
  if (user.value) {
    navigateTo('/dashboard')
  }
})
</script>