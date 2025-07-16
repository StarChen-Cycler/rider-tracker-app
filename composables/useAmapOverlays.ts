import { ref, reactive, readonly, onUnmounted } from 'vue'

export interface CircleOptions {
  strokeColor?: string
  strokeWeight?: number
  strokeOpacity?: number
  fillColor?: string
  fillOpacity?: number
  radius?: number
  zIndex?: number
}

export interface PolylineOptions {
  strokeColor?: string
  strokeWeight?: number
  strokeOpacity?: number
  strokeStyle?: 'solid' | 'dashed'
  strokeDasharray?: number[]
  lineJoin?: 'round' | 'bevel' | 'miter'
  lineCap?: 'round' | 'butt' | 'square'
  zIndex?: number
  isOutline?: boolean
  outlineColor?: string
  borderWeight?: number
}

export interface OverlayError {
  code: string
  message: string
  details?: any
}

export const useAmapOverlays = () => {
  const mapInstance = ref<any>(null)
  const circles = ref<any[]>([])
  const polylines = ref<any[]>([])
  const markers = ref<any[]>([])
  const polylineEditor = ref<any>(null)
  const isEditing = ref(false)
  const currentPolyline = ref<any>(null)
  const isInitialized = ref(false)
  const error = ref<OverlayError | null>(null)
  const eventHandlers = ref<{ [key: string]: Function[] }>({})

  // Utility function to normalize coordinates
  const normalizeCoordinates = (coords: any): [number, number] => {
    if (Array.isArray(coords)) {
      return [coords[0], coords[1]]
    }
    if (coords && typeof coords === 'object' && 'lng' in coords && 'lat' in coords) {
      return [coords.lng, coords.lat]
    }
    if (coords && typeof coords === 'object' && 'getLng' in coords && 'getLat' in coords) {
      return [coords.getLng(), coords.getLat()]
    }
    throw new Error('Invalid coordinate format')
  }

  // Utility function to create AMap.LngLat from coordinates
  const createLngLat = (coords: [number, number]): any => {
    return new window.AMap.LngLat(coords[0], coords[1])
  }

  // Utility function to convert path to AMap.LngLat array
  const normalizePath = (path: any[]): any[] => {
    return path.map(coord => {
      const normalized = normalizeCoordinates(coord)
      return createLngLat(normalized)
    })
  }

  // Event handler management
  const addEventHandler = (event: string, handler: Function) => {
    if (!eventHandlers.value[event]) {
      eventHandlers.value[event] = []
    }
    eventHandlers.value[event].push(handler)
  }

  const removeEventHandlers = (event?: string) => {
    if (event) {
      eventHandlers.value[event] = []
    } else {
      eventHandlers.value = {}
    }
  }

  // Enhanced error handling
  const setError = (code: string, message: string, details?: any) => {
    error.value = { code, message, details }
    console.error(`[OverlayError] ${code}: ${message}`, details)
  }

  const clearError = () => {
    error.value = null
  }

  // Wait for plugin to be fully loaded
  const waitForPlugin = (pluginName: string, timeout: number = 5000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const checkPlugin = () => {
        if (window.AMap && window.AMap[pluginName.split('.')[1]]) {
          resolve()
        } else {
          setTimeout(checkPlugin, 100)
        }
      }
      
      setTimeout(() => {
        reject(new Error(`Plugin ${pluginName} failed to load within ${timeout}ms`))
      }, timeout)
      
      checkPlugin()
    })
  }

  // Initialize the composable with map instance
  const initOverlays = async (map: any): Promise<void> => {
    if (!map) {
      setError('INIT_ERROR', 'Map instance is required')
      throw new Error('Map instance is required')
    }
    
    if (isInitialized.value) {
      console.warn('Overlays already initialized, cleaning up first')
      await cleanup()
    }
    
    mapInstance.value = map
    clearError()
    
    try {
      // Load the PolylineEditor plugin with proper error handling
      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Plugin loading timeout'))
        }, 10000)
        
        window.AMap.plugin(['AMap.PolylineEditor'], () => {
          clearTimeout(timeoutId)
          resolve()
        })
      })
      
      // Wait for plugin to be fully available
      await waitForPlugin('AMap.PolylineEditor')
      
      // Create polyline editor instance
            polylineEditor.value = new window.AMap.PolylineEditor(map)
            
      // Set up event handlers with proper cleanup tracking
      const addNodeHandler = (event: any) => {
              console.log('Node added:', event)
      }
            
      const adjustHandler = (event: any) => {
              console.log('Path adjusted:', event)
      }
            
      const removeNodeHandler = (event: any) => {
              console.log('Node removed:', event)
      }
            
      const endHandler = (event: any) => {
              console.log('Editing ended:', event)
              isEditing.value = false
              
        try {
              // Get the newly created/edited polyline
              const editedPolyline = polylineEditor.value.getTarget()
          if (editedPolyline) {
            // Apply consistent styling
            const defaultOptions = {
                  strokeColor: '#3366FF',
                  strokeWeight: 6,
                  strokeOpacity: 1,
                  strokeStyle: 'solid',
                  lineJoin: 'round',
                  lineCap: 'round',
                  zIndex: 100,
                  isOutline: true,
                  outlineColor: '#ffffff',
                  borderWeight: 3
            }
            
            editedPolyline.setOptions(defaultOptions)
                
            // Add to collection if not already present
            if (!polylines.value.includes(editedPolyline)) {
                polylines.value.push(editedPolyline)
                currentPolyline.value = editedPolyline
                console.log('New polyline added to collection:', editedPolyline)
              }
          }
        } catch (err) {
          setError('EDIT_END_ERROR', 'Failed to process edited polyline', err)
        }
      }
      
      // Register event handlers
      polylineEditor.value.on('addnode', addNodeHandler)
      polylineEditor.value.on('adjust', adjustHandler)
      polylineEditor.value.on('removenode', removeNodeHandler)
      polylineEditor.value.on('end', endHandler)
      
      // Track handlers for cleanup
      addEventHandler('addnode', addNodeHandler)
      addEventHandler('adjust', adjustHandler)
      addEventHandler('removenode', removeNodeHandler)
      addEventHandler('end', endHandler)
      
      isInitialized.value = true
      console.log('PolylineEditor initialized successfully')
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError('PLUGIN_LOAD_ERROR', `Failed to initialize PolylineEditor: ${errorMessage}`, err)
      throw err
    }
  }

  // Create a circle overlay with enhanced error handling
  const createCircle = (center: [number, number], radiusInKm: number, options: CircleOptions = {}): any => {
    if (!mapInstance.value) {
      setError('MAP_ERROR', 'Map instance not available')
      return null
    }

    try {
      const normalizedCenter = normalizeCoordinates(center)

    const defaultOptions: CircleOptions = {
      strokeColor: '#FF33FF',
      strokeWeight: 3,
      strokeOpacity: 0.8,
      fillColor: '#1791fc',
      fillOpacity: 0.35,
      radius: radiusInKm * 1000, // Convert km to meters
      zIndex: 100
    }

    const mergedOptions = { ...defaultOptions, ...options }

      // Create AMap Circle with proper coordinate handling
      const circle = new window.AMap.Circle({
        center: createLngLat(normalizedCenter),
        radius: mergedOptions.radius,
        strokeColor: mergedOptions.strokeColor,
        strokeOpacity: mergedOptions.strokeOpacity,
        strokeWeight: mergedOptions.strokeWeight,
        fillColor: mergedOptions.fillColor,
        fillOpacity: mergedOptions.fillOpacity,
        zIndex: mergedOptions.zIndex,
        map: mapInstance.value
      })

      // Add to map and track
      mapInstance.value.add(circle)
      circles.value.push(circle)
      clearError()

      console.log('Circle created successfully:', circle)
      console.log('Circle center:', normalizedCenter, 'radius:', radiusInKm, 'km')
      
      return circle
    } catch (err) {
      setError('CIRCLE_CREATE_ERROR', 'Failed to create circle', err)
      return null
    }
  }

  // Create a polyline with enhanced error handling
  const createPolyline = (path: [number, number][], options: PolylineOptions = {}): any => {
    if (!mapInstance.value) {
      setError('MAP_ERROR', 'Map instance not available')
      return null
    }

    try {
      const normalizedPath = normalizePath(path)

    const defaultOptions: PolylineOptions = {
      strokeColor: '#3366FF',
      strokeWeight: 6,
      strokeOpacity: 1,
      strokeStyle: 'solid',
      lineJoin: 'round',
      lineCap: 'round',
      zIndex: 100,
      isOutline: true,
      outlineColor: '#ffffff',
      borderWeight: 3
    }

    const mergedOptions = { ...defaultOptions, ...options }

      // Create AMap Polyline with normalized path
      const polyline = new window.AMap.Polyline({
        path: normalizedPath,
        strokeColor: mergedOptions.strokeColor,
        strokeOpacity: mergedOptions.strokeOpacity,
        strokeWeight: mergedOptions.strokeWeight,
        strokeStyle: mergedOptions.strokeStyle,
        strokeDasharray: mergedOptions.strokeDasharray,
        lineJoin: mergedOptions.lineJoin,
        lineCap: mergedOptions.lineCap,
        zIndex: mergedOptions.zIndex,
        isOutline: mergedOptions.isOutline,
        outlineColor: mergedOptions.outlineColor,
        borderWeight: mergedOptions.borderWeight,
        map: mapInstance.value
      })

      // Add to map and track
      mapInstance.value.add(polyline)
      polylines.value.push(polyline)
      currentPolyline.value = polyline
      clearError()

      console.log('Polyline created successfully:', polyline)
      console.log('Polyline path:', path)
      
      return polyline
    } catch (err) {
      setError('POLYLINE_CREATE_ERROR', 'Failed to create polyline', err)
      return null
    }
  }

  // Create a marker with enhanced error handling
  const createMarker = (position: [number, number], options: any = {}): any => {
    if (!mapInstance.value) {
      setError('MAP_ERROR', 'Map instance not available')
      return null
    }

    try {
      const normalizedPosition = normalizeCoordinates(position)
      
      const marker = new window.AMap.Marker({
        position: createLngLat(normalizedPosition),
        anchor: 'bottom-center',
        zIndex: 200,
        map: mapInstance.value,
        ...options
      })

      mapInstance.value.add(marker)
      markers.value.push(marker)
      clearError()

      console.log('Marker created successfully:', marker)
      return marker
    } catch (err) {
      setError('MARKER_CREATE_ERROR', 'Failed to create marker', err)
      return null
    }
  }

  // Edit existing polyline with enhanced error handling
  const editPolyline = (polyline: any): boolean => {
    if (!isInitialized.value) {
      setError('INIT_ERROR', 'Overlays not initialized')
      return false
    }

    if (!polylineEditor.value) {
      setError('EDITOR_ERROR', 'PolylineEditor not available')
      return false
    }

    if (!polyline) {
      setError('POLYLINE_ERROR', 'Polyline not provided')
      return false
    }

    try {
      // Close any existing editing session
      if (isEditing.value) {
        polylineEditor.value.close()
        isEditing.value = false
      }

      polylineEditor.value.setTarget(polyline)
      polylineEditor.value.open()
      isEditing.value = true
      clearError()
      
      console.log('Started editing polyline:', polyline)
      return true
    } catch (err) {
      setError('EDIT_START_ERROR', 'Failed to start editing polyline', err)
      return false
    }
  }

  // Create new polyline interactively with enhanced error handling
  const createNewPolyline = (): boolean => {
    if (!isInitialized.value) {
      setError('INIT_ERROR', 'Overlays not initialized')
      return false
    }

    if (!polylineEditor.value) {
      setError('EDITOR_ERROR', 'PolylineEditor not available')
      return false
    }

    try {
      // Close any existing editing session
      if (isEditing.value) {
        polylineEditor.value.close()
        isEditing.value = false
      }

      // Start with no target to create a new polyline
      polylineEditor.value.setTarget()
      polylineEditor.value.open()
      isEditing.value = true
      clearError()
      
      console.log('Started creating new polyline')
      return true
    } catch (err) {
      setError('NEW_POLYLINE_ERROR', 'Failed to start creating new polyline', err)
      return false
    }
  }

  // Close editor with enhanced error handling
  const closeEditor = (): boolean => {
    if (!polylineEditor.value) {
      return true // Already closed
    }

    try {
      if (isEditing.value) {
        polylineEditor.value.close()
        isEditing.value = false
        console.log('Editor closed')
      }
      clearError()
        return true
    } catch (err) {
      setError('CLOSE_EDITOR_ERROR', 'Failed to close editor', err)
        return false
      }
  }

  // Remove a specific circle with enhanced error handling
  const removeCircle = (circle: any): boolean => {
    if (!mapInstance.value || !circle) {
      setError('REMOVE_ERROR', 'Map instance or circle not available')
      return false
    }

    try {
      mapInstance.value.remove(circle)
      const index = circles.value.indexOf(circle)
      if (index > -1) {
        circles.value.splice(index, 1)
      }
      clearError()
      
      console.log('Circle removed successfully')
      return true
    } catch (err) {
      setError('REMOVE_CIRCLE_ERROR', 'Failed to remove circle', err)
      return false
    }
  }

  // Remove a specific polyline with enhanced error handling
  const removePolyline = (polyline: any): boolean => {
    if (!mapInstance.value || !polyline) {
      setError('REMOVE_ERROR', 'Map instance or polyline not available')
      return false
    }

    try {
      mapInstance.value.remove(polyline)
      const index = polylines.value.indexOf(polyline)
      if (index > -1) {
        polylines.value.splice(index, 1)
      }
      
      if (currentPolyline.value === polyline) {
        currentPolyline.value = null
      }
      clearError()
      
      console.log('Polyline removed successfully')
      return true
    } catch (err) {
      setError('REMOVE_POLYLINE_ERROR', 'Failed to remove polyline', err)
      return false
    }
  }

  // Remove a specific marker with enhanced error handling
  const removeMarker = (marker: any): boolean => {
    if (!mapInstance.value || !marker) {
      setError('REMOVE_ERROR', 'Map instance or marker not available')
      return false
    }

    try {
      mapInstance.value.remove(marker)
      const index = markers.value.indexOf(marker)
      if (index > -1) {
        markers.value.splice(index, 1)
      }
      clearError()
      
      console.log('Marker removed successfully')
      return true
    } catch (err) {
      setError('REMOVE_MARKER_ERROR', 'Failed to remove marker', err)
      return false
    }
  }

  // Clear all overlays with enhanced error handling
  const clearAllOverlays = (): boolean => {
    if (!mapInstance.value) {
      setError('MAP_ERROR', 'Map instance not available')
      return false
    }

    try {
      // Close editor first
      closeEditor()

      // Remove all overlays from map
      const allOverlays = [...circles.value, ...polylines.value, ...markers.value]
      if (allOverlays.length > 0) {
        mapInstance.value.remove(allOverlays)
      }

      // Clear arrays
      circles.value = []
      polylines.value = []
      markers.value = []
      currentPolyline.value = null
      clearError()
      
      console.log('All overlays cleared')
      return true
    } catch (err) {
      setError('CLEAR_ERROR', 'Failed to clear overlays', err)
      return false
    }
  }

  // Fit view to show all overlays with enhanced error handling
  const fitViewToOverlays = (): boolean => {
    if (!mapInstance.value) {
      setError('MAP_ERROR', 'Map instance not available')
      return false
    }

    try {
      const allOverlays = [...circles.value, ...polylines.value, ...markers.value]
      if (allOverlays.length > 0) {
        mapInstance.value.setFitView(allOverlays)
        console.log('View fitted to overlays')
        clearError()
        return true
      } else {
        console.log('No overlays to fit view to')
        return false
      }
    } catch (err) {
      setError('FIT_VIEW_ERROR', 'Failed to fit view to overlays', err)
      return false
    }
  }

  // Cleanup function
  const cleanup = async (): Promise<void> => {
    try {
      // Close editor
      closeEditor()
      
      // Clear all overlays
      clearAllOverlays()
      
      // Remove event handlers
      if (polylineEditor.value) {
        Object.keys(eventHandlers.value).forEach(event => {
          eventHandlers.value[event].forEach(handler => {
            polylineEditor.value.off(event, handler)
          })
        })
      }
      
      // Reset all state
      removeEventHandlers()
      polylineEditor.value = null
      mapInstance.value = null
      isInitialized.value = false
      clearError()
      
      console.log('Overlays cleaned up')
    } catch (err) {
      setError('CLEANUP_ERROR', 'Failed to cleanup overlays', err)
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })

  return {
    // State
    circles: readonly(circles),
    polylines: readonly(polylines),
    markers: readonly(markers),
    currentPolyline: readonly(currentPolyline),
    isEditing: readonly(isEditing),
    isInitialized: readonly(isInitialized),
    error: readonly(error),
    
    // Methods
    initOverlays,
    createCircle,
    createPolyline,
    createMarker,
    editPolyline,
    createNewPolyline,
    closeEditor,
    removeCircle,
    removePolyline,
    removeMarker,
    clearAllOverlays,
    fitViewToOverlays,
    cleanup,
    clearError
  }
} 