export const useTrackCleanup = () => {
  const { cleanup: cleanupRideRecording } = useRideRecorder()
  const { stopTimer } = useTrackTimer()
  const { activePolyline, cancelRideTracking } = usePolylineManager()
  const { stopRecording } = useRouteTracking()
  const { isLocationTracking, toggleLocationTracking } = useGlobalMap()
  const { isOrientationTracking, stopOrientationTracking } = useGlobalMap()
  const { dismissRecoveredRideInfo } = useTrackRecovery()

  const cleanup = () => {
    console.log('🧹 TRACK DEBUG: Starting comprehensive cleanup...')
    
    stopTimer()
    
    cleanupRideRecording()
    
    if (activePolyline.value) {
      cancelRideTracking()
      console.log('🧹 TRACK DEBUG: Cancelled active polyline tracking')
    }
    
      stopRecording()
    
    if (isOrientationTracking.value) {
      stopOrientationTracking()
    }
    
    if (isLocationTracking.value) {
      toggleLocationTracking()
    }
    
    dismissRecoveredRideInfo()
    
    console.log('🧹 TRACK DEBUG: Cleanup completed')
  }

  return {
    cleanup
  }
}