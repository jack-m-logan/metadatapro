<template>
  <div
    v-if="visible"
    :class="[containerClass, containerSpacing]"
  >
    <div class="flex">
      <!-- Icon -->
      <div 
        v-if="showIcon"
        class="flex-shrink-0"
      >
        <component 
          :is="iconComponent"
          :class="iconClass"
          class="h-5 w-5"
        />
      </div>
      
      <!-- Content -->
      <div :class="contentClass">
        <h3 
          v-if="title"
          :class="titleClass"
          class="text-sm font-medium"
        >
          {{ title }}
        </h3>
        <div 
          :class="messageClass"
          class="text-sm"
        >
          <p v-if="typeof message === 'string'">
            {{ message }}
          </p>
          <ul
            v-else-if="Array.isArray(message)"
            class="space-y-1"
          >
            <li
              v-for="(item, index) in message"
              :key="index"
            >
              • {{ item }}
            </li>
          </ul>
          <div v-else>
            {{ String(message) }}
          </div>
        </div>
        
        <!-- Action Button -->
        <div 
          v-if="actionText || $slots.action"
          class="mt-3"
        >
          <slot name="action">
            <button
              v-if="actionText"
              :class="buttonClass"
              class="px-3 py-1 rounded-md text-sm font-medium hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2"
              @click="$emit('action')"
            >
              {{ actionText }}
            </button>
          </slot>
        </div>
      </div>
      
      <!-- Dismiss Button -->
      <div 
        v-if="dismissible"
        class="ml-auto pl-3"
      >
        <div class="-mx-1.5 -my-1.5">
          <button
            type="button"
            :class="dismissButtonClass"
            class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            @click="handleDismiss"
          >
            <span class="sr-only">Dismiss</span>
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const ExclamationTriangleIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>
  `
}

const CheckCircleIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.23 10.661a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
    </svg>
  `
}

const XCircleIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
    </svg>
  `
}

const InformationCircleIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
    </svg>
  `
}

const XMarkIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  `
}

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'warning', 'error', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: [String, Array],
    required: true
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  actionText: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'filled',
    validator: (value) => ['filled', 'outlined', 'minimal'].includes(value)
  },
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['small', 'normal'].includes(value)
  }
})

const emit = defineEmits(['dismiss', 'action'])

const visible = ref(true)

const typeConfig = computed(() => {
  const configs = {
    success: {
      icon: CheckCircleIcon,
      background: 'bg-green-50',
      border: 'border-green-200',
      iconColor: 'text-green-400',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700',
      buttonBg: 'bg-green-100',
      buttonText: 'text-green-800',
      buttonHover: 'hover:bg-green-200',
      dismissButton: 'text-green-500 hover:bg-green-100 focus:ring-green-600'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      background: 'bg-yellow-50',
      border: 'border-yellow-200',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700',
      buttonBg: 'bg-yellow-100',
      buttonText: 'text-yellow-800',
      buttonHover: 'hover:bg-yellow-200',
      dismissButton: 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600'
    },
    error: {
      icon: XCircleIcon,
      background: 'bg-red-50',
      border: 'border-red-200',
      iconColor: 'text-red-400',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
      buttonBg: 'bg-red-100',
      buttonText: 'text-red-800',
      buttonHover: 'hover:bg-red-200',
      dismissButton: 'text-red-500 hover:bg-red-100 focus:ring-red-600'
    },
    info: {
      icon: InformationCircleIcon,
      background: 'bg-blue-50',
      border: 'border-blue-200',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700',
      buttonBg: 'bg-blue-100',
      buttonText: 'text-blue-800',
      buttonHover: 'hover:bg-blue-200',
      dismissButton: 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
    }
  }
  return configs[props.type]
})

const containerClass = computed(() => {
  const config = typeConfig.value
  const baseClass = 'rounded-md'
  
  if (props.variant === 'filled') {
    return `${baseClass} ${config.background} border ${config.border}`
  } else if (props.variant === 'outlined') {
    return `${baseClass} border-2 ${config.border} bg-white`
  } else {
    return `${baseClass} ${config.background}`
  }
})

const containerSpacing = computed(() => {
  return props.size === 'small' ? 'p-3' : 'p-4'
})

const iconComponent = computed(() => typeConfig.value.icon)
const iconClass = computed(() => typeConfig.value.iconColor)

const contentClass = computed(() => {
  return props.showIcon ? 'ml-3 flex-1' : 'flex-1'
})

const titleClass = computed(() => typeConfig.value.titleColor)

const messageClass = computed(() => {
  const baseClass = typeConfig.value.messageColor
  return props.title ? `${baseClass} mt-1` : baseClass
})

const buttonClass = computed(() => {
  const config = typeConfig.value
  return `${config.buttonBg} ${config.buttonText} ${config.buttonHover}`
})

const dismissButtonClass = computed(() => typeConfig.value.dismissButton)

const handleDismiss = () => {
  visible.value = false
  emit('dismiss')
}
</script>