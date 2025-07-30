import { ref, reactive, computed, getCurrentInstance } from 'vue'
import { useGlobalMap } from './useGlobalMap'

// Types for ride recording
export interface LocationPoint {
  id: string
  latitude: number
  longitude: number
  altitude?: number
  accuracy: number
  speed?: number
  heading?: number
  timestamp: string
}

export interface RideMetadata {
  id: string
  title: string
  vehicleType: 'bicycle' | 'motorbike'
  startTime: string
  endTime?: string
  totalDuration: number // in seconds
  totalDistance: number // in meters
  averageSpeed: number // in km/h
  maxSpeed: number // in km/h
  pauseEvents: PauseEvent[]
  status: 'recording' | 'paused' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface PauseEvent {
  id: string
  pausedAt: string
  resumedAt?: string
  duration?: number // in seconds
}

export interface RideRecord {
  metadata: RideMetadata
  locationPoints: LocationPoint[]
}

export interface StoredRideRecord extends RideRecord {
  savedAt: string
  source: 'local' | 'api'
}

// Mock API service that simulates a real HTTP backend
class MockRideAPI {
  private baseUrl = 'https://api.ridetracker.mock' // Mock API endpoint
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  async saveRide(rideRecord: RideRecord): Promise<{ success: boolean; id: string; error?: string }> {
    // Simulate realistic API delay
    await this.delay(Math.random() * 800 + 200) // 200-1000ms
    
    try {
      console.log('🚀 Mock API: POST', `${this.baseUrl}/rides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: rideRecord.metadata.id,
          points: rideRecord.locationPoints.length,
          distance: `${(rideRecord.metadata.totalDistance / 1000).toFixed(2)} km`,
          duration: `${Math.floor(rideRecord.metadata.totalDuration / 60)}:${(rideRecord.metadata.totalDuration % 60).toString().padStart(2, '0')}`
        }
      })
      
      // Simulate network conditions
      const networkCondition = Math.random()
      if (networkCondition < 0.02) { // 2% failure rate
        throw new Error('Network timeout - please try again')
      } else if (networkCondition < 0.05) { // 3% server error rate
        throw new Error('Server error 500 - backend temporarily unavailable')
      } else if (networkCondition < 0.08) { // 3% auth error rate
        throw new Error('Authentication failed - please login again')
      }
      
      // Store in mock backend database (localStorage simulating database)
      const backendRides = JSON.parse(localStorage.getItem('mock_backend_rides') || '[]')
      const storedRecord: StoredRideRecord = {
        ...rideRecord,
        savedAt: new Date().toISOString(),
        source: 'api'
      }
      backendRides.push(storedRecord)
      localStorage.setItem('mock_backend_rides', JSON.stringify(backendRides))
      
      // Simulate successful API response
      const response = {
        success: true,
        id: rideRecord.metadata.id,
        message: 'Ride saved successfully',
        savedAt: new Date().toISOString(),
        stats: {
          totalPoints: rideRecord.locationPoints.length,
          distance: rideRecord.metadata.totalDistance,
          duration: rideRecord.metadata.totalDuration
        }
      }
      
      console.log('✅ Mock API: Response 201 Created', response)
      return { success: true, id: rideRecord.metadata.id }
    } catch (error) {
      console.error('❌ Mock API: Request failed', {
        url: `${this.baseUrl}/rides`,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return { 
        success: false, 
        id: rideRecord.metadata.id, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  async getRides(limit = 10): Promise<{ success: boolean; data?: RideRecord[]; error?: string }> {
    await this.delay(300)
    
    try {
      const backendRides = JSON.parse(localStorage.getItem('mock_backend_rides') || '[]')
      const sortedRides = backendRides
        .sort((a: any, b: any) => new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime())
        .slice(0, limit)
      
      return { success: true, data: sortedRides }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch rides' 
      }
    }
  }
}

// Local storage service
class LocalRideStorage {
  private storageKey = 'rider_tracker_rides'
  private metadataKey = 'rider_tracker_metadata'
  private tempRecordingKey = 'rider_tracker_temp_recording' // Key for active recording state

  // Save ride as JSON file to device storage
  async saveRideLocally(rideRecord: RideRecord): Promise<boolean> {
    try {
      // Save to localStorage
      const existingRides = this.getLocalRides()
      const updatedRides = existingRides.filter(ride => ride.metadata.id !== rideRecord.metadata.id)
      const storedRecord: StoredRideRecord = {
        ...rideRecord,
        savedAt: new Date().toISOString(),
        source: 'local'
      }
      updatedRides.push(storedRecord)
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedRides))
      
      // Also save as downloadable JSON file
      await this.saveAsJsonFile(rideRecord)
      
      console.log('💾 Local Storage: Ride saved locally', rideRecord.metadata.id)
      return true
    } catch (error) {
      console.error('❌ Local Storage: Failed to save ride', error)
      return false
    }
  }

  private async saveAsJsonFile(rideRecord: RideRecord): Promise<void> {
    try {
      const jsonData = JSON.stringify(rideRecord, null, 2)
      const blob = new Blob([jsonData], { type: 'application/json' })
      
      // Create a filename with date and ride info
      const date = new Date().toISOString().split('T')[0]
      const time = new Date().toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '-')
      const fileName = `ride_${rideRecord.metadata.vehicleType}_${date}_${time}.json`
      
      // Automatically download the file
      if (typeof window !== 'undefined') {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        console.log('📁 JSON file downloaded:', fileName)
        
        // Also store file info for reference
        const fileInfo = {
          id: rideRecord.metadata.id,
          fileName,
          downloadedAt: new Date().toISOString(),
          fileSize: blob.size,
          points: rideRecord.locationPoints.length,
          distance: rideRecord.metadata.totalDistance,
          duration: rideRecord.metadata.totalDuration
        }
        
        const savedFiles = JSON.parse(localStorage.getItem('rider_tracker_files') || '[]')
        savedFiles.push(fileInfo)
        localStorage.setItem('rider_tracker_files', JSON.stringify(savedFiles))
        
        // Show user-friendly notification
        if (navigator && 'serviceWorker' in navigator) {
          // Could show a notification here
        }
        
        console.log('✅ Ride data saved as JSON file:', {
          fileName,
          fileSize: `${(blob.size / 1024).toFixed(2)} KB`,
          totalPoints: rideRecord.locationPoints.length,
          totalDistance: `${(rideRecord.metadata.totalDistance / 1000).toFixed(2)} km`,
          duration: `${Math.floor(rideRecord.metadata.totalDuration / 60)}:${(rideRecord.metadata.totalDuration % 60).toString().padStart(2, '0')}`
        })
      }
    } catch (error) {
      console.error('❌ Failed to create JSON file:', error)
    }
  }

  getLocalRides(): StoredRideRecord[] {
    try {
      const rides = localStorage.getItem(this.storageKey)
      return rides ? JSON.parse(rides) : []
    } catch (error) {
      console.error('❌ Failed to load local rides:', error)
      return []
    }
  }

  getLocalRideById(id: string): StoredRideRecord | null {
    const rides = this.getLocalRides()
    return rides.find(ride => ride.metadata.id === id) || null
  }

  deleteLocalRide(id: string): boolean {
    try {
      const rides = this.getLocalRides()
      const filteredRides = rides.filter(ride => ride.metadata.id !== id)
      localStorage.setItem(this.storageKey, JSON.stringify(filteredRides))
      return true
    } catch (error) {
      console.error('❌ Failed to delete local ride:', error)
      return false
    }
  }

  // Temp recording storage methods for persistence across page refreshes
  saveTempRecording(recordingState: {
    currentRide: RideRecord | null
    isRecording: boolean
    isPaused: boolean
    currentPauseEvent: PauseEvent | null
    locationPoints: LocationPoint[]
    startTime: string | null
    recordingDuration: number
    totalDistance: number
    currentSpeed: number
    maxSpeed: number
    lastUpdateTime: string
    // Additional UI state for persistence
    selectedVehicle?: string
    selectedTheme?: string
    enabledFeatures?: string[]
  }): boolean {
    try {
      const tempData = {
        ...recordingState,
        savedAt: new Date().toISOString()
      }
      localStorage.setItem(this.tempRecordingKey, JSON.stringify(tempData))
      console.log('💾 Temp recording state saved to localStorage')
      return true
    } catch (error) {
      console.error('❌ Failed to save temp recording state:', error)
      return false
    }
  }

  getTempRecording(): any | null {
    try {
      const tempData = localStorage.getItem(this.tempRecordingKey)
      if (!tempData) return null
      
      const parsed = JSON.parse(tempData)
      console.log('📂 Temp recording state loaded from localStorage:', {
        rideId: parsed.currentRide?.metadata?.id,
        isRecording: parsed.isRecording,
        isPaused: parsed.isPaused,
        pointsCount: parsed.locationPoints?.length || 0,
        duration: parsed.recordingDuration,
        distance: parsed.totalDistance
      })
      return parsed
    } catch (error) {
      console.error('❌ Failed to load temp recording state:', error)
      return null
    }
  }

  clearTempRecording(): boolean {
    try {
      localStorage.removeItem(this.tempRecordingKey)
      console.log('🗑️ Temp recording state cleared from localStorage')
      return true
    } catch (error) {
      console.error('❌ Failed to clear temp recording state:', error)
      return false
    }
  }

  hasTempRecording(): boolean {
    return localStorage.getItem(this.tempRecordingKey) !== null
  }

  // Save UI settings to temp state for persistence across refreshes
  saveTempUISettings(settings: {
    selectedVehicle?: string
    selectedTheme?: string
    enabledFeatures?: string[]
  }): boolean {
    try {
      const existingTemp = this.getTempRecording()
      if (existingTemp) {
        // Update existing temp state with UI settings
        const updatedTemp = {
          ...existingTemp,
          ...settings,
          lastUIUpdateTime: new Date().toISOString()
        }
        localStorage.setItem(this.tempRecordingKey, JSON.stringify(updatedTemp))
        console.log('💾 Temp UI settings saved to localStorage:', settings)
        return true
      } else {
        // Create new temp state with just UI settings
        const newTemp = {
          ...settings,
          savedAt: new Date().toISOString(),
          lastUIUpdateTime: new Date().toISOString()
        }
        localStorage.setItem(this.tempRecordingKey, JSON.stringify(newTemp))
        console.log('💾 New temp UI state created:', settings)
        return true
      }
    } catch (error) {
      console.error('❌ Failed to save temp UI settings:', error)
      return false
    }
  }
}

// Create reactive store for ride recording
const rideRecordingStore = reactive({
  currentRide: null as RideRecord | null,
  isRecording: false,
  isPaused: false,
  currentPauseEvent: null as PauseEvent | null,
  locationPoints: [] as LocationPoint[],
  startTime: null as Date | null,
  lastSaveTime: null as Date | null,
  saveStatus: 'idle' as 'idle' | 'saving' | 'success' | 'error',
  saveError: null as string | null,
  recordingDuration: 0, // in seconds
  totalDistance: 0, // in meters
  currentSpeed: 0, // in km/h
  maxSpeed: 0, // in km/h
})

export const useRideRecording = () => {
  const globalMap = useGlobalMap()
  const mockAPI = new MockRideAPI()
  const localStorage = new LocalRideStorage()
  
  // Save current recording state to temp storage
  const saveTempRecordingState = (uiSettings?: {
    selectedVehicle?: string
    selectedTheme?: string
    enabledFeatures?: string[]
  }) => {
    if (!rideRecordingStore.isRecording && !uiSettings) return
    
    const state = {
      currentRide: rideRecordingStore.currentRide,
      isRecording: rideRecordingStore.isRecording,
      isPaused: rideRecordingStore.isPaused,
      currentPauseEvent: rideRecordingStore.currentPauseEvent,
      locationPoints: rideRecordingStore.locationPoints,
      startTime: rideRecordingStore.startTime?.toISOString() || null,
      recordingDuration: rideRecordingStore.recordingDuration,
      totalDistance: rideRecordingStore.totalDistance,
      currentSpeed: rideRecordingStore.currentSpeed,
      maxSpeed: rideRecordingStore.maxSpeed,
      lastUpdateTime: new Date().toISOString(),
      // Include UI settings if provided
      ...(uiSettings || {})
    }
    
    localStorage.saveTempRecording(state)
  }

  // Save UI settings to temp storage (can be called independently)
  const saveTempUISettings = (settings: {
    selectedVehicle?: string
    selectedTheme?: string
    enabledFeatures?: string[]
  }) => {
    return localStorage.saveTempUISettings(settings)
  }

  // Recover recording state from temp storage (for page refresh persistence)
  const recoverRecordingState = (): boolean => {
    const tempData = localStorage.getTempRecording()
    if (!tempData) return false

    // Only recover if there's an actual ride recording, not just UI settings
    if (!tempData.currentRide || !tempData.isRecording) {
      console.log('🔄 Temp data exists but no active recording to recover')
      return false
    }

    try {
      // Restore store state - ensure arrays are properly synchronized
      rideRecordingStore.currentRide = tempData.currentRide
      rideRecordingStore.isRecording = tempData.isRecording
      rideRecordingStore.isPaused = tempData.isPaused
      rideRecordingStore.currentPauseEvent = tempData.currentPauseEvent
      rideRecordingStore.locationPoints = tempData.currentRide?.locationPoints || []
      rideRecordingStore.startTime = tempData.startTime ? new Date(tempData.startTime) : null
      rideRecordingStore.recordingDuration = tempData.recordingDuration || 0
      rideRecordingStore.totalDistance = tempData.totalDistance || 0
      rideRecordingStore.currentSpeed = tempData.currentSpeed || 0
      rideRecordingStore.maxSpeed = tempData.maxSpeed || 0

      // Recalculate statistics to ensure consistency after recovery
      updateRideStatistics()

      console.log('✅ Successfully recovered active recording state')
      return true
    } catch (error) {
      console.error('❌ Failed to recover recording state:', error)
      return false
    }
  }

  // Get UI settings from temp storage for restoration
  const getTempUISettings = (): {
    selectedVehicle?: string
    selectedTheme?: string 
    enabledFeatures?: string[]
  } => {
    const tempData = localStorage.getTempRecording()
    if (!tempData) return {}
    
    return {
      selectedVehicle: tempData.selectedVehicle,
      selectedTheme: tempData.selectedTheme,
      enabledFeatures: tempData.enabledFeatures
    }
  }

  // Computed values
  const isRecording = computed(() => rideRecordingStore.isRecording)
  const isPaused = computed(() => rideRecordingStore.isPaused)
  const currentRide = computed(() => rideRecordingStore.currentRide)
  const locationPoints = computed(() => rideRecordingStore.locationPoints)
  const recordingDuration = computed(() => rideRecordingStore.recordingDuration)
  const totalDistance = computed(() => rideRecordingStore.totalDistance)
  const currentSpeed = computed(() => rideRecordingStore.currentSpeed)
  const maxSpeed = computed(() => rideRecordingStore.maxSpeed)
  const saveStatus = computed(() => rideRecordingStore.saveStatus)
  const saveError = computed(() => rideRecordingStore.saveError)

  // Generate unique ID
  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000 // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Update ride statistics
  const updateRideStatistics = () => {
    if (rideRecordingStore.locationPoints.length < 2) return

    // Calculate total distance
    let totalDist = 0
    let maxSpd = 0
    
    for (let i = 1; i < rideRecordingStore.locationPoints.length; i++) {
      const prev = rideRecordingStore.locationPoints[i - 1]
      const curr = rideRecordingStore.locationPoints[i]
      
      // Add distance
      totalDist += calculateDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude)
      
      // Track max speed
      if (curr.speed && curr.speed > maxSpd) {
        maxSpd = curr.speed
      }
    }
    
    rideRecordingStore.totalDistance = totalDist
    rideRecordingStore.maxSpeed = maxSpd
    
    // Update current ride metadata if exists
    if (rideRecordingStore.currentRide) {
      rideRecordingStore.currentRide.metadata.totalDistance = totalDist
      rideRecordingStore.currentRide.metadata.maxSpeed = maxSpd
      
      // Calculate average speed
      if (rideRecordingStore.recordingDuration > 0) {
        rideRecordingStore.currentRide.metadata.averageSpeed = 
          (totalDist / 1000) / (rideRecordingStore.recordingDuration / 3600) // km/h
      }
    }
  }

  // Start recording a new ride
  const startRide = async (title: string, vehicleType: 'bicycle' | 'motorbike' = 'bicycle'): Promise<string> => {
    try {
      const rideId = generateId()
      const now = new Date().toISOString()
      
      // Create new ride metadata
      const metadata: RideMetadata = {
        id: rideId,
        title,
        vehicleType,
        startTime: now,
        totalDuration: 0,
        totalDistance: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        pauseEvents: [],
        status: 'recording',
        createdAt: now,
        updatedAt: now
      }

      // Create new ride record
      const rideRecord: RideRecord = {
        metadata,
        locationPoints: []
      }

      // Update store
      rideRecordingStore.currentRide = rideRecord
      rideRecordingStore.isRecording = true
      rideRecordingStore.isPaused = false
      rideRecordingStore.locationPoints = []
      rideRecordingStore.startTime = new Date()
      rideRecordingStore.recordingDuration = 0
      rideRecordingStore.totalDistance = 0
      rideRecordingStore.currentSpeed = 0
      rideRecordingStore.maxSpeed = 0

      // Save initial temp recording state
      saveTempRecordingState()

      console.log('🎬 Started recording ride:', rideId, title)
      return rideId
    } catch (error) {
      console.error('❌ Failed to start ride:', error)
      throw error
    }
  }

  // Simple outlier filtering algorithm
  const isValidLocationPoint = (newLocation: any): { valid: boolean; reason?: string } => {
    // Configuration thresholds
    const MAX_REASONABLE_SPEED = 80 // km/h - maximum reasonable speed for any transportation
    const MIN_TIME_INTERVAL = 1 // seconds - minimum time between points to calculate speed
    const MAX_ACCURACY_THRESHOLD = 50 // meters - reject points with poor GPS accuracy
    
    // Check GPS accuracy first
    if (newLocation.accuracy && newLocation.accuracy > MAX_ACCURACY_THRESHOLD) {
      return { valid: false, reason: `Poor GPS accuracy: ${newLocation.accuracy.toFixed(1)}m` }
    }

    // If this is the first point, always accept it
    if (rideRecordingStore.locationPoints.length === 0) {
      return { valid: true }
    }

    // Get the last valid point
    const lastPoint = rideRecordingStore.locationPoints[rideRecordingStore.locationPoints.length - 1]
    const currentTime = new Date()
    const lastTime = new Date(lastPoint.timestamp)
    const timeInterval = (currentTime.getTime() - lastTime.getTime()) / 1000 // seconds

    // Skip if time interval is too small (avoid division issues)
    if (timeInterval < MIN_TIME_INTERVAL) {
      return { valid: false, reason: `Time interval too small: ${timeInterval.toFixed(2)}s` }
    }

    // Calculate distance and speed between points
    const distance = calculateDistance(
      lastPoint.latitude, 
      lastPoint.longitude, 
      newLocation.lat, 
      newLocation.lng
    ) // meters

    const calculatedSpeed = (distance / timeInterval) * 3.6 // Convert m/s to km/h

    // Check if calculated speed is reasonable
    if (calculatedSpeed > MAX_REASONABLE_SPEED) {
      return { 
        valid: false, 
        reason: `Abnormal speed: ${calculatedSpeed.toFixed(1)} km/h (max: ${MAX_REASONABLE_SPEED} km/h)` 
      }
    }

    // Additional check: if the distance jump is too large in a short time
    const MAX_DISTANCE_PER_SECOND = 22 // meters/second (~80 km/h)
    if (distance / timeInterval > MAX_DISTANCE_PER_SECOND) {
      return { 
        valid: false, 
        reason: `Distance jump too large: ${distance.toFixed(1)}m in ${timeInterval.toFixed(1)}s` 
      }
    }

    // Point passes all validation checks
    return { valid: true }
  }

  // Add location point to current ride (with outlier filtering)
  const addLocationPoint = (location: any): void => {
    console.log('🔍 DEBUG: addLocationPoint called with:', {
      hasCurrentRide: !!rideRecordingStore.currentRide,
      isRecording: rideRecordingStore.isRecording,
      isPaused: rideRecordingStore.isPaused,
      location: {
        lat: location.lat,
        lng: location.lng,
        speed: location.speed,
        accuracy: location.accuracy
      }
    })

    if (!rideRecordingStore.currentRide || !rideRecordingStore.isRecording || rideRecordingStore.isPaused) {
      console.log('⚠️ DEBUG: Skipping location point - ride not active')
      return
    }

    try {
      // Validate the location point using outlier filtering
      const validation = isValidLocationPoint(location)
      if (!validation.valid) {
        console.log('🚫 DEBUG: Location point rejected by filter:', {
          reason: validation.reason,
          lat: location.lat.toFixed(6),
          lng: location.lng.toFixed(6),
          accuracy: location.accuracy,
          speed: location.speed
        })
        return
      }

      const point: LocationPoint = {
        id: generateId(),
        latitude: location.lat,
        longitude: location.lng,
        altitude: location.altitude,
        accuracy: location.accuracy,
        speed: location.speed,
        heading: location.heading,
        timestamp: new Date().toISOString()
      }

      // Add to store
      rideRecordingStore.locationPoints.push(point)
      rideRecordingStore.currentRide.locationPoints.push(point)
      
      // Update current speed
      if (location.speed) {
        rideRecordingStore.currentSpeed = location.speed * 3.6 // Convert m/s to km/h
      }

      // Update statistics
      updateRideStatistics()

      // Save temp recording state to localStorage (for persistence across refreshes)
      saveTempRecordingState()

      console.log('✅ DEBUG: Added location point successfully (passed filter):', {
        pointId: point.id,
        lat: point.latitude.toFixed(6),
        lng: point.longitude.toFixed(6),
        speed: point.speed,
        accuracy: point.accuracy,
        totalPoints: rideRecordingStore.locationPoints.length,
        totalDistance: rideRecordingStore.totalDistance.toFixed(2),
        currentSpeed: rideRecordingStore.currentSpeed.toFixed(2)
      })
    } catch (error) {
      console.error('❌ Failed to add location point:', error)
    }
  }

  // Pause current ride
  const pauseRide = (): string | null => {
    if (!rideRecordingStore.currentRide || !rideRecordingStore.isRecording || rideRecordingStore.isPaused) {
      return null
    }

    try {
      const pauseId = generateId()
      const now = new Date().toISOString()
      
      const pauseEvent: PauseEvent = {
        id: pauseId,
        pausedAt: now
      }

      // Add pause event to current ride
      rideRecordingStore.currentRide.metadata.pauseEvents.push(pauseEvent)
      rideRecordingStore.currentRide.metadata.status = 'paused'
      rideRecordingStore.currentRide.metadata.updatedAt = now
      
      // Update store
      rideRecordingStore.isPaused = true
      rideRecordingStore.currentPauseEvent = pauseEvent

      // Save temp recording state
      saveTempRecordingState()

      console.log('⏸️ Paused ride:', pauseId)
      return pauseId
    } catch (error) {
      console.error('❌ Failed to pause ride:', error)
      return null
    }
  }

  // Resume current ride
  const resumeRide = (): boolean => {
    if (!rideRecordingStore.currentRide || !rideRecordingStore.isPaused || !rideRecordingStore.currentPauseEvent) {
      return false
    }

    try {
      const now = new Date().toISOString()
      
      // Update current pause event
      rideRecordingStore.currentPauseEvent.resumedAt = now
      rideRecordingStore.currentPauseEvent.duration = 
        (new Date(now).getTime() - new Date(rideRecordingStore.currentPauseEvent.pausedAt).getTime()) / 1000

      // Update ride metadata
      rideRecordingStore.currentRide.metadata.status = 'recording'
      rideRecordingStore.currentRide.metadata.updatedAt = now
      
      // Update store
      rideRecordingStore.isPaused = false
      rideRecordingStore.currentPauseEvent = null

      // Save temp recording state
      saveTempRecordingState()

      console.log('▶️ Resumed ride')
      return true
    } catch (error) {
      console.error('❌ Failed to resume ride:', error)
      return false
    }
  }

  // Stop and save current ride
  const stopRide = async (): Promise<{ 
    success: boolean; 
    rideId: string | null; 
    error?: string;
    finalStats?: {
      totalDistance: number;
      totalDuration: number;
      totalPoints: number;
      averageSpeed: number;
      maxSpeed: number;
    }
  }> => {
    if (!rideRecordingStore.currentRide || !rideRecordingStore.isRecording) {
      return { success: false, rideId: null, error: 'No active ride to stop' }
    }

    try {
      const now = new Date().toISOString()
      const rideId = rideRecordingStore.currentRide.metadata.id

      // If currently paused, close the pause event
      if (rideRecordingStore.isPaused && rideRecordingStore.currentPauseEvent) {
        rideRecordingStore.currentPauseEvent.resumedAt = now
        rideRecordingStore.currentPauseEvent.duration = 
          (new Date(now).getTime() - new Date(rideRecordingStore.currentPauseEvent.pausedAt).getTime()) / 1000
      }

      // Update ride metadata
      rideRecordingStore.currentRide.metadata.endTime = now
      rideRecordingStore.currentRide.metadata.status = 'completed'
      rideRecordingStore.currentRide.metadata.totalDuration = rideRecordingStore.recordingDuration
      rideRecordingStore.currentRide.metadata.updatedAt = now

      // Final statistics update
      updateRideStatistics()

      console.log('📊 DEBUG: Final ride statistics before save:', {
        rideId: rideRecordingStore.currentRide.metadata.id,
        totalPoints: rideRecordingStore.locationPoints.length,
        totalDistance: rideRecordingStore.totalDistance,
        totalDuration: rideRecordingStore.recordingDuration,
        averageSpeed: rideRecordingStore.currentRide.metadata.averageSpeed,
        maxSpeed: rideRecordingStore.maxSpeed,
        pauseEvents: rideRecordingStore.currentRide.metadata.pauseEvents.length
      })

      const finalRide = { ...rideRecordingStore.currentRide }
      
      // Capture final stats BEFORE resetting store
      const finalStats = {
        totalDistance: rideRecordingStore.totalDistance,
        totalDuration: rideRecordingStore.recordingDuration,
        totalPoints: rideRecordingStore.locationPoints.length,
        averageSpeed: rideRecordingStore.currentRide.metadata.averageSpeed,
        maxSpeed: rideRecordingStore.maxSpeed
      }

      // Reset store
      rideRecordingStore.currentRide = null
      rideRecordingStore.isRecording = false
      rideRecordingStore.isPaused = false
      rideRecordingStore.currentPauseEvent = null
      rideRecordingStore.locationPoints = []
      rideRecordingStore.startTime = null
      rideRecordingStore.recordingDuration = 0
      rideRecordingStore.totalDistance = 0
      rideRecordingStore.currentSpeed = 0
      rideRecordingStore.maxSpeed = 0

      // Clear temp recording state from localStorage (ride is completed)
      localStorage.clearTempRecording()

      // Save the ride
      const saveResult = await saveRideData(finalRide)
      
      // Return result with final stats
      return {
        ...saveResult,
        finalStats: saveResult.success ? finalStats : undefined
      }
    } catch (error) {
      console.error('❌ Failed to stop ride:', error)
      return { 
        success: false, 
        rideId: rideRecordingStore.currentRide?.metadata.id || null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Save ride data to both local and backend
  const saveRideData = async (rideRecord: RideRecord): Promise<{ success: boolean; rideId: string; error?: string }> => {
    rideRecordingStore.saveStatus = 'saving'
    rideRecordingStore.saveError = null

    try {
      // Save locally first
      const localSaved = await localStorage.saveRideLocally(rideRecord)
      
      // Try to save to backend
      const backendResult = await mockAPI.saveRide(rideRecord)
      
      if (localSaved || backendResult.success) {
        rideRecordingStore.saveStatus = 'success'
        rideRecordingStore.lastSaveTime = new Date()
        
        console.log('✅ Ride saved successfully:', {
          id: rideRecord.metadata.id,
          local: localSaved,
          backend: backendResult.success,
          points: rideRecord.locationPoints.length
        })
        
        return { success: true, rideId: rideRecord.metadata.id }
      } else {
        throw new Error(backendResult.error || 'Failed to save ride')
      }
    } catch (error) {
      rideRecordingStore.saveStatus = 'error'
      rideRecordingStore.saveError = error instanceof Error ? error.message : 'Save failed'
      
      console.error('❌ Failed to save ride:', error)
      return { 
        success: false, 
        rideId: rideRecord.metadata.id, 
        error: rideRecordingStore.saveError 
      }
    }
  }

  // Get user's ride history
  const getRideHistory = async (source: 'local' | 'backend' | 'both' = 'both'): Promise<RideRecord[]> => {
    try {
      let rides: RideRecord[] = []

      if (source === 'local' || source === 'both') {
        const localRides = localStorage.getLocalRides()
        rides.push(...localRides)
      }

      if (source === 'backend' || source === 'both') {
        const backendResult = await mockAPI.getRides(20)
        if (backendResult.success && backendResult.data) {
          // Merge with local rides, avoiding duplicates
          const backendRides = backendResult.data.filter(backendRide => 
            !rides.some(localRide => localRide.metadata.id === backendRide.metadata.id)
          )
          rides.push(...backendRides)
        }
      }

      // Sort by creation date (newest first)
      return rides.sort((a, b) => 
        new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
      )
    } catch (error) {
      console.error('❌ Failed to load ride history:', error)
      return []
    }
  }

  // Get ride statistics
  const getRideStatistics = () => {
    const rides = localStorage.getLocalRides()
    const totalRides = rides.length
    const totalDistance = rides.reduce((sum, ride) => sum + ride.metadata.totalDistance, 0)
    const totalDuration = rides.reduce((sum, ride) => sum + ride.metadata.totalDuration, 0)
    const averageDistance = totalRides > 0 ? totalDistance / totalRides : 0
    const averageDuration = totalRides > 0 ? totalDuration / totalRides : 0

    return {
      totalRides,
      totalDistance,
      totalDuration,
      averageDistance,
      averageDuration,
      lastRideDate: rides.length > 0 ? rides[0].metadata.createdAt : null
    }
  }

  // Update recording duration (should be called by timer)
  const updateRecordingDuration = (seconds: number) => {
    rideRecordingStore.recordingDuration = seconds
    if (rideRecordingStore.currentRide) {
      rideRecordingStore.currentRide.metadata.totalDuration = seconds
    }
    
    // Save temp recording state when duration updates
    if (rideRecordingStore.isRecording) {
      saveTempRecordingState()
    }
  }

  // Debug function to inspect current state
  const debugRideState = () => {
    const state = {
      isRecording: rideRecordingStore.isRecording,
      isPaused: rideRecordingStore.isPaused,
      currentRide: rideRecordingStore.currentRide ? {
        id: rideRecordingStore.currentRide.metadata.id,
        title: rideRecordingStore.currentRide.metadata.title,
        status: rideRecordingStore.currentRide.metadata.status,
        startTime: rideRecordingStore.currentRide.metadata.startTime,
        totalDuration: rideRecordingStore.currentRide.metadata.totalDuration,
        totalDistance: rideRecordingStore.currentRide.metadata.totalDistance,
        locationPointsCount: rideRecordingStore.currentRide.locationPoints.length
      } : null,
      storeStats: {
        locationPointsCount: rideRecordingStore.locationPoints.length,
        recordingDuration: rideRecordingStore.recordingDuration,
        totalDistance: rideRecordingStore.totalDistance,
        currentSpeed: rideRecordingStore.currentSpeed,
        maxSpeed: rideRecordingStore.maxSpeed
      },
      localStorage: {
        localRides: JSON.parse(window.localStorage.getItem('rider_tracker_rides') || '[]').length,
        backendRides: JSON.parse(window.localStorage.getItem('mock_backend_rides') || '[]').length,
        files: JSON.parse(window.localStorage.getItem('rider_tracker_files') || '[]').length
      }
    }
    
    console.log('🔍 DEBUG: Current ride recording state:', state)
    return state
  }

  // Format duration in MM:SS format
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Initialize: check for existing temp recording on composable creation
  const initializeRecordingState = () => {
    if (localStorage.hasTempRecording()) {
      const recovered = recoverRecordingState()
      if (recovered) {
        console.log('🔄 Recording state automatically recovered from localStorage on initialization')
        // Return recovered ride info for UI notification
        return {
          recovered: true,
          rideId: rideRecordingStore.currentRide?.metadata?.id,
          title: rideRecordingStore.currentRide?.metadata?.title,
          duration: rideRecordingStore.recordingDuration,
          points: rideRecordingStore.locationPoints.length
        }
      }
    }
    return { recovered: false }
  }

  // Make debug function available globally for testing
  if (typeof window !== 'undefined') {
    (window as any).debugRideState = debugRideState
  }

  // Clean up function
  const cleanup = () => {
    if (getCurrentInstance()) {
      // Component is being unmounted, save current state if recording
      if (rideRecordingStore.isRecording && rideRecordingStore.currentRide) {
        console.log('⚠️ Component unmounting during recording - auto-saving ride')
        stopRide()
      }
    }
  }

  return {
    // State
    isRecording,
    isPaused,
    currentRide,
    locationPoints,
    recordingDuration,
    totalDistance,
    currentSpeed,
    maxSpeed,
    saveStatus,
    saveError,

    // Methods
    startRide,
    addLocationPoint,
    pauseRide,
    resumeRide,
    stopRide,
    getRideHistory,
    getRideStatistics,
    updateRecordingDuration,
    cleanup,
    debugRideState,

    // Persistence methods
    recoverRecordingState,
    saveTempRecordingState,
    initializeRecordingState,
    formatDuration,

    // UI Settings persistence
    saveTempUISettings,
    getTempUISettings,

    // Utilities
    mockAPI,
    localStorage
  }
} 