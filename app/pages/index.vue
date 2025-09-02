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

          <NuxtLink 
            to="/auth/user-signup" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Start Validating Free
          </NuxtLink>
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
    <PricingSection id="pricing" />

    <!-- Testimonials Section -->
    <!-- <section class="py-20 bg-neutral-50">
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
    </section> -->

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">
          Stop Losing Money to Bad Metadata
        </h2>
        <p class="text-xl mb-8 opacity-90">
          Sign up for your free account and see how MetadataPRO can prevent distribution rejections, save you time, and maximize your royalty collection.
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
          No credit card required • 5 free validations • Cancel anytime
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
import PricingSection from '/components/PricingSection.vue'

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