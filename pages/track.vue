<template>
  <div class="page-container map-interaction">
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

      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-gray-700">Current Location</span>
        <span 
          class="text-xs"
          :class="locationState.textColor"
        >
          {{ locationState.message }}
        </span>
      </div>
      
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-700">Orientation Tracking</span>
        <button 
          @click="toggleOrientationTracking" 
          class="flex items-center px-2 py-1 rounded text-xs"
          :class="isOrientationTracking ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
        >
          <Icon 
            name="heroicons:cursor-arrow-rays" 
            class="w-4 h-4 mr-1"
            :class="{ 'text-blue-600': isOrientationTracking }"
          />
          {{ isOrientationTracking ? 'Enabled' : 'Enable' }}
        </button>
      </div>
      
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-700">Location Tracking</span>
        <button 
          @click="toggleLocationTracking" 
          class="flex items-center px-2 py-1 rounded text-xs"
          :class="isLocationTracking ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
        >
          <Icon 
            name="heroicons:map-pin" 
            class="w-4 h-4 mr-1"
            :class="{ 'text-green-600': isLocationTracking }"
          />
          {{ isLocationTracking ? 'Active' : 'Start' }}
        </button>
      </div>

      <!-- Map Settings -->
      <div class="mt-3 pt-3 border-t border-gray-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-700">Map Theme</span>
          <select
            v-model="selectedTheme"
            @change="onThemeChange"
            class="form-input text-sm py-1 px-2 w-32"
          >
            <option 
              v-for="theme in availableThemes" 
              :key="theme.key" 
              :value="theme.key"
            >
              {{ theme.name }}
            </option>
          </select>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-700">Map Features</span>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="feature in availableFeatures"
              :key="feature.key"
              @click="toggleMapFeature(feature.key)"
              class="px-2 py-1 rounded text-xs border"
              :class="isFeatureEnabled(feature.key) ? 
                'bg-blue-100 text-blue-700 border-blue-300' : 
                'bg-gray-50 text-gray-600 border-gray-300'"
            >
              {{ feature.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ride Controls (Positioned at the bottom) -->
    <div class="ride-controls">
      <!-- Recovered Recording Indicator -->
      <div 
        v-if="recoveredRideInfo" 
        class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-blue-800">
              Recording recovered from page refresh
            </p>
            <p class="text-sm text-blue-600">
              {{ recoveredRideInfo.title }} • {{ formatTime(recoveredRideInfo.duration) }} • {{ recoveredRideInfo.points }} points
            </p>
          </div>
          <div class="ml-auto">
            <button 
              @click="dismissRecoveredRideInfo"
              class="flex-shrink-0 text-blue-400 hover:text-blue-600"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

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
          {{ formatTime(recordingDuration) }}
        </div>
      </div>

      <!-- Ride Stats -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900">
            {{ formatDistance(totalDistance || 0) }}
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
            {{ rideLocationPoints?.length || 0 }}
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
import { ref, onUnmounted } from 'vue'
import { useGlobalMap } from '~/composables/useGlobalMap'
import { useMapSettings } from '~/composables/useMapSettings'
import { useTrackRideControls } from '~/composables/useTrackRideControls'
import { useTrackTimer } from '~/composables/useTrackTimer'
import { useTrackUIState } from '~/composables/useTrackUIState'
import { useTrackLocationStatus } from '~/composables/useTrackLocationStatus'
import { useTrackRecovery } from '~/composables/useTrackRecovery'
import { useTrackCleanup } from '~/composables/useTrackCleanup'
import { useFormatters } from '~/composables/useFormatters'
import AppButton from '~/components/ui/AppButton.vue'

// Page meta with auth middleware
definePageMeta({
  middleware: 'auth'
})

// Meta
useHead({
  title: 'Track Ride - Rider Tracker'
})

// Reactive data
const showSettings = ref(false)
const currentSpeed = ref(0)
const currentHeading = ref(0)

// Composables usage - zero business logic
const { 
  currentLocation, 
  locationError, 
  isOrientationTracking, 
  startOrientationTracking, 
  stopOrientationTracking,
  isLocationTracking,
  toggleLocationTracking
} = useGlobalMap()

const {
  currentTheme,
  enabledFeatures,
  toggleFeature,
  getAvailableThemes,
  getAvailableFeatures
} = useMapSettings()

const {
  isRecording,
  isPaused,
  starting,
  stopping,
  startRide,
  pauseRide,
  resumeRide,
  stopRide
} = useTrackRideControls()

const { locationPoints: rideLocationPoints } = useRideRecorder()

const { recordingDuration } = useTrackTimer()
const { selectedVehicle, selectedTheme, availableThemes, availableFeatures, onThemeChange, toggleMapFeature, isFeatureEnabled, initializeUIState } = useTrackUIState()
const { locationState } = useTrackLocationStatus()
const { recoveredRideInfo, setRecoveredRideInfo, dismissRecoveredRideInfo, initializeTrackRecovery } = useTrackRecovery()
const { cleanup } = useTrackCleanup()
const { formatDistance, formatSpeed, formatDuration: formatTime } = useFormatters()

// Computed values
const { totalDistance } = useRideRecorder()

// Get ride status
const getRideStatus = () => {
  if (isRecording.value && !isPaused.value) return 'Recording'
  if (isPaused.value) return 'Paused'
  return 'Ready to start'
}

// Toggle device orientation tracking
const toggleOrientationTracking = async () => {
  try {
    if (isOrientationTracking.value) {
      stopOrientationTracking()
    } else {
      const success = await startOrientationTracking()
      if (!success) {
        alert('Could not start orientation tracking. Make sure your device supports it and you have granted permission.')
      }
    }
  } catch (err) {
    console.error('Error toggling orientation tracking:', err)
    alert('Failed to toggle orientation tracking: ' + (err.message || 'Unknown error'))
  }
}

// Initialize component
onMounted(async () => {
  await initializeUIState()
  await initializeTrackRecovery()
})

// Cleanup on unmount
onUnmounted(() => {
  cleanup()
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

/* Special class for pages that need map interaction */
.map-interaction {
  /* Make the container itself transparent to pointer events */
  pointer-events: none !important;
}

/* But make all direct children interactive */
.map-interaction > * {
  pointer-events: auto !important;
}

.ride-controls {
  position: fixed;
  bottom: 55px; /* Height of mobile nav + some padding */
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(229, 231, 235, 0.8);
  padding: 1rem;
  z-index: 10;
  pointer-events: auto !important; /* Ensure controls remain interactive */
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