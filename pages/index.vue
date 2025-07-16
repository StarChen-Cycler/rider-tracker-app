<template>
  <div class="page-container">
    <!-- Semi-transparent overlay with content -->
    <div class="bg-white bg-opacity-80 rounded-lg shadow-lg p-6 max-w-md mx-auto mt-8 backdrop-blur-md">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Rider Tracker</h1>
      
      <p class="text-gray-700 mb-6">
        Welcome to Rider Tracker! Track your cycling and motorbike adventures with GPS tracking and route recording.
      </p>
      
      <div class="space-y-4">
        <NuxtLink 
          to="/track" 
          class="btn-primary block w-full py-3 px-4 rounded-lg text-center font-medium"
        >
          Start Tracking
        </NuxtLink>
        
        <NuxtLink 
          to="/rides" 
          class="btn-secondary block w-full py-3 px-4 rounded-lg text-center font-medium"
        >
          View My Rides
        </NuxtLink>
      </div>
      
      <!-- Map info section -->
      <div class="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 class="text-lg font-semibold text-blue-800 mb-2">Global Map Active</h2>
        <p class="text-sm text-blue-700">
          The map is running in the background. Use the location button to center the map on your current position.
        </p>
        
        <div class="flex items-center mt-4">
          <div 
            class="h-2 w-2 rounded-full mr-2" 
            :class="locationState.color"
          ></div>
          <span 
            class="text-xs" 
            :class="locationState.textColor"
          >
            {{ locationState.message }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useGlobalMap } from '~/composables/useGlobalMap'

// Get the global map state
const { currentLocation, locationError } = useGlobalMap()

// Debug log to verify reactive state
watch(currentLocation, (newLocation) => {
  console.log('Home page: Location updated:', newLocation)
}, { immediate: true })

// Format coordinates to a readable string
const formatCoordinates = (lat, lng) => {
  if (!lat || !lng) return 'Unknown'
  
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}

// Computed property for location state message and styling
const locationState = computed(() => {
  console.log('Computing locationState, currentLocation:', currentLocation.value)
  
  // Check if we have location data
  if (currentLocation.value) {
    return {
      color: 'bg-green-500',
      textColor: 'text-green-700',
      message: `Location: ${formatCoordinates(currentLocation.value.lat, currentLocation.value.lng)}`
    }
  } 
  
  // If we have an error
  if (locationError.value) {
    return {
      color: 'bg-red-500',
      textColor: 'text-red-700',
      message: 'Location error: Please enable location services'
    }
  }
  
  // Default waiting state
  return {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    message: 'Waiting for location...'
  }
})
</script>

<style scoped>
.page-container {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 1rem;
  -webkit-overflow-scrolling: touch;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #1f2937;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}
</style> 