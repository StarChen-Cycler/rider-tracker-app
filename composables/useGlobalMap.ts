import { ref, readonly, provide, inject, reactive, toRef } from 'vue'
import type { Ref } from 'vue'
import { LOCATION_CORRECTION } from '~/utils/constants'
// Import arrow SVG
import arrowSvgTemplate from '~/assets/svg/arrow.svg?raw'

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

// Function to get arrow SVG with the proper angle
const getArrowSvg = (angle: number): string => {
  return arrowSvgTemplate.replace('${angle}', angle.toString())
}

// Create a reactive store for global state that persists across components
const globalMapStore = reactive({
  mapInstance: null as any,
  isMapReady: false,
  currentLocation: null as Location | null,
  locationError: null as Error | null,
  directionMarker: null as any, // Add direction marker reference
  lastHeading: 0, // Store the last known heading
  deviceOrientation: 0, // Add device orientation tracking
  isOrientationTracking: false, // Track if orientation is being monitored
  mapRotation: 0, // Track map rotation
  orientationHandler: null as any, // Store the orientation handler for proper cleanup
})

export const useGlobalMapProvider = () => {
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
    
    if (globalMapStore.isOrientationTracking) {
      // Use device orientation relative to map
      arrowAngle = calculateArrowAngle(globalMapStore.deviceOrientation, globalMapStore.mapRotation)
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

  // Start device orientation tracking
  const startOrientationTracking = async () => {
    if (typeof window === 'undefined' || globalMapStore.isOrientationTracking) return false
    
    if (window.DeviceOrientationEvent) {
      // For iOS 13+ devices, need to request permission
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permissionState = await (DeviceOrientationEvent as any).requestPermission();
          if (permissionState !== 'granted') {
            console.warn('Device orientation permission not granted')
            return false
          }
        } catch (error) {
          console.error('Error requesting device orientation permission:', error)
          return false
        }
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
          
          globalMapStore.deviceOrientation = heading
          updateArrowWithRelativeOrientation()
        }
      }
      
      // Store the handler for proper cleanup
      globalMapStore.orientationHandler = handleOrientation
      
      window.addEventListener('deviceorientation', handleOrientation, true)
      globalMapStore.isOrientationTracking = true
      console.log('Device orientation tracking started')
      return true
    } else {
      console.warn('Device orientation not supported')
      return false
    }
  }
  
  // Stop device orientation tracking
  const stopOrientationTracking = () => {
    if (typeof window === 'undefined' || !globalMapStore.isOrientationTracking) return
    
    // Remove the specific handler we stored
    if (globalMapStore.orientationHandler) {
      window.removeEventListener('deviceorientation', globalMapStore.orientationHandler, true)
      globalMapStore.orientationHandler = null
    }
    
    globalMapStore.isOrientationTracking = false
    console.log('Device orientation tracking stopped')
    
    // Update arrow to use GPS heading instead
    updateArrowWithRelativeOrientation()
  }

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

    // Use the imported SVG with the angle
    const arrowSvg = getArrowSvg(angle)

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
    
    // Use the imported SVG with the angle
    const arrowSvg = getArrowSvg(angle)

    // Check if AMap is available
    if (!window.AMap) {
      console.error('AMap is not loaded yet')
      return
    }

    marker.setIcon(new window.AMap.Icon({
      size: new window.AMap.Size(32, 32),
      image: 'data:image/svg+xml;base64,' + btoa(arrowSvg),
      imageSize: new window.AMap.Size(32, 32)
    }))
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

  // Create refs directly from the reactive store
  const mapInstance = toRef(globalMapStore, 'mapInstance')
  const isMapReady = toRef(globalMapStore, 'isMapReady')
  const currentLocation = toRef(globalMapStore, 'currentLocation')
  const locationError = toRef(globalMapStore, 'locationError')
  const directionMarker = toRef(globalMapStore, 'directionMarker')
  const isOrientationTracking = toRef(globalMapStore, 'isOrientationTracking')

  // Expose methods and state
  const globalMapState = {
    mapInstance,
    isMapReady,
    currentLocation,
    locationError,
    directionMarker,
    isOrientationTracking,
    setMapInstance,
    updateCurrentLocation,
    centerOnCurrentLocation,
    getUserLocation,
    updateLocationMarker,
    startOrientationTracking,
    stopOrientationTracking
  }

  // Provide the global map state to child components
  if (typeof window !== 'undefined') {
    provide(GLOBAL_MAP_KEY, globalMapState)
  }

  return globalMapState
}

// Consumer composable
export const useGlobalMap = () => {
  // Create a direct access to the global store
  const directAccess = {
    mapInstance: toRef(globalMapStore, 'mapInstance'),
    isMapReady: toRef(globalMapStore, 'isMapReady'),
    currentLocation: toRef(globalMapStore, 'currentLocation'),
    locationError: toRef(globalMapStore, 'locationError'),
    directionMarker: toRef(globalMapStore, 'directionMarker'),
    isOrientationTracking: toRef(globalMapStore, 'isOrientationTracking'),
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
    
    // Add orientation tracking methods
    startOrientationTracking: async () => {
      if (typeof window === 'undefined' || globalMapStore.isOrientationTracking) return false
      
      if (window.DeviceOrientationEvent) {
        // For iOS 13+ devices, need to request permission
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          try {
            const permissionState = await (DeviceOrientationEvent as any).requestPermission();
            if (permissionState !== 'granted') {
              console.warn('Device orientation permission not granted')
              return false
            }
          } catch (error) {
            console.error('Error requesting device orientation permission:', error)
            return false
          }
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
            
            globalMapStore.deviceOrientation = heading
            updateArrowWithRelativeOrientation()
          }
        }
        
        // Store the handler for proper cleanup
        globalMapStore.orientationHandler = handleOrientation
        
        window.addEventListener('deviceorientation', handleOrientation, true)
        globalMapStore.isOrientationTracking = true
        console.log('Device orientation tracking started')
        return true
      } else {
        console.warn('Device orientation not supported')
        return false
      }
    },
    
    stopOrientationTracking: () => {
      if (typeof window === 'undefined' || !globalMapStore.isOrientationTracking) return
      
      // Remove the specific handler we stored
      if (globalMapStore.orientationHandler) {
        window.removeEventListener('deviceorientation', globalMapStore.orientationHandler, true)
        globalMapStore.orientationHandler = null
      }
      
      globalMapStore.isOrientationTracking = false
      console.log('Device orientation tracking stopped')
      
      // Update arrow to use GPS heading instead
      updateArrowWithRelativeOrientation()
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
    
    if (globalMapStore.isOrientationTracking) {
      // Use device orientation relative to map
      arrowAngle = calculateArrowAngle(globalMapStore.deviceOrientation, globalMapStore.mapRotation)
    } else {
      // Use GPS heading or last known heading relative to map
      const gpsHeading = globalMapStore.currentLocation.heading !== undefined 
        ? globalMapStore.currentLocation.heading 
        : globalMapStore.lastHeading
      arrowAngle = calculateArrowAngle(gpsHeading, globalMapStore.mapRotation)
    }
    
    const position: [number, number] = [globalMapStore.currentLocation.lng, globalMapStore.currentLocation.lat]
    
    // Update the marker
    if (globalMapStore.directionMarker && window.AMap) {
      globalMapStore.directionMarker.setPosition(position)
      
      const arrowSvg = getArrowSvg(arrowAngle)
      globalMapStore.directionMarker.setIcon(new window.AMap.Icon({
        size: new window.AMap.Size(32, 32),
        image: 'data:image/svg+xml;base64,' + btoa(arrowSvg),
        imageSize: new window.AMap.Size(32, 32)
      }))
    }
  }

  const createDirectionMarker = (position: [number, number], angle: number = 0) => {
    if (!globalMapStore.mapInstance || !window.AMap) return null

    const arrowSvg = getArrowSvg(angle)
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
    return marker
  }
  
  // Try to get the injected state first
  const globalMap = inject(GLOBAL_MAP_KEY, null)
  
  // If injection is not available, use direct access to the global store
  return globalMap || directAccess
} 

// Add global type declaration for AMap and DeviceOrientationEvent
declare global {
  interface Window {
    AMap: any
    DeviceOrientationEvent: any
  }
  
  interface DeviceOrientationEvent {
    webkitCompassHeading?: number
  }
} 