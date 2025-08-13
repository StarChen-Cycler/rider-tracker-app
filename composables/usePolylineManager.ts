import { ref } from 'vue'

export const usePolylineManager = () => {
  const activePolyline = ref(null)
  const polylines = ref([])
  
  const { createPolyline, updatePolyline, completePolyline } = usePolylineStyles()

  const startRideTracking = (rideId) => {
    const polyline = createPolyline(rideId, 'recording')
    polylines.value.push(polyline)
    activePolyline.value = polyline
    return polyline
  }

  const addTrackingPoint = (lat, lng) => {
    if (!activePolyline.value) return
    
    activePolyline.value.points.push({ lat, lng })
    updatePolyline(activePolyline.value)
  }

  const pauseRideTracking = () => {
    if (!activePolyline.value) return
    activePolyline.value.status = 'paused'
    updatePolyline(activePolyline.value)
  }

  const resumeRideTracking = () => {
    if (!activePolyline.value) return
    activePolyline.value.status = 'recording'
    updatePolyline(activePolyline.value)
  }

  const completeRideTracking = () => {
    if (!activePolyline.value) return
    completePolyline(activePolyline.value)
    activePolyline.value = null
  }

  const cancelRideTracking = () => {
    if (activePolyline.value) {
      activePolyline.value.status = 'cancelled'
      activePolyline.value = null
    }
  }

  const clearAllPolylines = () => {
    polylines.value = []
    activePolyline.value = null
  }

  const recoverRidePolyline = async ({ id, locationPoints, status }) => {
    if (!locationPoints || locationPoints.length === 0) return null
    
    try {
      const polyline = createPolyline(id, status)
      polyline.points = locationPoints.map(point => ({
        lat: point.lat,
        lng: point.lng
      }))
      
      polylines.value.push(polyline)
      if (status === 'recording' || status === 'paused') {
        activePolyline.value = polyline
      }
      
      return polyline
    } catch (error) {
      console.error('Failed to recover polyline:', error)
      return null
    }
  }

  return {
    activePolyline,
    startRideTracking,
    addTrackingPoint,
    pauseRideTracking,
    resumeRideTracking,
    completeRideTracking,
    cancelRideTracking,
    clearAllPolylines,
    recoverRidePolyline
  }
}