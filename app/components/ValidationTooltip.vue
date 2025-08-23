<template>
  <teleport to="body">
    <div
      v-if="visible && track"
      ref="tooltipRef"
      class="validation-tooltip"
      :style="tooltipStyle"
      @click.stop
    >
      <div class="tooltip-header">
        <h4>{{ track.title || 'Untitled Track' }}</h4>
        <div class="validation-score">
          <span class="score-value">{{ validationSummary.score }}/100</span>
          <span
            class="score-status"
            :class="`status-${validationSummary.status}`"
          >
            {{ validationSummary.status }}
          </span>
        </div>
      </div>
      
      <div class="score-explanation">
        <div class="explanation-badge">
          <svg
            class="w-4 h-4 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="explanation-text">Auto Preview Score</span>
        </div>
        <p class="explanation-description">
          This is a quick assessment based on your current metadata. Run <strong>Full Validation</strong> for comprehensive analysis and official scoring used for distribution.
        </p>
      </div>
      
      <div class="tooltip-content">
        <div
          v-if="validationResults.length === 0"
          class="no-issues"
        >
          ✅ All metadata looks good!
        </div>
        
        <div
          v-else
          class="validation-issues"
        >
          <div
            v-for="(result, index) in validationResults"
            :key="index"
            class="validation-item"
            :class="`item-${result.severity}`"
          >
            <div class="item-icon">
              <component
                :is="getIcon(result.severity)"
                class="w-4 h-4"
              />
            </div>
            <div class="item-content">
              <div class="item-message">
                {{ result.message }}
              </div>
              <div
                v-if="result.suggestion"
                class="item-suggestion"
              >
                💡 {{ result.suggestion }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="tooltip-actions">
          <button
            class="btn-validate"
            @click="$emit('validate', track.id)"
          >
            Run Full Validation
          </button>
          <button
            class="btn-close"
            @click="$emit('close')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
interface Track {
  id: string
  title: string
  artist: string
  album: string
  isrc: string
  duration_seconds: number
  file_format: string
  sample_rate?: number
  bit_depth?: number
}

interface Props {
  visible: boolean
  track: Track | null
  position: { x: number; y: number }
}

interface Emits {
  (e: 'validate', trackId: string): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tooltipRef = ref<HTMLElement>()
const { validateTrack, getValidationSummary } = useValidationFeedback()

const validationResults = computed(() => {
  if (!props.track) return []
  return validateTrack(props.track)
})

const validationSummary = computed(() => {
  return getValidationSummary(validationResults.value)
})

const tooltipStyle = computed(() => {
  if (!props.visible) return { display: 'none' }
  
  const buffer = 20
  const tooltipWidth = 400
  const tooltipHeight = 350
  
  let x = props.position.x
  let y = props.position.y + 10
  
  // Smart positioning to stay within viewport
  if (x + tooltipWidth > window.innerWidth - buffer) {
    x = Math.max(buffer, window.innerWidth - tooltipWidth - buffer)
  }
  
  if (y + tooltipHeight > window.innerHeight - buffer) {
    y = Math.max(buffer, props.position.y - tooltipHeight - 10)
  }
  
  x = Math.max(buffer, x)
  y = Math.max(buffer, y)
  
  return {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    zIndex: 1000
  }
})

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

const handleClickOutside = (event: Event) => {
  if (tooltipRef.value && !tooltipRef.value.contains(event.target as Node)) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
})

const getIcon = (severity: string) => {
  const iconSvgs = {
    error: `<svg fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>`,
    warning: `<svg fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>`,
    info: `<svg fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
    </svg>`
  }
  
  return defineComponent({
    template: iconSvgs[severity] || iconSvgs.info
  })
}
</script>

<style scoped>
.validation-tooltip {
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  max-width: 400px;
  overflow: hidden;
  animation: fadeInScale 0.15s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.tooltip-header {
  background: #f9fafb;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tooltip-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  flex: 1;
  min-width: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.validation-score {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.score-value {
  font-weight: 700;
  font-size: 1.125rem;
  color: #374151;
}

.score-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-excellent {
  background: #d1fae5;
  color: #065f46;
}

.status-good {
  background: #dbeafe;
  color: #1e40af;
}

.status-fair {
  background: #fef3c7;
  color: #92400e;
}

.status-poor {
  background: #fee2e2;
  color: #991b1b;
}

.score-explanation {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  padding: 1rem;
  margin: 0;
}

.explanation-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.explanation-text {
  font-weight: 600;
  font-size: 0.875rem;
  color: #1e40af;
}

.explanation-description {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: #374151;
}

.explanation-description strong {
  color: #1e40af;
  font-weight: 600;
}

.tooltip-content {
  padding: 1rem;
  max-height: 250px;
  overflow-y: auto;
}

.no-issues {
  text-align: center;
  color: #059669;
  font-weight: 500;
  padding: 1rem 0;
}

.validation-issues {
  space-y: 0.75rem;
}

.validation-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

.item-error {
  background: #fef2f2;
  border: 1px solid #fca5a5;
}

.item-warning {
  background: #fffbeb;
  border: 1px solid #fbbf24;
}

.item-info {
  background: #eff6ff;
  border: 1px solid #93c5fd;
}

.item-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.item-error .item-icon {
  color: #dc2626;
}

.item-warning .item-icon {
  color: #d97706;
}

.item-info .item-icon {
  color: #2563eb;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-message {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.item-error .item-message {
  color: #991b1b;
}

.item-warning .item-message {
  color: #92400e;
}

.item-info .item-message {
  color: #1e40af;
}

.item-suggestion {
  font-size: 0.8125rem;
  line-height: 1.4;
  color: #6b7280;
}

.tooltip-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-validate {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  flex: 1;
}

.btn-validate:hover {
  background: #2563eb;
}

.btn-close {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #e5e7eb;
}
</style>