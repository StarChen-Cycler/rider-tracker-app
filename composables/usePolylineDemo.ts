import { ref, reactive, readonly, onUnmounted } from 'vue'

export interface PolylineConfig {
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
  showDir?: boolean
}

export interface PolylineState {
  polylines: any[]
  activePolyline: any | null
  isDrawing: boolean
  isEditing: boolean
  currentPath: [number, number][]
  totalLength: number
  status: string
}

export const usePolylineDemo = () => {
  const mapInstance = ref<any>(null)
  const polylineEditor = ref<any>(null)
  const mouseTool = ref<any>(null)
  
  const state = reactive<PolylineState>({
    polylines: [],
    activePolyline: null,
    isDrawing: false,
    isEditing: false,
    currentPath: [],
    totalLength: 0,
    status: 'Ready'
  })

  const error = ref<string | null>(null)

  // Initialize the polyline demo with map instance
  const initPolylineDemo = async (map: any): Promise<void> => {
    if (!map) {
      throw new Error('Map instance is required')
    }
    
    mapInstance.value = map
    
    try {
      // Load required plugins
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Plugin loading timeout'))
        }, 10000)
        
        window.AMap.plugin([
          'AMap.PolylineEditor',
          'AMap.MouseTool'
        ], () => {
          clearTimeout(timeout)
          resolve()
        })
      })
      
      // Wait for plugins to be available
      await waitForPlugins(['PolylineEditor', 'MouseTool'])
      
      // Initialize polyline editor
      polylineEditor.value = new window.AMap.PolylineEditor(map)
      
      // Initialize mouse tool for drawing
      mouseTool.value = new window.AMap.MouseTool(map)
      
      // Set up event listeners
      setupEventListeners()
      
      state.status = 'Initialized'
      console.log('Polyline demo initialized successfully')
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      state.status = 'Error'
      throw err
    }
  }

  // Wait for plugins to be available
  const waitForPlugins = (pluginNames: string[], timeout = 5000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const checkPlugins = () => {
        const allAvailable = pluginNames.every(name => 
          window.AMap && window.AMap[name]
        )
        if (allAvailable) {
          resolve()
        } else {
          setTimeout(checkPlugins, 100)
        }
      }
      
      setTimeout(() => {
        reject(new Error(`Plugins ${pluginNames.join(', ')} failed to load within ${timeout}ms`))
      }, timeout)
      
      checkPlugins()
    })
  }

  // Setup event listeners
  const setupEventListeners = () => {
    if (!polylineEditor.value || !mouseTool.value) return

    // Polyline editor events
    polylineEditor.value.on('addnode', (event: any) => {
      console.log('Node added:', event)
      updatePolylineInfo()
    })

    polylineEditor.value.on('adjust', (event: any) => {
      console.log('Path adjusted:', event)
      updatePolylineInfo()
    })

    polylineEditor.value.on('removenode', (event: any) => {
      console.log('Node removed:', event)
      updatePolylineInfo()
    })

    polylineEditor.value.on('end', (event: any) => {
      console.log('Editing ended:', event)
      state.isEditing = false
      state.status = 'Ready'
      
      const editedPolyline = polylineEditor.value.getTarget()
      if (editedPolyline && !state.polylines.includes(editedPolyline)) {
        state.polylines.push(editedPolyline)
        state.activePolyline = editedPolyline
      }
      updatePolylineInfo()
    })

    // Mouse tool events
    mouseTool.value.on('draw', (event: any) => {
      console.log('Polyline drawn:', event)
      state.isDrawing = false
      state.status = 'Ready'
      
      if (event.obj) {
        state.polylines.push(event.obj)
        state.activePolyline = event.obj
        updatePolylineInfo()
      }
    })

    // Map click events for manual drawing
    if (mapInstance.value) {
      mapInstance.value.on('click', (event: any) => {
        if (state.isDrawing) {
          const lnglat = event.lnglat
          state.currentPath.push([lnglat.lng, lnglat.lat])
          updatePolylineInfo()
        }
      })
    }
  }

  // Create polyline with specific configuration
  const createPolyline = (path: [number, number][], config: PolylineConfig = {}): any => {
    if (!mapInstance.value) {
      error.value = 'Map instance not available'
      return null
    }

    const defaultConfig: PolylineConfig = {
      strokeColor: '#3366FF',
      strokeWeight: 5,
      strokeOpacity: 1,
      strokeStyle: 'solid',
      lineJoin: 'round',
      lineCap: 'round',
      zIndex: 100,
      isOutline: true,
      outlineColor: '#ffffff',
      borderWeight: 2,
      showDir: false
    }

    const finalConfig = { ...defaultConfig, ...config }

    try {
      // Convert path to AMap.LngLat objects
      const amapPath = path.map(([lng, lat]) => new window.AMap.LngLat(lng, lat))
      
      const polyline = new window.AMap.Polyline({
        path: amapPath,
        strokeColor: finalConfig.strokeColor,
        strokeWeight: finalConfig.strokeWeight,
        strokeOpacity: finalConfig.strokeOpacity,
        strokeStyle: finalConfig.strokeStyle,
        strokeDasharray: finalConfig.strokeDasharray,
        lineJoin: finalConfig.lineJoin,
        lineCap: finalConfig.lineCap,
        zIndex: finalConfig.zIndex,
        isOutline: finalConfig.isOutline,
        outlineColor: finalConfig.outlineColor,
        borderWeight: finalConfig.borderWeight,
        showDir: finalConfig.showDir
      })

      mapInstance.value.add(polyline)
      state.polylines.push(polyline)
      state.activePolyline = polyline
      updatePolylineInfo()
      
      console.log('Polyline created:', polyline)
      return polyline
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create polyline'
      return null
    }
  }

  // Start drawing polyline with mouse tool
  const startDrawing = (config: PolylineConfig = {}) => {
    if (!mouseTool.value) {
      error.value = 'Mouse tool not available'
      return false
    }

    try {
      const drawingConfig = {
        strokeColor: config.strokeColor || '#FF0000',
        strokeWeight: config.strokeWeight || 5,
        strokeOpacity: config.strokeOpacity || 1,
        strokeStyle: config.strokeStyle || 'solid',
        ...config
      }

      mouseTool.value.polyline(drawingConfig)
      state.isDrawing = true
      state.status = 'Drawing - Click to add points, double-click to finish'
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to start drawing'
      return false
    }
  }

  // Start manual drawing mode
  const startManualDrawing = () => {
    state.isDrawing = true
    state.currentPath = []
    state.status = 'Manual Drawing - Click on map to add points'
  }

  // Finish manual drawing
  const finishManualDrawing = () => {
    if (state.currentPath.length < 2) {
      error.value = 'At least 2 points required for polyline'
      return false
    }

    const polyline = createPolyline(state.currentPath, {
      strokeColor: '#00FF00',
      strokeWeight: 4,
      showDir: true
    })

    if (polyline) {
      state.isDrawing = false
      state.currentPath = []
      state.status = 'Ready'
      return true
    }
    return false
  }

  // Cancel drawing
  const cancelDrawing = () => {
    if (mouseTool.value) {
      mouseTool.value.close(true)
    }
    state.isDrawing = false
    state.currentPath = []
    state.status = 'Ready'
  }

  // Edit polyline
  const editPolyline = (polyline?: any) => {
    if (!polylineEditor.value) {
      error.value = 'Polyline editor not available'
      return false
    }

    const targetPolyline = polyline || state.activePolyline
    if (!targetPolyline) {
      error.value = 'No polyline to edit'
      return false
    }

    try {
      if (state.isEditing) {
        polylineEditor.value.close()
      }

      polylineEditor.value.setTarget(targetPolyline)
      polylineEditor.value.open()
      state.isEditing = true
      state.status = 'Editing - Drag points to modify path'
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to start editing'
      return false
    }
  }

  // Stop editing
  const stopEditing = () => {
    if (polylineEditor.value && state.isEditing) {
      polylineEditor.value.close()
      state.isEditing = false
      state.status = 'Ready'
    }
  }

  // Remove polyline
  const removePolyline = (polyline?: any) => {
    if (!mapInstance.value) return false

    const targetPolyline = polyline || state.activePolyline
    if (!targetPolyline) return false

    try {
      mapInstance.value.remove(targetPolyline)
      const index = state.polylines.indexOf(targetPolyline)
      if (index > -1) {
        state.polylines.splice(index, 1)
      }
      
      if (state.activePolyline === targetPolyline) {
        state.activePolyline = state.polylines[0] || null
      }
      
      updatePolylineInfo()
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to remove polyline'
      return false
    }
  }

  // Clear all polylines
  const clearAll = () => {
    if (!mapInstance.value) return false

    try {
      if (state.polylines.length > 0) {
        mapInstance.value.remove(state.polylines)
        state.polylines = []
        state.activePolyline = null
      }
      
      if (state.isEditing) {
        stopEditing()
      }
      
      if (state.isDrawing) {
        cancelDrawing()
      }
      
      updatePolylineInfo()
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to clear polylines'
      return false
    }
  }

  // Update polyline information
  const updatePolylineInfo = () => {
    if (state.activePolyline) {
      try {
        const path = state.activePolyline.getPath()
        if (path && path.length > 0) {
          state.totalLength = calculatePolylineLength(path)
        }
      } catch (err) {
        console.error('Error calculating polyline length:', err)
      }
    } else {
      state.totalLength = 0
    }
  }

  // Calculate polyline length
  const calculatePolylineLength = (path: any[]): number => {
    if (!path || path.length < 2) return 0
    
    let totalLength = 0
    for (let i = 0; i < path.length - 1; i++) {
      const point1 = path[i]
      const point2 = path[i + 1]
      
      const lng1 = point1.lng || point1.getLng()
      const lat1 = point1.lat || point1.getLat()
      const lng2 = point2.lng || point2.getLng()
      const lat2 = point2.lat || point2.getLat()
      
      totalLength += calculateDistance(lat1, lng1, lat2, lng2)
    }
    
    return totalLength
  }

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // Fit view to show all polylines
  const fitViewToPolylines = () => {
    if (!mapInstance.value || state.polylines.length === 0) return false

    try {
      mapInstance.value.setFitView(state.polylines)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fit view'
      return false
    }
  }

  // Create sample polylines for testing
  const createSamplePolylines = () => {
    const samples: Array<{ path: [number, number][], config: PolylineConfig }> = [
      {
        path: [
          [116.397428, 39.90923],
          [116.407428, 39.91923],
          [116.417428, 39.92923]
        ],
        config: { strokeColor: '#FF0000', strokeWeight: 5 }
      },
      {
        path: [
          [116.387428, 39.89923],
          [116.397428, 39.90923],
          [116.407428, 39.91923]
        ],
        config: { strokeColor: '#00FF00', strokeWeight: 4, strokeStyle: 'dashed' as const }
      },
      {
        path: [
          [116.377428, 39.88923],
          [116.387428, 39.89923],
          [116.397428, 39.90923],
          [116.407428, 39.91923]
        ],
        config: { strokeColor: '#0000FF', strokeWeight: 6, showDir: true }
      }
    ]

    samples.forEach(sample => {
      createPolyline(sample.path, sample.config)
    })

    setTimeout(() => {
      fitViewToPolylines()
    }, 100)
  }

  // Cleanup function
  const cleanup = () => {
    if (state.isEditing) {
      stopEditing()
    }
    
    if (state.isDrawing) {
      cancelDrawing()
    }
    
    if (mouseTool.value) {
      mouseTool.value.close(true)
      mouseTool.value = null
    }
    
    if (polylineEditor.value) {
      polylineEditor.value.close()
      polylineEditor.value = null
    }
    
    clearAll()
    mapInstance.value = null
    error.value = null
  }

  // Cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })

  return {
    // State
    state: readonly(state),
    error: readonly(error),
    
    // Methods
    initPolylineDemo,
    createPolyline,
    startDrawing,
    startManualDrawing,
    finishManualDrawing,
    cancelDrawing,
    editPolyline,
    stopEditing,
    removePolyline,
    clearAll,
    fitViewToPolylines,
    createSamplePolylines,
    cleanup
  }
}

// Global type declarations
declare global {
  interface Window {
    AMap: any
  }
}

export default usePolylineDemo 