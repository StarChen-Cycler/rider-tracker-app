import { ref, reactive, onUnmounted, watch, getCurrentInstance } from 'vue'

// Create a reactive store for orientation tracking that persists across components
const orientationStore = reactive({
  deviceOrientation: 0,
  isTracking: false, // Will be started after map loads
  orientationHandler: null as any,
  permissionStatus: 'unknown' as 'unknown' | 'granted' | 'denied' | 'not-supported',
  lastOrientationUpdate: null as Date | null,
  error: null as Error | null,
})

export const useOrientTracking = () => {
  // Create reactive refs from the store
  const deviceOrientation = ref(orientationStore.deviceOrientation)
  const isTracking = ref(orientationStore.isTracking)
  const permissionStatus = ref(orientationStore.permissionStatus)
  const lastOrientationUpdate = ref(orientationStore.lastOrientationUpdate)
  const error = ref(orientationStore.error)

  // Watch store changes and update refs
  watch(() => orientationStore.deviceOrientation, (newVal) => {
    deviceOrientation.value = newVal
  })
  
  watch(() => orientationStore.isTracking, (newVal) => {
    isTracking.value = newVal
  })
  
  watch(() => orientationStore.permissionStatus, (newVal) => {
    permissionStatus.value = newVal
  })
  
  watch(() => orientationStore.lastOrientationUpdate, (newVal) => {
    lastOrientationUpdate.value = newVal
  })
  
  watch(() => orientationStore.error, (newVal) => {
    error.value = newVal
  })

  // Check if device orientation is supported
  const isSupported = () => {
    return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window
  }

  // Request permission for iOS 13+ devices
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported()) {
      orientationStore.permissionStatus = 'not-supported'
      return false
    }

    // For iOS 13+ devices, need to request permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission()
        orientationStore.permissionStatus = permissionState === 'granted' ? 'granted' : 'denied'
        return permissionState === 'granted'
      } catch (error) {
        console.error('Error requesting device orientation permission:', error)
        orientationStore.permissionStatus = 'denied'
        orientationStore.error = error instanceof Error ? error : new Error('Permission request failed')
        return false
      }
    } else {
      // For other devices, assume permission is granted
      orientationStore.permissionStatus = 'granted'
      return true
    }
  }

  // Wait for map to be ready before starting orientation tracking
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

  // Start orientation tracking (with map readiness check)
  const startTracking = async (): Promise<boolean> => {
    // Wait for map to be ready first
    await waitForMapReady()
    
    if (orientationStore.isTracking && orientationStore.orientationHandler) {
      console.log('Orientation tracking already active')
      return true
    }

    if (!isSupported()) {
      console.warn('Device orientation not supported')
      orientationStore.error = new Error('Device orientation not supported')
      return false
    }

    // Request permission if needed
    const hasPermission = await requestPermission()
    if (!hasPermission) {
      console.warn('Device orientation permission not granted')
      orientationStore.error = new Error('Permission denied for device orientation')
      return false
    }

    // Create the orientation handler
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // For most devices, alpha represents the compass heading
        // Convert to proper heading: 0° = North, 90° = East, 180° = South, 270° = West
        let heading = event.alpha

        // Handle different device orientations
        if (event.webkitCompassHeading !== undefined) {
          // iOS devices provide webkitCompassHeading which is more accurate
          heading = event.webkitCompassHeading
        } else {
          // Android devices: alpha is typically 0-360 where 0 is North
          // But we need to account for the device's natural orientation
          heading = (360 - event.alpha) % 360
        }

        // Update store
        orientationStore.deviceOrientation = heading
        orientationStore.lastOrientationUpdate = new Date()
        orientationStore.error = null

        console.log('Device orientation updated:', heading)
      }
    }

    // Store the handler for proper cleanup
    orientationStore.orientationHandler = handleOrientation

    // Add event listener
    window.addEventListener('deviceorientation', handleOrientation, true)
    orientationStore.isTracking = true

    console.log('Device orientation tracking started')
    return true
  }

  // Stop orientation tracking
  const stopTracking = () => {
    if (!orientationStore.isTracking) {
      console.log('Orientation tracking already stopped')
      return
    }

    // Remove the specific handler we stored
    if (orientationStore.orientationHandler) {
      window.removeEventListener('deviceorientation', orientationStore.orientationHandler, true)
      orientationStore.orientationHandler = null
    }

    orientationStore.isTracking = false
    console.log('Device orientation tracking stopped')
  }

  // Toggle orientation tracking
  const toggleTracking = async (): Promise<boolean> => {
    if (orientationStore.isTracking) {
      stopTracking()
      return false
    } else {
      return await startTracking()
    }
  }

  // Cleanup on unmount (only if in component context)
  if (typeof window !== 'undefined' && getCurrentInstance()) {
    onUnmounted(() => {
      stopTracking()
    })
  }

  // Return the composable interface
  return {
    // State
    deviceOrientation,
    isTracking,
    permissionStatus,
    lastOrientationUpdate,
    error,
    
    // Methods
    startTracking,
    stopTracking,
    toggleTracking,
    requestPermission,
    isSupported,
    
    // Direct access to store for advanced use cases
    orientationStore
  }
}

// Global type declarations
declare global {
  interface Window {
    DeviceOrientationEvent: any
  }
  
  interface DeviceOrientationEvent {
    webkitCompassHeading?: number
  }
} 