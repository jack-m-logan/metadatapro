<template>
  <div
    v-if="isLoading"
    class="min-h-screen bg-gray-50 flex items-center justify-center"
  >
    <div class="text-center">
      <div class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600">
        <svg
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600"
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
        Loading dashboard...
      </div>
    </div>
  </div>

  <div
    v-else
    class="min-h-screen bg-gray-50"
  >
    <!-- Navigation -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">
              metaPRO Dashboard
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">
              Welcome, {{ userProfile?.artist_name || userProfile?.full_name || 'Artist' }}
            </span>
            <button
              class="text-sm text-gray-500 hover:text-gray-700"
              @click="handleSignOut"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Welcome Section -->
        <div class="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-2">
              🎵 Ready to validate your music metadata?
            </h2>
            <p class="text-gray-600 mb-4">
              Upload your audio files to validate metadata for SGAE, AIE, and AGEDI registration.
            </p>
            <NuxtLink
              to="/dashboard/validate-metadata"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Validation
            </NuxtLink>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <span class="text-white text-sm font-medium">📁</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Tracks Validated
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats.tracksValidated }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span class="text-white text-sm font-medium">✓</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Issues Fixed
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats.issuesFixed }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span class="text-white text-sm font-medium">📄</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Reports Generated
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats.reportsGenerated }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Recent Validations
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Your latest metadata validation activity
            </p>
          </div>
          <div class="border-t border-gray-200">
            <div
              v-if="recentTracks.length === 0"
              class="px-4 py-5 text-center text-gray-500"
            >
              No validations yet. <NuxtLink
                to="/dashboard/validate-metadata"
                class="text-indigo-600 hover:text-indigo-500"
              >
                Upload your first track!
              </NuxtLink>
            </div>
            <ul
              v-else
              class="divide-y divide-gray-200"
            >
              <li
                v-for="track in recentTracks"
                :key="track.id"
                class="px-4 py-4"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">🎵</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ track.title || track.filename }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ formatDate(track.created_at) }}
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <span
                      :class="getStatusClass(track.validation_status)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ getStatusText(track.validation_status) }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const isLoading = ref(false)
const userProfile = ref(null)
const stats = ref({
  tracksValidated: 0,
  issuesFixed: 0,
  reportsGenerated: 0
})
const recentTracks = ref([])

const fetchUserData = async () => {
  try {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    userProfile.value = profile

    const { data: tracks } = await supabase
      .from('tracks')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
      .limit(5)

    recentTracks.value = tracks || []

    stats.value.tracksValidated = tracks?.length || 0
    stats.value.issuesFixed = 0
    stats.value.reportsGenerated = 0

  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

watch(user, async (newUser) => {
  if (newUser) {
    await fetchUserData()
  }
}, { immediate: true })

// auth check - redirect if not authenticated
watchEffect(() => {
  if (user.value === null) {
    navigateTo('/auth/user-login')
  }
})

const handleSignOut = async () => {
  try {
    await supabase.auth.signOut()
    await navigateTo('auth/user-login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'processing':
      return 'Processing'
    case 'error':
      return 'Error'
    case 'pending':
      return 'Pending'
    default:
      return 'Unknown'
  }
}
</script>