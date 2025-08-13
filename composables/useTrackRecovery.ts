import { ref } from 'vue'

export const useTrackRecovery = () => {
  const recoveredRideInfo = ref(null)
  const recoveredRideInfoTimer = ref(null)
  
  const { 
    isRecording: isRideRecording,
    isPaused: isRidePaused,
    locationPoints: rideLocationPoints,
    currentRide,
    initializeRecordingState 
  } = useRideRecorder()
  
  const { recoverRidePolyline } = usePolylineManager()
  const { startTimer } = useTrackTimer()

  const setRecoveredRideInfo = (info) => {
    if (recoveredRideInfoTimer.value) {
      clearTimeout(recoveredRideInfoTimer.value)
    }
    
    recoveredRideInfo.value = info
    
    recoveredRideInfoTimer.value = setTimeout(() => {
      recoveredRideInfo.value = null
      recoveredRideInfoTimer.value = null
      console.log('🔄 TRACK DEBUG: Auto-hid recovered ride info after 2 seconds')
    }, 2000)
    
    console.log('🔄 TRACK DEBUG: Set recovered ride info with 2-second auto-hide timer')
  }

  const dismissRecoveredRideInfo = () => {
    if (recoveredRideInfoTimer.value) {
      clearTimeout(recoveredRideInfoTimer.value)
      recoveredRideInfoTimer.value = null
    }
    
    recoveredRideInfo.value = null
    console.log('🔄 TRACK DEBUG: Manually dismissed recovered ride info')
  }

  const initializeTrackRecovery = async () => {
    console.log('🔄 TRACK DEBUG: Initializing component and checking for temp recording state')
    
    const recoveryResult = initializeRecordingState()
    
    if (recoveryResult.recovered) {
      console.log('🔄 TRACK DEBUG: Recording state recovered:', recoveryResult)
      
      if (isRideRecording.value && !isRidePaused.value) {
        console.log('🔄 TRACK DEBUG: Resuming timer for recovered recording')
        startTimer()
      }
      
      if (rideLocationPoints.value.length > 0 && currentRide.value) {
        console.log('🔄 TRACK DEBUG: Recovering polylines from', rideLocationPoints.value.length, 'recovered points')
        
        let polylineStatus
        if (isRideRecording.value && !isRidePaused.value) {
          polylineStatus = 'recording'
        } else if (isRidePaused.value) {
          polylineStatus = 'paused'
        } else {
          polylineStatus = 'completed'
        }
        
        try {
          const recoveredPolyline = await recoverRidePolyline({
            id: currentRide.value.metadata.id,
            locationPoints: rideLocationPoints.value,
            status: polylineStatus
          })
          
          if (recoveredPolyline) {
            console.log('🔄 TRACK DEBUG: Successfully recovered polyline:', {
              polylineId: recoveredPolyline.id,
              rideId: recoveredPolyline.rideId,
              pointCount: recoveredPolyline.points.length
            })
            
            if (recoveredRideInfo.value) {
              recoveredRideInfo.value.polylineRecovered = true
            }
          }
        } catch (error) {
          console.error('❌ TRACK DEBUG: Error recovering polyline:', error)
        }
      }
      
      setRecoveredRideInfo({
        title: recoveryResult.title,
        duration: recoveryResult.duration,
        points: recoveryResult.points
      })
    }
  }

  return {
    recoveredRideInfo,
    setRecoveredRideInfo,
    dismissRecoveredRideInfo,
    initializeTrackRecovery
  }
}