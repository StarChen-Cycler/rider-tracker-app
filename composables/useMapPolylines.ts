import { ref, reactive, computed, watch, onUnmounted, getCurrentInstance } from 'vue'
import { useGlobalMap } from './useGlobalMap'

// Types for polyline management
export interface PolylineStyle {
  strokeColor: string
  strokeWeight: number
  strokeOpacity: number
  strokeStyle: 'solid' | 'dashed'
  zIndex: number
}

export interface TrackPolyline {
  id: string
  polyline: any // AMap.Polyline instance
  rideId?: string
  style: PolylineStyle
  points: Array<[number, number]> // [lng, lat] format for AMap
  status: 'recording' | 'paused' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

// Predefined styles for different states
export const POLYLINE_STYLES = {
  recording: {
    strokeColor: '#ef4444', // Red for active recording
    strokeWeight: 4,
    strokeOpacity: 0.8,
    strokeStyle: 'solid' as const,
    zIndex: 100
  },
  paused: {
    strokeColor: '#f59e0b', // Orange for paused
    strokeWeight: 4,
    strokeOpacity: 0.6,
    strokeStyle: 'dashed' as const,
    zIndex: 95
  },
  completed: {
    strokeColor: '#10b981', // Green for completed
    strokeWeight: 3,
    strokeOpacity: 0.7,
    strokeStyle: 'solid' as const,
    zIndex: 90
  },
  preview: {
    strokeColor: '#6366f1', // Purple for preview/historical
    strokeWeight: 3,
    strokeOpacity: 0.5,
    strokeStyle: 'solid' as const,
    zIndex: 85
  }
} as const

// Create reactive store for polylines
const polylineStore = reactive({
  activePolyline: null as TrackPolyline | null,
  polylines: [] as TrackPolyline[],
  isEnabled: true,
  showHistoricalTracks: false,
  maxHistoricalTracks: 5
})

export const useMapPolylines = () => {
  const globalMap = useGlobalMap()
  
  // Reactive state
  const activePolyline = computed(() => polylineStore.activePolyline)
  const polylines = computed(() => polylineStore.polylines)
  const isEnabled = computed(() => polylineStore.isEnabled)
  
  // Generate unique ID
  const generateId = (): string => {
    return `polyline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Create a new polyline on the map
  const createPolyline = (
    points: Array<[number, number]>,
    style: PolylineStyle,
    rideId?: string
  ): TrackPolyline | null => {
    if (!globalMap.mapInstance.value || !window.AMap) {
      console.warn('⚠️ Map instance or AMap not available for polyline creation')
      return null
    }

    try {
      // Create AMap.LngLat array from points
      const amapPoints = points.map(([lng, lat]) => new window.AMap.LngLat(lng, lat))
      
      // Create AMap polyline
      const polyline = new window.AMap.Polyline({
        path: amapPoints,
        strokeColor: style.strokeColor,
        strokeWeight: style.strokeWeight,
        strokeOpacity: style.strokeOpacity,
        strokeStyle: style.strokeStyle,
        lineJoin: 'round',
        lineCap: 'round',
        zIndex: style.zIndex,
        bubble: true
      })

      // Add to map
      globalMap.mapInstance.value.add(polyline)

      // Create track polyline object
      const trackPolyline: TrackPolyline = {
        id: generateId(),
        polyline,
        rideId,
        style,
        points: [...points],
        status: 'recording',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      console.log('✅ Created polyline:', {
        id: trackPolyline.id,
        rideId: rideId,
        pointCount: points.length,
        style: style.strokeColor
      })

      return trackPolyline
    } catch (error) {
      console.error('❌ Failed to create polyline:', error)
      return null
    }
  }

  // Update polyline with new points
  const updatePolyline = (
    trackPolyline: TrackPolyline, 
    newPoints: Array<[number, number]>
  ): boolean => {
    if (!trackPolyline.polyline || !window.AMap) {
      return false
    }

    try {
      // Update points array
      trackPolyline.points = [...newPoints]
      trackPolyline.updatedAt = new Date().toISOString()
      
      // Create AMap.LngLat array
      const amapPoints = newPoints.map(([lng, lat]) => new window.AMap.LngLat(lng, lat))
      
      // Update polyline path
      trackPolyline.polyline.setPath(amapPoints)
      
      console.log('📍 Updated polyline:', {
        id: trackPolyline.id,
        totalPoints: newPoints.length,
        lastPoint: newPoints[newPoints.length - 1]
      })
      
      return true
    } catch (error) {
      console.error('❌ Failed to update polyline:', error)
      return false
    }
  }

  // Add single point to existing polyline
  const addPointToPolyline = (
    trackPolyline: TrackPolyline,
    point: [number, number]
  ): boolean => {
    const newPoints = [...trackPolyline.points, point]
    return updatePolyline(trackPolyline, newPoints)
  }

  // Update polyline style
  const updatePolylineStyle = (
    trackPolyline: TrackPolyline,
    newStyle: Partial<PolylineStyle>
  ): boolean => {
    if (!trackPolyline.polyline) {
      return false
    }

    try {
      // Merge styles
      const style = { ...trackPolyline.style, ...newStyle }
      trackPolyline.style = style
      trackPolyline.updatedAt = new Date().toISOString()

      // Update polyline properties
      if (newStyle.strokeColor) {
        trackPolyline.polyline.setOptions({ strokeColor: newStyle.strokeColor })
      }
      if (newStyle.strokeWeight !== undefined) {
        trackPolyline.polyline.setOptions({ strokeWeight: newStyle.strokeWeight })
      }
      if (newStyle.strokeOpacity !== undefined) {
        trackPolyline.polyline.setOptions({ strokeOpacity: newStyle.strokeOpacity })
      }
      if (newStyle.strokeStyle) {
        trackPolyline.polyline.setOptions({ strokeStyle: newStyle.strokeStyle })
      }

      console.log('🎨 Updated polyline style:', {
        id: trackPolyline.id,
        style: style
      })

      return true
    } catch (error) {
      console.error('❌ Failed to update polyline style:', error)
      return false
    }
  }

  // Start tracking for a new ride
  const startRideTracking = (rideId: string): TrackPolyline | null => {
    if (!polylineStore.isEnabled) {
      console.log('📍 Polyline tracking disabled, skipping...')
      return null
    }

    try {
      // Clear any existing active polyline for the same ride to prevent duplicates
      if (polylineStore.activePolyline && polylineStore.activePolyline.rideId === rideId) {
        console.log('📍 Clearing existing active polyline for ride:', rideId)
        cancelRideTracking()
      }

      // Create new polyline for this ride
      const trackPolyline = createPolyline([], POLYLINE_STYLES.recording, rideId)
      
      if (trackPolyline) {
        // Set as active polyline
        polylineStore.activePolyline = trackPolyline
        
        // Add to polylines array
        polylineStore.polylines.push(trackPolyline)
        
        console.log('🎬 Started ride tracking polyline:', {
          rideId,
          polylineId: trackPolyline.id
        })
      }
      
      return trackPolyline
    } catch (error) {
      console.error('❌ Failed to start ride tracking:', error)
      return null
    }
  }

  // Add location point to active tracking
  const addTrackingPoint = (lat: number, lng: number): boolean => {
    if (!polylineStore.activePolyline) {
      console.warn('⚠️ No active polyline for tracking')
      return false
    }

    const point: [number, number] = [lng, lat] // AMap uses [lng, lat] format
    return addPointToPolyline(polylineStore.activePolyline, point)
  }

  // Pause ride tracking (change style)
  const pauseRideTracking = (): boolean => {
    if (!polylineStore.activePolyline) {
      return false
    }

    polylineStore.activePolyline.status = 'paused'
    return updatePolylineStyle(polylineStore.activePolyline, POLYLINE_STYLES.paused)
  }

  // Resume ride tracking (change style back)
  const resumeRideTracking = (): boolean => {
    if (!polylineStore.activePolyline) {
      return false
    }

    polylineStore.activePolyline.status = 'recording'
    return updatePolylineStyle(polylineStore.activePolyline, POLYLINE_STYLES.recording)
  }

  // Complete ride tracking
  const completeRideTracking = (): boolean => {
    if (!polylineStore.activePolyline) {
      return false
    }

    try {
      // Update status and style
      polylineStore.activePolyline.status = 'completed'
      updatePolylineStyle(polylineStore.activePolyline, POLYLINE_STYLES.completed)
      
      console.log('🏁 Completed ride tracking:', {
        polylineId: polylineStore.activePolyline.id,
        totalPoints: polylineStore.activePolyline.points.length
      })
      
      // Clear active polyline
      polylineStore.activePolyline = null
      
      return true
    } catch (error) {
      console.error('❌ Failed to complete ride tracking:', error)
      return false
    }
  }

  // Cancel ride tracking (remove polyline)
  const cancelRideTracking = (): boolean => {
    if (!polylineStore.activePolyline) {
      return false
    }

    try {
      // Remove from map
      if (polylineStore.activePolyline.polyline && globalMap.mapInstance.value) {
        globalMap.mapInstance.value.remove(polylineStore.activePolyline.polyline)
      }
      
      // Remove from polylines array
      const index = polylineStore.polylines.findIndex(p => p.id === polylineStore.activePolyline!.id)
      if (index > -1) {
        polylineStore.polylines.splice(index, 1)
      }
      
      console.log('❌ Cancelled ride tracking:', polylineStore.activePolyline.id)
      
      // Clear active polyline
      polylineStore.activePolyline = null
      
      return true
    } catch (error) {
      console.error('❌ Failed to cancel ride tracking:', error)
      return false
    }
  }

  // Draw historical ride from data
  const drawHistoricalRide = (
    rideData: {
      id: string,
      locationPoints: Array<{ latitude: number, longitude: number, timestamp: string }>
    },
    style: PolylineStyle = POLYLINE_STYLES.preview
  ): TrackPolyline | null => {
    if (!polylineStore.isEnabled || !rideData.locationPoints.length) {
      return null
    }

    try {
      // Convert location points to polyline points
      const points: Array<[number, number]> = rideData.locationPoints.map(point => [
        point.longitude,
        point.latitude
      ])

      // Create polyline
      const trackPolyline = createPolyline(points, style, rideData.id)
      
      if (trackPolyline) {
        trackPolyline.status = 'completed'
        polylineStore.polylines.push(trackPolyline)
        
        console.log('📜 Drew historical ride:', {
          rideId: rideData.id,
          points: points.length
        })
      }
      
      return trackPolyline
    } catch (error) {
      console.error('❌ Failed to draw historical ride:', error)
      return null
    }
  }

  // Clear all polylines
  const clearAllPolylines = (): boolean => {
    try {
      if (globalMap.mapInstance.value) {
        // Remove all polylines from map
        polylineStore.polylines.forEach(trackPolyline => {
          if (trackPolyline.polyline) {
            globalMap.mapInstance.value.remove(trackPolyline.polyline)
          }
        })
      }
      
      // Clear arrays
      polylineStore.polylines = []
      polylineStore.activePolyline = null
      
      console.log('🧹 Cleared all polylines')
      return true
    } catch (error) {
      console.error('❌ Failed to clear polylines:', error)
      return false
    }
  }

  // Remove specific polyline
  const removePolyline = (polylineId: string): boolean => {
    try {
      const index = polylineStore.polylines.findIndex(p => p.id === polylineId)
      if (index === -1) {
        return false
      }

      const trackPolyline = polylineStore.polylines[index]
      
      // Remove from map
      if (trackPolyline.polyline && globalMap.mapInstance.value) {
        globalMap.mapInstance.value.remove(trackPolyline.polyline)
      }
      
      // Remove from array
      polylineStore.polylines.splice(index, 1)
      
      // Clear active if this was active
      if (polylineStore.activePolyline?.id === polylineId) {
        polylineStore.activePolyline = null
      }
      
      console.log('🗑️ Removed polyline:', polylineId)
      return true
    } catch (error) {
      console.error('❌ Failed to remove polyline:', error)
      return false
    }
  }

  // Toggle polyline tracking
  const toggleTracking = (enabled: boolean): void => {
    polylineStore.isEnabled = enabled
    console.log(`📍 Polyline tracking ${enabled ? 'enabled' : 'disabled'}`)
    
    if (!enabled) {
      clearAllPolylines()
    }
  }

  // Get polyline statistics
  const getPolylineStats = () => {
    const totalPolylines = polylineStore.polylines.length
    const activePolyline = polylineStore.activePolyline
    const completedPolylines = polylineStore.polylines.filter(p => p.status === 'completed').length
    
    return {
      totalPolylines,
      completedPolylines,
      hasActivePolyline: !!activePolyline,
      activePolylinePoints: activePolyline?.points.length || 0,
      isTrackingEnabled: polylineStore.isEnabled
    }
  }

  // Fit map to show all polylines
  const fitMapToPolylines = (): boolean => {
    if (!globalMap.mapInstance.value || !polylineStore.polylines.length) {
      return false
    }

    try {
      const allPoints: Array<[number, number]> = []
      
      // Collect all points from all polylines
      polylineStore.polylines.forEach(trackPolyline => {
        allPoints.push(...trackPolyline.points)
      })

      if (allPoints.length === 0) {
        return false
      }

      // Create bounds
      const lngs = allPoints.map(point => point[0])
      const lats = allPoints.map(point => point[1])
      
      const bounds = new window.AMap.Bounds(
        new window.AMap.LngLat(Math.min(...lngs), Math.min(...lats)),
        new window.AMap.LngLat(Math.max(...lngs), Math.max(...lats))
      )

      // Fit map to bounds
      globalMap.mapInstance.value.setBounds(bounds, false, [50, 50, 50, 50])
      
      console.log('🗺️ Fitted map to polylines:', allPoints.length, 'points')
      return true
    } catch (error) {
      console.error('❌ Failed to fit map to polylines:', error)
      return false
    }
  }

  // Recover polyline from stored ride data (optimized for page refresh recovery)
  const recoverRidePolyline = (
    rideData: {
      id: string,
      locationPoints: Array<{ latitude: number, longitude: number, timestamp: string }>,
      status: 'recording' | 'paused' | 'completed'
    }
  ): Promise<TrackPolyline | null> => {
    return new Promise((resolve) => {
      // Wait for map to be ready
      const waitForMap = () => {
        if (!globalMap.mapInstance.value || !window.AMap) {
          setTimeout(waitForMap, 100)
          return
        }

                 try {
           if (!polylineStore.isEnabled || !rideData.locationPoints.length) {
             resolve(null)
             return
           }

           // Check if polyline for this ride already exists to prevent duplicates
           const existingPolyline = polylineStore.polylines.find(p => p.rideId === rideData.id)
           if (existingPolyline) {
             console.log('🔄 Polyline for ride already exists, skipping recovery:', rideData.id)
             resolve(existingPolyline)
             return
           }

           // Convert location points to polyline format
           const points: Array<[number, number]> = rideData.locationPoints
             .filter(point => point.latitude != null && point.longitude != null)
             .map(point => [
               point.longitude,
               point.latitude
             ])

           if (points.length === 0) {
             console.warn('⚠️ No valid location points found for polyline recovery')
             resolve(null)
             return
           }

          // Choose style based on ride status
          let style: PolylineStyle
          switch (rideData.status) {
            case 'recording':
              style = POLYLINE_STYLES.recording
              break
            case 'paused':
              style = POLYLINE_STYLES.paused
              break
            case 'completed':
              style = POLYLINE_STYLES.completed
              break
            default:
              style = POLYLINE_STYLES.recording
          }

          // Create polyline with all points at once (efficient bulk drawing)
          const trackPolyline = createPolyline(points, style, rideData.id)
          
                     if (trackPolyline) {
             trackPolyline.status = rideData.status
             
             // Set as active polyline if recording or paused
             if (rideData.status === 'recording' || rideData.status === 'paused') {
               // Clear any existing active polyline first
               if (polylineStore.activePolyline && polylineStore.activePolyline.id !== trackPolyline.id) {
                 console.log('🔄 Replacing existing active polyline with recovered one')
               }
               polylineStore.activePolyline = trackPolyline
             }
             
             // Add to polylines array
             polylineStore.polylines.push(trackPolyline)
             
                          console.log('🔄 Recovered ride polyline:', {
               rideId: rideData.id,
               points: points.length,
               status: rideData.status,
               isActive: rideData.status === 'recording' || rideData.status === 'paused',
               polylineId: trackPolyline.id
             })

             // Validate and fix polyline state if needed
             validateRecoveredPolyline(trackPolyline, rideData.status)
           }
           
           resolve(trackPolyline)
        } catch (error) {
          console.error('❌ Failed to recover ride polyline:', error)
          resolve(null)
        }
      }

      waitForMap()
    })
  }

  // Check if map is ready for polyline operations
  const isMapReady = (): boolean => {
    return !!(globalMap.mapInstance.value && window.AMap)
  }

  // Wait for map to be ready (utility function)
  const waitForMapReady = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const checkMap = () => {
        if (isMapReady()) {
          resolve(true)
        } else {
          setTimeout(checkMap, 100)
        }
      }
      checkMap()
    })
  }

  // Validate recovered polyline state and fix if needed
  const validateRecoveredPolyline = (trackPolyline: TrackPolyline, expectedStatus: 'recording' | 'paused' | 'completed'): boolean => {
    if (!trackPolyline) return false

    try {
      // Check if status matches expected
      if (trackPolyline.status !== expectedStatus) {
        console.log('🔧 Fixing polyline status:', trackPolyline.status, '->', expectedStatus)
        trackPolyline.status = expectedStatus
        
        // Update style to match status
        const style = expectedStatus === 'recording' ? POLYLINE_STYLES.recording :
                     expectedStatus === 'paused' ? POLYLINE_STYLES.paused :
                     POLYLINE_STYLES.completed
        
        updatePolylineStyle(trackPolyline, style)
      }

      // Validate active polyline state
      const shouldBeActive = expectedStatus === 'recording' || expectedStatus === 'paused'
      const isCurrentlyActive = polylineStore.activePolyline?.id === trackPolyline.id

      if (shouldBeActive && !isCurrentlyActive) {
        console.log('🔧 Setting polyline as active:', trackPolyline.id)
        polylineStore.activePolyline = trackPolyline
      } else if (!shouldBeActive && isCurrentlyActive) {
        console.log('🔧 Removing polyline from active status:', trackPolyline.id)
        polylineStore.activePolyline = null
      }

      return true
    } catch (error) {
      console.error('❌ Failed to validate recovered polyline:', error)
      return false
    }
  }

  // Cleanup on component unmount
  const cleanup = () => {
    if (getCurrentInstance()) {
      clearAllPolylines()
      console.log('🧹 Cleaned up polylines on component unmount')
    }
  }

  // Auto-cleanup
  if (typeof window !== 'undefined' && getCurrentInstance()) {
    onUnmounted(cleanup)
  }

  return {
    // State
    activePolyline: readonly(activePolyline),
    polylines: readonly(polylines),
    isEnabled: readonly(isEnabled),
    
    // Core methods
    startRideTracking,
    addTrackingPoint,
    pauseRideTracking,
    resumeRideTracking,
    completeRideTracking,
    cancelRideTracking,
    
    // Advanced methods
    drawHistoricalRide,
    recoverRidePolyline,
    clearAllPolylines,
    removePolyline,
    toggleTracking,
    fitMapToPolylines,
    
    // Utility methods
    getPolylineStats,
    isMapReady,
    waitForMapReady,
    validateRecoveredPolyline,
    cleanup,
    
    // Styles
    POLYLINE_STYLES,
    
    // Direct access to store for advanced usage
    polylineStore
  }
} 