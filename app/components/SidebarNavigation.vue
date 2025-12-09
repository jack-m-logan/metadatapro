<template>
  <aside class="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
    <nav class="space-y-1">
      <button
        v-for="section in sections"
        :key="section.id"
        class="w-full text-left group rounded-md px-3 py-2 flex items-center text-sm font-medium transition-colors"
        :class="activeSection === section.id 
          ? 'bg-indigo-50 text-indigo-700 border-indigo-500' 
          : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50'"
        @click="$emit('section-changed', section.id)"
      >
        <svg 
          class="flex-shrink-0 -ml-1 mr-3 h-6 w-6"
          :class="activeSection === section.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            :d="section.icon"
          />
        </svg>
        <span class="truncate">{{ section.name }}</span>
        <span 
          v-if="section.badge"
          class="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="section.badge.class || 'bg-gray-100 text-gray-800'"
        >
          {{ section.badge.text }}
        </span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
interface SidebarSection {
  id: string
  name: string
  icon: string
  badge?: {
    text: string
    class?: string
  }
}

interface Props {
  sections: SidebarSection[]
  activeSection: string
}

interface Emits {
  (e: 'section-changed', sectionId: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>