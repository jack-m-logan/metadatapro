<template>
  <section
    id="features"
    class="py-20 bg-white"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
          Complete Metadata Management
        </h2>
        <p class="text-xl text-neutral-600 max-w-3xl mx-auto">
          Everything you need to ensure your music is ready for distribution, royalty collection and enhanced
          discoverability.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          v-for="feature in featuresData"
          :key="feature.title"
          :title="feature.title"
          :description="feature.description"
          :bullet-points="feature.bulletPoints"
          :icon="feature.icon"
          :icon-color="feature.iconColor"
          :badge-text="feature.badgeText"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import FeatureCard from './FeatureCard.vue'

const featuresData = [
  {
    title: 'Smart Validation',
    description: 'Checks 50+ metadata fields against distributor requirements following industry standards (DDEX). Know exactly what needs fixing before submission.',
    bulletPoints: [
      'DistroKid, CD Baby, TuneCore compatibility',
      'ISRC format validation',
      'Technical quality checks'
    ],
    icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>`,
    iconColor: 'bg-secondary-300'
  },
  {
    title: 'Auto-Correction',
    description: 'Fix metadata issues with one click. Download corrected files with embedded metadata ready for any distribution platform.',
    bulletPoints: [
      'Capitalization & formatting fixes',
      'Embed corrected metadata in files',
      'Genre optimization suggestions'
    ],
    icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
    </svg>`,
    iconColor: 'bg-secondary-400'
  },
  {
    title: 'Bulk Operations',
    description: 'Manage entire albums or catalogs at once. Perfect for labels managing multiple artists.',
    bulletPoints: [
      'Album-level consistency',
      'Multi-artist management',
      'Batch corrections'
    ],
    icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
    </svg>`,
    iconColor: 'bg-secondary-500'
  },
  {
    title: 'Metadata Manager',
    description: 'See a complete overview of your metadata, its quality, and the direct impact on your revenue and discoverability.',
    bulletPoints: [
      'Simple grid interface',
      'Create reports and output CSVs',
      'Lost royalty estimation'
    ],
    icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
    </svg>`,
    iconColor: 'bg-secondary-600'
  },
  {
    title: 'ISRC Generation',
    description: 'Generate unique ISRC codes instantly. Essential for radio play royalties and streaming analytics.',
    bulletPoints: [
      'Official ISRC Manager status',
      'Instant generation & embedding',
      'Radio royalty eligibility'
    ],
    icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l-5 7 5 7M10 5l-5 7 5 7"/>
    </svg>`,
    iconColor: 'bg-secondary-700',
    badgeText: 'Coming Soon'
  },
  {
    title: 'PRO Registration Guidance',
    description: 'Streamlined registration with PRS, SGAE, SACEM and other collection societies worldwide.',
    bulletPoints: [
      'Pre-filled forms from metadata',
      'Step-by-step guidance',
      'Multi-territory support'
    ],
    icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>`,
    iconColor: 'bg-secondary-800',
    badgeText: 'Coming Soon'
  }
]
</script>