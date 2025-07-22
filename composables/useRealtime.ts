import { ref, onUnmounted } from 'vue'
import type { RealtimeChannel, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js'

export const useRealtime = () => {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  
  const channels = ref<RealtimeChannel[]>([])
  const isConnected = ref(false)
  const connectionStatus = ref<string>('CLOSED')

  // Subscribe to ride updates for live tracking
  const subscribeToRideUpdates = (rideId: string, onUpdate: (payload: any) => void) => {
    const channel = supabase
      .channel(`ride:${rideId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'route_points',
        filter: `ride_id=eq.${rideId}`
      }, (payload) => {
        console.log('Route point update:', payload)
        onUpdate(payload)
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rides',
        filter: `id=eq.${rideId}`
      }, (payload) => {
        console.log('Ride status update:', payload)
        onUpdate(payload)
      })
      .subscribe((status) => {
        connectionStatus.value = status
        isConnected.value = status === 'SUBSCRIBED'
        console.log('Subscription status:', status)
      })

    channels.value.push(channel)
    return channel
  }

  // Subscribe to user's rides for notifications
  const subscribeToUserRides = (onRideUpdate: (payload: any) => void) => {
    if (!user.value) return null

    const channel = supabase
      .channel(`user-rides:${user.value.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rides',
        filter: `user_id=eq.${user.value.id}`
      }, (payload) => {
        console.log('User ride update:', payload)
        onRideUpdate(payload)
      })
      .subscribe((status) => {
        connectionStatus.value = status
        isConnected.value = status === 'SUBSCRIBED'
        console.log('User rides subscription status:', status)
      })

    channels.value.push(channel)
    return channel
  }

  // Broadcast live location during ride
  const broadcastLocation = async (rideId: string, locationData: {
    lat: number
    lng: number
    timestamp: string
    speed?: number
    altitude?: number
  }) => {
    const channel = channels.value.find(c => c.topic === `ride:${rideId}`)
    
    if (channel) {
      const status = await channel.send({
        type: 'broadcast',
        event: 'location_update',
        payload: {
          user_id: user.value?.id,
          ride_id: rideId,
          ...locationData
        }
      })
      
      console.log('Location broadcast status:', status)
      return status
    }
    
    return null
  }

  // Listen for emergency alerts
  const subscribeToEmergencyAlerts = (onEmergencyAlert: (payload: any) => void) => {
    if (!user.value) return null

    const channel = supabase
      .channel(`emergency:${user.value.id}`)
      .on('broadcast', {
        event: 'emergency_alert'
      }, (payload) => {
        console.log('Emergency alert received:', payload)
        onEmergencyAlert(payload.payload)
      })
      .subscribe((status) => {
        connectionStatus.value = status
        isConnected.value = status === 'SUBSCRIBED'
        console.log('Emergency alerts subscription status:', status)
      })

    channels.value.push(channel)
    return channel
  }

  // Send emergency alert
  const sendEmergencyAlert = async (location: { lat: number; lng: number }, message?: string) => {
    if (!user.value) return null

    // First save to database for persistence
    const { data: alertData, error } = await supabase
      .from('emergency_alerts')
      .insert({
        user_id: user.value.id,
        location: location,
        message: message || 'Emergency assistance needed',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving emergency alert:', error)
      return null
    }

    // Then broadcast to real-time channel
    const channel = supabase.channel('emergency_broadcasts')
    const status = await channel.send({
      type: 'broadcast',
      event: 'emergency_alert',
      payload: {
        alert_id: alertData.id,
        user_id: user.value.id,
        location: location,
        message: message || 'Emergency assistance needed',
        timestamp: new Date().toISOString()
      }
    })

    console.log('Emergency alert broadcast status:', status)
    return { alertData, broadcastStatus: status }
  }

  // Clean up all subscriptions
  const unsubscribeAll = () => {
    channels.value.forEach(channel => {
      channel.unsubscribe()
    })
    channels.value = []
    isConnected.value = false
    connectionStatus.value = 'CLOSED'
  }

  // Unsubscribe from specific channel
  const unsubscribe = (channelTopic: string) => {
    const channelIndex = channels.value.findIndex(c => c.topic === channelTopic)
    if (channelIndex !== -1) {
      channels.value[channelIndex].unsubscribe()
      channels.value.splice(channelIndex, 1)
    }
  }

  // Auto cleanup on component unmount
  onUnmounted(() => {
    unsubscribeAll()
  })

  return {
    channels: readonly(channels),
    isConnected: readonly(isConnected),
    connectionStatus: readonly(connectionStatus),
    subscribeToRideUpdates,
    subscribeToUserRides,
    subscribeToEmergencyAlerts,
    broadcastLocation,
    sendEmergencyAlert,
    unsubscribe,
    unsubscribeAll
  }
} 