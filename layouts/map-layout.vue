<template>
  <div class="app-container">
    <!-- Global Map Container (Always Present) -->
    <div class="global-map-container">
      <ClientOnly>
        <div id="global-map-container" class="w-full h-full"></div>
        <template #fallback>
          <div class="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p class="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>
    
    <!-- Current Location Button (Fixed Position) - Only visible on track page -->
    <div v-if="$route.path === '/track'" class="fixed bottom-72 right-4 z-20">
      <button
        @click="locateUser"
        class="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
        :class="{ 'location-button-pulse': isLocatingUser }"
      >
        <Icon
          name="heroicons:map-pin"
          class="w-6 h-6"
          :class="{ 'text-primary-600': isLocatingUser }"
        />
      </button>
    </div>

    <!-- Location Error Notification -->
    <div v-if="showLocationError" class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-yellow-500" />
        </div>
        <div class="ml-3 w-0 flex-1">
          <p class="text-sm font-medium text-gray-900">Location access required</p>
          <p class="mt-1 text-sm text-gray-500">
            {{ locationErrorMessage }}
          </p>
          <div class="mt-2 flex">
            <button 
              @click="showLocationError = false" 
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Dismiss
            </button>
          </div>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button
            @click="showLocationError = false"
            class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span class="sr-only">Close</span>
            <Icon name="heroicons:x-mark" class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area (Overlaid on Map) -->
    <main class="content-overlay ">
      <slot />
    </main>

    <!-- Mobile Navigation -->
    <nav class="mobile-nav z-20">
      <div class="flex items-center justify-around py-0 px-4">
        <NuxtLink
          to="/"
          class="flex flex-col items-center p-2 rounded-lg transition-colors"
          :class="{ 'text-primary-600 bg-primary-50': $route.path === '/' }"
        >
          <Icon name="heroicons:home" class="w-6 h-6" />
          <span class="text-xs mt-1">Home</span>
        </NuxtLink>
        
        <NuxtLink
          to="/track"
          class="flex flex-col items-center p-2 rounded-lg transition-colors"
          :class="{ 'text-primary-600 bg-primary-50': $route.path === '/track' }"
        >
          <Icon name="heroicons:play-circle" class="w-6 h-6" />
          <span class="text-xs mt-1">Track</span>
        </NuxtLink>

        <NuxtLink
          to="/rides"
          class="flex flex-col items-center p-2 rounded-lg transition-colors"
          :class="{ 'text-primary-600 bg-primary-50': $route.path === '/rides' }"
        >
          <Icon name="heroicons:map" class="w-6 h-6" />
          <span class="text-xs mt-1">Rides</span>
        </NuxtLink>
        
        <NuxtLink
          to="/chats"
          class="flex flex-col items-center p-2 rounded-lg transition-colors"
          :class="{ 'text-primary-600 bg-primary-50': $route.path === '/chats' }"
        >
          <Icon name="heroicons:chat-bubble-left-right" class="w-6 h-6" />
          <span class="text-xs mt-1">Chat</span>
        </NuxtLink>
        
        <NuxtLink
          to="/profile"
          class="flex flex-col items-center p-2 rounded-lg transition-colors"
          :class="{ 'text-primary-600 bg-primary-50': $route.path === '/profile' }"
        >
          <Icon name="heroicons:user-circle" class="w-6 h-6" />
          <span class="text-xs mt-1">Profile</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGlobalMapProvider } from '~/composables/useGlobalMap'
import { useMapSettingsProvider } from '~/composables/useMapSettings'
import { useAmap } from '~/composables/useAmap'

const globalMapRef = ref(null)
const isLocatingUser = ref(false) // Local state for UI updates
const showLocationError = ref(false)
const locationErrorMessage = ref('Please enable location services to use this feature.')

// Initialize providers
const globalMapProvider = useGlobalMapProvider()
useMapSettingsProvider() // Initialize provider for child components

const { 
  setMapInstance, 
  centerOnCurrentLocation, 
  getUserLocation, 
  startLocationTracking,
  startOrientationTracking 
} = globalMapProvider
const { loadAmapScript, isLoaded } = useAmap()

// Add padding bottom to account for mobile navigation
useHead({
  bodyAttrs: {
    class: 'overflow-hidden' // Prevent scrolling on body
  }
})

let map = null

// Initialize the map manually
onMounted(async () => {
  if (import.meta.client) {
    try {
      console.log('Initializing map...')
      // Log protocol to help with debugging
      console.log(`Current protocol: ${window.location.protocol}`)
      console.log(`Is secure context: ${window.isSecureContext}`)
      
      // Load AMap script if not already loaded
      if (!isLoaded.value) {
        await loadAmapScript()
      }
      
      // Initialize map with default theme from map settings
      map = new window.AMap.Map('global-map-container', {
        zoom: 16,
        mapStyle: 'amap://styles/dark', // Use default theme from map settings
        resizeEnable: true,
        rotateEnable: true,
        pitchEnable: true,
        zoomEnable: true,
        dragEnable: true,
        features: ['bg', 'road', 'building', 'point'] // Use default features from map settings
      })
      
      // Load required plugins
      await new Promise((resolve) => {
        window.AMap.plugin([
          'AMap.Geolocation',
          'AMap.Geocoder', 
          'AMap.Polyline',
          'AMap.PolylineEditor',
          'AMap.Marker',
          'AMap.CircleMarker',
          'AMap.InfoWindow',
          'AMap.MoveAnimation'
        ], () => {
          resolve()
        })
      })
      
      // Set map instance in global state
      setMapInstance(map)
      
      console.log('Map initialized, getting user location...')
      
      // Try to get user location immediately
      try {
        await getUserLocation()
        console.log('Global map is ready with user location')
        
        // Center map on user location if available with fast transition
        if (map) {
          await centerOnCurrentLocation(map)
        }
      } catch (error) {
        console.error('Failed to get user location:', error)
        console.log('Global map is ready without user location')
        
        // Show error notification with specific message
        if (error instanceof Error) {
          if (error.message.includes('secure')) {
            locationErrorMessage.value = 'Location access requires HTTPS. Please use a secure connection or try a different browser.'
          } else if (error.message.includes('denied')) {
            locationErrorMessage.value = 'Location access was denied. Please enable location services in your browser settings.'
          } else if (error.message.includes('timeout')) {
            locationErrorMessage.value = 'Location request timed out. Please try again or check your connection.'
          } else {
            locationErrorMessage.value = 'Unable to get your location. ' + error.message
          }
          showLocationError.value = true
        }
      }

      // Auto-start location and orientation tracking after map is ready
      console.log('🗺️ Map ready, starting location and orientation tracking...')
      
      try {
        // Start location tracking for continuous GPS updates
        await startLocationTracking()
        console.log('✅ Location tracking started automatically')
      } catch (error) {
        console.warn('⚠️ Failed to start location tracking:', error)
      }

      try {
        // Start orientation tracking for compass functionality
        await startOrientationTracking()
        console.log('✅ Orientation tracking started automatically')
      } catch (error) {
        console.warn('⚠️ Failed to start orientation tracking:', error)
      }
    } catch (error) {
      console.error('Failed to initialize map:', error)
    }
  }
})

// Center the map on the user's current location
const locateUser = async () => {
  try {
    isLocatingUser.value = true
    showLocationError.value = false
    
    // Try to get a fresh location
    await getUserLocation()
    
    // Then center the map using the global map state
    await centerOnCurrentLocation(map)
  } catch (error) {
    console.error('Failed to locate user:', error)
    
    // Show error notification with specific message
    if (error instanceof Error) {
      if (error.message.includes('secure')) {
        locationErrorMessage.value = 'Location access requires HTTPS. Please use a secure connection or try a different browser.'
      } else if (error.message.includes('denied')) {
        locationErrorMessage.value = 'Location access was denied. Please enable location services in your browser settings.'
      } else if (error.message.includes('timeout')) {
        locationErrorMessage.value = 'Location request timed out. Please try again or check your connection.'
      } else {
        locationErrorMessage.value = 'Unable to get your location. ' + error.message
      }
      showLocationError.value = true
    }
  } finally {
    isLocatingUser.value = false
  }
}

defineExpose({
  globalMapRef,
  locateUser
})
</script>

<style scoped>
/* App container */
.app-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Global map container */
.global-map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

/* Content overlay */
.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 56px; /* Height of mobile nav */
  z-index: 10;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  pointer-events: none; /* Allow map interaction by default */
}
.content-overlay > * {
  pointer-events: auto; /* Re-enable pointer events for actual UI elements */
}

/* Mobile navigation styles */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
  border-top: 1px solid rgba(229, 231, 235, 0.8);
  z-index: 20;
}

@supports (backdrop-filter: blur(10px)) {
  .mobile-nav {
    background-color: rgba(255, 255, 255, 0.8);
  }
}

#global-map-container {
  width: 100%;
  height: 100%;
}

.location-button-pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
  }
}
</style> 