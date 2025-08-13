import { ref } from 'vue'

export const useTrackRideControls = () => {
  const starting = ref(false)
  const stopping = ref(false)

  const {
    isRecording: isRideRecording,
    isPaused: isRidePaused,
    startRide: startRideRecording,
    pauseRide: pauseRideRecording,
    resumeRide: resumeRideRecording,
    stopRide: stopRideRecording,
    currentRide
  } = useRideRecorder()

  const { startTimer, stopTimer } = useTrackTimer()
  const { selectedVehicle } = useTrackUIState()
  const { clearAllPolylines, startRideTracking, completeRideTracking, pauseRideTracking, resumeRideTracking, cancelRideTracking } = usePolylineManager()
  const { startRecording, stopRecording } = useRouteTracking()

  const startRide = async () => {
    starting.value = true
    console.log('🚴 TRACK DEBUG: Starting ride...')
    
    try {
      clearAllPolylines()
      console.log('🧹 TRACK DEBUG: Cleared existing polylines before new ride')
      
      const rideTitle = `${selectedVehicle.value} ride - ${new Date().toLocaleDateString()}`
      console.log('🚴 TRACK DEBUG: Starting ride recording with title:', rideTitle)
      
      const rideId = await startRideRecording(rideTitle, selectedVehicle.value)
      console.log('🚴 TRACK DEBUG: Ride recording started with ID:', rideId)
      
      startRideTracking(rideId)
      await startRecording()
      startTimer()
      
      console.log('🚴 Started ride recording:', rideTitle)
    } catch (error) {
      console.error('Failed to start ride:', error)
      alert('Failed to start ride. Please check your location permissions.')
    } finally {
      starting.value = false
    }
  }

  const pauseRide = () => {
    pauseRideRecording()
    pauseRideTracking()
    stopTimer()
    console.log('⏸️ Paused ride recording and polyline tracking')
  }

  const resumeRide = () => {
    resumeRideRecording()
    resumeRideTracking()
    startTimer()
    console.log('▶️ Resumed ride recording and polyline tracking')
  }

  const stopRide = async () => {
    stopping.value = true
    try {
      const result = await stopRideRecording()
      completeRideTracking()
      await stopRecording()
      stopTimer()
      
      if (result.success && result.finalStats) {
        const { formatDistance, formatDuration, formatSpeed } = useFormatters()
        const distance = formatDistance(result.finalStats.totalDistance)
        const duration = formatDuration(result.finalStats.totalDuration)
        const points = result.finalStats.totalPoints
        const avgSpeed = formatSpeed(result.finalStats.averageSpeed)
        const maxSpeed = formatSpeed(result.finalStats.maxSpeed)
        
        alert(`🎉 Ride completed!\nDistance: ${distance}\nDuration: ${duration}\nPoints: ${points}\nAvg Speed: ${avgSpeed}\nMax Speed: ${maxSpeed}\nRide ID: ${result.rideId}\n\nData saved locally and to backend!`)
      } else if (result.success) {
        alert(`🎉 Ride completed!\nRide ID: ${result.rideId}\n\nData saved locally and to backend!`)
      } else {
        alert(`⚠️ Ride stopped but save failed: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to stop ride:', error)
      alert('Failed to stop ride: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      stopping.value = false
    }
  }

  return {
    isRecording: isRideRecording,
    isPaused: isRidePaused,
    starting,
    stopping,
    startRide,
    pauseRide,
    resumeRide,
    stopRide
  }
}