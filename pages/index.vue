<template>
  <div class="page-container">
    <!-- Semi-transparent overlay with content -->
    <div class="bg-white bg-opacity-80 rounded-lg shadow-lg p-6 max-w-md mx-auto mt-8 backdrop-blur-md">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Rider Tracker</h1>
      
      <p class="text-gray-700 mb-6">
        Welcome to Rider Tracker! Track your cycling and motorbike adventures with GPS tracking and route recording.
      </p>
      
      <div class="space-y-4">
        <!-- Authenticated user actions -->
        <template v-if="user">
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
        </template>
        
        <!-- Non-authenticated user actions -->
        <template v-else>
          <NuxtLink 
            to="/login" 
            class="btn-primary block w-full py-3 px-4 rounded-lg text-center font-medium"
          >
            Sign In to Start Tracking
          </NuxtLink>
          
          <p class="text-sm text-gray-600 text-center">
            Create an account or sign in to save your rides and track your progress
          </p>

                    <!-- Development Tools Navigation (Dev Mode Only) -->
          <div v-if="isDev" class="mt-6 space-y-3">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-yellow-600 font-medium">开发工具</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <NuxtLink 
                to="/dev-utils" 
                class="btn-secondary py-3 px-4 rounded-lg text-center font-medium flex items-center justify-center gap-2"
              >
                <Icon name="heroicons:wrench-screwdriver" class="w-5 h-5 text-gray-600" />
                <span>开发工具集</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/debug-auth" 
                class="btn-secondary py-3 px-4 rounded-lg text-center font-medium flex items-center justify-center gap-2"
              >
                <Icon name="heroicons:bug-ant" class="w-5 h-5 text-gray-600" />
                <span>认证调试</span>
              </NuxtLink>
            </div>

            <p class="text-xs text-yellow-600 text-center">
              仅在开发模式下可用的调试工具
            </p>
          </div>
        </template>
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

      <!-- Development Mode Info -->
      <div v-if="isDev" class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-center mb-2">
          <Icon name="heroicons:wrench-screwdriver" class="w-5 h-5 text-yellow-600 mr-2" />
          <h3 class="text-sm font-semibold text-yellow-800">开发模式</h3>
        </div>
        <p class="text-xs text-yellow-700">
          身份验证已跳过，可直接访问所有页面进行开发测试
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useGlobalMap } from '~/composables/useGlobalMap'
import { useAuth } from '~/composables/useSupabase'

// Get the global map state
const { currentLocation, locationError } = useGlobalMap()

// Get auth state
const { user } = useAuth()

// Check if in development mode
const isDev = import.meta.dev

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