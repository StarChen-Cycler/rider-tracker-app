import { ref, reactive, onUnmounted, watch, getCurrentInstance } from 'vue'

// Create a reactive store for location tracking that persists across components
const locationTrackingStore = reactive({
  isLocationTracking: false, // Will be started after map loads
  locationTrackingInterval: null as any,
  locationTrackingError: null as Error | null,
  lastLocationUpdate: null as Date | null,
  trackingInterval: 3000, // 3 seconds - configurable
})

export const useLocationTracking = () => {
  // Create reactive refs from the store
  const isLocationTracking = ref(locationTrackingStore.isLocationTracking)
  const locationTrackingError = ref(locationTrackingStore.locationTrackingError)
  const lastLocationUpdate = ref(locationTrackingStore.lastLocationUpdate)
  const trackingInterval = ref(locationTrackingStore.trackingInterval)

  // Watch store changes and update refs
  watch(() => locationTrackingStore.isLocationTracking, (newVal) => {
    isLocationTracking.value = newVal
  })
  
  watch(() => locationTrackingStore.locationTrackingError, (newVal) => {
    locationTrackingError.value = newVal
  })
  
  watch(() => locationTrackingStore.lastLocationUpdate, (newVal) => {
    lastLocationUpdate.value = newVal
  })
  
  watch(() => locationTrackingStore.trackingInterval, (newVal) => {
    trackingInterval.value = newVal
  })

  // Wait for map to be ready before starting location tracking
  const waitForMapReady = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const checkMap = () => {
        if (typeof window !== 'undefined' && window.AMap) {
          resolve(true)
        } else {
          setTimeout(checkMap, 100)
        }
      }
      checkMap()
    })
  }

  // Start continuous location tracking (with map readiness check)
  const startLocationTracking = async (locationService: () => Promise<any>) => {
    // Wait for map to be ready first
    await waitForMapReady()
    
    if (locationTrackingStore.isLocationTracking && locationTrackingStore.locationTrackingInterval) {
      console.log('Location tracking already active')
      return
    }
    
    console.log('Starting continuous location tracking...')
    locationTrackingStore.isLocationTracking = true
    locationTrackingStore.locationTrackingError = null
    
    // Get initial location
    try {
      await locationService()
      locationTrackingStore.lastLocationUpdate = new Date()
      console.log('Initial location obtained for tracking')
    } catch (error) {
      console.error('Failed to get initial location for tracking:', error)
      locationTrackingStore.locationTrackingError = error instanceof Error ? error : new Error('Failed to get initial location')
    }
    
    // Start interval for continuous tracking
    locationTrackingStore.locationTrackingInterval = setInterval(async () => {
      if (!locationTrackingStore.isLocationTracking) return
      
      try {
        await locationService()
        locationTrackingStore.lastLocationUpdate = new Date()
        locationTrackingStore.locationTrackingError = null
        console.log('Location updated at:', locationTrackingStore.lastLocationUpdate)
      } catch (error) {
        console.error('Failed to update location during tracking:', error)
        locationTrackingStore.locationTrackingError = error instanceof Error ? error : new Error('Failed to update location')
      }
    }, locationTrackingStore.trackingInterval)
    
    console.log(`Location tracking started with ${locationTrackingStore.trackingInterval}ms interval`)
  }

  // Stop continuous location tracking
  const stopLocationTracking = () => {
    if (!locationTrackingStore.isLocationTracking) {
      console.log('Location tracking already stopped')
      return
    }
    
    console.log('Stopping location tracking...')
    locationTrackingStore.isLocationTracking = false
    
    if (locationTrackingStore.locationTrackingInterval) {
      clearInterval(locationTrackingStore.locationTrackingInterval)
      locationTrackingStore.locationTrackingInterval = null
    }
    
    console.log('Location tracking stopped')
  }

  // Toggle location tracking
  const toggleLocationTracking = async (locationService: () => Promise<any>) => {
    if (locationTrackingStore.isLocationTracking) {
      stopLocationTracking()
    } else {
      await startLocationTracking(locationService)
    }
  }

  // Configure tracking interval
  const setTrackingInterval = (interval: number) => {
    locationTrackingStore.trackingInterval = interval
    
    // If tracking is active, restart with new interval
    if (locationTrackingStore.isLocationTracking && locationTrackingStore.locationTrackingInterval) {
      // Store the location service function for restart
      const wasTracking = locationTrackingStore.isLocationTracking
      stopLocationTracking()
      
      // Note: This requires the locationService to be available
      // In practice, this would be handled by the parent composable
      console.log(`Tracking interval updated to ${interval}ms`)
    }
  }

  // Check if tracking is supported
  const isSupported = () => {
    return typeof window !== 'undefined' && 'navigator' in window && 'geolocation' in navigator
  }

  // Get tracking statistics
  const getTrackingStats = () => {
    return {
      isActive: locationTrackingStore.isLocationTracking,
      interval: locationTrackingStore.trackingInterval,
      lastUpdate: locationTrackingStore.lastLocationUpdate,
      error: locationTrackingStore.locationTrackingError,
      uptime: locationTrackingStore.lastLocationUpdate 
        ? Date.now() - locationTrackingStore.lastLocationUpdate.getTime()
        : null
    }
  }

  // Cleanup on unmount (only if in component context)
  if (typeof window !== 'undefined' && getCurrentInstance()) {
    onUnmounted(() => {
      stopLocationTracking()
    })
  }

  // Return the composable interface
  return {
    // State (matching existing API)
    isLocationTracking,
    locationTrackingError,
    lastLocationUpdate,
    trackingInterval,
    
    // Methods (matching existing API)
    startLocationTracking,
    stopLocationTracking,
    toggleLocationTracking,
    
    // Additional configuration methods
    setTrackingInterval,
    isSupported,
    getTrackingStats,
    
    // Direct access to store for advanced use cases
    locationTrackingStore
  }
}

// Export store for direct access if needed
export { locationTrackingStore } 