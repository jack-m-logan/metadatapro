<template>
  <div :class="containerClass">
    <div class="p-6">
      <!-- Header with Icon and Content -->
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div 
            :class="iconBackgroundClass"
            class="w-8 h-8 rounded-md flex items-center justify-center"
          >
            <span 
              :class="iconTextClass"
              class="text-lg"
            >
              {{ icon }}
            </span>
          </div>
        </div>
        <div class="ml-5">
          <h3 
            :class="titleClass"
            class="text-lg font-medium"
          >
            {{ title }}
          </h3>
          <p 
            :class="descriptionClass"
            class="text-sm"
          >
            {{ description }}
          </p>
        </div>
      </div>
      
      <!-- Action Button -->
      <div class="mt-4">
        <slot name="action">
          <NuxtLink
            v-if="to"
            :to="to"
            :class="buttonClass"
            class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md w-full justify-center focus:outline-none focus:ring-2 focus:ring-offset-2"
            :disabled="disabled"
          >
            {{ actionText }}
          </NuxtLink>
          <button
            v-else-if="actionText"
            :class="buttonClass" 
            class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md w-full justify-center focus:outline-none focus:ring-2 focus:ring-offset-2"
            :disabled="disabled"
            @click="$emit('action')"
          >
            {{ actionText }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  actionText: {
    type: String,
    default: ''
  },
  to: {
    type: String,
    default: null
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'gradient', 'outline'].includes(value)
  },
  color: {
    type: String,
    default: 'indigo',
    validator: (value) => ['indigo', 'purple', 'blue', 'green', 'red', 'yellow', 'gray'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'compact'].includes(value)
  }
})

const emit = defineEmits(['action'])

const containerClass = computed(() => {
  const baseClass = 'overflow-hidden shadow rounded-lg'
  
  // gradient like on Pro card
  if (props.variant === 'gradient') {
    return `${baseClass} bg-gradient-to-r from-purple-400 to-indigo-500`
  } else {
    return `${baseClass} bg-white`
  }
})

const iconBackgroundClass = computed(() => {
  if (props.variant === 'gradient') {
    return 'bg-white bg-opacity-20'
  }
  
  const colorMap = {
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500', 
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500'
  }
  
  return colorMap[props.color] || 'bg-indigo-500'
})

const iconTextClass = computed(() => {
  return 'text-white'
})

const titleClass = computed(() => {
  if (props.variant === 'gradient') {
    return 'text-white'
  }
  return 'text-gray-900'
})

const descriptionClass = computed(() => {
  if (props.variant === 'gradient') {
    return 'text-purple-100'
  }
  return 'text-gray-500'
})

const buttonClass = computed(() => {
  if (props.disabled) {
    return 'border border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
  }
  
  const variantMap = {
    primary: {
      indigo: 'border border-transparent shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
      purple: 'border border-transparent shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
      blue: 'border border-transparent shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      green: 'border border-transparent shadow-sm text-white bg-green-600 hover:bg-green-700 focus:ring-green-500',
      red: 'border border-transparent shadow-sm text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
    },
    secondary: {
      indigo: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500',
      purple: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-purple-500',
      gray: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500'
    },
    gradient: {
      default: 'border border-transparent text-purple-600 bg-white hover:bg-gray-50 focus:ring-purple-500'
    },
    outline: {
      indigo: 'border-2 border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50 focus:ring-indigo-500',
      purple: 'border-2 border-purple-600 text-purple-600 bg-white hover:bg-purple-50 focus:ring-purple-500'
    }
  }
  
  if (props.variant === 'gradient') {
    return variantMap.gradient.default
  }
  
  return variantMap[props.variant]?.[props.color] || variantMap.primary.indigo
})
</script>