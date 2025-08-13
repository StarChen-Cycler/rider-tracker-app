export const useRideSync = () => {
  const syncToBackend = async (ride, locationPoints) => {
    try {
      const response = await $fetch('/api/v1/rides', {
        method: 'POST',
        body: {
          ride: ride.metadata,
          points: locationPoints
        }
      })
      
      return { success: true, response }
    } catch (error) {
      console.error('Failed to sync ride to backend:', error)
      return { success: false, error: error.message }
    }
  }

  const syncFromBackend = async (rideId) => {
    try {
      const response = await $fetch(`/api/v1/rides/${rideId}`)
      return { success: true, data: response }
    } catch (error) {
      console.error('Failed to fetch ride from backend:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    syncToBackend,
    syncFromBackend
  }
}