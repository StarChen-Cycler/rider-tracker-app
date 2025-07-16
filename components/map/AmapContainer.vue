<template>
  <div class="map-container">
    <div
      :id="actualContainerId"
      class="w-full h-full"
      :class="containerClass"
    ></div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="absolute inset-0 bg-gray-100 flex items-center justify-center">
      <LoadingSpinner text="Loading map..." />
    </div>

    <!-- Error State -->
    <div v-if="error" class="absolute inset-0 bg-red-50 flex items-center justify-center p-4">
      <div class="text-center">
        <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-2" />
        <p class="text-red-800 text-sm">{{ error }}</p>
        <button
          @click="retryLoad"
          class="mt-2 btn btn-primary text-xs"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Map Controls -->
    <div
      v-if="showControls && !isLoading && !error"
      class="absolute top-4 right-4 flex flex-col space-y-2"
    >
      <button
        @click="locateUser"
        class="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50"
        :disabled="locating"
      >
        <Icon
          name="heroicons:map-pin"
          class="w-5 h-5"
          :class="{ 'animate-pulse text-primary-600': locating }"
        />
      </button>
      
      <button
        v-if="showCenterButton"
        @click="centerMap"
        class="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50"
      >
        <Icon name="heroicons:arrows-pointing-in" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useAmapInstance, useLocation } from '~/composables/useAmap'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

const emit = defineEmits(['map-ready', 'map-error', 'location-change'])

const props = defineProps({
  containerId: {
    type: String,
    default: 'amap-container'
  },
  containerClass: {
    type: String,
    default: ''
  },
  showControls: {
    type: Boolean,
    default: true
  },
  showCenterButton: {
    type: Boolean,
    default: true
  },
  mapOptions: {
    type: Object,
    default: () => ({})
  },
  autoLocate: {
    type: Boolean,
    default: true
  },
  showDirectionMarker: {
    type: Boolean,
    default: true
  }
})

const { createMap, mapInstance, setCenter, setZoom, fitView, addDirectionMarker, updateDirectionMarker } = useAmapInstance()
const { getCurrentPosition } = useLocation()

const isLoading = ref(true)
const error = ref(null)
const locating = ref(false)
const directionMarker = ref(null)
const currentHeading = ref(0)

// Generate unique container ID client-side to avoid hydration mismatch
const actualContainerId = ref(props.containerId)

const initMap = async () => {
  // Generate unique ID if using default
  if (props.containerId === 'amap-container') {
    actualContainerId.value = `amap-container-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  }
  
  try {
    isLoading.value = true
    error.value = null
    
    await nextTick()
    
    // Ensure DOM element exists
    const containerElement = document.getElementById(actualContainerId.value)
    if (!containerElement) {
      throw new Error(`Map container element with ID '${actualContainerId.value}' not found`)
    }
    
    const mapOptions = {
      zoom: 16,
      mapStyle: 'amap://styles/normal',
      resizeEnable: true,
      rotateEnable: true,
      pitchEnable: true,
      zoomEnable: true,
      dragEnable: true,
      ...props.mapOptions
    }
    
    await createMap(actualContainerId.value, mapOptions)
    
    if (props.autoLocate) {
      await locateUser()
    }
    
    emit('map-ready', mapInstance.value)
    isLoading.value = false
  } catch (err) {
    console.error('Map initialization error:', err)
    error.value = err.message || 'Failed to load map'
    isLoading.value = false
    emit('map-error', err)
  }
}

const locateUser = async () => {
  try {
    locating.value = true
    const position = await getCurrentPosition()
    
    console.log('AmapContainer - Location received:', {
      lat: position.lat,
      lng: position.lng,
      accuracy: position.accuracy
    })
    
    if (mapInstance.value) {
      const center = [position.lng, position.lat]
      setCenter(center)
      setZoom(16)
      
      // Update heading if available
      if (position.heading !== undefined) {
        currentHeading.value = position.heading
      }
      
      // Add or update direction marker if enabled
      if (props.showDirectionMarker) {
        if (!directionMarker.value) {
          directionMarker.value = addDirectionMarker(center, currentHeading.value)
        } else {
          updateDirectionMarker(directionMarker.value, center, currentHeading.value)
        }
      }
      
      emit('location-change', position)
    }
  } catch (err) {
    console.error('Failed to get location:', err)
    error.value = err.message || 'Failed to get location'
  } finally {
    locating.value = false
  }
}

const centerMap = () => {
  if (mapInstance.value) {
    fitView()
  }
}

const retryLoad = () => {
  initMap()
}

onMounted(() => {
  initMap()
})

// Expose methods for parent component
defineExpose({
  mapInstance,
  locateUser,
  centerMap
})
</script>

<style scoped>
.map-container {
  position: relative;
  background-color: #f3f4f6;
}
</style> 