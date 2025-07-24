<template>
  <div class="page-container">
    <!-- Semi-transparent overlay for header -->
    <header class="bg-white bg-opacity-90 shadow-sm border-b border-gray-200 safe-area-top">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center">
          <Icon name="heroicons:map" class="w-6 h-6 text-primary-600 mr-2" />
          <h1 class="text-lg font-semibold text-gray-900">My Rides</h1>
        </div>
        <div class="flex items-center space-x-2">
          <button
            class="p-2 rounded-lg hover:bg-gray-100"
            @click="showFilter = !showFilter"
          >
            <Icon name="heroicons:funnel" class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div v-if="showFilter" class="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div class="flex gap-2">
          <select v-model="selectedVehicle" class="form-input text-sm py-1 px-2 flex-1">
            <option value="">All Vehicles</option>
            <option value="bicycle">Bicycle</option>
            <option value="motorbike">Motorbike</option>
          </select>
          <select v-model="selectedStatus" class="form-input text-sm py-1 px-2 flex-1">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="recording">Recording</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>
    </header>

    <!-- Content overlay -->
    <div class="content-scrollable">
      <!-- Stats Summary -->
      <div class="bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200 p-4">
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-xl font-bold text-gray-900">{{ totalRides }}</div>
            <div class="text-xs text-gray-500">Total Rides</div>
          </div>
          <div class="text-center">
            <div class="text-xl font-bold text-gray-900">{{ formatDistance(totalDistance) }}</div>
            <div class="text-xs text-gray-500">Total Distance</div>
          </div>
          <div class="text-center">
            <div class="text-xl font-bold text-gray-900">{{ formatDuration(totalDuration) }}</div>
            <div class="text-xs text-gray-500">Total Time</div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-8">
        <LoadingSpinner text="Loading rides..." />
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredRides.length === 0" class="p-8 text-center bg-white bg-opacity-80 backdrop-blur-sm m-4 rounded-lg">
        <Icon name="heroicons:map" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No rides yet</h3>
        <p class="text-gray-600 mb-6">Start tracking your first ride to see it here!</p>
        <AppButton
          variant="primary"
          icon="heroicons:play-circle"
          @click="$router.push('/track')"
        >
          Start Your First Ride
        </AppButton>
      </div>

      <!-- Rides List -->
      <div v-else class="space-y-3 p-4">
        <div
          v-for="ride in filteredRides"
          :key="ride.id"
          class="card hover:shadow-md transition-shadow cursor-pointer bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4"
          @click="viewRideDetails(ride)"
        >
          <!-- Ride Header -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <Icon
                :name="getVehicleIcon(ride.vehicle_type)"
                class="w-5 h-5 text-gray-600 mr-2"
              />
              <h3 class="font-semibold text-gray-900">{{ ride.title }}</h3>
            </div>
            <div class="flex items-center">
              <span
                class="px-2 py-1 text-xs rounded-full"
                :class="getStatusBadgeClass(ride.status)"
              >
                {{ formatRideStatus(ride.status) }}
              </span>
            </div>
          </div>

          <!-- Ride Stats -->
          <div class="grid grid-cols-3 gap-4 mb-3">
            <div class="text-center">
              <div class="text-sm font-semibold text-gray-900">
                {{ formatDistance(ride.distance || 0) }}
              </div>
              <div class="text-xs text-gray-500">Distance</div>
            </div>
            <div class="text-center">
              <div class="text-sm font-semibold text-gray-900">
                {{ formatDuration(ride.duration || 0) }}
              </div>
              <div class="text-xs text-gray-500">Duration</div>
            </div>
            <div class="text-center">
              <div class="text-sm font-semibold text-gray-900">
                {{ getAverageSpeed(ride) }}
              </div>
              <div class="text-xs text-gray-500">Avg Speed</div>
            </div>
          </div>

          <!-- Ride Date -->
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>{{ formatDateTime(ride.created_at) }}</span>
            <Icon name="heroicons:chevron-right" class="w-4 h-4" />
          </div>

          <!-- Description -->
          <p v-if="ride.description" class="text-sm text-gray-600 mt-2 truncate-2">
            {{ ride.description }}
          </p>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore && !loading" class="p-4">
        <AppButton
          variant="secondary"
          full-width
          @click="loadMore"
          :loading="loadingMore"
        >
          Load More Rides
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatDuration, formatDistance, formatDateTime, formatRideStatus, getVehicleIcon, formatSpeed } from '~/utils/formatters'
import { useGlobalMap } from '~/composables/useGlobalMap'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import AppButton from '~/components/ui/AppButton.vue'

// Page meta with auth middleware
definePageMeta({
  middleware: 'auth'
})

// Meta
useHead({
  title: 'My Rides - Rider Tracker'
})

// Get the global map state - we're importing this to ensure the global map is active
// even though we don't directly use the currentLocation in this component
useGlobalMap()

// Reactive data
const loading = ref(true)
const loadingMore = ref(false)
const showFilter = ref(false)
const selectedVehicle = ref('')
const selectedStatus = ref('')
const rides = ref([])
const hasMore = ref(true)

// Mock data for demonstration
const mockRides = ref([
  {
    id: '1',
    title: 'Morning Commute',
    description: 'Quick ride to work through the park',
    vehicle_type: 'bicycle',
    status: 'completed',
    distance: 5200, // meters
    duration: 1800000, // milliseconds (30 minutes)
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    route_points: []
  },
  {
    id: '2',
    title: 'Weekend Adventure',
    description: 'Long scenic ride around the lake',
    vehicle_type: 'bicycle',
    status: 'completed',
    distance: 15600, // meters
    duration: 3600000, // milliseconds (1 hour)
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    route_points: []
  },
  {
    id: '3',
    title: 'City Tour',
    description: 'Exploring downtown on motorbike',
    vehicle_type: 'motorbike',
    status: 'completed',
    distance: 28900, // meters
    duration: 2700000, // milliseconds (45 minutes)
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    route_points: []
  }
])

// Computed
const filteredRides = computed(() => {
  let filtered = rides.value

  if (selectedVehicle.value) {
    filtered = filtered.filter(ride => ride.vehicle_type === selectedVehicle.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(ride => ride.status === selectedStatus.value)
  }

  return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const totalRides = computed(() => rides.value.length)

const totalDistance = computed(() => {
  return rides.value.reduce((total, ride) => total + (ride.distance || 0), 0)
})

const totalDuration = computed(() => {
  return rides.value.reduce((total, ride) => total + (ride.duration || 0), 0)
})

// Methods
const loadRides = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    rides.value = mockRides.value
    hasMore.value = false
  } catch (error) {
    console.error('Failed to load rides:', error)
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  loadingMore.value = true
  try {
    // Simulate loading more rides
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add more mock rides
    const newRides = [
      {
        id: '4',
        title: 'Mountain Trail',
        description: 'Off-road adventure in the hills',
        vehicle_type: 'bicycle',
        status: 'completed',
        distance: 12500,
        duration: 4500000, // 1h 15m
        created_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        route_points: []
      },
      {
        id: '5',
        title: 'Evening Cruise',
        description: 'Relaxing ride along the beach',
        vehicle_type: 'motorbike',
        status: 'completed',
        distance: 18700,
        duration: 3000000, // 50m
        created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        route_points: []
      }
    ]
    
    rides.value = [...rides.value, ...newRides]
    hasMore.value = false
  } catch (error) {
    console.error('Failed to load more rides:', error)
  } finally {
    loadingMore.value = false
  }
}

const viewRideDetails = (ride) => {
  // In a real app, navigate to ride details page
  console.log('View ride details:', ride.id)
  alert(`Viewing details for ride: ${ride.title}`)
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'recording':
      return 'bg-red-100 text-red-800'
    case 'paused':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getAverageSpeed = (ride) => {
  if (!ride.distance || !ride.duration) return '0 km/h'
  
  const hours = ride.duration / 3600000 // Convert ms to hours
  const km = ride.distance / 1000 // Convert m to km
  const speed = hours > 0 ? km / hours : 0
  
  return formatSpeed(speed)
}

// Load rides on mount
onMounted(() => {
  loadRides()
})
</script>

<style scoped>
.page-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.content-scrollable {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.card {
  transition: transform 0.2s;
}

.card:active {
  transform: scale(0.98);
}

.truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 