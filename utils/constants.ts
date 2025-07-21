// App configuration constants
export const APP_CONFIG = {
  name: 'Rider Tracker',
  version: '1.0.0',
  description: 'Track your cycling and motorbike adventures',
  author: 'Rider Tracker Team'
}

// Map configuration
export const MAP_CONFIG = {
  defaultZoom: 15,
  maxZoom: 20,
  minZoom: 3,
  // Removed default center coordinates to use device location instead
  trackingAccuracy: 50, // meters
  minTrackingDistance: 5, // meters
  trackingInterval: 3000, // milliseconds
  maxTrackingPoints: 10000
}

// Location tracking settings
export const LOCATION_CONFIG = {
  enableHighAccuracy: true,
  maximumAge: 30000, // 30 seconds
  timeout: 15000, // 15 seconds
  watchInterval: 3000, // 3 seconds
  minimumDistance: 10 // meters
}

// Storage keys
export const STORAGE_KEYS = {
  lastLocation: 'rider_tracker_last_location',
  userPreferences: 'rider_tracker_user_preferences',
  rideSettings: 'rider_tracker_ride_settings',
  offlineRides: 'rider_tracker_offline_rides'
}

// Vehicle types
export const VEHICLE_TYPES = {
  BICYCLE: 'bicycle',
  MOTORBIKE: 'motorbike'
} as const

// Ride statuses
export const RIDE_STATUSES = {
  RECORDING: 'recording',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

// API endpoints (relative to base URL)
export const API_ENDPOINTS = {
  rides: '/api/rides',
  routePoints: '/api/route-points',
  profiles: '/api/profiles',
  auth: '/api/auth'
}

// UI constants
export const UI_CONFIG = {
  mobileBreakpoint: 768,
  tabletBreakpoint: 1024,
  desktopBreakpoint: 1280,
  maxModalWidth: 600,
  toastDuration: 3000,
  loadingDelay: 200
}

// Validation rules
export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 8,
    message: 'Password must be at least 8 characters long'
  },
  rideTitle: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: 'Ride title must be between 3 and 100 characters'
  },
  rideDescription: {
    required: false,
    maxLength: 500,
    message: 'Description must be less than 500 characters'
  }
}

// Default user preferences
export const DEFAULT_PREFERENCES = {
  theme: 'light',
  language: 'en',
  units: 'metric',
  notifications: {
    rideStart: true,
    rideEnd: true,
    lowBattery: true,
    locationError: true
  },
  privacy: {
    shareLocation: false,
    publicProfile: false,
    showInLeaderboard: false
  },
  tracking: {
    autoStart: true, // Enable auto-start for better UX
    pauseOnStop: true,
    highAccuracy: true,
    saveOffline: true
  }
}

// Error messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  location: 'Unable to access location. Please enable location services.',
  permission: 'Permission denied. Please allow location access.',
  timeout: 'Request timed out. Please try again.',
  unknown: 'An unexpected error occurred. Please try again.',
  auth: {
    invalidCredentials: 'Invalid email or password.',
    emailInUse: 'This email is already in use.',
    weakPassword: 'Password is too weak.',
    userNotFound: 'User not found.',
    sessionExpired: 'Session expired. Please log in again.'
  },
  ride: {
    noActiveRide: 'No active ride found.',
    cannotStart: 'Cannot start ride. Please check your location settings.',
    cannotSave: 'Cannot save ride. Please try again.',
    notFound: 'Ride not found.'
  }
}

// Success messages
export const SUCCESS_MESSAGES = {
  rideStarted: 'Ride started successfully!',
  rideSaved: 'Ride saved successfully!',
  rideDeleted: 'Ride deleted successfully!',
  profileUpdated: 'Profile updated successfully!',
  settingsSaved: 'Settings saved successfully!',
  auth: {
    signedIn: 'Successfully signed in!',
    signedUp: 'Account created successfully!',
    signedOut: 'Successfully signed out!',
    passwordReset: 'Password reset email sent!'
  }
}

// Local storage configuration
export const LOCAL_STORAGE_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  keyPrefix: 'rt_', // rider tracker prefix
  compression: false
}

// Performance monitoring
export const PERFORMANCE_CONFIG = {
  enableMetrics: true,
  sampleRate: 0.1, // 10% of users
  maxBreadcrumbs: 20,
  maxEvents: 100
}

// Feature flags
export const FEATURE_FLAGS = {
  offlineMode: true,
  socialFeatures: false,
  premiumFeatures: false,
  analytics: true,
  pushNotifications: true
}

// Location correction deltas to adjust for GPS bias
export const LOCATION_CORRECTION = {
  // Correction values calculated from provided coordinates
  // Actual: 22.91294, 113.843313
  // API: 22.915696, 113.838358
  // Delta = Actual - API
  LAT_DELTA: -0.002756, // 22.91294 - 22.915696
  LNG_DELTA: 0.004955   // 113.843313 - 113.838358
}

export type VehicleType = typeof VEHICLE_TYPES[keyof typeof VEHICLE_TYPES]
export type RideStatus = typeof RIDE_STATUSES[keyof typeof RIDE_STATUSES] 