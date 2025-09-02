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

    <footer class="bg-white text-black border-t border-neutral-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div class="md:col-span-2 space-y-4">
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
          <p class="text-neutral-600 font-medium max-w-sm">
            Professional metadata validation and correction for independent artists, labels, and venues.
          </p>
          <div class="flex space-x-4">
            <a
              href="https://www.instagram.com/metadatapro/"
              class="text-neutral-500 hover:text-primary-600 transition-colors"
            >
              <span class="sr-only">Instagram</span>
              <svg
                class="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 448 512"
                aria-hidden="true"
              >
                <path
                  d="M224,202.66A53.34,53.34,0,1,0,277.34,256,53.38,53.38,0,0,0,224,202.66Zm124.71-41a54,54,0,0,0-30.51-30.51c-21.1-8.42-71.23-6.5-94.2-6.5s-73.11-1.92-94.2,6.5a54,54,0,0,0-30.51,30.51c-8.42,21.1-6.5,71.23-6.5,94.2s-1.92,73.11,6.5,94.2a54,54,0,0,0,30.51,30.51c21.1,8.42,71.23,6.5,94.2,6.5s73.11,1.92,94.2-6.5a54,54,0,0,0,30.51-30.51c8.42-21.1,6.5-71.23,6.5-94.2S357.13,182.73,348.71,161.63ZM224,338a82,82,0,1,1,82-82A82.09,82.09,0,0,1,224,338Zm85.38-148.34a19.16,19.16,0,1,1,19.16-19.16A19.15,19.15,0,0,1,309.38,189.66ZM400,32H48A48,48,0,0,0,0,80V432a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V80A48,48,0,0,0,400,32Zm-6.41,290c-1.29,25.84-7.22,48.72-26.3,67.8s-42,25-67.8,26.3c-26.73,1.52-106.91,1.52-133.64,0-25.84-1.29-48.72-7.22-67.8-26.3s-25-42-26.3-67.8c-1.52-26.73-1.52-106.91,0-133.64,1.29-25.84,7.22-48.72,26.3-67.8s42-25,67.8-26.3c26.73-1.52,106.91-1.52,133.64,0,25.84,1.29,48.72,7.22,67.8,26.3s25,42,26.3,67.8C395.11,215.09,395.11,295.27,393.59,322Z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="text-neutral-500 hover:text-primary-600 transition-colors"
            >
              <span class="sr-only">LinkedIn</span>
              <svg
                class="w-6 h-6"
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

        <div class="grid grid-cols-2 md:col-span-2 mt-3 gap-8">
          <div>
            <h3 class="text-sm font-semibold text-neutral-500 tracking-wider uppercase mb-4">
              Product
            </h3>
            <ul class="space-y-2">
              <li>
                <a
                  href="#features"
                  class="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  class="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <NuxtLink
                  to="/auth/user-signup"
                  class="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Get Started
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-neutral-500 tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul class="space-y-2">
              <li>
                <a
                  href="mailto:support@MetadataPRO.app"
                  class="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  class="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  class="text-neutral-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-neutral-200">
        <p class="text-neutral-500 text-sm text-center md:text-left">
          © 2025 MetadataPRO. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const mobileMenuOpen = ref(false)

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