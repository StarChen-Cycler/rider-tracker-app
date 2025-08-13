export const useFormatters = () => {
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
    formatDuration,
    formatDistance,
    formatSpeed
  }
}