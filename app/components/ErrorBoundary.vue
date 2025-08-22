<template>
  <div
    v-if="hasError"
    class="error-boundary"
  >
    <div class="error-container">
      <div class="error-icon">
        <svg
          class="w-16 h-16 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      
      <div class="error-content">
        <h1 class="error-title">
          Something went wrong
        </h1>
        
        <div
          v-if="userFriendlyMessage"
          class="error-message"
        >
          {{ userFriendlyMessage }}
        </div>
        
        <div
          v-if="showDetails"
          class="error-details"
        >
          <details class="error-technical">
            <summary>Technical Details</summary>
            <div class="error-technical-content">
              <div class="error-info">
                <strong>Error:</strong> {{ error?.message || 'Unknown error' }}
              </div>
              <div
                v-if="error?.stack"
                class="error-stack"
              >
                <strong>Stack Trace:</strong>
                <pre>{{ error.stack }}</pre>
              </div>
              <div class="error-info">
                <strong>Component:</strong> {{ errorInfo?.componentName || 'Unknown' }}
              </div>
              <div class="error-info">
                <strong>Time:</strong> {{ errorTime }}
              </div>
              <div class="error-info">
                <strong>User Agent:</strong> {{ navigator.userAgent }}
              </div>
              <div class="error-info">
                <strong>URL:</strong> {{ window.location.href }}
              </div>
            </div>
          </details>
        </div>
        
        <div class="error-actions">
          <button
            class="btn-primary"
            @click="reload"
          >
            🔄 Reload Page
          </button>
          
          <button
            class="btn-secondary"
            @click="goHome"
          >
            🏠 Go Home
          </button>
          
          <button
            v-if="canRetry"
            class="btn-secondary"
            @click="retry"
          >
            🔁 Try Again
          </button>
          
          <button
            class="btn-tertiary"
            @click="reportError"
          >
            📝 Report Issue
          </button>
        </div>
        
        <div class="error-help">
          <h3>What can you do?</h3>
          <ul>
            <li>Try reloading the page - this often resolves temporary issues</li>
            <li>Check your internet connection</li>
            <li>Clear your browser cache and cookies</li>
            <li>Try using a different browser</li>
            <li>Contact support if the problem persists</li>
          </ul>
        </div>
        
        <div class="error-toggle">
          <button
            class="btn-link"
            @click="showDetails = !showDetails"
          >
            {{ showDetails ? 'Hide' : 'Show' }} Technical Details
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup>
interface Props {
  fallback?: string
  onError?: (error: Error, errorInfo: unknown) => void
}

const props = withDefaults(defineProps<Props>(), {
  fallback: 'Something went wrong. Please try again.'
})

const hasError = ref(false)
const error = ref<Error | null>(null)
const errorInfo = ref<unknown>(null)
const errorTime = ref('')
const showDetails = ref(false)
const canRetry = ref(true)

const userFriendlyMessage = computed(() => {
  if (!error.value) return props.fallback
  
  const errorMessage = error.value.message.toLowerCase()
  
  // Network-related errors
  if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('connection')) {
    return 'We\'re having trouble connecting to our servers. Please check your internet connection and try again.'
  }
  
  // Authentication errors
  if (errorMessage.includes('unauthorized') || errorMessage.includes('auth')) {
    return 'Your session has expired. Please log in again to continue.'
  }
  
  // Validation errors
  if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return 'There was an issue with the data provided. Please check your input and try again.'
  }
  
  // File upload errors
  if (errorMessage.includes('upload') || errorMessage.includes('file')) {
    return 'There was a problem uploading your file. Please try again with a different file or check your internet connection.'
  }
  
  // Permission errors
  if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
    return 'You don\'t have permission to perform this action. Please contact support if you believe this is an error.'
  }
  
  // Database errors
  if (errorMessage.includes('database') || errorMessage.includes('query')) {
    return 'We\'re experiencing database issues. Please try again in a few moments.'
  }
  
  // Generic fallback
  return props.fallback
})

const handleError = (err: Error, info?: unknown) => {
  hasError.value = true
  error.value = err
  errorInfo.value = info
  errorTime.value = new Date().toLocaleString()
  
  console.error('Error Boundary caught an error:', err, info)
  
  if (props.onError) {
    props.onError(err, info)
  }
  
  if (window.reportError) {
    window.reportError(err, {
      ...info,
      timestamp: errorTime.value,
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }
}

const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  handleError(new Error(event.reason?.toString() || 'Unhandled Promise Rejection'), {
    type: 'unhandledrejection',
    reason: event.reason
  })
  event.preventDefault()
}

const handleGlobalError = (event: ErrorEvent) => {
  handleError(new Error(event.message), {
    type: 'javascript',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  })
}

const reload = () => {
  window.location.reload()
}

const goHome = () => {
  window.location.href = '/dashboard'
}

const retry = () => {
  hasError.value = false
  error.value = null
  errorInfo.value = null
  canRetry.value = false
  
  // 30s retry
  setTimeout(() => {
    canRetry.value = true
  }, 30000)
}

const reportError = () => {
  const subject = encodeURIComponent('Error Report - MetaPro App')
  const body = encodeURIComponent(`
Error Details:
- Message: ${error.value?.message || 'Unknown error'}
- Time: ${errorTime.value}
- URL: ${window.location.href}
- User Agent: ${navigator.userAgent}
- Stack: ${error.value?.stack || 'No stack trace available'}

Please describe what you were doing when this error occurred:
[Your description here]
  `)
  
  window.open(`mailto:support@metapro.app?subject=${subject}&body=${body}`)
}

onMounted(() => {
  window.addEventListener('error', handleGlobalError)
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
})

onUnmounted(() => {
  window.removeEventListener('error', handleGlobalError)
  window.removeEventListener('unhandledrejection', handleUnhandledRejection)
})

defineExpose({
  handleError
})
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  padding: 2rem;
}

.error-container {
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.error-icon {
  display: flex;
  justify-content: center;
  padding: 2rem 2rem 1rem;
}

.error-content {
  padding: 0 2rem 2rem;
}

.error-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin: 0 0 1rem;
}

.error-message {
  font-size: 1.125rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-details {
  margin-bottom: 2rem;
}

.error-technical {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.error-technical summary {
  background: #f3f4f6;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-weight: 600;
  color: #374151;
  border: none;
  outline: none;
}

.error-technical summary:hover {
  background: #e5e7eb;
}

.error-technical-content {
  padding: 1rem;
  background: #fafafa;
  border-top: 1px solid #e5e7eb;
}

.error-info {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  word-break: break-word;
}

.error-info strong {
  color: #374151;
  font-weight: 600;
}

.error-stack {
  margin-bottom: 0.75rem;
}

.error-stack pre {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 0.75rem;
  color: #475569;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0.5rem 0 0;
}

.error-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.875rem;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-tertiary {
  background: none;
  color: #6b7280;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-tertiary:hover {
  color: #374151;
  border-color: #9ca3af;
}

.error-help {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.error-help h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #0c4a6e;
}

.error-help ul {
  margin: 0;
  padding-left: 1.25rem;
  color: #0369a1;
}

.error-help li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.error-toggle {
  text-align: center;
}

.btn-link {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.btn-link:hover {
  color: #2563eb;
}

@media (max-width: 640px) {
  .error-boundary {
    padding: 1rem;
  }
  
  .error-container {
    margin: 0;
  }
  
  .error-icon {
    padding: 1.5rem 1rem 0.5rem;
  }
  
  .error-content {
    padding: 0 1rem 1.5rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-message {
    font-size: 1rem;
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .error-actions button {
    width: 100%;
  }
}
</style>