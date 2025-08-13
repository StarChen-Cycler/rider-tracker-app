import { ref, computed } from 'vue'

export const useRideRecorder = () => {
  const isRecording = ref(false)
  const isPaused = ref(false)
  const currentRide = ref(null)
  const locationPoints = ref([])
  const recordingDuration = ref(0)
  const totalDistance = ref(0)
  const currentSpeed = ref(0)
  const maxSpeed = ref(0)
  
  const { saveRideData, loadRideData } = useRideStorage()
  const { calculateDistance } = useRideCalculations()
  const { syncToBackend } = useRideSync()

  const startRide = async (title, vehicleType) => {
    const rideId = generateId()
    currentRide.value = {
      metadata: {
        id: rideId,
        title,
        vehicleType,
        startTime: new Date().toISOString()
      }
    }
    
    isRecording.value = true
    isPaused.value = false
    locationPoints.value = []
    totalDistance.value = 0
    maxSpeed.value = 0
    
    await saveRideData(currentRide.value, locationPoints.value)
    return rideId
  }

  const addLocationPoint = (location) => {
    if (!isRecording.value || isPaused.value) return
    
    const point = {
      id: generateId(),
      rideId: currentRide.value.metadata.id,
      ...location,
      timestamp: new Date().toISOString()
    }
    
    locationPoints.value.push(point)
    
    if (location.speed > maxSpeed.value) {
      maxSpeed.value = location.speed
    }
    
    if (locationPoints.value.length > 1) {
      const lastPoint = locationPoints.value[locationPoints.value.length - 2]
      const distance = calculateDistance(lastPoint, point)
      totalDistance.value += distance
    }
    
    currentSpeed.value = location.speed || 0
  }

  const pauseRide = () => {
    isPaused.value = true
  }

  const resumeRide = () => {
    isPaused.value = false
  }

  const stopRide = async () => {
    if (!currentRide.value) return { success: false, error: 'No active ride' }
    
    const finalStats = {
      totalDistance: totalDistance.value,
      totalDuration: recordingDuration.value,
      totalPoints: locationPoints.value.length,
      averageSpeed: totalDistance.value > 0 ? totalDistance.value / (recordingDuration.value / 3600) : 0,
      maxSpeed: maxSpeed.value
    }
    
    currentRide.value.metadata.endTime = new Date().toISOString()
    currentRide.value.metadata.finalStats = finalStats
    
    await saveRideData(currentRide.value, locationPoints.value)
    await syncToBackend(currentRide.value, locationPoints.value)
    
    isRecording.value = false
    isPaused.value = false
    
    return {
      success: true,
      rideId: currentRide.value.metadata.id,
      finalStats
    }
  }

  const updateRecordingDuration = (duration) => {
    recordingDuration.value = duration
  }

  const cleanup = () => {
    if (!isRecording.value) {
      currentRide.value = null
      locationPoints.value = []
      recordingDuration.value = 0
      totalDistance.value = 0
      currentSpeed.value = 0
      maxSpeed.value = 0
    }
  }

  const initializeRecordingState = () => {
    const state = loadRideData()
    if (state && state.recordingState) {
      currentRide.value = state.recordingState.currentRide
      locationPoints.value = state.recordingState.locationPoints || []
      recordingDuration.value = state.recordingState.recordingDuration || 0
      totalDistance.value = state.recordingState.totalDistance || 0
      maxSpeed.value = state.recordingState.maxSpeed || 0
      isRecording.value = state.recordingState.isRecording || false
      isPaused.value = state.recordingState.isPaused || false
      
      return {
        recovered: true,
        title: currentRide.value?.metadata?.title || 'Recovered ride',
        duration: recordingDuration.value,
        points: locationPoints.value.length
      }
    }
    
    return { recovered: false }
  }

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  return {
    isRecording,
    isPaused,
    currentRide,
    locationPoints,
    recordingDuration,
    totalDistance,
    currentSpeed,
    maxSpeed,
    startRide,
    addLocationPoint,
    pauseRide,
    resumeRide,
    stopRide,
    updateRecordingDuration,
    cleanup,
    initializeRecordingState
  }
}