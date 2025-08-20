<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Artist Name *
      </label>
      <input
        v-model="formData.artistName"
        type="text"
        required
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        :class="{ 'border-red-300': showErrors && !formData.artistName.trim() }"
        placeholder="Enter artist name"
        @blur="showErrors = true"
      >
      <p
        v-if="showErrors && !formData.artistName.trim()"
        class="mt-1 text-xs text-red-600"
      >
        Artist name is required
      </p>
    </div>
    
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Verification Evidence (URL) *
      </label>
      <input
        v-model="formData.evidence"
        type="url"
        required
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        :class="{ 'border-red-300': showErrors && !isValidUrl }"
        placeholder="https://example.com/your-profile"
        @blur="showErrors = true"
      >
      <p class="text-xs text-gray-500 mt-1">
        Required: Provide a valid URL to verify your identity as this artist (social media, streaming profile, official website, etc.)
      </p>
      <p
        v-if="showErrors && formData.evidence.trim() && !isValidUrl"
        class="mt-1 text-xs text-red-600"
      >
        Please enter a valid URL (e.g., https://example.com)
      </p>
      <p
        v-if="showErrors && !formData.evidence.trim()"
        class="mt-1 text-xs text-red-600"
      >
        Verification URL is required
      </p>
    </div>
    
    <div class="flex justify-end space-x-3">
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        @click="handleCancel"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
        :class="canSubmit 
          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
        :disabled="!canSubmit || isSubmitting"
      >
        {{ isSubmitting ? 'Adding...' : 'Add Artist' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
interface Props {
  isSubmitting?: boolean
}

interface FormData {
  artistName: string
  evidence: string
}

interface Emits {
  (e: 'submit', data: FormData): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false
})

const emit = defineEmits<Emits>()

// Form state
const formData = ref<FormData>({
  artistName: '',
  evidence: ''
})

const showErrors = ref(false)

// Validation
const isValidUrl = computed(() => {
  if (!formData.value.evidence.trim()) return false
  
  try {
    new URL(formData.value.evidence)
    return true
  } catch {
    return false
  }
})

const canSubmit = computed(() => {
  return formData.value.artistName.trim() && 
         formData.value.evidence.trim() && 
         isValidUrl.value
})

const handleSubmit = () => {
  showErrors.value = true
  
  if (canSubmit.value) {
    emit('submit', {
      artistName: formData.value.artistName.trim(),
      evidence: formData.value.evidence.trim()
    })
  }
}

const handleCancel = () => {
  emit('cancel')
}

const resetForm = () => {
  formData.value = {
    artistName: '',
    evidence: ''
  }
  showErrors.value = false
}

// Expose reset for parent components
defineExpose({
  resetForm
})
</script>