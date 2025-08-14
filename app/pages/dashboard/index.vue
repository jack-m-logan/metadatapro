<template>
  <LoadingSpinner
    v-if="isLoading"
    message="Loading dashboard..."
    fullscreen
  />

  <div
    v-else
    class="min-h-screen bg-gray-50"
  >
    <DashboardNav
      :user-profile="userProfile"
      :show-sign-out="true"
    />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Welcome Section -->
        <div class="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h2 class="text-lg font-medium text-gray-900 mb-2">
                  🎵 Ready to validate your music metadata?
                </h2>
                <p class="text-gray-600 mb-4">
                  Upload your audio files to validate metadata for distribution and royalty collection.
                </p>
              </div>
              <div class="flex-shrink-0 ml-6">
                <NuxtLink
                  to="/dashboard/validate-metadata"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Upload Track
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <!-- Upload Track -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <span class="text-white text-lg">📤</span>
                  </div>
                </div>
                <div class="ml-5">
                  <h3 class="text-lg font-medium text-gray-900">
                    Upload Track
                  </h3>
                  <p class="text-sm text-gray-500">
                    Add new music for validation
                  </p>
                </div>
              </div>
              <div class="mt-4">
                <NuxtLink
                  to="/dashboard/validate-metadata"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 w-full justify-center"
                >
                  Upload Track
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Metadata Manager -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span class="text-white text-lg">📊</span>
                  </div>
                </div>
                <div class="ml-5">
                  <h3 class="text-lg font-medium text-gray-900">
                    Metadata Manager
                  </h3>
                  <p class="text-sm text-gray-500">
                    Edit and manage all tracks
                  </p>
                </div>
              </div>
              <div class="mt-4">
                <NuxtLink
                  to="/dashboard/metadata-manager"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 w-full justify-center"
                >
                  Manage Metadata
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Pro Features Teaser -->
          <div class="bg-gradient-to-r from-purple-400 to-indigo-500 overflow-hidden shadow rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-white bg-opacity-20 rounded-md flex items-center justify-center">
                    <span class="text-white text-lg">⭐</span>
                  </div>
                </div>
                <div class="ml-5">
                  <h3 class="text-lg font-medium text-white">
                    Go Pro
                  </h3>
                  <p class="text-sm text-purple-100">
                    Unlimited tracks + corrections
                  </p>
                </div>
              </div>
              <div class="mt-4">
                <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-600 bg-white hover:bg-gray-50 w-full justify-center">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
          <StatsCard
            label="Total Tracks"
            :value="stats.totalTracks"
            icon="📁"
            color="indigo"
          />
          
          <StatsCard
            label="Validated"
            :value="stats.validatedTracks"
            icon="✓"
            color="green"
          />
          
          <StatsCard
            label="Need Fixes"
            :value="stats.tracksWithIssues"
            icon="⚠"
            color="yellow"
          />
          
          <StatsCard
            label="Avg Score"
            :value="stats.averageScore"
            icon="📊"
            color="purple"
            suffix="/100"
          />
        </div>

        <!-- Usage Limit Banner (Free Tier) -->
        <div 
          v-if="isApproachingLimit"
          class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <h3 class="text-sm font-medium text-yellow-800">
                You've used {{ stats.totalTracks }}/5 free tracks this month
              </h3>
              <p class="mt-1 text-sm text-yellow-700">
                Upgrade to Pro for unlimited track validation and advanced features.
              </p>
              <div class="mt-3">
                <button class="bg-yellow-100 px-3 py-1 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- All Tracks Section -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Your Tracks
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  Click on any track to view detailed validation results
                </p>
              </div>
              <NuxtLink
                to="/dashboard/validate-metadata"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                + Add Track
              </NuxtLink>
            </div>
          </div>

          <div class="divide-y divide-gray-200">
            <div
              v-if="allTracks.length === 0"
              class="px-4 py-12 text-center text-gray-500"
            >
              <div class="text-4xl mb-4">
                🎵
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                No tracks uploaded yet
              </h3>
              <p class="text-gray-500 mb-4">
                Upload your first track to get started with metadata validation
              </p>
              <NuxtLink
                to="/dashboard/validate-metadata"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Upload Your First Track
              </NuxtLink>
            </div>

            <div
              v-for="track in allTracks"
              :key="track.id"
              class="px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              @click="navigateToTrack(track.id)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4 flex-1 min-w-0">
                  <!-- Track Icon -->
                  <div class="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span class="text-xl">🎵</span>
                  </div>
                  
                  <!-- Track Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2">
                      <h4 class="text-sm font-medium text-gray-900 truncate">
                        {{ track.title || track.filename }}
                      </h4>
                      <span
                        v-if="track.validation_score !== null"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        :class="getScoreClass(track.validation_score)"
                      >
                        {{ track.validation_score }}/100
                      </span>
                    </div>
                    <div class="flex items-center space-x-4 mt-1">
                      <p class="text-sm text-gray-500 truncate">
                        {{ track.artist || 'Unknown Artist' }}
                      </p>
                      <span class="text-gray-300">•</span>
                      <p class="text-sm text-gray-500">
                        {{ formatDate(track.created_at) }}
                      </p>
                      <span
                        v-if="track.duration_seconds"
                        class="text-sm text-gray-500"
                      >
                        • {{ formatDuration(track.duration_seconds) }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Status & Action -->
                <div class="flex items-center space-x-3">
                  <div class="flex flex-col items-end">
                    <span
                      :class="getStatusClass(track.validation_status)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ getStatusText(track.validation_status) }}
                    </span>
                    <span
                      v-if="track.has_critical_issues"
                      class="text-xs text-red-600 mt-1"
                    >
                      {{ getIssueCount(track) }} issues found
                    </span>
                  </div>
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const isLoading = ref(true)
const userProfile = ref(null)
const stats = ref({
  totalTracks: 0,
  validatedTracks: 0,
  tracksWithIssues: 0,
  averageScore: 0
})
const allTracks = ref([])

const isApproachingLimit = computed(() => {
  return stats.value.totalTracks >= 4 // show warning when user hits 4/5 tracks
})

const fetchUserData = async () => {
  try {
    isLoading.value = true
    
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

    allTracks.value = tracks || []

    // calculate stats
    const totalTracks = tracks?.length || 0
    const validatedTracks = tracks?.filter(t => t.validation_status === 'completed').length || 0
    const tracksWithIssues = tracks?.filter(t => t.has_critical_issues || t.has_warnings).length || 0
    
    // average score for validated tracks
    const validatedWithScores = tracks?.filter(t => t.validation_score !== null) || []
    const averageScore = validatedWithScores.length > 0 
      ? Math.round(validatedWithScores.reduce((sum, t) => sum + (t.validation_score || 0), 0) / validatedWithScores.length)
      : 0

    stats.value = {
      totalTracks,
      validatedTracks,
      tracksWithIssues,
      averageScore
    }

  } catch (error) {
    console.error('Error fetching user data:', error)
  } finally {
    isLoading.value = false
  }
}

const navigateToTrack = (trackId) => {
  navigateTo(`/dashboard/tracks/${trackId}`)
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


const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const formatDuration = (seconds) => {
  if (!seconds) return ''
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getStatusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'error':
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Validated'
    case 'processing':
      return 'Processing'
    case 'error':
    case 'failed':
      return 'Error'
    case 'pending':
      return 'Pending'
    default:
      return 'Unknown'
  }
}

const getScoreClass = (score) => {
  if (score >= 80) return 'bg-green-100 text-green-800'
  if (score >= 60) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

const getIssueCount = (track) => {
  // TODO this needs to be calculated based on validation_issues table
  // return a placeholder for now
  if (track.has_critical_issues) return 'Critical'
  if (track.has_warnings) return 'Minor'
  return ''
}
</script>