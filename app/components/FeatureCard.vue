<template>
  <div class="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl animate-fade-in hover:shadow-lg transition-shadow duration-300 relative flex flex-col">
    <div class="glass-card p-6 flex flex-col h-full rounded-xl">
      <div 
        v-if="badgeText" 
        class="absolute top-4 right-4 z-10"
      >
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          {{ badgeText }}
        </span>
      </div>

      <!-- Icon -->
      <div 
        class="w-12 h-12 rounded-lg flex items-center justify-center mb-4 relative z-10"
        :class="iconColor"
      >
        <div v-html="icon" />
      </div>

      <!-- Title -->
      <h3 class="text-xl font-bold text-neutral-900 mb-3 relative z-10">
        {{ title }}
      </h3>

      <div class="flex-1 flex flex-col relative z-10">
        <p class="text-neutral-600 mb-4 text-sm leading-relaxed">
          {{ description }}
        </p>

        <div class="space-y-1 mt-auto">
          <div 
            v-for="(point, index) in bulletPoints" 
            :key="index"
            class="flex items-center text-sm text-neutral-500"
          >
            <span 
              class="w-1 h-1 rounded-full mr-2 flex-shrink-0"
              :class="iconColor"
            />
            {{ point }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  bulletPoints: {
    type: Array,
    required: true,
    validator: (value) => value.length === 3 // Ensure exactly 3 bullet points
  },
  icon: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    required: true
  },
  badgeText: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>