<template>
  <span
    :class="[badgeClasses, sizeClasses, colorClasses]"
    class="inline-flex items-center font-medium"
    :aria-label="ariaLabel"
    role="status"
  >
    {{ displayText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'custom',
    validator: (value) => ['score', 'status', 'tier', 'priority', 'custom'].includes(value)
  },
  value: {
    type: [String, Number],
    required: true
  },
  color: {
    type: String,
    default: null,
    validator: (value) => !value || ['green', 'yellow', 'red', 'blue', 'purple', 'gray', 'indigo'].includes(value)
  },
  variant: {
    type: String,
    default: 'filled',
    validator: (value) => ['filled', 'outlined'].includes(value)
  },
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['xs', 'sm', 'base'].includes(value)
  },
  shape: {
    type: String,
    default: 'rounded',
    validator: (value) => ['rounded', 'pill'].includes(value)
  },
  suffix: {
    type: String,
    default: ''
  }
})

// Score-based color logic
const getScoreColor = (score) => {
  const numScore = Number(score)
  if (numScore >= 80) return 'green'
  if (numScore >= 60) return 'yellow'
  return 'red'
}

// Status-based color logic  
const getStatusColor = (status) => {
  const statusMap = {
    'completed': 'green',
    'validated': 'green', 
    'success': 'green',
    'processing': 'yellow',
    'pending': 'yellow',
    'warning': 'yellow',
    'error': 'red',
    'failed': 'red',
    'cancelled': 'red',
    'draft': 'gray',
    'inactive': 'gray'
  }
  return statusMap[String(status).toLowerCase()] || 'gray'
}

// Tier-based color logic
const getTierColor = (tier) => {
  const tierMap = {
    'pro': 'purple',
    'premium': 'purple',
    'plus': 'blue',
    'basic': 'gray',
    'free': 'gray'
  }
  return tierMap[String(tier).toLowerCase()] || 'gray'
}

// Status text mapping
const getStatusText = (status) => {
  const statusTexts = {
    'completed': 'Validated',
    'validated': 'Validated',
    'processing': 'Processing', 
    'pending': 'Pending',
    'error': 'Error',
    'failed': 'Error',
    'cancelled': 'Cancelled',
    'success': 'Success',
    'warning': 'Warning',
    'draft': 'Draft',
    'inactive': 'Inactive'
  }
  return statusTexts[String(status).toLowerCase()] || String(status)
}

// Determine the display color
const badgeColor = computed(() => {
  // Explicit color override
  if (props.color) return props.color
  
  // Type-based color logic
  switch (props.type) {
    case 'score':
      return getScoreColor(props.value)
    case 'status':
      return getStatusColor(props.value)
    case 'tier':
      return getTierColor(props.value)
    case 'priority':
      return props.value === 'high' ? 'red' : props.value === 'medium' ? 'yellow' : 'green'
    default:
      return 'gray'
  }
})

// Display text logic
const displayText = computed(() => {
  switch (props.type) {
    case 'score':
      return `${props.value}${props.suffix || '/100'}`
    case 'status':
      return getStatusText(props.value)
    case 'tier':
    case 'priority':
    case 'custom':
    default:
      return `${props.value}${props.suffix}`
  }
})

// Accessibility label
const ariaLabel = computed(() => {
  switch (props.type) {
    case 'score':
      return `Validation score: ${props.value} out of 100`
    case 'status':
      return `Status: ${getStatusText(props.value)}`
    case 'tier':
      return `Tier: ${props.value}`
    case 'priority':
      return `Priority: ${props.value}`
    default:
      return `${props.type}: ${props.value}`
  }
})

// Size classes
const sizeClasses = computed(() => {
  const sizeMap = {
    'xs': 'px-2 py-0.5 text-xs',
    'sm': 'px-2.5 py-0.5 text-xs', 
    'base': 'px-3 py-1 text-sm'
  }
  return sizeMap[props.size]
})

// Shape classes
const badgeClasses = computed(() => {
  return props.shape === 'pill' ? 'rounded-full' : 'rounded'
})

// Color classes based on variant and color
const colorClasses = computed(() => {
  const color = badgeColor.value
  
  const colorMap = {
    filled: {
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800', 
      red: 'bg-red-100 text-red-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800',
      indigo: 'bg-indigo-100 text-indigo-800'
    },
    outlined: {
      green: 'border border-green-200 text-green-800 bg-white',
      yellow: 'border border-yellow-200 text-yellow-800 bg-white',
      red: 'border border-red-200 text-red-800 bg-white', 
      blue: 'border border-blue-200 text-blue-800 bg-white',
      purple: 'border border-purple-200 text-purple-800 bg-white',
      gray: 'border border-gray-200 text-gray-800 bg-white',
      indigo: 'border border-indigo-200 text-indigo-800 bg-white'
    }
  }
  
  return colorMap[props.variant][color] || colorMap[props.variant]['gray']
})
</script>