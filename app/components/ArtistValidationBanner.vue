<template>
  <div
    v-if="shouldShow"
    class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4"
  >
    <div class="flex items-start">
      <div class="ml-3 flex-1">
        <h3 class="text-sm font-medium text-yellow-800">
          {{ title }}
        </h3>
        <div class="mt-2 text-sm text-yellow-700">
          <p>{{ message }}</p>
        </div>

        <!-- Quick Actions -->
        <div class="mt-4 space-y-3">
          <div v-if="!showingForm && canAddAlias">
            <button
              class="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
              @click="showAddForm"
            >
              Add "{{ artistName }}" as verified alias
            </button>
          </div>

          <!-- Inline form -->
          <div
            v-if="showingForm"
            class="max-w-md"
          >
            <div class="space-y-2">
              <div class="flex items-center space-x-2"> 
                <input
                  v-model="evidenceUrl"
                  type="url"
                  placeholder="https://spotify.com/artist/... or social media URL"
                  class="flex-1 min-w-0 text-sm border rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                  :class="showValidationError ? 'border-red-300' : 'border-yellow-300'"
                  required
                  @blur="showValidationError = true"
                >
                <button
                  class="text-sm font-medium px-3 py-1 rounded-md focus:outline-none focus:ring-2 transition-colors"
                  :class="canSubmit 
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
                  :disabled="!canSubmit || isProcessing"
                  @click="addAlias"
                >
                  {{ isProcessing ? 'Adding...' : 'Add' }}
                </button>
                <button
                  class="text-sm text-yellow-700 hover:text-yellow-800"
                  @click="cancelAdd"
                >
                  Cancel
                </button>
              </div>
              
              <!-- Helper text / validation messages -->
              <p class="text-xs text-yellow-700">
                Required: Provide a valid URL to verify your identity as this artist
              </p>
              <p
                v-if="showValidationError && evidenceUrl.trim() && !isValidUrl"
                class="text-xs text-red-600"
              >
                Please enter a valid URL (e.g., https://example.com)
              </p>
              <p
                v-if="showValidationError && !evidenceUrl.trim()"
                class="text-xs text-red-600"
              >
                Verification URL is required
              </p>
            </div>
          </div>

          <!-- Upgrade prompt -->
          <div
            v-if="showUpgradePrompt"
            class="space-y-2"
          >
            <div class="text-sm text-yellow-700">
              or
            </div>
            <button
              class="text-sm font-medium bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled
              @click="upgradeToLabel"
            >
              ⭐ Upgrade to Label tier
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Props {
  artistName: string
  userTier: string
  context?: string
  uploadPattern?: {
    multiArtistBehavior: boolean
    uniqueArtists: number
    shouldUpgrade: boolean
  }
  visible?: boolean
}

interface Emits {
  (e: 'alias-added', artistName: string): void
  (e: 'dismissed'): void
}

const props = withDefaults(defineProps<Props>(), {
  context: 'upload',
  visible: true
})

const emit = defineEmits<Emits>()

const { addArtistAlias } = useArtistValidation()

const showingForm = ref(false)
const evidenceUrl = ref('')
const isProcessing = ref(false)
const showValidationError = ref(false)

const shouldShow = computed(() => {
  return props.visible && props.artistName && props.userTier === 'artist'
})

const canAddAlias = computed(() => {
  return props.userTier === 'artist'
})

const showUpgradePrompt = computed(() => {
  return props.uploadPattern?.shouldUpgrade ||
    (props.uploadPattern?.multiArtistBehavior && props.uploadPattern?.uniqueArtists >= 3)
})

const title = computed(() => {
  if (showUpgradePrompt.value) {
    return 'Multiple Artists Detected'
  }

  switch (props.context) {
    case 'upload':
      return 'Unverified Artist Name'
    case 'metadata':
      return 'Artist Verification Required'
    default:
      return 'Artist Verification Needed'
  }
})

const message = computed(() => {
  if (showUpgradePrompt.value) {
    const count = props.uploadPattern?.uniqueArtists || 0
    return `You're managing ${count} different artists. Consider upgrading to Label tier for unlimited artist management.`
  }

  switch (props.context) {
    case 'upload':
      return `"${props.artistName}" is not in your verified artist list. Add it as an alias or upgrade to Label tier for unlimited artist management.`
    case 'metadata':
      return `To edit metadata for "${props.artistName}", you need to verify this artist name first.`
    default:
      return `"${props.artistName}" needs to be verified before you can proceed.`
  }
})

const isValidUrl = computed(() => {
  if (!evidenceUrl.value.trim()) return false
  
  try {
    new URL(evidenceUrl.value)
    return true
  } catch {
    return false
  }
})

const canSubmit = computed(() => {
  return evidenceUrl.value.trim() && isValidUrl.value
})

const showAddForm = () => {
  showingForm.value = true
}

const cancelAdd = () => {
  showingForm.value = false
  evidenceUrl.value = ''
  showValidationError.value = false
}

const addAlias = async () => {
  showValidationError.value = true
  
  if (!canSubmit.value) {
    return
  }
  
  try {
    isProcessing.value = true

    await addArtistAlias(props.artistName, evidenceUrl.value)

    emit('alias-added', props.artistName)
    showingForm.value = false
    evidenceUrl.value = ''
    showValidationError.value = false
  } catch (error) {
    console.error('Failed to add artist alias:', error)
    // error handling done by parent component
  } finally {
    isProcessing.value = false
  }
}

const upgradeToLabel = () => {
  navigateTo('/dashboard/upgrade?tier=label')
}
</script>