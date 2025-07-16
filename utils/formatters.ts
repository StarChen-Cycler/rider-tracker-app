// Time formatting utilities
export const formatDuration = (milliseconds: number): string => {
  if (milliseconds < 0) return '0:00'
  
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  const remainingMinutes = minutes % 60
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  } else {
    return `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
}

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

// Distance formatting utilities
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  } else {
    const kilometers = meters / 1000
    return `${kilometers.toFixed(1)}km`
  }
}

export const formatSpeed = (kmh: number): string => {
  return `${kmh.toFixed(1)} km/h`
}

export const formatAltitude = (meters: number): string => {
  return `${Math.round(meters)}m`
}

// Coordinate formatting utilities
export const formatCoordinate = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}

export const formatLatitude = (lat: number): string => {
  const direction = lat >= 0 ? 'N' : 'S'
  return `${Math.abs(lat).toFixed(6)}°${direction}`
}

export const formatLongitude = (lng: number): string => {
  const direction = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lng).toFixed(6)}°${direction}`
}

// Vehicle type formatting
export const formatVehicleType = (type: 'bicycle' | 'motorbike'): string => {
  const types = {
    bicycle: 'Bicycle',
    motorbike: 'Motorbike'
  }
  return types[type] || type
}

export const getVehicleIcon = (type: 'bicycle' | 'motorbike'): string => {
  const icons = {
    bicycle: 'heroicons:truck',
    motorbike: 'heroicons:truck' // Replace with actual motorbike icon when available
  }
  return icons[type] || 'heroicons:truck'
}

// Status formatting
export const formatRideStatus = (status: string): string => {
  const statuses: Record<string, string> = {
    recording: 'Recording',
    paused: 'Paused',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }
  return statuses[status] || status
}

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    recording: 'text-red-600',
    paused: 'text-yellow-600',
    completed: 'text-green-600',
    cancelled: 'text-gray-600'
  }
  return colors[status] || 'text-gray-600'
}

// File size formatting
export const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 B'
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

// Number formatting
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num)
}

// Validation helpers
export const isValidCoordinate = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// URL helpers
export const createMapUrl = (lat: number, lng: number, zoom = 15): string => {
  return `https://uri.amap.com/marker?position=${lng},${lat}&zoom=${zoom}`
}

export const createShareUrl = (rideId: string): string => {
  return `${window.location.origin}/ride/${rideId}`
} 