<template>
  <div 
    :class="containerClass"
    class="flex items-center justify-center"
  >
    <div :class="wrapperClass">
      <svg
        class="animate-spin h-5 w-5"
        :class="spinnerColor"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span 
        v-if="message"
        :class="textClass"
        class="ml-3"
      >
        {{ message }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: 'Loading...'
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: 'indigo',
    validator: (value) => ['indigo', 'gray', 'white'].includes(value)
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  center: {
    type: Boolean,
    default: false
  },
  inline: {
    type: Boolean,
    default: false
  }
})

const containerClass = computed(() => {
  if (props.fullscreen) {
    return 'min-h-screen bg-gray-50'
  }
  if (props.center && !props.inline) {
    return 'py-6 sm:py-8'
  }
  return ''
})

const wrapperClass = computed(() => {
  const baseClasses = ['inline-flex', 'items-center']
  
  if (!props.inline) {
    baseClasses.push('px-4', 'py-2', 'border', 'border-transparent', 'rounded-md')
    
    if (props.size === 'small') {
      baseClasses.push('text-xs', 'font-medium')
    } else if (props.size === 'large') {
      baseClasses.push('text-base', 'font-medium')
    } else {
      baseClasses.push('text-sm', 'font-medium')
    }
  }
  
  return baseClasses.join(' ')
})

const spinnerColor = computed(() => {
  switch (props.color) {
    case 'white':
      return 'text-white'
    case 'gray':
      return 'text-gray-600'
    default:
      return 'text-indigo-600'
  }
})

const textClass = computed(() => {
  if (props.color === 'white') {
    return 'text-white'
  }
  if (props.color === 'gray') {
    return 'text-gray-600'
  }
  return 'text-indigo-600'
})
</script>