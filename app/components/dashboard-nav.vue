<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <NuxtLink
            v-if="backLink"
            :to="backLink"
            class="text-indigo-600 hover:text-indigo-500 mr-4"
          >
            ← Back to Dashboard
          </NuxtLink>
          <h1 class="text-xl font-semibold text-gray-900">
            {{ title }}
          </h1>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-700">
            {{ welcomeMessage }}
          </span>
          <button
            v-if="showSignOut"
            class="text-sm text-gray-500 hover:text-gray-700"
            @click="handleSignOut"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'metaPRO Dashboard'
  },
  backLink: {
    type: String,
    default: null
  },
  showSignOut: {
    type: Boolean,
    default: false
  },
  userProfile: {
    type: Object,
    default: null
  },
  customInfo: {
    type: String,
    default: null
  }
})

const supabase = useSupabaseClient()

const welcomeMessage = computed(() => {
  if (props.customInfo) {
    return props.customInfo
  }
  
  if (props.userProfile) {
    const name = props.userProfile.artist_name || props.userProfile.full_name || 'Artist'
    return `Welcome, ${name}`
  }
  
  return 'Welcome, Artist'
})

const handleSignOut = async () => {
  try {
    await supabase.auth.signOut()
    await navigateTo('/auth/user-login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script>