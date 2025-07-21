import { ref, readonly, provide, inject, reactive, toRef, watch } from 'vue'
import type { Ref } from 'vue'
import { LOCATION_CORRECTION } from '~/utils/constants'
// Import arrow SVG
import arrowSvgTemplate from '~/assets/svg/arrow.svg?raw'
// Import orientation tracking composable
import { useOrientTracking } from './useOrientTracking'
// Import location tracking composable
import { useLocationTracking } from './useLocationTracking'

// Define types for location and map reference
interface Location {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
  heading?: number;
  speed?: number;
}

// Symbol for dependency injection
const GLOBAL_MAP_KEY = Symbol('global-map')

// Function to get arrow SVG (no angle needed since we'll use CSS transforms)
const getArrowSvg = (): string => {
  return arrowSvgTemplate
}

// Create a reactive store for global state that persists across components
const globalMapStore = reactive({
  mapInstance: null as any,
  isMapReady: false,
  currentLocation: null as Location | null,
  locationError: null as Error | null,
  directionMarker: null as any, // Add direction marker reference
  lastHeading: 0, // Store the last known heading
  mapRotation: 0, // Track map rotation
})

// ================================================ PROVIDER COMPOSABLE ================================================
export const useGlobalMapProvider = () => {
  // Initialize orientation tracking composable
  const orientationTracking = useOrientTracking()
  
  // Initialize location tracking composable
  const locationTracking = useLocationTracking()

  // ================================================ MARKER ORIENTATION TRACKING AND CONTROL================================================
  
  // Set the map instance
  const setMapInstance = (instance: any) => {
    globalMapStore.mapInstance = instance
    globalMapStore.isMapReady = true
    console.log('Map instance set in global store')
    
    // Set up map rotation tracking
    if (instance && window.AMap) {
      // Track map rotation changes
      instance.on('rotatechange', () => {
        globalMapStore.mapRotation = instance.getRotation()
        updateArrowWithRelativeOrientation()
      })
    }
  }
  
  // Watch for orientation changes to trigger arrow updates
  watch(() => orientationTracking.deviceOrientation.value, () => {
    updateArrowWithRelativeOrientation()
  })
  
  watch(() => orientationTracking.isTracking.value, () => {
    updateArrowWithRelativeOrientation()
  })

  // Calculate the actual arrow angle considering both device orientation and map rotation
  const calculateArrowAngle = (deviceHeading: number, mapRotation: number): number => {
    // Device heading is the direction the phone is pointing (0° = North, 90° = East, etc.)
    // Map rotation is how much the map is rotated (0° = North up, 90° = East up, etc.)
    // We want the arrow to point in the direction the phone is facing relative to the map
    
    // The arrow should point in the device direction relative to the current map orientation
    // When map rotates clockwise, arrow should rotate counterclockwise to maintain absolute direction
    const relativeAngle = deviceHeading + mapRotation
    
    // Normalize to 0-360 range
    return ((relativeAngle % 360) + 360) % 360
  }

  // Update arrow with relative orientation
  const updateArrowWithRelativeOrientation = () => {
    if (!globalMapStore.directionMarker || !globalMapStore.currentLocation) return
    
    let arrowAngle = 0
    
    if (orientationTracking.isTracking.value) {
      // Use device orientation relative to map
      arrowAngle = calculateArrowAngle(orientationTracking.deviceOrientation.value, globalMapStore.mapRotation)
    } else {
      // Use GPS heading or last known heading relative to map
      const gpsHeading = globalMapStore.currentLocation.heading !== undefined 
        ? globalMapStore.currentLocation.heading 
        : globalMapStore.lastHeading
      arrowAngle = calculateArrowAngle(gpsHeading, globalMapStore.mapRotation)
    }
    
    const position: [number, number] = [globalMapStore.currentLocation.lng, globalMapStore.currentLocation.lat]
    updateDirectionMarker(globalMapStore.directionMarker, position, arrowAngle)
  }

  // Orientation tracking methods (delegated to orientation composable)
  const startOrientationTracking = async () => {
    return await orientationTracking.startTracking()
  }
  
  const stopOrientationTracking = () => {
    orientationTracking.stopTracking()
  }

  // ================================================ MARKER LOCATION TRACKING AND CONTROL ================================================

  // Update current location
  const updateCurrentLocation = (location: Location | null) => {
    globalMapStore.currentLocation = location
    if (location === null) {
      globalMapStore.locationError = new Error('Location not available')
    } else {
      globalMapStore.locationError = null
      
      // Update direction marker if location is available
      if (location && globalMapStore.mapInstance) {
        // Update last heading if GPS provides it
        if (location.heading !== undefined) {
          globalMapStore.lastHeading = location.heading
        }
        
        updateLocationMarker([location.lng, location.lat])
      }
    }
    console.log('Location updated in global store:', location)
  }

  // Create a direction arrow marker
  const createDirectionMarker = (position: [number, number], angle: number = 0) => {
    if (!globalMapStore.mapInstance) return null

    // Use the imported SVG (no angle needed, we'll use CSS transforms)
    const arrowSvg = getArrowSvg()

    // Check if AMap is available
    if (!window.AMap) {
      console.error('AMap is not loaded yet')
      return null
    }

    const marker = new window.AMap.Marker({
      position,
      title: 'Current Location',
      anchor: 'center',
      zIndex: 300,
      angle: angle, // Use AMap's built-in rotation
      icon: new window.AMap.Icon({
        size: new window.AMap.Size(32, 32),
        image: 'data:image/svg+xml;base64,' + btoa(arrowSvg),
        imageSize: new window.AMap.Size(32, 32)
      })
    })

    globalMapStore.mapInstance.add(marker)
    
    return marker
  }

  // Update direction marker
  const updateDirectionMarker = (marker: any, position: [number, number], angle: number) => {
    if (!marker || !globalMapStore.mapInstance) return

    // Update position
    marker.setPosition(position)
    
    // Use AMap's built-in rotation for smooth rotation
    if (marker.setAngle) {
      marker.setAngle(angle)
    }
  }

  // Update location marker (create or update)
  const updateLocationMarker = (position: [number, number]) => {
    if (!globalMapStore.mapInstance) return
    
    // Create or update direction marker
    if (!globalMapStore.directionMarker) {
      globalMapStore.directionMarker = createDirectionMarker(position, 0)
    }
    
    // Update with proper orientation
    updateArrowWithRelativeOrientation()
  }

  // Center map on current location
  const centerOnCurrentLocation = async (map: any) => {
    if (!map) return false
    
    try {
      if (globalMapStore.currentLocation && globalMapStore.mapInstance) {
        globalMapStore.mapInstance.setCenter([globalMapStore.currentLocation.lng, globalMapStore.currentLocation.lat], false, 500)
        globalMapStore.mapInstance.setZoom(16, false, 500)
        return true
      }
      
      // If no current location, throw an error
      if (!globalMapStore.currentLocation) {
        throw new Error('No location available to center on')
      }
      
      return false
    } catch (error) {
      console.error('Failed to center on current location:', error)
      throw error
    }
  }

  // Get user location with improved error handling
  const getUserLocation = async () => {
    console.log('Getting user location...')
    
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        console.error('Geolocation API not supported in this browser')
        throw new Error('Geolocation not supported')
      }
      
      // Check if we're in a secure context
      if (window.isSecureContext === false) {
        console.warn('Page is not in a secure context. Geolocation may not work in Chrome, Safari, and Firefox.')
      }

      // Log protocol to help with debugging
      console.log(`Current protocol: ${window.location.protocol}`)
      
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Geolocation timeout'))
        }, 10000) // Increased timeout to 10 seconds
        
        const successCallback = (pos: GeolocationPosition) => {
          clearTimeout(timeoutId)
          console.log('Geolocation success:', pos)
          resolve(pos)
        }
        
        const errorCallback = (err: GeolocationPositionError) => {
          clearTimeout(timeoutId)
          console.error('Geolocation error:', err.code, err.message)
          
          // Provide more detailed error messages
          let errorMessage = 'Unknown error occurred'
          
          switch(err.code) {
            case 1:
              errorMessage = 'Permission denied. User or browser settings denied location access.'
              if (err.message && err.message.includes('secure')) {
                errorMessage += ' This may be due to non-HTTPS connection. Geolocation requires HTTPS.'
              }
              break
            case 2:
              errorMessage = 'Position unavailable. The network is down or satellites cannot be reached.'
              break
            case 3:
              errorMessage = 'Timeout. The request to get user location timed out.'
              break
          }
          
          reject(new Error(errorMessage))
        }
        
        navigator.geolocation.getCurrentPosition(
          successCallback,
          errorCallback,
          {
            enableHighAccuracy: true, // Try high accuracy first
            timeout: 10000,
            maximumAge: 60000
          }
        )
      })
      
      const location = {
        lat: position.coords.latitude + LOCATION_CORRECTION.LAT_DELTA,
        lng: position.coords.longitude + LOCATION_CORRECTION.LNG_DELTA,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        heading: position.coords.heading !== null ? position.coords.heading : undefined,
        speed: position.coords.speed !== null ? position.coords.speed : undefined
      }
      
      // Update location in global state
      updateCurrentLocation(location)
      
      console.log('Location successfully obtained:', location)
      return location
    } catch (error) {
      console.error('Failed to get location:', error)
      // Clear current location in global state
      updateCurrentLocation(null)
      throw error
    }
  }

  // Location tracking methods (delegated to location tracking composable)
  const startLocationTracking = async () => {
    return await locationTracking.startLocationTracking(getUserLocation)
  }

  const stopLocationTracking = () => {
    locationTracking.stopLocationTracking()
  }

  const toggleLocationTracking = async () => {
    return await locationTracking.toggleLocationTracking(getUserLocation)
  }

  // Create refs directly from the reactive store
  const mapInstance = toRef(globalMapStore, 'mapInstance')
  const isMapReady = toRef(globalMapStore, 'isMapReady')
  const currentLocation = toRef(globalMapStore, 'currentLocation')
  const locationError = toRef(globalMapStore, 'locationError')
  const directionMarker = toRef(globalMapStore, 'directionMarker')
  
  // Expose orientation tracking state
  const isOrientationTracking = orientationTracking.isTracking
  
  // Expose location tracking state
  const isLocationTracking = locationTracking.isLocationTracking
  const locationTrackingError = locationTracking.locationTrackingError
  const lastLocationUpdate = locationTracking.lastLocationUpdate

  // Expose methods and state
  const globalMapState = {
    mapInstance,
    isMapReady,
    currentLocation,
    locationError,
    directionMarker,
    isOrientationTracking,
    isLocationTracking,
    locationTrackingError,
    lastLocationUpdate,
    setMapInstance,
    updateCurrentLocation,
    centerOnCurrentLocation,
    getUserLocation,
    updateLocationMarker,
    startOrientationTracking,
    stopOrientationTracking,
    startLocationTracking,
    stopLocationTracking,
    toggleLocationTracking
  }

  // Provide the global map state to child components
  if (typeof window !== 'undefined') {
    provide(GLOBAL_MAP_KEY, globalMapState)
  }

  return globalMapState
}

// ================================================ CONSUMER COMPOSABLE ================================================
export const useGlobalMap = () => {
  // Initialize orientation tracking composable for consumer
  const orientationTracking = useOrientTracking()
  
  // Initialize location tracking composable for consumer
  const locationTracking = useLocationTracking()
  
  // Watch for orientation changes to trigger arrow updates
  watch(() => orientationTracking.deviceOrientation.value, () => {
    updateArrowWithRelativeOrientation()
  })
  
  watch(() => orientationTracking.isTracking.value, () => {
    updateArrowWithRelativeOrientation()
  })
  
  // Create a direct access to the global store
  const directAccess = {
    mapInstance: toRef(globalMapStore, 'mapInstance'),
    isMapReady: toRef(globalMapStore, 'isMapReady'),
    currentLocation: toRef(globalMapStore, 'currentLocation'),
    locationError: toRef(globalMapStore, 'locationError'),
    directionMarker: toRef(globalMapStore, 'directionMarker'),
    isOrientationTracking: orientationTracking.isTracking,
    isLocationTracking: locationTracking.isLocationTracking,
    locationTrackingError: locationTracking.locationTrackingError,
    lastLocationUpdate: locationTracking.lastLocationUpdate,
    setMapInstance: (instance: any) => {
      globalMapStore.mapInstance = instance
      globalMapStore.isMapReady = true
      
      // Set up map rotation tracking
      if (instance && window.AMap) {
        instance.on('rotatechange', () => {
          globalMapStore.mapRotation = instance.getRotation()
          updateArrowWithRelativeOrientation()
        })
      }
    },
    updateCurrentLocation: (location: Location | null) => {
      globalMapStore.currentLocation = location
      if (location === null) {
        globalMapStore.locationError = new Error('Location not available')
      } else {
        globalMapStore.locationError = null
        
        // Update direction marker if location is available
        if (location && globalMapStore.mapInstance) {
          // Update last heading if GPS provides it
          if (location.heading !== undefined) {
            globalMapStore.lastHeading = location.heading
          }
          
          // Create a position array from the location
          const position: [number, number] = [location.lng, location.lat]
          
          // Create or update direction marker
          if (!globalMapStore.directionMarker && window.AMap) {
            globalMapStore.directionMarker = createDirectionMarker(position, 0)
          }
          
          // Update with proper orientation
          updateArrowWithRelativeOrientation()
        }
      }
    },
    centerOnCurrentLocation: async (mapRef: any) => {
      try {
        if (globalMapStore.currentLocation && globalMapStore.mapInstance) {
          globalMapStore.mapInstance.setCenter([globalMapStore.currentLocation.lng, globalMapStore.currentLocation.lat], false, 500)
          return true
        }
        
        // If no current location, throw an error
        if (!globalMapStore.currentLocation) {
          throw new Error('No location available to center on')
        }
        
        return false
      } catch (error) {
        console.error('Failed to center on current location:', error)
        throw error
      }
    },
    getUserLocation: async () => {
      console.log('Getting user location from direct access...')
      
      try {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
          console.error('Geolocation API not supported in this browser')
          throw new Error('Geolocation not supported')
        }
        
        // Check if we're in a secure context
        if (window.isSecureContext === false) {
          console.warn('Page is not in a secure context. Geolocation may not work in Chrome, Safari, and Firefox.')
        }

        // Log protocol to help with debugging
        console.log(`Current protocol: ${window.location.protocol}`)
        
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Geolocation timeout'))
          }, 10000) // Increased timeout to 10 seconds
          
          const successCallback = (pos: GeolocationPosition) => {
            clearTimeout(timeoutId)
            console.log('Geolocation success:', pos)
            resolve(pos)
          }
          
          const errorCallback = (err: GeolocationPositionError) => {
            clearTimeout(timeoutId)
            console.error('Geolocation error:', err.code, err.message)
            
            // Provide more detailed error messages
            let errorMessage = 'Unknown error occurred'
            
            switch(err.code) {
              case 1:
                errorMessage = 'Permission denied. User or browser settings denied location access.'
                if (err.message && err.message.includes('secure')) {
                  errorMessage += ' This may be due to non-HTTPS connection. Geolocation requires HTTPS.'
                }
                break
              case 2:
                errorMessage = 'Position unavailable. The network is down or satellites cannot be reached.'
                break
              case 3:
                errorMessage = 'Timeout. The request to get user location timed out.'
                break
            }
            
            reject(new Error(errorMessage))
          }
          
          navigator.geolocation.getCurrentPosition(
            successCallback,
            errorCallback,
            {
              enableHighAccuracy: true, // Try high accuracy first
              timeout: 10000,
              maximumAge: 60000
            }
          )
        })
        
        const location = {
          lat: position.coords.latitude + LOCATION_CORRECTION.LAT_DELTA,
          lng: position.coords.longitude + LOCATION_CORRECTION.LNG_DELTA,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          heading: position.coords.heading !== null ? position.coords.heading : undefined,
          speed: position.coords.speed !== null ? position.coords.speed : undefined
        }
        
        // Update location in global state
        globalMapStore.currentLocation = location
        globalMapStore.locationError = null
        
        // Update last heading if GPS provides it
        if (location.heading !== undefined) {
          globalMapStore.lastHeading = location.heading
        }
        
        // Update direction marker with new location
        if (location && globalMapStore.mapInstance) {
          const position: [number, number] = [location.lng, location.lat]
          
          if (!globalMapStore.directionMarker && window.AMap) {
            globalMapStore.directionMarker = createDirectionMarker(position, 0)
          }
          
          // Update with proper orientation
          updateArrowWithRelativeOrientation()
        }
        
        console.log('Location successfully obtained:', location)
        return location
      } catch (error) {
        console.error('Failed to get location:', error)
        // Clear current location in global state
        globalMapStore.currentLocation = null
        globalMapStore.locationError = new Error(error instanceof Error ? error.message : 'Location not available')
        throw error
      }
    },
    
    // Add orientation tracking methods (delegated to orientation composable)
    startOrientationTracking: async () => {
      return await orientationTracking.startTracking()
    },
    
    stopOrientationTracking: () => {
      orientationTracking.stopTracking()
    },
    
    // Location tracking methods (delegated to location tracking composable)
    startLocationTracking: async () => {
      return await locationTracking.startLocationTracking(directAccess.getUserLocation)
    },
    
    stopLocationTracking: () => {
      locationTracking.stopLocationTracking()
    },
    
    toggleLocationTracking: async () => {
      return await locationTracking.toggleLocationTracking(directAccess.getUserLocation)
    }
  }

  // Helper functions for direct access
  const calculateArrowAngle = (deviceHeading: number, mapRotation: number): number => {
    // When map rotates clockwise, arrow should rotate counterclockwise to maintain absolute direction
    const relativeAngle = deviceHeading + mapRotation
    return ((relativeAngle % 360) + 360) % 360
  }

  const updateArrowWithRelativeOrientation = () => {
    if (!globalMapStore.directionMarker || !globalMapStore.currentLocation) return
    
    let arrowAngle = 0
    
    if (orientationTracking.isTracking.value) {
      // Use device orientation relative to map
      arrowAngle = calculateArrowAngle(orientationTracking.deviceOrientation.value, globalMapStore.mapRotation)
    } else {
      // Use GPS heading or last known heading relative to map
      const gpsHeading = globalMapStore.currentLocation.heading !== undefined 
        ? globalMapStore.currentLocation.heading 
        : globalMapStore.lastHeading
      arrowAngle = calculateArrowAngle(gpsHeading, globalMapStore.mapRotation)
    }
    
    const position: [number, number] = [globalMapStore.currentLocation.lng, globalMapStore.currentLocation.lat]
    
    // Update the marker with smooth rotation
    if (globalMapStore.directionMarker && window.AMap) {
      globalMapStore.directionMarker.setPosition(position)
      
      // Use AMap's built-in rotation for smooth rotation
      if (globalMapStore.directionMarker.setAngle) {
        globalMapStore.directionMarker.setAngle(arrowAngle)
      }
    }
  }

  const createDirectionMarker = (position: [number, number], angle: number = 0) => {
    if (!globalMapStore.mapInstance || !window.AMap) return null

    const arrowSvg = getArrowSvg()
    const marker = new window.AMap.Marker({
      position,
      title: 'Current Location',
      anchor: 'center',
      zIndex: 300,
      icon: new window.AMap.Icon({
        size: new window.AMap.Size(32, 32),
        image: 'data:image/svg+xml;base64,' + btoa(arrowSvg),
        imageSize: new window.AMap.Size(32, 32)
      })
    })

    globalMapStore.mapInstance.add(marker)
    
    // Apply initial rotation using AMap's built-in rotation
    if (marker.setAngle) {
      marker.setAngle(angle)
    }
    
    return marker
  }
  
  // Try to get the injected state first
  const globalMap = inject(GLOBAL_MAP_KEY, null)
  
  // If injection is not available, use direct access to the global store
  return globalMap || directAccess
} 

// Add global type declaration for AMap
declare global {
  interface Window {
    AMap: any
  }
} 