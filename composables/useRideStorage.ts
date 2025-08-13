import { useStorage } from '@vueuse/core'

export const useRideStorage = () => {
  const rideStorage = useStorage('rides-data', {
    currentRide: null,
    locationPoints: [],
    recordingState: null,
    uiSettings: {}
  })

  const saveRideData = async (ride, locationPoints) => {
    try {
      rideStorage.value = {
        ...rideStorage.value,
        currentRide: ride,
        locationPoints: locationPoints,
        recordingState: {
          currentRide: ride,
          locationPoints: locationPoints,
          recordingDuration: 0,
          totalDistance: 0,
          maxSpeed: 0,
          isRecording: false,
          isPaused: false
        }
      }
      return true
    } catch (error) {
      console.error('Failed to save ride data:', error)
      return false
    }
  }

  const loadRideData = () => {
    return rideStorage.value
  }

  const saveTempUISettings = (settings) => {
    rideStorage.value = {
      ...rideStorage.value,
      uiSettings: {
        ...rideStorage.value.uiSettings,
        ...settings
      }
    }
  }

  const getTempUISettings = () => {
    return rideStorage.value.uiSettings || {}
  }

  const clearRideData = () => {
    rideStorage.value = {
      currentRide: null,
      locationPoints: [],
      recordingState: null,
      uiSettings: rideStorage.value.uiSettings || {}
    }
  }

  return {
    saveRideData,
    loadRideData,
    saveTempUISettings,
    getTempUISettings,
    clearRideData
  }
}