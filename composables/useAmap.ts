import { ref, reactive, onMounted, onUnmounted, watch, readonly } from 'vue'
import { LOCATION_CORRECTION } from '~/utils/constants'

// Amap composable for map integration
export const useAmap = () => {
  const config = useRuntimeConfig()
  const isLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadAmapScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Amap can only be loaded in browser environment'))
        return
      }

      if (window.AMap) {
        isLoaded.value = true
        resolve()
        return
      }

      if (isLoading.value) {
        // If already loading, wait for it to complete
        const checkLoaded = () => {
          if (isLoaded.value) {
            resolve()
          } else if (error.value) {
            reject(new Error(error.value))
          } else {
            setTimeout(checkLoaded, 100)
          }
        }
        checkLoaded()
        return
      }

      isLoading.value = true
      
      // Updated script URL with proper plugin loading for route tracking
      const script = document.createElement('script')
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${config.public.amapKey}`
      script.async = true
      
      script.onload = () => {
        // Load required plugins after main script loads
        window.AMap.plugin([
          'AMap.Geolocation',
          'AMap.Geocoder', 
          'AMap.Polyline',
          'AMap.PolylineEditor',
          'AMap.Marker',
          'AMap.CircleMarker',
          'AMap.InfoWindow',
          'AMap.MoveAnimation' // Add MoveAnimation plugin for smooth marker movement
        ], () => {
          isLoaded.value = true
          isLoading.value = false
          resolve()
        })
      }
      
      script.onerror = () => {
        isLoading.value = false
        error.value = 'Failed to load Amap script'
        reject(new Error('Failed to load Amap script'))
      }
      
      document.head.appendChild(script)
    })
  }

  return {
    isLoaded,
    isLoading,
    error,
    loadAmapScript
  }
}

// GPS and location tracking composable
export const useLocation = () => {
  const isTracking = ref(false)
  const currentLocation = ref<{
    lat: number
    lng: number
    accuracy: number
    timestamp: number
    heading?: number | undefined
    speed?: number | undefined
  } | null>(null)
  const error = ref<string | null>(null)
  const watchId = ref<number | null>(null)

  const startTracking = (options: {
    enableHighAccuracy?: boolean
    maximumAge?: number
    timeout?: number
    interval?: number
  } = {}) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      error.value = 'Geolocation is not supported by this browser'
      return false
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      maximumAge: 0, // Don't use cached position
      timeout: 30000, // Longer timeout for better accuracy
      interval: 1000
    }

    const trackingOptions = { ...defaultOptions, ...options }

    const successCallback = (position: GeolocationPosition) => {
      console.log('Raw GPS data:', {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        heading: position.coords.heading,
        speed: position.coords.speed
      })
      
      currentLocation.value = {
        lat: position.coords.latitude + LOCATION_CORRECTION.LAT_DELTA,
        lng: position.coords.longitude + LOCATION_CORRECTION.LNG_DELTA,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        heading: position.coords.heading !== null ? position.coords.heading : undefined,
        speed: position.coords.speed !== null ? position.coords.speed : undefined
      }
      error.value = null
    }

    const errorCallback = (err: GeolocationPositionError) => {
      error.value = `Location error: ${err.message} (code: ${err.code})`
      console.error('Location error:', err)
    }

    watchId.value = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      {
        enableHighAccuracy: trackingOptions.enableHighAccuracy,
        maximumAge: trackingOptions.maximumAge,
        timeout: trackingOptions.timeout
      }
    )

    isTracking.value = true
    return true
  }

  const stopTracking = () => {
    if (watchId.value !== null) {
      navigator.geolocation.clearWatch(watchId.value)
      watchId.value = null
    }
    isTracking.value = false
  }

  const getCurrentPosition = async (): Promise<{
    lat: number
    lng: number
    accuracy: number
    timestamp: number
    heading?: number | undefined
    speed?: number | undefined
  }> => {
    return new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('getCurrentPosition raw data:', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            heading: position.coords.heading,
            speed: position.coords.speed
          })
          
          resolve({
            lat: position.coords.latitude + LOCATION_CORRECTION.LAT_DELTA,
            lng: position.coords.longitude + LOCATION_CORRECTION.LNG_DELTA,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            heading: position.coords.heading !== null ? position.coords.heading : undefined,
            speed: position.coords.speed !== null ? position.coords.speed : undefined
          })
        },
        (error) => {
          console.error('getCurrentPosition error:', error)
          reject(new Error(`Location error: ${error.message} (code: ${error.code})`))
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0, // Don't use cached position
          timeout: 30000 // Longer timeout for better accuracy
        }
      )
    })
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopTracking()
  })

  return {
    isTracking,
    currentLocation: readonly(currentLocation),
    error: readonly(error),
    startTracking,
    stopTracking,
    getCurrentPosition
  }
}

// Map instance management with route visualization
export const useAmapInstance = () => {
  const { isLoaded, loadAmapScript } = useAmap()
  const mapInstance = ref<any>(null)
  const markers = ref<any[]>([])
  const polylines = ref<any[]>([])
  const currentRoutePolyline = ref<any>(null)

  const createMap = async (container: string | HTMLElement, options: any = {}) => {
    if (!isLoaded.value) {
      await loadAmapScript()
    }

    const defaultOptions = {
      zoom: 16,
      // Don't set default center coordinates, let the map use device location
      mapStyle: 'amap://styles/normal',
      resizeEnable: true,
      rotateEnable: true,
      pitchEnable: true,
      zoomEnable: true,
      dragEnable: true,
      doubleClickZoom: true,
      keyboardEnable: true,
      isHotspot: false,
      defaultCursor: 'pointer'
    }

    const mapOptions = { ...defaultOptions, ...options }
    mapInstance.value = new window.AMap.Map(container, mapOptions)

    return mapInstance.value
  }

  const addMarker = (position: [number, number], options: any = {}) => {
    if (!mapInstance.value) return null

    const defaultOptions = {
      position,
      title: 'Marker',
      animation: 'AMAP_ANIMATION_BOUNCE'
    }

    const marker = new window.AMap.Marker({
      ...defaultOptions,
      ...options
    })

    markers.value.push(marker)
    mapInstance.value.add(marker)
    return marker
  }

  // Add a direction arrow marker
  const addDirectionMarker = (position: [number, number], angle: number = 0, options: any = {}) => {
    if (!mapInstance.value) return null

    // Create a custom arrow marker using SVG
    const arrowSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
        <path d="M16 6 L24 16 L16 26 L8 16 Z" fill="#ffffff" transform="rotate(${angle}, 16, 16)" />
      </svg>
    `

    const defaultOptions = {
      position,
      title: 'Current Location',
      anchor: 'center',
      zIndex: 300,
      icon: new window.AMap.Icon({
        size: new window.AMap.Size(32, 32),
        image: 'data:image/svg+xml;base64,' + btoa(arrowSvg),
        imageSize: new window.AMap.Size(32, 32)
      })
    }

    const marker = new window.AMap.Marker({
      ...defaultOptions,
      ...options
    })

    markers.value.push(marker)
    mapInstance.value.add(marker)
    return marker
  }

  // Function to update direction marker
  const updateDirectionMarker = (marker: any, position: [number, number], angle: number) => {
    if (!marker || !mapInstance.value) return

    // Update position
    marker.setPosition(position)
    
    // Update icon with new angle
    const arrowSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
        <path d="M16 6 L24 16 L16 26 L8 16 Z" fill="#ffffff" transform="rotate(${angle}, 16, 16)" />
      </svg>
    `

    marker.setIcon(new window.AMap.Icon({
      size: new window.AMap.Size(32, 32),
      image: 'data:image/svg+xml;base64,' + btoa(arrowSvg),
      imageSize: new window.AMap.Size(32, 32)
    }))
  }

  const addPolyline = (path: [number, number][], options: any = {}) => {
    if (!mapInstance.value) return null

    const defaultOptions = {
      path,
      strokeColor: '#3b82f6',
      strokeWeight: 4,
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      lineJoin: 'round',
      lineCap: 'round'
    }

    const polyline = new window.AMap.Polyline({
      ...defaultOptions,
      ...options
    })

    polylines.value.push(polyline)
    mapInstance.value.add(polyline)
    return polyline
  }

  // Add real-time route polyline for tracking
  const createRoutePolyline = (options: any = {}) => {
    if (!mapInstance.value) return null

    const defaultOptions = {
      path: [],
      strokeColor: '#ef4444', // Red color for active tracking
      strokeWeight: 5,
      strokeOpacity: 0.9,
      strokeStyle: 'solid',
      lineJoin: 'round',
      lineCap: 'round',
      zIndex: 100
    }

    currentRoutePolyline.value = new window.AMap.Polyline({
      ...defaultOptions,
      ...options
    })

    mapInstance.value.add(currentRoutePolyline.value)
    return currentRoutePolyline.value
  }

  // Update route polyline with new point
  const updateRoutePolyline = (newPoint: [number, number]) => {
    if (!currentRoutePolyline.value) return

    const currentPath = currentRoutePolyline.value.getPath() || []
    currentPath.push(new window.AMap.LngLat(newPoint[0], newPoint[1]))
    currentRoutePolyline.value.setPath(currentPath)
  }

  // Clear current route polyline
  const clearRoutePolyline = () => {
    if (currentRoutePolyline.value && mapInstance.value) {
      mapInstance.value.remove(currentRoutePolyline.value)
      currentRoutePolyline.value = null
    }
  }

  const clearMarkers = () => {
    if (mapInstance.value && markers.value.length > 0) {
      mapInstance.value.remove(markers.value)
      markers.value = []
    }
  }

  const clearPolylines = () => {
    if (mapInstance.value && polylines.value.length > 0) {
      mapInstance.value.remove(polylines.value)
      polylines.value = []
    }
  }

  const clearAll = () => {
    clearMarkers()
    clearPolylines()
    clearRoutePolyline()
  }

  const fitView = () => {
    if (mapInstance.value) {
      mapInstance.value.setFitView()
    }
  }

  const setCenter = (center: [number, number], immediately: boolean = false, duration?: number) => {
    if (mapInstance.value) {
      mapInstance.value.setCenter(center, immediately, duration)
    }
  }

  const setZoom = (zoom: number, immediately: boolean = false, duration?: number) => {
    if (mapInstance.value) {
      mapInstance.value.setZoom(zoom, immediately, duration)
    }
  }

  return {
    mapInstance: readonly(mapInstance),
    markers: readonly(markers),
    polylines: readonly(polylines),
    currentRoutePolyline: readonly(currentRoutePolyline),
    createMap,
    addMarker,
    addDirectionMarker,
    updateDirectionMarker,
    addPolyline,
    createRoutePolyline,
    updateRoutePolyline,
    clearRoutePolyline,
    clearMarkers,
    clearPolylines,
    clearAll,
    fitView,
    setCenter,
    setZoom
  }
}

// Enhanced route tracking with real-time visualization
export const useRouteTracking = () => {
  const { startTracking, stopTracking, currentLocation } = useLocation()
  const { 
    mapInstance, 
    createRoutePolyline, 
    updateRoutePolyline, 
    clearRoutePolyline, 
    addMarker,
    addDirectionMarker,
    updateDirectionMarker
  } = useAmapInstance()
  
  const routePoints = ref<Array<{ lat: number; lng: number; timestamp: number; heading?: number }>>([])
  const isRecording = ref(false)
  const isPaused = ref(false)
  const startTime = ref<number | null>(null)
  const pausedTime = ref(0)
  const totalDistance = ref(0)
  const directionMarker = ref<any>(null)
  const lastHeading = ref<number>(0)
  const lastPosition = ref<[number, number]>([0, 0])

  // Calculate heading based on two points if GPS heading is not available
  const calculateHeading = (from: [number, number], to: [number, number]): number => {
    const [lng1, lat1] = from
    const [lng2, lat2] = to
    
    // Convert to radians
    const lat1Rad = (lat1 * Math.PI) / 180
    const lat2Rad = (lat2 * Math.PI) / 180
    const lngDiffRad = ((lng2 - lng1) * Math.PI) / 180
    
    const y = Math.sin(lngDiffRad) * Math.cos(lat2Rad)
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lngDiffRad)
    
    let heading = Math.atan2(y, x) * (180 / Math.PI)
    heading = (heading + 360) % 360 // Normalize to 0-360
    
    return heading
  }

  // Start recording with real-time visualization
  const startRecording = () => {
    if (isRecording.value) return

    routePoints.value = []
    isRecording.value = true
    isPaused.value = false
    startTime.value = Date.now()
    pausedTime.value = 0
    totalDistance.value = 0

    // Create route polyline for real-time tracking
    createRoutePolyline({
      strokeColor: '#ef4444',
      strokeWeight: 5,
      strokeOpacity: 0.9
    })

    // Start GPS tracking
    startTracking({
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 10000
    })

    // Watch for location changes and update route
    watch(currentLocation, (newLocation) => {
      if (newLocation && isRecording.value && !isPaused.value) {
        addRoutePoint(newLocation)
      }
    }, { deep: true })
    
    return true
  }

  const addRoutePoint = (location: { 
    lat: number; 
    lng: number; 
    timestamp: number; 
    heading?: number;
    speed?: number;
  }) => {
    const point = {
      lat: location.lat,
      lng: location.lng,
      timestamp: location.timestamp,
      heading: location.heading
    }

    // Calculate heading if not provided by GPS
    let currentHeading = location.heading
    const currentPosition: [number, number] = [location.lng, location.lat]
    
    if (routePoints.value.length > 0 && !currentHeading) {
      // If no heading from GPS, calculate from previous point
      currentHeading = calculateHeading(lastPosition.value, currentPosition)
    }
    
    // Update last position and heading
    lastPosition.value = currentPosition
    if (currentHeading !== undefined) {
      lastHeading.value = currentHeading
    }
    
    routePoints.value.push(point)

    // Update total distance
    if (routePoints.value.length > 1) {
      const lastPoint = routePoints.value[routePoints.value.length - 2]
      const distance = calculateDistance(
        lastPoint.lat,
        lastPoint.lng,
        point.lat,
        point.lng
      )
      totalDistance.value += distance
    }

    // Update route polyline on map
    updateRoutePolyline([location.lng, location.lat])

    // Update direction marker
    updateLocationMarker([location.lng, location.lat], currentHeading)
  }

  const updateLocationMarker = (position: [number, number], heading?: number) => {
    if (!mapInstance.value) return

    // Use provided heading or last known heading
    const angle = heading !== undefined ? heading : lastHeading.value
    
    // Create or update direction marker
    if (!directionMarker.value) {
      directionMarker.value = addDirectionMarker(position, angle)
    } else {
      updateDirectionMarker(directionMarker.value, position, angle)
    }
  }

  const pauseRecording = () => {
    if (!isRecording.value || isPaused.value) return
    isPaused.value = true
    stopTracking()
  }

  const resumeRecording = () => {
    if (!isRecording.value || !isPaused.value) return
    isPaused.value = false
    startTracking()
    return true
  }

  const stopRecording = () => {
    if (!isRecording.value) return

    isRecording.value = false
    isPaused.value = false
    stopTracking()

    // Add start and end markers
    if (routePoints.value.length > 0) {
      const startPoint = routePoints.value[0]
      const endPoint = routePoints.value[routePoints.value.length - 1]

      // Add start marker
      addMarker([startPoint.lng, startPoint.lat], {
        icon: new window.AMap.Icon({
          size: new window.AMap.Size(30, 30),
          image: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#10b981">
              <circle cx="12" cy="12" r="8" stroke="#ffffff" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="bold">S</text>
            </svg>
          `)
        }),
        title: 'Start'
      })

      // Add end marker
      addMarker([endPoint.lng, endPoint.lat], {
        icon: new window.AMap.Icon({
          size: new window.AMap.Size(30, 30),
          image: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#ef4444">
              <circle cx="12" cy="12" r="8" stroke="#ffffff" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="bold">E</text>
            </svg>
          `)
        }),
        title: 'End'
      })
    }

    // Remove direction marker
    if (directionMarker.value && mapInstance.value) {
      mapInstance.value.remove(directionMarker.value)
      directionMarker.value = null
    }
    
    return true
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  }

  const getDuration = (): number => {
    if (!startTime.value) return 0
    if (isPaused.value) return pausedTime.value
    return Date.now() - startTime.value - pausedTime.value
  }

  const getAverageSpeed = (): number => {
    const duration = getDuration()
    if (duration === 0 || totalDistance.value === 0) return 0
    return (totalDistance.value / (duration / 1000)) * 3.6 // km/h
  }

  return {
    routePoints: readonly(routePoints),
    isRecording: readonly(isRecording),
    isPaused: readonly(isPaused),
    totalDistance: readonly(totalDistance),
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    getDuration,
    getAverageSpeed
  }
}

// Type declarations
declare global {
  interface Window {
    AMap: any
    amapInitCallback: () => void
  }
} 