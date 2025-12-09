<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div 
            class="w-8 h-8 rounded-md flex items-center justify-center"
            :class="iconBackgroundClass"
          >
            <span class="text-white text-sm font-medium">
              {{ icon }}
            </span>
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ label }}
            </dt>
            <dd class="text-lg font-medium text-gray-900">
              {{ formattedValue }}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'indigo',
    validator: (value) => [
      'indigo', 'blue', 'green', 'yellow', 'red', 'purple', 'pink', 'gray'
    ].includes(value)
  },
  suffix: {
    type: String,
    default: ''
  },
  format: {
    type: String,
    default: 'number',
    validator: (value) => ['number', 'percentage', 'currency', 'text'].includes(value)
  }
})

const iconBackgroundClass = computed(() => {
  const colorMap = {
    indigo: 'bg-indigo-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    gray: 'bg-gray-500'
  }
  return colorMap[props.color] || 'bg-indigo-500'
})

const formattedValue = computed(() => {
  const value = props.value

  switch (props.format) {
    case 'percentage':
      return `${value}%`
    case 'currency':
      return `£${value}`
    case 'text':
      return String(value)
    case 'number':
    default:
      // Add suffix if provided
      return props.suffix ? `${value}${props.suffix}` : String(value)
  }
})
</script>