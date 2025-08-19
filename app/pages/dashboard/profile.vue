<template>
  <div class="min-h-screen bg-gray-50">
    <DashboardNav
      title="Profile Settings"
      back-link="/dashboard"
      :user-profile="userProfile"
      :show-sign-out="true"
      :show-settings="false"
    />

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-1 sm:px-0">
        <div class="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <SidebarNavigation
            :sections="sections"
            :active-section="activeSection"
            :show-sign-out="true"
            :show-settings="true"
            @section-changed="activeSection = $event"
          />

          <!-- Main Content -->
          <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <!-- Profile Information Section -->
            <div
              v-if="activeSection === 'profile'"
              class="space-y-6"
            >
              <!-- Basic Profile -->
              <div class="bg-white shadow rounded-lg">
                <div class="px-6 py-4 border-b border-gray-200">
                  <h2 class="text-lg font-medium text-gray-900">
                    Profile Information
                  </h2>
                  <p class="text-sm text-gray-500 mt-1">
                    Update your account details and preferences
                  </p>
                </div>

                <div class="px-6 py-4">
                  <form @submit.prevent="saveProfile">
                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          v-model="profileForm.full_name"
                          type="text"
                          class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter your full name"
                        >
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          v-model="profileForm.email"
                          type="email"
                          disabled
                          class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
                        >
                        <p class="mt-1 text-xs text-gray-500">
                          Email cannot be changed after account creation
                        </p>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700">
                          Primary Artist Name
                        </label>
                        <input
                          v-model="profileForm.primary_artist_name"
                          type="text"
                          class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Your main artist name"
                        >
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700">
                          Account Tier
                        </label>
                        <div
                          class="mt-1 block w-full px-3 py-2 sm:text-sm flex items-center justify-between"
                        >
                          <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="tierBadgeClass"
                          >
                            {{ profileForm.user_tier?.toUpperCase() || 'ARTIST' }}
                          </span>
                          <button
                            v-if="profileForm.user_tier === 'artist'"
                            type="button"
                            class="text-sm text-purple-600 hover:text-purple-700 font-medium"
                            @click="upgradeAccount"
                          >
                            ⭐ Upgrade
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="mt-6 flex justify-end">
                      <button
                        type="submit"
                        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        :disabled="isSaving"
                      >
                        {{ isSaving ? 'Saving...' : 'Save Changes' }}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <!-- Account Tier Benefits -->
              <div class="bg-white shadow rounded-lg">
                <div class="px-6 py-4 border-b border-gray-200">
                  <h2 class="text-lg font-medium text-gray-900">
                    Account Tier Benefits
                  </h2>
                </div>

                <div class="px-6 py-4">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                      class="border rounded-lg p-4"
                      :class="profileForm.user_tier === 'artist' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                    >
                      <h3 class="font-medium text-gray-900 mb-2">
                        Artist
                      </h3>
                      <ul class="text-sm text-gray-600 space-y-1">
                        <li>✓ Upload tracks</li>
                        <li>✓ Metadata validation</li>
                        <li>✓ Artist name verification</li>
                        <li>✗ Unlimited artists</li>
                      </ul>
                      <p
                        v-if="profileForm.user_tier === 'artist'"
                        class="text-xs text-indigo-600 mt-2 font-medium"
                      >
                        Current plan
                      </p>
                    </div>

                    <div
                      class="border rounded-lg p-4"
                      :class="profileForm.user_tier === 'label' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                    >
                      <h3 class="font-medium text-gray-900 mb-2">
                        Label
                      </h3>
                      <ul class="text-sm text-gray-600 space-y-1">
                        <li>✓ All Artist features</li>
                        <li>✓ Unlimited artists</li>
                        <li>✓ No verification needed</li>
                        <li>✓ Bulk operations</li>
                      </ul>
                      <div class="mt-2">
                        <p
                          v-if="profileForm.user_tier === 'label'"
                          class="text-xs text-indigo-600 font-medium"
                        >
                          Current plan
                        </p>
                        <button
                          v-else
                          class="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                          disabled
                          @click="upgradeAccount"
                        >
                          ⭐ Upgrade
                        </button>
                      </div>
                    </div>

                    <div
                      class="border rounded-lg p-4"
                      :class="profileForm.user_tier === 'venue' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                    >
                      <h3 class="font-medium text-gray-900 mb-2">
                        Venue
                      </h3>
                      <ul class="text-sm text-gray-600 space-y-1">
                        <li>✓ All Label features</li>
                        <li>✓ Event management</li>
                        <li>✓ Live recordings</li>
                        <li>✓ Performance rights</li>
                      </ul>
                      <div class="mt-2">
                        <p
                          v-if="profileForm.user_tier === 'venue'"
                          class="text-xs text-indigo-600 font-medium"
                        >
                          Current plan
                        </p>
                        <button
                          v-else
                          class="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                          disabled
                          @click="upgradeAccount"
                        >
                          🚧 Coming Soon
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Artist Management Section -->
            <div
              v-if="activeSection === 'artists'"
              class="space-y-6"
            >
              <div class="bg-white shadow rounded-lg">
                <div class="px-6 py-4 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <div>
                      <h2 class="text-lg font-medium text-gray-900">
                        Verified Artist Names
                      </h2>
                      <p class="text-sm text-gray-500 mt-1">
                        Manage your verified artist aliases for metadata validation
                      </p>
                    </div>
                    <button
                      v-if="profileForm.user_tier === 'artist'"
                      class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      @click="showAddAliasModal = true"
                    >
                      Add Artist Alias
                    </button>
                  </div>
                </div>

                <div class="px-6 py-4">
                  <div
                    v-if="profileForm.user_tier !== 'artist'"
                    class="text-center py-8"
                  >
                    <svg
                      class="mx-auto h-12 w-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                      Unlimited Artist Management
                    </h3>
                    <p class="text-gray-600 text-sm">
                      Your {{ profileForm.user_tier }} tier can manage any artist without verification requirements.
                    </p>
                  </div>

                  <div
                    v-else-if="verifiedArtistsData.length === 0"
                    class="text-center py-8 text-gray-500"
                  >
                    <svg
                      class="mx-auto h-12 w-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <p class="text-sm">
                      No verified artist names yet
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                      Add artist aliases to validate metadata for multiple artist names
                    </p>
                  </div>

                  <div
                    v-else
                    class="space-y-3"
                  >
                    <div
                      v-for="artist in verifiedArtistsData"
                      :key="artist.name"
                      class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                          <svg
                            class="h-5 w-5 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-900">
                            {{ artist.name }}
                          </p>
                          <p
                            v-if="artist.isPrimary"
                            class="text-xs text-indigo-600"
                          >
                            Primary artist
                          </p>
                        </div>
                      </div>

                      <div class="flex items-center space-x-2">
                        <button
                          v-if="!artist.isPrimary"
                          class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                          @click="setPrimary(artist.name)"
                        >
                          Set as Primary
                        </button>
                        <button
                          v-if="!artist.isPrimary"
                          class="text-sm text-red-600 hover:text-red-700 font-medium"
                          @click="confirmRemoveAlias(artist.name)"
                        >
                          Remove
                        </button>
                        <span
                          v-else
                          class="text-sm text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Security Section -->
            <div
              v-if="activeSection === 'security'"
              class="space-y-6"
            >
              <div class="bg-white shadow rounded-lg">
                <div class="px-6 py-4 border-b border-gray-200">
                  <h2 class="text-lg font-medium text-gray-900">
                    Security & Access
                  </h2>
                  <p class="text-sm text-gray-500 mt-1">
                    Manage your account security settings
                  </p>
                </div>

                <div class="px-6 py-4">
                  <div class="space-y-6">
                    <!-- Password Reset -->
                    <div class="border border-gray-200 rounded-lg p-4">
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <h3 class="text-sm font-medium text-gray-900">
                            Password
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Change your account password via email reset
                          </p>
                        </div>
                        <button
                          type="button"
                          class="ml-4 w-35 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                          :disabled="isResettingPassword"
                          @click="sendPasswordReset"
                        >
                          {{ isResettingPassword ? 'Sending...' : 'Reset Password' }}
                        </button>
                      </div>
                    </div>

                    <!-- Session Management -->
                    <div class="border border-gray-200 rounded-lg p-4">
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <h3 class="text-sm font-medium text-gray-900">
                            Active Sessions
                          </h3>
                          <p class="text-sm text-gray-500 mt-1">
                            Sign out from all devices and sessions
                          </p>
                        </div>
                        <button
                          type="button"
                          class="ml-4 w-35 bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                          :disabled="isSigningOut"
                          @click="signOutEverywhere"
                        >
                          {{ isSigningOut ? 'Signing out...' : 'Sign Out' }}
                        </button>
                      </div>
                    </div>

                    <!-- Account Deletion -->
                    <div class="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <h3 class="text-sm font-medium text-red-900">
                            Delete Account
                          </h3>
                          <p class="text-sm text-red-600 mt-1">
                            Permanently delete your account and all associated data
                          </p>
                        </div>
                        <button
                          type="button"
                          class="ml-4 w-35 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                          @click="confirmDeleteAccount"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Usage Statistics Section -->
            <div
              v-if="activeSection === 'usage'"
              class="space-y-6"
            >
              <div class="bg-white shadow rounded-lg">
                <div class="px-6 py-4 border-b border-gray-200">
                  <h2 class="text-lg font-medium text-gray-900">
                    Usage Statistics
                  </h2>
                  <p class="text-sm text-gray-500 mt-1">
                    Overview of your account activity and metrics
                  </p>
                </div>

                <div class="px-6 py-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="flex items-center">
                        <div class="flex-shrink-0">
                          <svg
                            class="h-6 w-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
                            />
                          </svg>
                        </div>
                        <div class="ml-3">
                          <p class="text-sm font-medium text-gray-900">
                            Total Tracks
                          </p>
                          <p class="text-2xl font-semibold text-gray-900">
                            {{ usageStats.totalTracks }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="flex items-center">
                        <div class="flex-shrink-0">
                          <svg
                            class="h-6 w-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div class="ml-3">
                          <p class="text-sm font-medium text-gray-900">
                            Validated
                          </p>
                          <p class="text-2xl font-semibold text-gray-900">
                            {{ usageStats.validatedTracks }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="flex items-center">
                        <div class="flex-shrink-0">
                          <svg
                            class="h-6 w-6 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div class="ml-3">
                          <p class="text-sm font-medium text-gray-900">
                            Artists
                          </p>
                          <p class="text-2xl font-semibold text-gray-900">
                            {{ usageStats.verifiedArtists }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="flex items-center">
                        <div class="flex-shrink-0">
                          <svg
                            class="h-6 w-6 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <div class="ml-3">
                          <p class="text-sm font-medium text-gray-900">
                            Avg Score
                          </p>
                          <p class="text-2xl font-semibold text-gray-900">
                            {{ usageStats.avgScore }}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Account Information -->
                  <div class="mt-8 border-t border-gray-200 pt-6">
                    <h3 class="text-sm font-medium text-gray-900 mb-4">
                      Account Information
                    </h3>
                    <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                      <div class="flex justify-between">
                        <dt class="text-sm text-gray-500">
                          Account Created
                        </dt>
                        <dd class="text-sm text-gray-900">
                          {{ formatDate(userProfile?.created_at) }}
                        </dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-sm text-gray-500">
                          Last Updated
                        </dt>
                        <dd class="text-sm text-gray-900">
                          {{ formatDate(userProfile?.updated_at) }}
                        </dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-sm text-gray-500">
                          User ID
                        </dt>
                        <dd class="text-sm text-gray-900 font-mono">
                          {{ userProfile?.id?.slice(0, 8) }}...
                        </dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-sm text-gray-500">
                          Account Status
                        </dt>
                        <dd class="text-sm">
                          <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            Active
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Toast Messages -->
        <Toast
          :visible="!!message.text"
          :message="message.text"
          :type="message.type"
          @close="clearMessage"
        />
      </div>
    </main>

    <!-- Add Alias Modal -->
    <div
      v-if="showAddAliasModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
      @click="showAddAliasModal = false"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-md mx-4 w-full"
        @click.stop
      >
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Add Artist Alias
        </h3>

        <form @submit.prevent="addAlias">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Artist Name
            </label>
            <input
              v-model="aliasForm.artistName"
              type="text"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter artist name"
            >
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Verification Evidence (Optional)
            </label>
            <input
              v-model="aliasForm.evidence"
              type="url"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Social media or streaming profile URL"
            >
            <p class="text-xs text-gray-500 mt-1">
              Provide a link to verify your identity as this artist
            </p>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              @click="showAddAliasModal = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              :disabled="isAddingAlias"
            >
              {{ isAddingAlias ? 'Adding...' : 'Add Alias' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Toast from '/components/toast-messages.vue'
import SidebarNavigation from '/components/sidebar-navigation.vue'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { getVerifiedArtistsWithDetails, addArtistAlias, removeArtistAlias, setPrimaryArtist } = useArtistValidation()

// Left hand navigation menu sections with SVG icons
const sections = [
  {
    id: 'profile',
    name: 'Profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  },
  {
    id: 'artists',
    name: 'Artist Names',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  },
  {
    id: 'security',
    name: 'Password & Security',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  },
  {
    id: 'usage',
    name: 'Usage & Stats',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  }
]

const activeSection = ref('profile')
const userProfile = ref(null)
const verifiedArtistsData = ref<Array<{ name: string, isPrimary: boolean }>>([])
const isSaving = ref(false)
const isAddingAlias = ref(false)
const showAddAliasModal = ref(false)
const isResettingPassword = ref(false)
const isSigningOut = ref(false)

const usageStats = ref({
  totalTracks: 0,
  validatedTracks: 0,
  verifiedArtists: 0,
  avgScore: 0
})

const profileForm = ref({
  full_name: '',
  email: '',
  primary_artist_name: '',
  user_tier: 'artist'
})

const aliasForm = ref({
  artistName: '',
  evidence: ''
})

const message = ref({ text: '', type: '' })

const tierBadgeClass = computed(() => {
  const tier = profileForm.value.user_tier
  const classes = {
    artist: 'bg-blue-100 text-blue-800',
    label: 'bg-purple-100 text-purple-800',
    venue: 'bg-green-100 text-green-800'
  }
  return classes[tier] || classes.artist
})

const fetchUserProfile = async () => {
  try {
    if (!user.value) return

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (error) throw error

    userProfile.value = data
    profileForm.value = {
      full_name: data.full_name || '',
      email: user.value.email || '',
      primary_artist_name: data.primary_artist_name || '',
      user_tier: data.user_tier || 'artist'
    }

    await loadVerifiedArtists()

    await fetchUsageStats()
  } catch (error) {
    console.error('Error fetching profile:', error)
    showMessage('Failed to load profile', 'error')
  }
}

const loadVerifiedArtists = async () => {
  try {
    if (profileForm.value.user_tier === 'artist') {
      const artistsData = await getVerifiedArtistsWithDetails()
      verifiedArtistsData.value = artistsData

      usageStats.value.verifiedArtists = artistsData.length
    }
  } catch (error) {
    console.error('Error loading verified artists:', error)
    verifiedArtistsData.value = []
  }
}

const fetchUsageStats = async () => {
  try {
    if (!user.value) return

    const { data: tracks, error: tracksError } = await supabase
      .from('tracks')
      .select('validation_status, validation_score')
      .eq('user_id', user.value.id)

    if (tracksError) throw tracksError

    const totalTracks = tracks?.length || 0
    const validatedTracks = tracks?.filter(t => t.validation_status === 'completed').length || 0

    const validatedWithScores = tracks?.filter(t => t.validation_score !== null) || []
    const avgScore = validatedWithScores.length > 0
      ? Math.round(validatedWithScores.reduce((sum, t) => sum + t.validation_score, 0) / validatedWithScores.length)
      : 0

    usageStats.value = {
      totalTracks,
      validatedTracks,
      verifiedArtists: verifiedArtistsData.value.length,
      avgScore
    }
  } catch (error) {
    console.error('Error fetching usage stats:', error)
  }
}

const saveProfile = async () => {
  try {
    isSaving.value = true

    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: profileForm.value.full_name,
        primary_artist_name: profileForm.value.primary_artist_name
      })
      .eq('id', user.value.id)

    if (error) throw error

    showMessage('Profile updated successfully', 'success')
  } catch (error) {
    console.error('Error saving profile:', error)
    showMessage('Failed to save profile', 'error')
  } finally {
    isSaving.value = false
  }
}

const addAlias = async () => {
  try {
    isAddingAlias.value = true

    const result = await addArtistAlias(
      aliasForm.value.artistName,
      aliasForm.value.evidence || undefined
    )

    if (result) {
      await loadVerifiedArtists()

      showAddAliasModal.value = false
      aliasForm.value = { artistName: '', evidence: '' }
      showMessage('Artist alias added successfully', 'success')
    }
  } catch (error) {
    console.error('Error adding alias:', error)
    showMessage(error.message || 'Failed to add artist alias', 'error')
  } finally {
    isAddingAlias.value = false
  }
}

const confirmRemoveAlias = (artistName: string) => {
  if (confirm(`Are you sure you want to remove "${artistName}" from your verified artists?`)) {
    removeAlias(artistName)
  }
}

const removeAlias = async (artistName: string) => {
  try {
    await removeArtistAlias(artistName)
    await loadVerifiedArtists()
    showMessage('Artist alias removed', 'success')
  } catch (error) {
    console.error('Error removing alias:', error)
    showMessage(error.message || 'Failed to remove artist alias', 'error')
  }
}

const setPrimary = async (artistName: string) => {
  try {
    await setPrimaryArtist(artistName)
    profileForm.value.primary_artist_name = artistName
    await loadVerifiedArtists()
    showMessage('Primary artist updated', 'success')
  } catch (error) {
    console.error('Error setting primary artist:', error)
    showMessage(error.message || 'Failed to set primary artist', 'error')
  }
}

const upgradeAccount = () => {
  navigateTo('/dashboard/upgrade')
}

const sendPasswordReset = async () => {
  try {
    isResettingPassword.value = true

    const { error } = await supabase.auth.resetPasswordForEmail(user.value.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      showMessage(`Failed to send reset email: ${error.message}`, 'error')
    } else {
      showMessage('Password reset email sent! Check your inbox.', 'success')
    }
  } catch (error) {
    console.error('Password reset error:', error)
    showMessage('Failed to send password reset email', 'error')
  } finally {
    isResettingPassword.value = false
  }
}

const signOutEverywhere = async () => {
  try {
    isSigningOut.value = true

    const { error } = await supabase.auth.signOut({ scope: 'global' })

    if (error) {
      showMessage(`Failed to sign out: ${error.message}`, 'error')
    } else {
      showMessage('Signed out from all devices successfully', 'success')
    }
  } catch (error) {
    console.error('Sign out error:', error)
    showMessage('Failed to sign out from all devices', 'error')
  } finally {
    isSigningOut.value = false
  }
}

const confirmDeleteAccount = () => {
  if (confirm('Are you sure you want to permanently delete your account? This action cannot be undone and will delete all your data including tracks, metadata, and artist verifications.')) {
    if (confirm('This is your final warning. Are you absolutely sure you want to delete your account?')) {
      deleteAccount()
    }
  }
}

const deleteAccount = async () => {
  try {
    showMessage('Account deletion is not yet implemented. Please contact support for account deletion.', 'error')
  } catch (error) {
    console.error('Account deletion error:', error)
    showMessage('Failed to delete account', 'error')
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const showMessage = (text: string, type: string) => {
  message.value = { text, type }
  setTimeout(() => {
    message.value = { text: '', type: '' }
  }, 5000)
}

const clearMessage = () => {
  message.value = { text: '', type: '' }
}

onMounted(() => {
  if (user.value) {
    fetchUserProfile()
    debugArtistData()
  }
})

watchEffect(() => {
  if (user.value === null) {
    navigateTo('/auth/user-login')
  }
})
</script>