<template>
  <div class="validation-results">
    <!-- Header -->
    <div class="bg-white shadow rounded-lg mb-6">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              Validation Results
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ results.track?.filename || 'Unknown Track' }}
            </p>
          </div>
          <button
            v-if="showBackButton"
            class="text-sm text-indigo-600 hover:text-indigo-500"
            @click="$emit('back-to-upload')"
          >
            ← Upload Another Track
          </button>
        </div>
      </div>

      <div class="px-6 py-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Validation Score</span>
              <span class="text-sm font-medium text-gray-900">
                {{ results.validationScore || 0 }}/100
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-500"
                :class="getScoreColor(results.validationScore || 0)"
                :style="{ width: `${results.validationScore || 0}%` }"
              />
            </div>
          </div>
          <StatusBadge
            type="score"
            :value="results.validationScore || 0"
            shape="pill"
            size="base"
          />
        </div>

        <!-- Revenue Impact Message -->
        <AlertBanner
          v-if="results.validationScore < 80"
          type="warning"
          title="Revenue Impact Warning"
          :message="getRevenueImpactMessage(results.validationScore, results.issues)"
          class="mt-4"
          size="small"
        />
      </div>
    </div>

    <!-- Track Information -->
    <div class="bg-white shadow rounded-lg mb-6">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          Track Information
        </h3>
      </div>
      <div class="px-6 py-4">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div>
            <dt class="text-sm font-medium text-gray-500">
              Title
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ results.metadata?.title || 'Not detected' }}
              <span
                v-if="!results.metadata?.title"
                class="text-red-600 ml-2"
              >⚠ Required for distribution</span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">
              Artist
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ results.metadata?.artist || 'Not detected' }}
              <span
                v-if="!results.metadata?.artist"
                class="text-red-600 ml-2"
              >⚠ Required for distribution</span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">
              Duration
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatDuration(results.metadata?.duration) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">
              Format
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ results.metadata?.codec || 'Unknown' }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">
              Sample Rate
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ results.metadata?.sample_rate ? `${results.metadata.sample_rate} Hz` : 'Unknown' }}
              <span
                v-if="results.metadata?.sample_rate && results.metadata.sample_rate < 44100"
                class="text-yellow-600 ml-2"
              >⚠ Low quality</span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">
              ISRC
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ results.metadata?.isrc || 'Not found' }}
              <span
                v-if="!results.metadata?.isrc"
                class="text-blue-600 ml-2"
              >💰 Missing radio royalties</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Issues Found -->
    <div class="bg-white shadow rounded-lg mb-6">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          Issues Found
        </h3>
      </div>
      <div class="divide-y divide-gray-200">
        <div
          v-if="!results.issues || results.issues.length === 0"
          class="px-6 py-8 text-center text-gray-500"
        >
          <div class="text-4xl mb-2">
            ✅
          </div>
          <p>No issues found! Your track looks good for distribution.</p>
        </div>

        <div
          v-for="issue in results.issues"
          :key="issue.id"
          class="px-6 py-4"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                :class="getSeverityColor(issue.severity)"
              >
                {{ getSeverityIcon(issue.severity) }}
              </div>
            </div>
            <div class="ml-3 flex-1">
              <h4 class="text-sm font-medium text-gray-900">
                {{ issue.title }}
              </h4>
              <p class="text-sm text-gray-600 mt-1">
                {{ issue.description }}
              </p>
              <p
                v-if="issue.suggestion"
                class="text-sm text-indigo-600 mt-2"
              >
                💡 {{ issue.suggestion }}
              </p>
              <!-- Correction CTA for fixable issues -->
              <div
                v-if="isFixableIssue(issue.issue_code)"
                class="mt-3 p-2 bg-green-50 border border-green-200 rounded"
              >
                <p class="text-sm text-green-800">
                  🔧 This can be fixed automatically for €0.99
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div
      v-if="showBackButton"
      class="bg-white shadow rounded-lg"
    >
      <div class="px-6 py-4">
        <div class="flex space-x-4">
          <button
            class="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            @click="downloadReport"
          >
            📄 Download Report
          </button>
          <button
            class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            @click="handleBackToUpload"
          >
            Upload Another Track
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  results: {
    type: Object,
    required: true
  },
  showBackButton: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['back-to-upload'])

const handleBackToUpload = () => {
  emit('back-to-upload')
}

const getScoreColor = (score) => {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}


const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return 'bg-red-500'
    case 'warning': return 'bg-yellow-500'
    case 'info': return 'bg-blue-500'
    default: return 'bg-gray-500'
  }
}

const getSeverityIcon = (severity) => {
  switch (severity) {
    case 'critical': return '!'
    case 'warning': return '⚠'
    case 'info': return 'i'
    default: return '?'
  }
}

const formatDuration = (seconds) => {
  if (!seconds) return 'Unknown'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getRevenueImpactMessage = (score, issues) => {
  const missingISRC = issues?.some(i => i.issue_code === 'missing_isrc')
  const criticalIssues = issues?.filter(i => i.severity === 'critical').length || 0

  if (missingISRC) {
    return 'Missing ISRC could cost you €50-200 per month in radio royalties. Generate one instantly with Pro.'
  }

  if (criticalIssues > 0) {
    return `${criticalIssues} critical issues may prevent distribution and cost you streaming revenue.`
  }

  return 'Some optimizations could improve your track\'s discoverability and revenue potential.'
}

const isFixableIssue = (issueCode) => {
  const fixableIssues = [
    'missing_title',
    'missing_artist',
    'missing_album',
    'missing_isrc',
    'invalid_isrc_format'
  ]
  return fixableIssues.includes(issueCode)
}

const downloadReport = () => {
  // TODO: Implement report download
  console.log('Download report for:', props.results)
}
</script>