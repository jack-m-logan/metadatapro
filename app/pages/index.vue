<template>
  <div class="landing-page text-sans relative min-h-screen bg-neutral-100 overflow-x-hidden">
    <section class="relative z-10 py-24 flex items-center justify-center">
      <div class="absolute inset-0 z-0 overflow-hidden">
        <CirclesBackground />
      </div>
      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-20"> 
        <div class="absolute -top-12 -right-8 z--10 w-48 h-48 pattern-dots" />
        <div class="absolute -bottom-12 -left-8 z--10 w-48 h-48 pattern-dots" />

        <div class="glass-card p-8 sm:p-10 text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-neutral-900 mb-4 leading-tight">
            Stop Losing Money to
            <br>
            <span class="text-orange-600 font-heading">
              Bad Metadata
            </span>
          </h1>

          <p class="text-base font-sans text-neutral-600 mb-8 max-w-xl mx-auto leading-relaxed">
            Poor metadata costs independent artists thousands in lost royalties and distribution rejections. MetadataPRO validates and fixes your music metadata before release.
          </p>

          <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-xl transition-all duration-200 transform hover:scale-105">
            Start Validating Free
          </button>
        </div>
      </div>
    </section>

    <!-- Before/After Comparison Section -->
    <BeforeAfterComparison />

    <!-- Features Section -->
    <FeaturesSection />

    <!-- How It Works Section -->
    <HowItWorks />

    <!-- Pricing Section -->
    <section
      id="pricing"
      class="py-20 bg-neutral-50"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p class="text-xl text-neutral-600">
            Pay for what you need. Upgrade as you grow.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <!-- Free Tier -->
          <div class="bg-white rounded-xl shadow-lg p-8 border border-neutral-200">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-neutral-900 mb-2">
                Free
              </h3>
              <div class="mb-6">
                <span class="text-4xl font-bold text-neutral-900">£0</span>
                <span class="text-neutral-600">/month</span>
              </div>
            </div>
            
            <ul class="space-y-3 mb-8">
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>3 validations per month</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>3 corrections per month</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Basic validation reports</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Email support</span>
              </li>
            </ul>

            <NuxtLink 
              to="/auth/user-signup" 
              class="w-full bg-neutral-600 hover:bg-neutral-700 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors"
            >
              Get Started Free
            </NuxtLink>
          </div>

          <!-- Pro Artist - Most Popular -->
          <div class="bg-white rounded-xl shadow-xl p-8 border-2 border-primary-600 relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            
            <div class="text-center">
              <h3 class="text-2xl font-bold text-neutral-900 mb-2">
                Pro Artist
              </h3>
              <div class="mb-6">
                <span class="text-4xl font-bold text-primary-600">£4.99</span>
                <span class="text-neutral-600">/month</span>
              </div>
            </div>
            
            <ul class="space-y-3 mb-8">
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span><strong>Unlimited</strong> validations & corrections</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>ISRC code generation</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>PRO registration assistance</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Revenue impact calculator</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Priority support</span>
              </li>
            </ul>

            <NuxtLink 
              to="/auth/user-signup" 
              class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors"
            >
              Start Pro Trial
            </NuxtLink>
          </div>

          <!-- Pro Label -->
          <div class="bg-white rounded-xl shadow-lg p-8 border border-neutral-200">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-neutral-900 mb-2">
                Pro Label
              </h3>
              <div class="mb-6">
                <span class="text-4xl font-bold text-neutral-900">£14.99</span>
                <span class="text-neutral-600">/month</span>
              </div>
            </div>
            
            <ul class="space-y-3 mb-8">
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span><strong>Everything in Pro Artist</strong></span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Unlimited artist management</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Bulk operations & batch processing</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Portfolio analytics dashboard</span>
              </li>
              <li class="flex items-center">
                <svg
                  class="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Advanced reporting & exports</span>
              </li>
            </ul>

            <NuxtLink 
              to="/auth/user-signup" 
              class="w-full bg-secondary-600 hover:bg-secondary-700 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors"
            >
              Start Label Trial
            </NuxtLink>
          </div>
        </div>

        <div class="mt-12 text-center">
          <div class="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 class="text-xl font-bold text-neutral-900 mb-2">
              💡 VIP Beta Program
            </h3>
            <p class="text-neutral-600 mb-4">
              Get 6 months of Pro features free in exchange for feedback sessions. 
              Help shape the future of metadata management.
            </p>
            <p class="text-sm text-neutral-500">
              Limited spots available • By invitation only
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section
      id="demo"
      class="py-20 bg-white"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            See MetadataPRO in Action
          </h2>
          <p class="text-xl text-neutral-600">
            Watch how easy it is to validate and fix your metadata
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <div class="bg-neutral-100 rounded-xl aspect-video flex items-center justify-center">
            <div class="text-center">
              <div class="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  class="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-neutral-900 mb-2">
                2-Minute Demo
              </h3>
              <p class="text-neutral-600">
                Upload → Validate → Fix → Download
              </p>
              <button class="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Play Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 bg-neutral-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            What Artists Say
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white rounded-xl p-6 shadow-lg">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                <span class="text-white font-bold">S</span>
              </div>
              <div>
                <h4 class="font-bold text-neutral-900">
                  Sarah M.
                </h4>
                <p class="text-neutral-600 text-sm">
                  Singer-Songwriter
                </p>
              </div>
            </div>
            <p class="text-neutral-700 mb-4">
              "Finally caught the ISRC issue that would have cost me radio royalties. 
              MetadataPRO paid for itself in the first month."
            </p>
            <div class="flex text-yellow-400">
              ★★★★★
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-lg">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center mr-4">
                <span class="text-white font-bold">M</span>
              </div>
              <div>
                <h4 class="font-bold text-neutral-900">
                  Mike R.
                </h4>
                <p class="text-neutral-600 text-sm">
                  Indie Label Owner
                </p>
              </div>
            </div>
            <p class="text-neutral-700 mb-4">
              "Manages our entire catalog. The bulk operations save us 10+ hours per release. 
              Essential tool for any label."
            </p>
            <div class="flex text-yellow-400">
              ★★★★★
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-lg">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-accent-600 rounded-full flex items-center justify-center mr-4">
                <span class="text-white font-bold">A</span>
              </div>
              <div>
                <h4 class="font-bold text-neutral-900">
                  Alex K.
                </h4>
                <p class="text-neutral-600 text-sm">
                  Electronic Producer
                </p>
              </div>
            </div>
            <p class="text-neutral-700 mb-4">
              "The genre optimization suggestions increased my Spotify saves by 40%. 
              Game changer for electronic music."
            </p>
            <div class="flex text-yellow-400">
              ★★★★★
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">
          Stop Losing Money to Bad Metadata
        </h2>
        <p class="text-xl mb-8 opacity-90">
          Join thousands of independent artists who trust MetadataPRO to protect their royalties
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/auth/user-signup" 
            class="bg-white text-primary-600 hover:bg-neutral-100 px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Start Free Today
          </NuxtLink>
          <button 
            class="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-xl font-bold text-lg transition-colors"
            @click="scrollTo('#pricing')"
          >
            View Pricing
          </button>
        </div>
        <p class="text-sm opacity-75 mt-4">
          No credit card required • 3 free validations • Cancel anytime
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import BeforeAfterComparison from '/components/BeforeAfterComparison.vue'
import CirclesBackground from '/components/CirclesBackground.vue'
import HowItWorks from '/components/HowItWorks.vue'
import FeaturesSection from '/components/FeaturesSection.vue'
// import CirclesBackgroundBlur from '/components/CirclesBackgroundBlur.vue'

definePageMeta({
  layout: 'marketing-layout'
})

useHead({
  title: 'MetadataPRO - Professional Music Metadata Validation & Correction',
  meta: [
    {
      name: 'description',
      content: 'Stop losing money to poor metadata. MetadataPRO validates and fixes music metadata before distribution, ensuring maximum royalty collection and preventing rejections. £4.99/month for unlimited validations.'
    },
    {
      property: 'og:title',
      content: 'MetadataPRO - Stop Losing Money to Bad Metadata'
    },
    {
      property: 'og:description',
      content: 'Professional metadata validation and correction for independent artists. Prevent distribution rejections and maximize royalty collection.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'keywords',
      content: 'music metadata, ISRC codes, distribution validation, music royalties, DistroKid, CD Baby, TuneCore, music publishing, PRO registration'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'MetadataPRO - Professional Music Metadata Validation'
    },
    {
      name: 'twitter:description',
      content: 'Validate and fix music metadata before distribution. Prevent rejections and maximize royalties.'
    }
  ]
})

const scrollTo = (selector) => {
  const element = document.querySelector(selector)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Track page view for analytics
onMounted(() => {
  // Add any analytics tracking here
  console.log('Landing page loaded')
})
</script>

<style scoped>
.bg-grid-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-slide-up,
  .animate-bounce-light {
    animation: none;
  }
}
</style>