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
              {{ recoveredRideInfo.title }} • {{ formatDuration(recoveredRideInfo.duration) }} • {{ recoveredRideInfo.points }} points
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
          {{ formatDuration(recordingDuration) }}
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
            {{ formatSpeed(rideSpeed || currentSpeed) }}
          </div>
          <div class="text-xs text-gray-500">Speed</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900">
            {{ rideLocationPoints.length }}
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
import { useRideRecording } from '~/composables/useRideRecording'
import { useMapPolylines } from '~/composables/useMapPolylines'
import { formatDistance, formatSpeed } from '~/utils/formatters'
import { useGlobalMap } from '~/composables/useGlobalMap'
import { useMapSettings } from '~/composables/useMapSettings'
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
const starting = ref(false)
const stopping = ref(false)
const selectedVehicle = ref('bicycle')
const currentSpeed = ref(0)
const currentHeading = ref(0) // Add heading tracking
const recoveredRideInfo = ref(null) // Store info about recovered recording
const recoveredRideInfoTimer = ref(null) // Timer for auto-hiding recovered ride info
// Get the global map state
const { 
  currentLocation, 
  locationError, 
  isOrientationTracking, 
  startOrientationTracking, 
  stopOrientationTracking,
  isLocationTracking,
  toggleLocationTracking
} = useGlobalMap()

// Get map settings state
const {
  currentTheme,
  enabledFeatures,
  setMapTheme,
  setMapFeatures,
  toggleFeature,
  getAvailableThemes,
  getAvailableFeatures
} = useMapSettings()

// Map settings reactive data
const selectedTheme = ref(currentTheme.value)
const availableThemes = ref(getAvailableThemes())
const availableFeatures = ref(getAvailableFeatures())

// Map settings methods (now async)
const onThemeChange = async () => {
  try {
    await setMapTheme(selectedTheme.value)
  } catch (error) {
    console.error('Failed to change map theme:', error)
  }
}

const toggleMapFeature = async (featureKey) => {
  try {
    await toggleFeature(featureKey)
  } catch (error) {
    console.error('Failed to toggle map feature:', error)
  }
}

const isFeatureEnabled = (featureKey) => {
  return enabledFeatures.value.includes(featureKey)
}

// Watch for theme changes to update selected theme
watch(currentTheme, (newTheme) => {
  selectedTheme.value = newTheme
})

// Watch for UI setting changes and save to temp state for persistence
watch(selectedVehicle, (newVehicle) => {
  saveTempUISettings({ selectedVehicle: newVehicle })
})

watch(selectedTheme, (newTheme) => {
  saveTempUISettings({ selectedTheme: newTheme })
})

watch(enabledFeatures, (newFeatures) => {
  saveTempUISettings({ enabledFeatures: [...newFeatures] })
}, { deep: true })

// Ride recording composable
const {
  isRecording: isRideRecording,
  isPaused: isRidePaused,
  currentRide,
  locationPoints: rideLocationPoints,
  recordingDuration,
  totalDistance: rideDistance,
  currentSpeed: rideSpeed,
  // maxSpeed: rideMaxSpeed,  // Available but not used in this component yet
  // saveStatus,              // Available but not used in this component yet
  // saveError,               // Available but not used in this component yet
  startRide: startRideRecording,
  addLocationPoint,
  pauseRide: pauseRideRecording,
  resumeRide: resumeRideRecording,
  stopRide: stopRideRecording,
  updateRecordingDuration,
  cleanup: cleanupRideRecording,
  // Persistence methods
  initializeRecordingState,
  formatDuration,
  // UI Settings persistence
  saveTempUISettings,
  getTempUISettings
} = useRideRecording()

// Map polylines composable for track visualization
const {
  activePolyline,
  startRideTracking,
  addTrackingPoint,
  pauseRideTracking,
  resumeRideTracking,
  completeRideTracking,
  cancelRideTracking,
  clearAllPolylines,
  recoverRidePolyline
} = useMapPolylines()

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

// Keep route tracking for map display (but use ride recording for data)
const {
  startRecording,
  stopRecording
} = useRouteTracking()

// Timer for elapsed time
let timer = null

// Computed values using ride recording data
const getRideStatus = () => {
  if (isRideRecording.value && !isRidePaused.value) return 'Recording'
  if (isRidePaused.value) return 'Paused'
  return 'Ready to start'
}

// Use ride recording values for display
const isRecording = computed(() => isRideRecording.value)
const isPaused = computed(() => isRidePaused.value)
const totalDistance = computed(() => rideDistance.value)

// Methods using ride recording
const startRide = async () => {
  starting.value = true
  console.log('🚴 TRACK DEBUG: Starting ride...')
  
  try {
    // Clear any existing polylines before starting new ride
    clearAllPolylines()
    console.log('🧹 TRACK DEBUG: Cleared existing polylines before new ride')
    
    // Start ride recording with metadata
    const rideTitle = `${selectedVehicle.value} ride - ${new Date().toLocaleDateString()}`
    console.log('🚴 TRACK DEBUG: Starting ride recording with title:', rideTitle)
    
    const rideId = await startRideRecording(rideTitle, selectedVehicle.value)
    console.log('🚴 TRACK DEBUG: Ride recording started with ID:', rideId)
    
    // Start polyline tracking for visual path
    const polyline = startRideTracking(rideId)
    console.log('🚴 TRACK DEBUG: Polyline tracking started:', polyline?.id)
    
    // Also start route tracking for map display
    await startRecording()
    console.log('🚴 TRACK DEBUG: Route tracking started')
    
    // Start timer
    startTimer()
    
    // Check initial state
    console.log('🚴 TRACK DEBUG: Initial ride state after start:', {
      isRideRecording: isRideRecording.value,
      isRidePaused: isRidePaused.value,
      currentRide: currentRide.value?.metadata.id,
      locationPointsCount: rideLocationPoints.value.length,
      currentLocation: currentLocation.value ? 'available' : 'not available'
    })
    
    console.log('🚴 Started ride recording:', rideTitle)
  } catch (error) {
    console.error('Failed to start ride:', error)
    alert('Failed to start ride. Please check your location permissions.')
  } finally {
    starting.value = false
  }
}

const pauseRide = () => {
  // Pause ride recording
  pauseRideRecording()
  
  // Pause polyline tracking (changes style to dashed)
  pauseRideTracking()
  
  stopTimer()
  console.log('⏸️ Paused ride recording and polyline tracking')
}

const resumeRide = () => {
  // Resume ride recording
  resumeRideRecording()
  
  // Resume polyline tracking (changes style back to solid)
  resumeRideTracking()
  
  // Restart timer accounting for existing duration
  startTimer()
  console.log('▶️ Resumed ride recording and polyline tracking')
}

const stopRide = async () => {
  stopping.value = true
  try {
    // Stop ride recording and save data
    const result = await stopRideRecording()
    
    // Complete polyline tracking (changes style to green)
    completeRideTracking()
    console.log('🏁 TRACK DEBUG: Completed polyline tracking')
    
    // Also stop route tracking
    await stopRecording()
    
    // Stop timer
    stopTimer()
    
    // Show completion message
    if (result.success && result.finalStats) {
      console.log('🏁 TRACK DEBUG: Using final stats from result:', {
        finalStats: result.finalStats,
        storeValues: {
          rideDistance: rideDistance.value,
          recordingDuration: recordingDuration.value,
          rideLocationPoints: rideLocationPoints.value.length
        },
        result: result
      })
      
      const distance = formatDistance(result.finalStats.totalDistance)
      const duration = formatDuration(result.finalStats.totalDuration)
      const points = result.finalStats.totalPoints
      const avgSpeed = formatSpeed(result.finalStats.averageSpeed)
      const maxSpeed = formatSpeed(result.finalStats.maxSpeed)
      
      console.log('🏁 TRACK DEBUG: Formatted values for alert:', {
        distance,
        duration,
        points,
        avgSpeed,
        maxSpeed
      })
      
      alert(`🎉 Ride completed!\nDistance: ${distance}\nDuration: ${duration}\nPoints: ${points}\nAvg Speed: ${avgSpeed}\nMax Speed: ${maxSpeed}\nRide ID: ${result.rideId}\n\nData saved locally and to backend!`)
    } else if (result.success) {
      // Fallback if finalStats not available
      alert(`🎉 Ride completed!\nRide ID: ${result.rideId}\n\nData saved locally and to backend!`)
    } else {
      alert(`⚠️ Ride stopped but save failed: ${result.error || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Failed to stop ride:', error)
    alert('Failed to stop ride: ' + (error instanceof Error ? error.message : 'Unknown error'))
  } finally {
    stopping.value = false
  }
}

let startTimestamp = null

const startTimer = () => {
  if (timer) clearInterval(timer)
  console.log('⏰ TRACK DEBUG: Starting timer')
  
  // Account for existing duration (important for resume and recovery)
  const existingDuration = recordingDuration.value
  startTimestamp = Date.now() - (existingDuration * 1000)
  
  timer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTimestamp) / 1000)
    // Update ride recording duration
    updateRecordingDuration(elapsed)
    console.log('⏰ TRACK DEBUG: Timer tick:', {
      elapsed: elapsed,
      recordingDuration: recordingDuration.value,
      rideDistance: rideDistance.value,
      locationPoints: rideLocationPoints.value.length
    })
  }, 1000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// Update current location and add to ride recording
watch(() => currentLocation.value, (newLocation) => {
  console.log('🔍 TRACK DEBUG: Location changed:', {
    hasLocation: !!newLocation,
    location: newLocation ? {
      lat: newLocation.lat?.toFixed(6),
      lng: newLocation.lng?.toFixed(6),
      speed: newLocation.speed,
      accuracy: newLocation.accuracy,
      timestamp: newLocation.timestamp
    } : null,
    rideState: {
      isRideRecording: isRideRecording.value,
      isRidePaused: isRidePaused.value,
      shouldAddPoint: isRideRecording.value && !isRidePaused.value
    }
  })
  
  if (newLocation) {
    // Update current speed if available
    if (newLocation.speed !== undefined) {
      currentSpeed.value = newLocation.speed
    }
    
    // Update heading if available
    if (newLocation.heading !== undefined) {
      currentHeading.value = newLocation.heading
    }
    
    // Add location point to ride recording if recording is active
    if (isRideRecording.value && !isRidePaused.value) {
      console.log('📍 TRACK DEBUG: Adding location point to ride recording')
      addLocationPoint(newLocation)
      
      // Also add point to polyline for visual tracking
      addTrackingPoint(newLocation.lat, newLocation.lng)
      console.log('📍 TRACK DEBUG: Added point to polyline tracking')
    } else {
      console.log('⚠️ TRACK DEBUG: NOT adding location point because:', {
        isRideRecording: isRideRecording.value,
        isRidePaused: isRidePaused.value,
        reason: !isRideRecording.value ? 'not recording' : 'ride is paused'
      })
    }
  }
}, { deep: true })

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

// Clear all polylines (useful for debugging or reset)
const clearAllTracks = () => {
  clearAllPolylines()
  console.log('🧹 TRACK DEBUG: Cleared all polyline tracks')
}

// Set recovered ride info with auto-hide timer
const setRecoveredRideInfo = (info) => {
  // Clear any existing timer
  if (recoveredRideInfoTimer.value) {
    clearTimeout(recoveredRideInfoTimer.value)
  }
  
  // Set the info
  recoveredRideInfo.value = info
  
  // Set auto-hide timer for 2 seconds
  recoveredRideInfoTimer.value = setTimeout(() => {
    recoveredRideInfo.value = null
    recoveredRideInfoTimer.value = null
    console.log('🔄 TRACK DEBUG: Auto-hid recovered ride info after 2 seconds')
  }, 2000)
  
  console.log('🔄 TRACK DEBUG: Set recovered ride info with 2-second auto-hide timer')
}

// Manually dismiss recovered ride info (for X button)
const dismissRecoveredRideInfo = () => {
  // Clear any existing timer
  if (recoveredRideInfoTimer.value) {
    clearTimeout(recoveredRideInfoTimer.value)
    recoveredRideInfoTimer.value = null
  }
  
  // Clear the info
  recoveredRideInfo.value = null
  console.log('🔄 TRACK DEBUG: Manually dismissed recovered ride info')
}

// State recovery on component mount
const initializeComponent = async () => {
  console.log('🔄 TRACK DEBUG: Initializing component and checking for temp recording state')
  
  // Restore UI settings from temp state first
  const tempUISettings = getTempUISettings()
  if (tempUISettings.selectedVehicle) {
    selectedVehicle.value = tempUISettings.selectedVehicle
    console.log('🔄 TRACK DEBUG: Restored vehicle type:', tempUISettings.selectedVehicle)
  }
  if (tempUISettings.selectedTheme) {
    selectedTheme.value = tempUISettings.selectedTheme
    try {
      await setMapTheme(tempUISettings.selectedTheme)
      console.log('🔄 TRACK DEBUG: Restored map theme:', tempUISettings.selectedTheme)
    } catch (error) {
      console.warn('⚠️ Failed to restore map theme:', error)
    }
  }
  if (tempUISettings.enabledFeatures && tempUISettings.enabledFeatures.length > 0) {
    try {
      await setMapFeatures(tempUISettings.enabledFeatures)
      console.log('🔄 TRACK DEBUG: Restored map features:', tempUISettings.enabledFeatures)
    } catch (error) {
      console.warn('⚠️ Failed to restore map features:', error)
    }
  }
  
  // Check for existing recording state
  const recoveryResult = initializeRecordingState()
  
  if (recoveryResult.recovered) {
    console.log('🔄 TRACK DEBUG: Recording state recovered:', recoveryResult)
    
    // Restart timer if recording was active
    if (isRideRecording.value && !isRidePaused.value) {
      console.log('🔄 TRACK DEBUG: Resuming timer for recovered recording')
      startTimer()
    }
    
    // Redraw polylines from recovered location points using optimized bulk method
    if (rideLocationPoints.value.length > 0 && currentRide.value) {
      console.log('🔄 TRACK DEBUG: Recovering polylines from', rideLocationPoints.value.length, 'recovered points')
      
             // Determine polyline status based on ride state
       let polylineStatus
       if (isRideRecording.value && !isRidePaused.value) {
         polylineStatus = 'recording'
       } else if (isRidePaused.value) {
         polylineStatus = 'paused'
       } else {
         polylineStatus = 'completed'
       }
      
             // Use optimized bulk polyline recovery (waits for map to be ready)
       recoverRidePolyline({
         id: currentRide.value.metadata.id,
         locationPoints: rideLocationPoints.value,
         status: polylineStatus
       }).then((recoveredPolyline) => {
         if (recoveredPolyline) {
           console.log('🔄 TRACK DEBUG: Successfully recovered polyline:', {
             polylineId: recoveredPolyline.id,
             rideId: recoveredPolyline.rideId,
             pointCount: recoveredPolyline.points.length,
             status: recoveredPolyline.status,
             isActive: recoveredPolyline.status === 'recording' || recoveredPolyline.status === 'paused'
           })
           
           // Update recovery info to show polyline was also recovered
           if (recoveredRideInfo.value) {
             recoveredRideInfo.value.polylineRecovered = true
           }
         } else {
           console.warn('⚠️ TRACK DEBUG: Failed to recover polyline - continuing without visual track')
         }
       }).catch((error) => {
         console.error('❌ TRACK DEBUG: Error recovering polyline:', error, '- continuing without visual track')
       })
    }
    
    // Set recovery info for UI indicator with auto-hide timer
    setRecoveredRideInfo({
      title: recoveryResult.title,
      duration: recoveryResult.duration,
      points: recoveryResult.points
    })
  }
}

// Call initialization on component mount
initializeComponent()

// Make debug function available globally
if (typeof window !== 'undefined') {
  window.clearAllTracks = clearAllTracks
}

// Cleanup on unmount
onUnmounted(() => {
  // Stop timer
  stopTimer()
  
  // Clear recovered ride info timer
  if (recoveredRideInfoTimer.value) {
    clearTimeout(recoveredRideInfoTimer.value)
    recoveredRideInfoTimer.value = null
  }
  
  // Clean up ride recording first (important for data safety)
  cleanupRideRecording()
  
  // Clean up polyline tracking
  if (activePolyline.value) {
    // Cancel active tracking if component unmounts during recording
    cancelRideTracking()
    console.log('🧹 TRACK DEBUG: Cancelled active polyline tracking on unmount')
  }
  
  // Clean up any ongoing recording
  if (isRecording.value) {
    stopRecording()
  }
  
  // Stop orientation tracking
  if (isOrientationTracking.value) {
    stopOrientationTracking()
  }
  
  // Stop location tracking
  if (isLocationTracking.value) {
    toggleLocationTracking()
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