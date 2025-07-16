import { ref, readonly, provide, inject, reactive, toRef } from 'vue'
import type { Ref } from 'vue'

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

// Create a reactive store for global state that persists across components
const globalMapStore = reactive({
  mapInstance: null as any,
  isMapReady: false,
  currentLocation: null as Location | null,
  locationError: null as Error | null,
})

export const useGlobalMapProvider = () => {
  // Set the map instance
  const setMapInstance = (instance: any) => {
    globalMapStore.mapInstance = instance
    globalMapStore.isMapReady = true
    console.log('Map instance set in global store')
  }

  // Update current location
  const updateCurrentLocation = (location: Location | null) => {
    globalMapStore.currentLocation = location
    if (location === null) {
      globalMapStore.locationError = new Error('Location not available')
    } else {
      globalMapStore.locationError = null
    }
    console.log('Location updated in global store:', location)
  }

  // Center map on current location
  const centerOnCurrentLocation = async (map: any) => {
    if (!map) return false
    
    try {
      if (globalMapStore.currentLocation && globalMapStore.mapInstance) {
        globalMapStore.mapInstance.setCenter([globalMapStore.currentLocation.lng, globalMapStore.currentLocation.lat])
        globalMapStore.mapInstance.setZoom(16)
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
        lat: position.coords.latitude,
        lng: position.coords.longitude,
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

  // Expose methods and state
  const globalMapState = {
    mapInstance,
    isMapReady,
    currentLocation,
    locationError,
    setMapInstance,
    updateCurrentLocation,
    centerOnCurrentLocation,
    getUserLocation
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
    setMapInstance: (instance: any) => {
      globalMapStore.mapInstance = instance
      globalMapStore.isMapReady = true
    },
    updateCurrentLocation: (location: Location | null) => {
      globalMapStore.currentLocation = location
      if (location === null) {
        globalMapStore.locationError = new Error('Location not available')
      } else {
        globalMapStore.locationError = null
      }
    },
    centerOnCurrentLocation: async (mapRef: any) => {
      try {
        if (globalMapStore.currentLocation && globalMapStore.mapInstance) {
          globalMapStore.mapInstance.setCenter([globalMapStore.currentLocation.lng, globalMapStore.currentLocation.lat])
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
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          heading: position.coords.heading !== null ? position.coords.heading : undefined,
          speed: position.coords.speed !== null ? position.coords.speed : undefined
        }
        
        // Update location in global state
        globalMapStore.currentLocation = location
        globalMapStore.locationError = null
        
        console.log('Location successfully obtained:', location)
        return location
      } catch (error) {
        console.error('Failed to get location:', error)
        // Clear current location in global state
        globalMapStore.currentLocation = null
        globalMapStore.locationError = new Error(error instanceof Error ? error.message : 'Location not available')
        throw error
      }
    }
  }
  
  // Try to get the injected state first
  const globalMap = inject(GLOBAL_MAP_KEY, null)
  
  // If injection is not available, use direct access to the global store
  return globalMap || directAccess
} 