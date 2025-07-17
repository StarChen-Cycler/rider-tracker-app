<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-3">
        <h1 class="text-lg font-semibold text-gray-900">Simple Polyline Demo</h1>
        <NuxtLink to="/" class="text-blue-600 text-sm hover:text-blue-800">
          Back to Home
        </NuxtLink>
      </div>
    </header>

    <!-- Map Container -->
    <div class="relative h-[70vh] bg-gray-200">
      <div id="map-container" class="w-full h-full"></div>
      
      <!-- Control Panel -->
      <div class="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10 w-64">
        <h3 class="text-sm font-semibold mb-3 text-gray-700">Map Controls</h3>
        <div class="space-y-2">
          <button 
            @click="createSamplePolylines" 
            class="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            :disabled="!mapReady"
          >
            Create Sample Polylines
          </button>
          
          <button 
            @click="startDrawing" 
            class="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            :disabled="!mapReady || isDrawing"
          >
            {{ isDrawing ? 'Drawing...' : 'Draw Polyline' }}
          </button>
          
          <button 
            @click="toggleEdit" 
            class="w-full px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
            :disabled="!mapReady || polylines.length === 0"
          >
            {{ isEditing ? 'Stop Edit' : 'Edit Mode' }}
          </button>
          
          <button 
            @click="clearAll" 
            class="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            :disabled="!mapReady"
          >
            Clear All
          </button>
        </div>
      </div>

      <!-- Info Panel -->
      <div class="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10 w-64">
        <h3 class="text-sm font-semibold mb-3 text-gray-700">Information</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Status:</span>
            <span class="font-medium" :class="statusClass">{{ status }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Polylines:</span>
            <span class="font-medium">{{ polylines.length }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Total Length:</span>
            <span class="font-medium">{{ totalLength }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Mode:</span>
            <span class="font-medium">{{ currentMode }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 m-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
        <div class="ml-auto pl-3">
          <button @click="clearError" class="text-red-400 hover:text-red-600">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="bg-white p-6 m-4 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-2">Instructions</h2>
      <div class="text-sm text-gray-600 space-y-1">
        <p>• <strong>Create Sample Polylines:</strong> Adds some demo polylines to the map</p>
        <p>• <strong>Draw Polyline:</strong> Click on the map to draw a new polyline (double-click to finish)</p>
        <p>• <strong>Edit Mode:</strong> Click and drag polyline points to edit them</p>
        <p>• <strong>Clear All:</strong> Removes all polylines from the map</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Meta
useHead({
  title: 'Simple Polyline Demo - Rider Tracker'
})

// Reactive state
const mapReady = ref(false)
const isDrawing = ref(false)
const isEditing = ref(false)
const status = ref('Loading...')
const error = ref(null)
const polylines = ref([])

// AMap instances
let map = null
let mouseTool = null
let polylineEditor = null
let currentEditingPolyline = null

// Config
const config = useRuntimeConfig()

// Computed properties
const statusClass = computed(() => {
  if (error.value) return 'text-red-600'
  if (isDrawing.value) return 'text-blue-600'
  if (isEditing.value) return 'text-orange-600'
  if (mapReady.value) return 'text-green-600'
  return 'text-gray-600'
})

const totalLength = computed(() => {
  if (polylines.value.length === 0) return '0 km'
  
  const total = polylines.value.reduce((sum, polyline) => {
    return sum + calculatePolylineLength(polyline)
  }, 0)
  
  return formatDistance(total)
})

const currentMode = computed(() => {
  if (isDrawing.value) return 'Drawing'
  if (isEditing.value) return 'Editing'
  return 'Normal'
})

// Utility functions
const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  } else {
    return `${(meters / 1000).toFixed(2)} km`
  }
}

const calculatePolylineLength = (polyline) => {
  if (!polyline || !polyline.getPath) return 0
  
  const path = polyline.getPath()
  if (!path || path.length < 2) return 0
  
  let totalDistance = 0
  for (let i = 0; i < path.length - 1; i++) {
    const point1 = path[i]
    const point2 = path[i + 1]
    totalDistance += calculateDistance(
      point1.lat, point1.lng,
      point2.lat, point2.lng
    )
  }
  
  return totalDistance
}

const calculateDistance = (lat1, lng1, lat2, lng2) => {
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

const setError = (message) => {
  error.value = message
  status.value = 'Error'
  console.error('Error:', message)
}

const clearError = () => {
  error.value = null
  if (mapReady.value) {
    status.value = 'Ready'
  }
}

// Map initialization
const initMap = async () => {
  try {
    status.value = 'Loading map...'
    
    // Load AMap script
    await loadAmapScript()
    
    status.value = 'Initializing map...'
    
    // Create map instance
    map = new window.AMap.Map('map-container', {
      zoom: 13,
      center: [116.397428, 39.90923], // Beijing center
      mapStyle: 'amap://styles/normal',
      resizeEnable: true,
      rotateEnable: true,
      pitchEnable: true,
      zoomEnable: true,
      dragEnable: true
    })
    
    // Load required plugins
    await loadPlugins()
    
    // Initialize tools
    mouseTool = new window.AMap.MouseTool(map)
    polylineEditor = new window.AMap.PolylineEditor(map)
    
    // Set up event handlers
    setupEventHandlers()
    
    // Mark map as ready first, so features can be used even if location fails
    mapReady.value = true
    status.value = 'Ready'
    
    // Try to get user location (don't await, so map is usable even if location fails)
    getUserLocation().catch(err => {
      console.warn('Location error in background:', err.message)
      // Map is already marked as ready, so this won't block functionality
    })
    
  } catch (err) {
    console.error('Map initialization error:', err)
    setError(`Failed to initialize map: ${err.message}`)
  }
}

const loadAmapScript = () => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve()
      return
    }
    
    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${config.public.amapKey}`
    script.onload = resolve
    script.onerror = () => reject(new Error('Failed to load AMap script'))
    document.head.appendChild(script)
  })
}

const loadPlugins = () => {
  return new Promise((resolve, reject) => {
    window.AMap.plugin([
      'AMap.MouseTool',
      'AMap.PolylineEditor'
    ], () => {
      resolve()
    })
    
    // Timeout after 10 seconds
    setTimeout(() => reject(new Error('Plugin loading timeout')), 10000)
  })
}

const getUserLocation = async () => {
  try {
    // Set a loading status
    status.value = 'Getting your location...'
    
    const position = await new Promise((resolve, reject) => {
      // Set a longer timeout (20 seconds)
      const timeoutId = setTimeout(() => {
        reject(new Error('Location request timed out'))
      }, 20000)
      
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timeoutId)
          resolve(pos)
        },
        (err) => {
          clearTimeout(timeoutId)
          reject(err)
        },
        {
          enableHighAccuracy: false, // Set to false for faster response
          timeout: 15000,
          maximumAge: 120000 // Accept positions up to 2 minutes old
        }
      )
    })
    
    const userLocation = [position.coords.longitude, position.coords.latitude]
    map.setCenter(userLocation, false, 500) // Fast transition - 500ms duration
    map.setZoom(16, false, 500) // Fast transition - 500ms duration
    
    console.log('Successfully got user location:', userLocation)
    status.value = 'Ready'
    
  } catch (err) {
    console.warn('Could not get user location:', err.message)
    status.value = 'Using default location'
    
    // After a short delay, set back to ready
    setTimeout(() => {
      status.value = 'Ready'
    }, 3000)
  }
}

const setupEventHandlers = () => {
  // Mouse tool events
  mouseTool.on('draw', (e) => {
    if (e.obj.CLASS_NAME === 'AMap.Polyline') {
      polylines.value.push(e.obj)
      isDrawing.value = false
      status.value = 'Ready'
      
      // Style the new polyline
      e.obj.setOptions({
        strokeColor: '#3366FF',
        strokeWeight: 4,
        strokeOpacity: 1,
        strokeStyle: 'solid',
        lineJoin: 'round',
        lineCap: 'round'
      })
    }
  })
  
  // Polyline editor events
  polylineEditor.on('end', () => {
    isEditing.value = false
    status.value = 'Ready'
    currentEditingPolyline = null
  })
}

// Action functions
const createSamplePolylines = () => {
  if (!mapReady.value) return
  
  try {
    status.value = 'Creating samples...'
    
    // Get map center
    const center = map.getCenter()
    const centerLng = center.lng
    const centerLat = center.lat
    
    // Sample polyline data (relative to center)
    const samplePaths = [
      // Polyline 1: Square pattern
      [
        [centerLng - 0.01, centerLat + 0.01],
        [centerLng + 0.01, centerLat + 0.01],
        [centerLng + 0.01, centerLat - 0.01],
        [centerLng - 0.01, centerLat - 0.01],
        [centerLng - 0.01, centerLat + 0.01]
      ],
      // Polyline 2: Diagonal line
      [
        [centerLng - 0.015, centerLat - 0.015],
        [centerLng + 0.015, centerLat + 0.015]
      ],
      // Polyline 3: Curved path
      [
        [centerLng - 0.02, centerLat],
        [centerLng - 0.01, centerLat + 0.005],
        [centerLng, centerLat],
        [centerLng + 0.01, centerLat - 0.005],
        [centerLng + 0.02, centerLat]
      ]
    ]
    
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1']
    
    samplePaths.forEach((path, index) => {
      const polyline = new window.AMap.Polyline({
        path: path,
        strokeColor: colors[index],
        strokeWeight: 4,
        strokeOpacity: 1,
        strokeStyle: 'solid',
        lineJoin: 'round',
        lineCap: 'round'
      })
      
      map.add(polyline)
      polylines.value.push(polyline)
    })
    
    // Fit view to show all polylines
    if (polylines.value.length > 0) {
      map.setFitView(polylines.value, false, [20, 20, 20, 20])
    }
    
    status.value = 'Ready'
    
  } catch (err) {
    setError(`Failed to create samples: ${err.message}`)
  }
}

const startDrawing = () => {
  if (!mapReady.value || isDrawing.value) return
  
  try {
    // Stop editing if active
    if (isEditing.value) {
      toggleEdit()
    }
    
    isDrawing.value = true
    status.value = 'Drawing - Click to add points, double-click to finish'
    
    mouseTool.polyline({
      strokeColor: '#3366FF',
      strokeWeight: 4,
      strokeOpacity: 1
    })
    
  } catch (err) {
    setError(`Failed to start drawing: ${err.message}`)
    isDrawing.value = false
  }
}

const toggleEdit = () => {
  if (!mapReady.value) return
  
  try {
    if (isEditing.value) {
      // Stop editing
      polylineEditor.close()
      isEditing.value = false
      status.value = 'Ready'
      currentEditingPolyline = null
    } else {
      // Start editing the last polyline
      if (polylines.value.length === 0) {
        setError('No polylines to edit')
        return
      }
      
      // Stop drawing if active
      if (isDrawing.value) {
        mouseTool.close()
        isDrawing.value = false
      }
      
      currentEditingPolyline = polylines.value[polylines.value.length - 1]
      polylineEditor.setTarget(currentEditingPolyline)
      polylineEditor.open()
      isEditing.value = true
      status.value = 'Editing - Drag points to modify'
    }
    
  } catch (err) {
    setError(`Failed to toggle edit: ${err.message}`)
  }
}

const clearAll = () => {
  if (!mapReady.value || !map) return
  
  try {
    console.log('Clearing all polylines...')
    
    // Stop any active tools
    if (isDrawing.value) {
      mouseTool.close()
      isDrawing.value = false
    }
    
    if (isEditing.value) {
      polylineEditor.close()
      isEditing.value = false
      currentEditingPolyline = null
    }
    
    // Clear all overlays from the map (more reliable than individual removal)
    map.clearMap()
    console.log('Map cleared')
    
    // Reset our tracking array
    polylines.value = []
    
    status.value = 'All polylines cleared'
    console.log('Polylines array cleared:', polylines.value)
    
    setTimeout(() => {
      if (status.value === 'All polylines cleared') {
        status.value = 'Ready'
      }
    }, 2000)
    
  } catch (err) {
    console.error('Error in clearAll:', err)
    setError(`Failed to clear all: ${err.message}`)
  }
}

// Lifecycle
onMounted(() => {
  // Only run on client side
  if (import.meta.client) {
    initMap()
  }
})

onUnmounted(() => {
  // Cleanup
  if (mouseTool) {
    mouseTool.close()
  }
  if (polylineEditor) {
    polylineEditor.close()
  }
})
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:disabled:hover {
  transform: none;
}

#map-container {
  background: #f5f5f5;
}
</style> 