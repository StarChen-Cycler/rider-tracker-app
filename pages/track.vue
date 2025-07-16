<template>
  <div class="page-container">
    <!-- Semi-transparent overlay for controls -->
    <div class="bg-white bg-opacity-90 shadow-sm border-b border-gray-200 safe-area-top">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center">
          <Icon name="heroicons:play-circle" class="w-6 h-6 text-primary-600 mr-2" />
          <h1 class="text-lg font-semibold text-gray-900">Track Ride</h1>
        </div>
        <div class="flex items-center space-x-2">
          <button
            class="p-2 rounded-lg hover:bg-gray-100"
            @click="showSettings = true"
          >
            <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions (Positioned at the top) -->
    <div class="mt-2 mx-4 p-3 bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-gray-700">Vehicle Type</span>
        <select
          v-model="selectedVehicle"
          :disabled="isRecording"
          class="form-input text-sm py-1 px-2 w-32"
        >
          <option value="bicycle">Bicycle</option>
          <option value="motorbike">Motorbike</option>
        </select>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-700">Current Location</span>
        <span 
          class="text-xs"
          :class="locationState.textColor"
        >
          {{ locationState.message }}
        </span>
      </div>
    </div>

    <!-- Ride Controls (Positioned at the bottom) -->
    <div class="ride-controls">
      <!-- Ride Status -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div 
            class="status-indicator mr-2"
            :class="{
              'status-recording': isRecording && !isPaused,
              'status-paused': isPaused,
              'status-stopped': !isRecording
            }"
          ></div>
          <span class="text-sm font-medium text-gray-700">
            {{ getRideStatus() }}
          </span>
        </div>
        <div class="text-sm text-gray-500">
          {{ formatDuration(elapsedTime) }}
        </div>
      </div>

      <!-- Ride Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900">
            {{ formatDistance(totalDistance) }}
          </div>
          <div class="text-xs text-gray-500">Distance</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900">
            {{ formatSpeed(currentSpeed) }}
          </div>
          <div class="text-xs text-gray-500">Speed</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900">
            {{ routePoints.length }}
          </div>
          <div class="text-xs text-gray-500">Points</div>
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="flex gap-3">
        <AppButton
          v-if="!isRecording"
          variant="primary"
          size="lg"
          icon="heroicons:play"
          full-width
          @click="startRide"
          :loading="starting"
        >
          Start Ride
        </AppButton>

        <template v-else>
          <AppButton
            v-if="!isPaused"
            variant="secondary"
            size="lg"
            icon="heroicons:pause"
            @click="pauseRide"
            class="flex-1"
          >
            Pause
          </AppButton>
          <AppButton
            v-else
            variant="primary"
            size="lg"
            icon="heroicons:play"
            @click="resumeRide"
            class="flex-1"
          >
            Resume
          </AppButton>

          <AppButton
            variant="danger"
            size="lg"
            icon="heroicons:stop"
            @click="stopRide"
            class="flex-1"
            :loading="stopping"
          >
            Stop
          </AppButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch, computed } from 'vue'
import { useRouteTracking } from '~/composables/useAmap'
import { formatDuration, formatDistance, formatSpeed } from '~/utils/formatters'
import { useGlobalMap } from '~/composables/useGlobalMap'
import AppButton from '~/components/ui/AppButton.vue'

// Meta
useHead({
  title: 'Track Ride - Rider Tracker'
})

// Reactive data
const showSettings = ref(false)
const starting = ref(false)
const stopping = ref(false)
const selectedVehicle = ref('bicycle')
const elapsedTime = ref(0)
const currentSpeed = ref(0)
const currentHeading = ref(0) // Add heading tracking

// Get the global map state
const { currentLocation, locationError } = useGlobalMap()

// Computed property for location state message and styling
const locationState = computed(() => {
  // Check if we have location data
  if (currentLocation.value) {
    return {
      textColor: 'text-green-600',
      message: `${currentLocation.value.lat.toFixed(6)}, ${currentLocation.value.lng.toFixed(6)}`
    }
  } 
  
  // If we have an error
  if (locationError.value) {
    return {
      textColor: 'text-red-600',
      message: 'Location error: Please enable location services'
    }
  }
  
  // Default waiting state
  return {
    textColor: 'text-yellow-600',
    message: 'Getting location...'
  }
})

// Route tracking - use enhanced version
const {
  routePoints,
  isRecording,
  isPaused,
  totalDistance,
  startRecording,
  pauseRecording,
  resumeRecording,
  stopRecording,
  getDuration,
  getAverageSpeed
} = useRouteTracking()

// Timer for elapsed time
let timer = null

// Computed
const getRideStatus = () => {
  if (isRecording.value && !isPaused.value) return 'Recording'
  if (isPaused.value) return 'Paused'
  return 'Ready to start'
}

// Methods
const startRide = async () => {
  starting.value = true
  try {
    await startRecording()
    startTimer()
  } catch (error) {
    console.error('Failed to start ride:', error)
    alert('Failed to start ride. Please check your location permissions.')
  } finally {
    starting.value = false
  }
}

const pauseRide = () => {
  pauseRecording()
  stopTimer()
}

const resumeRide = () => {
  resumeRecording()
  startTimer()
}

const stopRide = async () => {
  stopping.value = true
  try {
    await stopRecording()
    stopTimer()
    elapsedTime.value = 0
    
    // Show completion message
    const distance = formatDistance(totalDistance.value)
    const duration = formatDuration(getDuration())
    const avgSpeed = formatSpeed(getAverageSpeed())
    
    alert(`Ride completed!\nDistance: ${distance}\nDuration: ${duration}\nAverage Speed: ${avgSpeed}`)
  } catch (error) {
    console.error('Failed to stop ride:', error)
  } finally {
    stopping.value = false
  }
}

const startTimer = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// Update current location text when location changes
watch(() => currentLocation.value, (newLocation) => {
  if (newLocation) {
    // currentLocationText.value = `${newLocation.lat.toFixed(6)}, ${newLocation.lng.toFixed(6)}`
    
    // Update current speed if available
    if (newLocation.speed !== undefined) {
      currentSpeed.value = newLocation.speed
    }
    
    // Update heading if available
    if (newLocation.heading !== undefined) {
      currentHeading.value = newLocation.heading
    }
  } else {
    // currentLocationText.value = 'Getting location...'
  }
}, { deep: true })

// Cleanup on unmount
onUnmounted(() => {
  stopTimer()
  if (isRecording.value) {
    stopRecording()
  }
})
</script>

<style scoped>
.page-container {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

.ride-controls {
  position: fixed;
  bottom: 72px; /* Height of mobile nav + some padding */
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(229, 231, 235, 0.8);
  padding: 1rem;
  z-index: 10;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #d1d5db;
}

.status-recording {
  background-color: #ef4444;
  animation: pulse 1.5s infinite;
}

.status-paused {
  background-color: #f59e0b;
}

.status-stopped {
  background-color: #10b981;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}
</style> 