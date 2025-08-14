<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2 translate-x-2"
      enter-to-class="opacity-100 translate-y-0 translate-x-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 translate-x-0"
      leave-to-class="opacity-0 translate-y-2 translate-x-2"
    >
      <div
        v-if="visible"
        class="fixed top-4 right-4 z-50 max-w-sm rounded-lg shadow-lg p-4"
        :class="typeClasses"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <component
              :is="iconComponent"
              class="h-5 w-5"
              :class="iconClasses"
            />
          </div>
          <div class="ml-3">
            <p
              class="text-sm font-medium"
              :class="textClasses"
            >
              {{ message }}
            </p>
          </div>
          <button
            class="ml-auto pl-3 inline-flex rounded-md p-1.5 focus:outline-none"
            :class="buttonClasses"
            @click="$emit('close')"
          >
            <svg
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  }
})

defineEmits(['close'])

const typeClasses = computed(() => {
  const classes = {
    success: 'bg-green-100 border border-green-200',
    error: 'bg-red-100 border border-red-200',
    warning: 'bg-yellow-100 border border-yellow-200',
    info: 'bg-blue-100 border border-blue-200'
  }
  return classes[props.type]
})

const iconClasses = computed(() => {
  const classes = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  return classes[props.type]
})

const textClasses = computed(() => {
  const classes = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }
  return classes[props.type]
})

const buttonClasses = computed(() => {
  const classes = {
    success: 'text-green-500 hover:bg-green-200',
    error: 'text-red-500 hover:bg-red-200',
    warning: 'text-yellow-500 hover:bg-yellow-200',
    info: 'text-blue-500 hover:bg-blue-200'
  }
  return classes[props.type]
})
</script>