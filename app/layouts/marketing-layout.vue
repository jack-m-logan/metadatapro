<template>
  <div class="min-h-screen bg-white">
    <!-- Marketing Navigation -->
    <nav class="relative z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200 sticky top-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink
              to="/"
              class="flex items-center space-x-2"
            >
              <img
                src="/logo/metadatapro-banner-orange.svg"
                alt="MetadataPRO"
                class="h-15"
              >
            </NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              class="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              class="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
            >
              Pricing
            </a>
            <a
              href="#how-it-works"
              class="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
            >
              How It Works
            </a>
            <NuxtLink 
              to="/auth/user-login" 
              class="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
            >
              Sign In
            </NuxtLink>
            <NuxtLink 
              to="/auth/user-signup" 
              class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Get Started
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button 
              class="text-neutral-600 hover:text-neutral-900 p-2"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path 
                  v-if="!mobileMenuOpen"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path 
                  v-else
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div 
          v-if="mobileMenuOpen" 
          class="md:hidden py-4 border-t border-neutral-200"
        >
          <div class="flex flex-col space-y-4">
            <a 
              href="#features" 
              class="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
              @click="mobileMenuOpen = false"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              class="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
              @click="mobileMenuOpen = false"
            >
              Pricing
            </a>
            <a 
              href="#how-it-works" 
              class="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
              @click="mobileMenuOpen = false"
            >
              How It Works
            </a>
            <div class="pt-4 border-t border-neutral-200 flex flex-col space-y-2">
              <NuxtLink 
                to="/auth/user-login" 
                class="text-neutral-600 hover:text-primary-600 font-medium transition-colors text-center"
                @click="mobileMenuOpen = false"
              >
                Sign In
              </NuxtLink>
              <NuxtLink 
                to="/auth/user-signup" 
                class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center"
                @click="mobileMenuOpen = false"
              >
                Get Started Free
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-neutral-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">m</span>
              </div>
              <span class="text-xl font-bold">MetadataPRO</span>
            </div>
            <p class="text-neutral-400 mb-4 max-w-md">
              Professional metadata validation and correction for independent artists, 
              labels, and venues. Ensure your music is distribution-ready and maximizes royalty potential.
            </p>
            <div class="flex space-x-4">
              <a
                href="#"
                class="text-neutral-400 hover:text-white transition-colors"
              >
                <span class="sr-only">Twitter</span>
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                class="text-neutral-400 hover:text-white transition-colors"
              >
                <span class="sr-only">LinkedIn</span>
                <svg
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          <!-- Product -->
          <div>
            <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Product
            </h3>
            <ul class="space-y-2">
              <li>
                <a
                  href="#features"
                  class="text-neutral-400 hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  class="text-neutral-400 hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <NuxtLink
                  to="/auth/user-signup"
                  class="text-neutral-400 hover:text-white transition-colors"
                >
                  Get Started
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul class="space-y-2">
              <li>
                <a
                  href="mailto:support@MetadataPRO.app"
                  class="text-neutral-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  class="text-neutral-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  class="text-neutral-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center">
          <p class="text-neutral-400 text-sm">
            © 2025 MetadataPRO. All rights reserved.
          </p>
          <div class="mt-4 md:mt-0 flex items-center space-x-4">
            <button 
              class="text-neutral-400 hover:text-white text-sm transition-colors"
              @click="toggleTheme"
            >
              Switch Theme
            </button>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const mobileMenuOpen = ref(false)

// Theme switching for A/B testing
const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const newTheme = currentTheme === 'purple-green' ? null : 'purple-green'
  document.documentElement.setAttribute('data-theme', newTheme || '')
}

// Close mobile menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('nav') && mobileMenuOpen.value) {
      mobileMenuOpen.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})

// SEO meta tags for marketing pages
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect', 
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    }
  ]
})
</script>