<template>
  <transition name="feedback">
    <div
      v-if="result && shouldShow"
      class="validation-feedback"
      :class="[
        `feedback-${result.severity}`,
        { 'feedback-inline': inline }
      ]"
    >
      <div class="feedback-content">
        <div class="feedback-icon">
          <component
            :is="getIcon(result.severity)"
            class="w-4 h-4"
          />
        </div>
        
        <div class="feedback-text">
          <div class="feedback-message">
            {{ result.message }}
          </div>
          <div
            v-if="result.suggestion"
            class="feedback-suggestion"
          >
            💡 {{ result.suggestion }}
          </div>
        </div>
        
        <div
          v-if="result.autoCorrect && result.correctedValue"
          class="feedback-actions"
        >
          <button
            class="btn-auto-correct"
            @click="$emit('auto-correct', result.correctedValue)"
          >
            Fix
          </button>
        </div>
        
        <button
          v-if="dismissible"
          class="feedback-dismiss"
          @click="$emit('dismiss')"
        >
          ×
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
interface ValidationResult {
  isValid: boolean
  message: string
  suggestion?: string
  correctedValue?: string
  severity: 'error' | 'warning' | 'info'
  autoCorrect?: boolean
}

interface Props {
  result: ValidationResult | null
  inline?: boolean
  dismissible?: boolean
  showSuccess?: boolean
}

interface Emits {
  (e: 'auto-correct', value: string): void
  (e: 'dismiss'): void
}

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  dismissible: true,
  showSuccess: false
})

const shouldShow = computed(() => {
  if (!props.result) return false
  if (props.result.severity === 'info' && props.result.isValid && !props.showSuccess) return false
  return true
})

const getIcon = (severity: string) => {
  switch (severity) {
    case 'error':
      return defineComponent({
        template: `<svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>`
      })
    case 'warning':
      return defineComponent({
        template: `
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        `
      })
    case 'info':
      return defineComponent({
        template: `
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        `
      })
    default:
      return defineComponent({
        template: `
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        `
      })
  }
}
</script>

<style scoped>
.validation-feedback {
  border-radius: 6px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.feedback-error {
  background: #fef2f2;
  border: 1px solid #fca5a5;
}

.feedback-warning {
  background: #fffbeb;
  border: 1px solid #fbbf24;
}

.feedback-info {
  background: #eff6ff;
  border: 1px solid #93c5fd;
}

.feedback-inline {
  position: absolute;
  z-index: 10;
  min-width: 200px;
  max-width: 400px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.feedback-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
}

.feedback-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.feedback-error .feedback-icon {
  color: #dc2626;
}

.feedback-warning .feedback-icon {
  color: #d97706;
}

.feedback-info .feedback-icon {
  color: #2563eb;
}

.feedback-text {
  flex: 1;
  min-width: 0;
}

.feedback-message {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.feedback-error .feedback-message {
  color: #991b1b;
}

.feedback-warning .feedback-message {
  color: #92400e;
}

.feedback-info .feedback-message {
  color: #1e40af;
}

.feedback-suggestion {
  font-size: 0.8125rem;
  line-height: 1.4;
  color: #6b7280;
}

.feedback-actions {
  flex-shrink: 0;
}

.btn-auto-correct {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-auto-correct:hover {
  background: #2563eb;
}

.feedback-dismiss {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: color 0.2s;
}

.feedback-dismiss:hover {
  color: #6b7280;
  background: rgba(0, 0, 0, 0.05);
}

.feedback-enter-active, .feedback-leave-active {
  transition: all 0.3s ease;
}

.feedback-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.feedback-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>