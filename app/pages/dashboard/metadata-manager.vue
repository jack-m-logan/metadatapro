<template>
  <div class="min-h-screen bg-gray-50">
    <DashboardNav
      title="Metadata Manager"
      back-link="/dashboard"
      :custom-info="`${tracks.length} tracks`"
      :show-sign-out="true"
    />

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-1 sm:px-0">
        <!-- Header Section -->
        <div class="bg-white shadow rounded-lg mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium text-gray-900">
                  Your Music Metadata
                </h2>
                <p class="text-sm text-gray-500 mt-1">
                  Manage and validate all your track metadata in one place
                </p>
              </div>
              <NuxtLink
                to="/dashboard/validate-metadata"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                + Add Track
              </NuxtLink>
            </div>
          </div>

          <!-- Toolbar -->
          <div class="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- Search -->
                <div class="relative">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search tracks..."
                    class="block w-64 pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    @input="onFilterTextBoxChanged"
                  >
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg
                      class="h-4 w-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Selection Info -->
                <span
                  v-if="selectedRowCount > 0"
                  class="text-sm text-gray-700 bg-indigo-50 px-3 py-1 rounded-full"
                >
                  {{ selectedRowCount }} selected
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center space-x-3">
                <button
                  v-if="selectedRowCount > 0"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  :disabled="isProcessing"
                  @click="validateSelected"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  Validate
                </button>
                <button
                  v-if="selectedRowCount > 0"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  @click="showProFeature('bulk_correction')"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                    />
                  </svg>
                  ⭐ Fix (Pro)
                </button>
                <button
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  @click="exportData"
                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Artist Validation Banner -->
        <ArtistValidationBanner
          v-if="showArtistValidationBanner && pendingArtistEdit"
          :artist-name="pendingArtistEdit.artistName"
          :user-tier="normalizedUserTier"
          context="metadata"
          class="mb-4"
          @alias-added="onArtistAliasAdded"
          @dismissed="dismissArtistValidation"
        />

        <Toast
          :visible="!!toastMessage.text"
          :message="toastMessage.text"
          :type="toastMessage.type"
          @close="clearToast"
        />

        <!-- Grid Tabs -->
        <div class="bg-white border-b border-gray-200">
          <div class="px-6">
            <nav
              class="-mb-px flex space-x-8"
              aria-label="Tabs"
            >
              <button
                v-for="tab in columnTabs"
                :key="tab.value"
                class="py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap"
                :class="selectedColumnSet === tab.value
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                @click="selectColumnSet(tab.value)"
              >
                {{ tab.label }}
                <span
                  v-if="tab.isPro"
                  class="ml-1 text-xs text-purple-500"
                >
                  ⭐
                </span>
              </button>
            </nav>
          </div>
        </div>

        <!-- AG Grid -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <ag-grid-vue
            style="height: calc(100vh - 67px); min-height: 500px;"
            class="ag-theme-alpine"
            :column-defs="columnDefs"
            :row-data="tracks"
            :default-col-def="defaultColDef"
            :grid-options="gridOptions"
            @grid-ready="onGridReady"
            @selection-changed="onSelectionChanged"
          />
        </div>

        <!-- Revenue Impact Banner -->
        <AlertBanner
          v-if="revenueImpact.potentialValue > 0"
          type="warning"
          :title="`Potential Revenue Impact: €${revenueImpact.potentialValue}/month`"
          :message="revenueImpactMessage"
          action-text="⭐ Fix All Issues (Pro Feature)"
          class="mt-6"
          @action="showProFeature('fix_all')"
        />

        <!-- Pro Feature Modal -->
        <div
          v-if="showingProModal"
          class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
          @click="hideProFeature"
        >
          <div
            class="bg-white rounded-lg p-6 max-w-md mx-4"
            @click.stop
          >
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
                <span class="text-2xl">⭐</span>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                {{ proModalContent.title }}
              </h3>
              <p class="text-sm text-gray-500 mb-6">
                {{ proModalContent.description }}
              </p>
              <div class="flex space-x-3">
                <button
                  class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  @click="hideProFeature"
                >
                  Coming Soon!
                </button>
                <button
                  class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  @click="hideProFeature"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { AgGridVue } from 'ag-grid-vue3'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import Toast from '/components/toast-messages.vue'
import ArtistValidationBanner from '/components/ArtistValidationBanner.vue'

const { showToast, clearToast, message: toastMessage } = useToast()
const { validateArtistPermission, getVerifiedArtistNames } = useArtistValidation()

ModuleRegistry.registerModules([AllCommunityModule])

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Data
const tracks = ref([])
const isLoading = ref(true)
const isProcessing = ref(false)
const searchQuery = ref('')
const selectedColumnSet = ref('basic')
const selectedRowCount = ref(0)
const userTier = ref('free')

// Artist validation state
const verifiedArtists = ref([])
const showArtistValidationBanner = ref(false)
const pendingArtistEdit = ref(null)

// UI state
const showingProModal = ref(false)
const proModalContent = ref({})

// AG Grid
const gridApi = ref(null)
const columnApi = ref(null)

// Computed values
const normalizedUserTier = computed(() => {
  // Map 'free' to 'artist' for validation purposes
  return userTier.value === 'free' ? 'artist' : userTier.value
})


const columnTabs = ref([
  { label: 'Basic', value: 'basic', isPro: false },
  { label: 'Technical', value: 'technical', isPro: false },
  { label: 'Rights', value: 'rights', isPro: true },
  { label: 'All Fields', value: 'all', isPro: true }
])

const renderScoreBadge = (score) => {
  const colorClass = score >= 80 ? 'bg-green-100 text-green-800' :
    score >= 60 ? 'bg-yellow-100 text-yellow-800' :
      'bg-red-100 text-red-800'
  return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}">${score}/100</span>`
}

const renderStatusBadge = (status) => {
  const statusClasses = {
    'completed': 'bg-green-100 text-green-800',
    'processing': 'bg-yellow-100 text-yellow-800',
    'error': 'bg-red-100 text-red-800',
    'failed': 'bg-red-100 text-red-800'
  }
  const statusTexts = {
    'completed': 'Validated',
    'processing': 'Processing',
    'error': 'Error',
    'failed': 'Error',
    'pending': 'Pending'
  }
  const colorClass = statusClasses[status] || 'bg-gray-100 text-gray-800'
  const text = statusTexts[status] || 'Unknown'
  return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}">${text}</span>`
}

const getColumnDefs = (columnSet = 'basic') => {
  const baseColumns = [
    {
      headerName: '',
      field: 'checkbox',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      width: 50,
      pinned: 'left',
      lockPosition: 'left',
      suppressMenu: true,
      sortable: false,
      filter: false,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0'
      },
      headerClass: 'checkbox-header',
    },
    {
      headerName: 'Track',
      field: 'title',
      editable: true,
      cellRenderer: (params) => {
        return params.value ||
          params.data.original_metadata?.title ||
          params.data.filename ||
          'Unknown Track'
      },
    },
    {
      headerName: 'Duration',
      field: 'duration_seconds',
      width: 100,
      editable: false,
      valueFormatter: (params) => formatDuration(params.value)
    },
    {
      headerName: 'File Size',
      field: 'file_size',
      width: 100,
      editable: false,
      valueFormatter: (params) => {
        if (!params.value) return ''
        const size = params.value / 1024 / 1024
        return `${size.toFixed(2)} MB`;
      }
    },
    {
      headerName: 'Artist',
      field: 'artist',
      editable: true,
      cellRenderer: (params) => {
        const artist = params.value || params.data.original_metadata?.artist

        if (!artist) {
          return '<span class="text-gray-500 italic">Click to add artist</span>'
        }

        if (normalizedUserTier.value !== 'artist') {
          return `<span>${artist}</span>`
        }

        const verified = isArtistVerified(artist)
        const statusIcon = verified ? '✅' : '⚠️'
        const statusColor = verified ? 'text-green-600' : 'text-orange-500'

        return `<div class="flex items-center justify-between w-full">
                <span>${artist}</span>
                <span class="${statusColor} text-sm ml-2">${statusIcon}</span>
            </div>`
      },
      cellEditorParams: {
        maxLength: 100
      }
    },
    {
      headerName: 'Album',
      field: 'album',
      editable: true,
      cellRenderer: (params) => {
        const album = params.value || params.data.original_metadata?.album
        return album || '<span class="text-gray-500 italic">Click to add album</span>'
      }
    },
    {
      headerName: 'ISRC',
      field: 'isrc',
      width: 120,
      editable: true,
      cellRenderer: (params) => {
        if (params.value) {
          return params.value
        } else {
          return '<span class="text-gray-500 italic">Click to add ISRC</span>'
        }
      }
    }
  ]

  const technicalColumns = [
    {
      headerName: 'Format',
      field: 'file_format',
      width: 80,
      editable: false
    },
    {
      headerName: 'Sample Rate',
      field: 'sample_rate',
      width: 100,
      editable: false,
      valueFormatter: (params) => params.value ? `${params.value} Hz` : ''
    },
    {
      headerName: 'Bit Depth',
      field: 'bit_depth',
      width: 90,
      editable: false,
      valueFormatter: (params) => params.value ? `${params.value} bit` : ''
    }
  ]

  const rightsColumns = [
    {
      headerName: 'Publisher',
      field: 'publisher',
      width: 150,
      editable: true,
      cellRenderer: (params) => {
        if (columnSet === 'all') {
          return params.value || '<span class="text-gray-500 italic">Click to add</span>'
        } else {
          return '<span class="text-gray-400">🔒 Pro Feature</span>'
        }
      }
    },
    {
      headerName: 'Songwriter',
      field: 'songwriter',
      width: 150,
      editable: columnSet === 'all',
      cellRenderer: (params) => {
        if (columnSet === 'all') {
          return params.value || '<span class="text-gray-500 italic">Click to add</span>'
        } else {
          return '<span class="text-gray-400">🔒 Pro Feature</span>'
        }
      }
    }
  ]

  const endColumns = [
    {
      headerName: 'Score',
      field: 'validation_score',
      width: 80,
      editable: false,
      cellRenderer: (params) => {
        if (params.value !== null) {
          return renderScoreBadge(params.value)
        }
        return '<span class="text-gray-500">Not validated</span>'
      }
    },
    {
      headerName: 'Status',
      field: 'validation_status',
      width: 100,
      editable: false,
      cellRenderer: (params) => {
        return renderStatusBadge(params.value)
      }
    },
    {
      headerName: 'Actions',
      width: 80,
      editable: false,
      cellStyle: { textAlign: 'center' },
      cellRenderer: (params) => {
        const trackId = params.data.id
        return `<button class="text-gray-600 hover:text-gray-900 text-xs font-medium" onclick="window.showTrackDetails('${trackId}')">View</button>`
      }
    }
  ]

  // Build column set based on selection
  let columns = [...baseColumns]

  if (columnSet === 'technical' || columnSet === 'rights' || columnSet === 'all') {
    columns = [...columns, ...technicalColumns]
  }

  if (columnSet === 'rights' || columnSet === 'all') {
    columns = [...columns, ...rightsColumns]
  }

  columns = [...columns, ...endColumns]

  return columns
}

const onCellValueChanged = async (params) => {
  const { data, newValue, oldValue, colDef } = params

  // Normalize values for comparison
  const normalizeValue = (val) => {
    if (val === null || val === undefined || val === '') return null
    return typeof val === 'string' ? val.trim() : val
  }

  const normalizedNew = normalizeValue(newValue)
  const normalizedOld = normalizeValue(oldValue)

  // Only proceed if value actually changed
  if (normalizedNew === normalizedOld) {
    return
  }

  if (colDef.field === 'artist' && normalizedNew) {
    if (normalizedUserTier.value === 'artist') {
      const permission = await validateArtistPermission(normalizedNew, normalizedUserTier.value)

      if (!permission.allowed && permission.requiresVerification) {
        pendingArtistEdit.value = {
          artistName: normalizedNew,
          trackId: data.id,
          originalValue: normalizedOld
        }
        showArtistValidationBanner.value = true

        data.artist = normalizedOld
        params.api.refreshCells({ rowNodes: [params.node] })
        return
      }
    }
  }

  // ISRC validation
  if (colDef.field === 'isrc' && normalizedNew) {
    const isrcRegex = /^[A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5}$/
    if (!isrcRegex.test(normalizedNew.toUpperCase())) {
      showToast('Invalid ISRC format. Use: XX-ABC-12-34567', 'error')
      data.isrc = normalizedOld
      params.api.refreshCells({ rowNodes: [params.node] })
      return
    }
    normalizedNew = normalizedNew.toUpperCase()
  }

  try {
    const { error } = await supabase
      .from('tracks')
      .update({ [colDef.field]: normalizedNew })
      .eq('id', data.id)

    if (error) throw error

    // Update local data
    data[colDef.field] = normalizedNew

    showToast(`${colDef.headerName} updated successfully`, 'success')
  } catch (error) {
    console.error('Error saving edit:', error)
    showToast('Failed to save changes', 'error')
    params.api.refreshCells({ rowNodes: [params.node] })
  }
}

const columnDefs = ref(getColumnDefs('basic'))

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  minWidth: 80,
}

const gridOptions = {
  theme: 'legacy',
  rowSelection: {
    mode: 'multiRow',
    checkboxes: false,
    headerCheckbox: false,
    enableClickSelection: false
  },
  stopEditingWhenCellsLoseFocus: true,
  onCellValueChanged: onCellValueChanged,
  pagination: true,
  paginationAutoPageSize: true,
  suppressHorizontalScroll: false,
  suppressPaginationPanel: false
}

// Computed
const revenueImpact = computed(() => {
  const missingISRC = tracks.value.filter(t => !t.isrc).length
  const lowQuality = tracks.value.filter(t => t.validation_score && t.validation_score < 60).length

  return {
    missingISRC,
    lowQuality,
    potentialValue: (missingISRC * 50) + (lowQuality * 20)
  }
})

const revenueImpactMessage = computed(() => {
  const items = []
  if (revenueImpact.value.missingISRC > 0) {
    items.push(`${revenueImpact.value.missingISRC} tracks missing ISRC - losing radio royalties`)
  }
  if (revenueImpact.value.lowQuality > 0) {
    items.push(`${revenueImpact.value.lowQuality} tracks with quality issues - affecting discoverability`)
  }
  return items
})

const fetchTracks = async () => {
  try {
    isLoading.value = true

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('user_type')
      .eq('id', user.value.id)
      .single()

    userTier.value = profile?.user_type || 'free'

    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    tracks.value = data || []

  } catch (error) {
    console.error('Error fetching tracks:', error)
    showToast('Failed to load tracks', 'error')
  } finally {
    isLoading.value = false
  }
}

const onGridReady = (params) => {
  gridApi.value = params.api
  columnApi.value = params.columnApi

  window.validateTrack = validateTrack
  window.showProFeature = showProFeature
  window.showTrackDetails = showTrackDetails
}

const onSelectionChanged = () => {
  if (gridApi.value) {
    selectedRowCount.value = gridApi.value.getSelectedRows().length
  }
}

const onFilterTextBoxChanged = () => {
  if (gridApi.value) {
    gridApi.value.setQuickFilter(searchQuery.value)
  }
}

const validateTrack = async (trackId) => {
  try {
    await $fetch('/api/validation/validate-track', {
      method: 'POST',
      body: { trackId }
    })

    showToast('Track validated successfully', 'success')
    await fetchTracks()
  } catch (error) {
    console.error('Validation failed:', error)
    showToast('Validation failed. Please try again.', 'error')
  }
}

const validateSelected = async () => {
  if (!gridApi.value) return

  const selectedRows = gridApi.value.getSelectedRows()
  if (selectedRows.length === 0) return

  try {
    isProcessing.value = true

    for (const row of selectedRows) {
      await validateTrack(row.id)
    }

    showToast(`${selectedRows.length} tracks validated successfully`, 'success')
  } catch {
    showToast('Some tracks failed to validate', 'error')
  } finally {
    isProcessing.value = false
  }
}

const exportData = () => {
  if (gridApi.value) {
    gridApi.value.exportDataAsCsv({
      fileName: 'metadata-export.csv'
    })
    showToast('CSV exported successfully', 'success')
  }
}

const showTrackDetails = (trackId) => {
  navigateTo(`/dashboard/tracks/${trackId}`)
}

// const showProFeature = (feature) => {
//     const features = {
//         isrc_generation: {
//             title: 'ISRC Generation',
//             description: 'Automatically generate unique ISRC codes for your tracks. Coming soon in Pro!'
//         },
//         single_correction: {
//             title: 'Metadata Correction',
//             description: 'Automatically fix metadata issues and embed corrected tags. Coming soon in Pro!'
//         },
//         bulk_correction: {
//             title: 'Bulk Corrections',
//             description: 'Fix multiple tracks at once with our automated correction service. Coming soon in Pro!'
//         },
//         fix_all: {
//             title: 'Fix All Issues',
//             description: 'Automatically resolve all metadata issues across your entire catalog. Coming soon in Pro!'
//         }
//     }

//     proModalContent.value = features[feature]
//     showingProModal.value = true
// }

const hideProFeature = () => {
  showingProModal.value = false
  proModalContent.value = {}
}


const formatDuration = (seconds) => {
  if (!seconds) return ''
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const isArtistVerified = (artistName) => {
  if (!artistName) return false
  const normalizedName = artistName.toLowerCase().trim()
  const isVerified = verifiedArtists.value.includes(normalizedName)

  return isVerified
}

const loadVerifiedArtists = async () => {
  try {
    const artists = await getVerifiedArtistNames()
    verifiedArtists.value = artists.map(artist => artist.toLowerCase().trim())
    console.log('Loaded verified artists:', verifiedArtists.value)
  } catch (error) {
    console.error('Error loading verified artists:', error)
    verifiedArtists.value = []
  }
}

const onArtistAliasAdded = async (artistName) => {
  console.log('Artist alias added:', artistName)

  await loadVerifiedArtists()

  if (pendingArtistEdit.value && pendingArtistEdit.value.artistName === artistName) {
    const trackId = pendingArtistEdit.value.trackId

    try {
      const { error } = await supabase
        .from('tracks')
        .update({ artist: artistName })
        .eq('id', trackId)

      if (error) throw error

      const track = tracks.value.find(t => t.id === trackId)
      if (track) {
        track.artist = artistName
      }

      showToast(`Artist "${artistName}" updated successfully`, 'success')
    } catch (error) {
      console.error('Error updating artist:', error)
      showToast('Failed to update artist', 'error')
    }
  }

  if (gridApi.value) {
    gridApi.value.refreshCells()
  }

  showArtistValidationBanner.value = false
  pendingArtistEdit.value = null
}

const dismissArtistValidation = () => {
  showArtistValidationBanner.value = false
  pendingArtistEdit.value = null
}

// Lifecycle
onMounted(async () => {
  if (user.value) {
    await Promise.all([
      fetchTracks(),
      loadVerifiedArtists()
    ])
  }
})

// Auth check
watchEffect(() => {
  if (user.value === null) {
    navigateTo('/auth/user-login')
  }
})

watch(verifiedArtists, () => {
  if (gridApi.value) {
    gridApi.value.refreshCells()
  }
}, { deep: true })

watch(normalizedUserTier, () => {
  columnDefs.value = getColumnDefs(selectedColumnSet.value)
  if (gridApi.value) {
    gridApi.value.setGridOption('columnDefs', columnDefs.value)
  }
})


const selectColumnSet = (columnSet) => {
  if ((columnSet === 'rights' || columnSet === 'all') && userTier.value !== 'pro') {
    showProFeature('advanced_columns')
    return
  }

  selectedColumnSet.value = columnSet
  columnDefs.value = getColumnDefs(columnSet)
  if (gridApi.value) {
    gridApi.value.setGridOption('columnDefs', columnDefs.value)
  }
}

const showProFeature = (feature) => {
  const features = {
    advanced_columns: {
      title: 'Advanced Columns',
      description: 'Unlock Rights & Publishing fields, and view all metadata columns with Pro!'
    }
  }

  proModalContent.value = features[feature]
  showingProModal.value = true
}
</script>

<style>
.ag-theme-alpine {
  --ag-header-background-color: #f9fafb;
  --ag-header-foreground-color: #374151;
  --ag-border-color: #e5e7eb;
  --ag-row-hover-color: #f3f4f6;
  --ag-selected-row-background-color: #eff6ff;
}

.ag-theme-alpine .ag-header-cell-text {
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>