export const useRideCalculations = () => {
  const calculateDistance = (point1, point2) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = point1.lat * Math.PI / 180
    const φ2 = point2.lat * Math.PI / 180
    const Δφ = (point2.lat - point1.lat) * Math.PI / 180
    const Δλ = (point2.lng - point1.lng) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c // Distance in meters
  }

  const calculateAverageSpeed = (totalDistance, totalDuration) => {
    if (totalDuration === 0) return 0
    return (totalDistance / 1000) / (totalDuration / 3600) // km/h
  }

  const calculateElevationGain = (points) => {
    let elevationGain = 0
    for (let i = 1; i < points.length; i++) {
      const elevationDiff = points[i].elevation - points[i-1].elevation
      if (elevationDiff > 0) {
        elevationGain += elevationDiff
      }
    }
    return elevationGain
  }

  const calculateCalories = (distance, duration, vehicleType) => {
    const MET_VALUES = {
      bicycle: 8.0,
      motorbike: 3.0
    }

    const met = MET_VALUES[vehicleType] || 8.0
    const weight = 70 // Assume average weight in kg
    const hours = duration / 3600
    
    return Math.round(met * weight * hours)
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`
    }
    return `${(meters / 1000).toFixed(1)}km`
  }

  const formatSpeed = (metersPerSecond) => {
    if (!metersPerSecond) return '0 km/h'
    const kmh = (metersPerSecond * 3.6).toFixed(1)
    return `${kmh} km/h`
  }

  return {
    calculateDistance,
    calculateAverageSpeed,
    calculateElevationGain,
    calculateCalories,
    formatDuration,
    formatDistance,
    formatSpeed
  }
}