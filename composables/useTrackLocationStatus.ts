import { computed } from 'vue'

export const useTrackLocationStatus = () => {
  const { currentLocation, locationError } = useGlobalMap()

  const locationState = computed(() => {
    if (currentLocation.value) {
      return {
        textColor: 'text-green-600',
        message: `${currentLocation.value.lat.toFixed(6)}, ${currentLocation.value.lng.toFixed(6)}`
      }
    } 
    
    if (locationError.value) {
      return {
        textColor: 'text-red-600',
        message: 'Location error: Please enable location services'
      }
    }
    
    return {
      textColor: 'text-yellow-600',
      message: 'Getting location...'
    }
  })

  return {
    locationState
  }
}