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
            <div class="flex items-center mt-1 space-x-2">
              <p class="text-sm text-gray-600">
                {{ decodeHtmlPlain(results.track?.filename) || 'Unknown Track' }}
              </p>
              <StatusBadge
                v-if="results.hasChangedSinceValidation"
                type="custom"
                value="Changed Since Validation"
                color="yellow"
                shape="pill"
                size="sm"
                class="ml-2"
              />
              <StatusBadge
                v-else-if="results.validatedAt"
                type="custom"
                value="Current"
                color="green"
                shape="pill"
                size="sm"
                class="ml-2"
              />
            </div>
          </div>
          <button
            v-if="showBackButton"
            class="text-sm text-indigo-600 hover:text-indigo-500"
            @click="$emit('back-to-upload')"
          >
            ← Back
          </button>
        </div>
      </div>

      <div class="px-6 py-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-700">
                  {{ results.hasChangedSinceValidation ? 'Last Validation Score' : 'Validation Score' }}
                </span>
                <span
                  v-if="results.validatedAt"
                  class="text-xs text-gray-500"
                >
                  {{ formatValidationDate(results.validatedAt) }}
                </span>
              </div>
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

        <AlertBanner
          v-if="results.hasChangedSinceValidation"
          type="info"
          title="Metadata Changed"
          message="This track has been edited since the last validation. Results shown reflect the previous state."
          class="mt-4"
          size="small"
        >
          <template #action>
            <button
              class="text-sm font-medium text-indigo-600 hover:text-indigo-500 underline"
              @click="$emit('re-validate')"
            >
              Validate Current Metadata
            </button>
          </template>
        </AlertBanner>

        <!-- Revenue Impact Message -->
        <AlertBanner
          v-else-if="results.validationScore < 80"
          type="warning"
          title="Revenue Impact Warning"
          :message="getRevenueImpactMessage(results.validationScore, results.issues)"
          class="mt-4"
          size="small"
        />
      </div>
    </div>

    <!-- Track Information - Show Current State -->
    <div class="bg-white shadow rounded-lg mb-6">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ results.hasChangedSinceValidation ? 'Current Track Information' : 'Track Information' }}
          </h3>
          <span
            v-if="results.hasChangedSinceValidation"
            class="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded"
          >
            Modified
          </span>
        </div>
      </div>
      <div class="px-6 py-4">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <MetadataField
            label="Title"
            :current-value="results.currentMetadata?.title"
            :original-value="results.metadata?.title"
            :show-comparison="results.hasChangedSinceValidation"
            required
          />
          <MetadataField
            label="Artist"
            :current-value="results.currentMetadata?.artist"
            :original-value="results.metadata?.artist"
            :show-comparison="results.hasChangedSinceValidation"
            required
          />
          <MetadataField
            label="Album"
            :current-value="results.currentMetadata?.album"
            :original-value="results.metadata?.album"
            :show-comparison="results.hasChangedSinceValidation"
          />
          <MetadataField
            label="Genre"
            :current-value="results.currentMetadata?.genre"
            :original-value="results.metadata?.genre"
            :show-comparison="results.hasChangedSinceValidation"
            helps-discoverability
          />
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
              {{ formatAudioFormat(results.metadata?.codec, results.metadata?.container) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">
              Sample Rate
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ results.metadata?.sample_rate ? `${results.metadata.sample_rate.toLocaleString()} Hz` : 'Unknown' }}
              <span
                v-if="results.metadata?.sample_rate && results.metadata.sample_rate < 44100"
                class="text-yellow-600 ml-2"
              >
                ⚠ Low quality
              </span>
            </dd>
          </div>
          <MetadataField
            label="ISRC"
            :current-value="results.currentMetadata?.isrc"
            :original-value="results.metadata?.isrc"
            :show-comparison="results.hasChangedSinceValidation"
            affects-royalties
          />
        </dl>
      </div>
    </div>

    <!-- Issues Found -->
    <div class="bg-white shadow rounded-lg mb-6">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          Issues Found
          <span
            v-if="results.hasChangedSinceValidation"
            class="text-sm text-orange-600 ml-2"
          >
            (from most recent validation)
          </span>
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
                {{ decodeHtmlPlain(issue.title) }}
              </h4>
              <p class="text-sm text-gray-600 mt-1">
                {{ decodeHtmlPlain(issue.description) }}
              </p>
              <p
                v-if="issue.suggestion"
                class="text-sm text-indigo-600 mt-2"
              >
                💡 {{ decodeHtmlPlain(issue.suggestion) }}
              </p>
              <!-- Correction CTA for fixable issues -->
              <div
                v-if="isFixableIssue(issue.issue_code)"
                class="mt-3 p-2 bg-green-50 border border-green-200 rounded"
              >
                <p class="text-sm text-green-800">
                  🔧 This can be fixed automatically
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
            v-if="results.hasChangedSinceValidation"
            class="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            @click="$emit('re-validate')"
          >
            🎯 Validate Current Metadata
          </button>
          <button
            v-else
            class="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            @click="downloadReport"
          >
            📄 Download Report
          </button>
          <button
            class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            @click="handleBackToUpload"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// MetadataField component for showing current vs original values
const MetadataField = defineComponent({
  props: {
    label: String,
    currentValue: String,
    originalValue: String,
    showComparison: Boolean,
    required: Boolean,
    helpsDiscoverability: Boolean,
    affectsRoyalties: Boolean
  },
  setup(props) {
    const hasChanged = computed(() => {
      if (!props.showComparison) return false
      const current = props.currentValue?.trim() || null
      const original = props.originalValue?.trim() || null
      return current !== original
    })

    const getWarningText = () => {
      if (props.required) return '⚠ Required for distribution'
      if (props.helpsDiscoverability) return '⚠ Improves discoverability'
      if (props.affectsRoyalties) return '💰 Missing radio royalties'
      return null
    }

    return { hasChanged, getWarningText }
  },
  template: `
    <div>
      <dt class="text-sm font-medium text-gray-500 flex items-center">
        {{ label }}
        <span v-if="hasChanged" class="ml-2 text-xs text-orange-500">Changed</span>
      </dt>
      <dd class="mt-1 text-sm text-gray-900">
        <span v-if="currentValue">{{ currentValue }}</span>
        <span v-else class="text-gray-500 italic">Not specified</span>
        
        <!-- Show warning for missing required/important fields -->
        <span v-if="!currentValue && getWarningText()" class="text-red-600 ml-2 text-xs">
          {{ getWarningText() }}
        </span>
        
        <!-- Show comparison if changed -->
        <div v-if="hasChanged && showComparison" class="mt-1 text-xs text-gray-500">
          Originally: {{ originalValue || 'Not specified' }}
        </div>
      </dd>
    </div>
  `
})

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

const emit = defineEmits(['back-to-upload', 're-validate'])

const decodeHtmlPlain = (text) => {
  if (!text) return ''
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

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
  const secs = Math.round(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatAudioFormat = (codec, container) => {
  return codec || container || 'Unknown'
}

const formatValidationDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getRevenueImpactMessage = (score, issues) => {
  const missingISRC = issues?.some(i => i.issue_code === 'missing_isrc')
  const criticalIssues = issues?.filter(i => i.severity === 'critical').length || 0

  if (missingISRC) {
    return 'Missing ISRC could cost you £50-200 per month in royalties.'
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
  console.log('Download report for:', props.results)
}
</script>