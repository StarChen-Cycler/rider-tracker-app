import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'
import type { User } from '@supabase/supabase-js'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  // Use MemFire Cloud endpoints (compatible with Supabase client)
  const supabase = createClient<Database>(
    config.public.memfireUrl as string,
    config.public.memfireAnonKey as string
  )

  return {
    supabase
  }
}

// Auth composable
export const useAuth = () => {
  const { supabase } = useSupabase()
  const user = ref<User | null>(null)
  const loading = ref(true)

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  }

  // Initialize auth state
  onMounted(async () => {
    const { user: currentUser } = await getCurrentUser()
    user.value = currentUser
    loading.value = false

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  })

  return {
    user: readonly(user),
    loading: readonly(loading),
    signUp,
    signIn,
    signOut,
    getCurrentUser
  }
}

// Rides composable
export const useRides = () => {
  const { supabase } = useSupabase()
  const { user } = useAuth()

  const createRide = async (rideData: {
    title: string
    description?: string
    vehicle_type: 'bicycle' | 'motorbike'
    start_location: {
      lat: number
      lng: number
      address?: string
    }
  }) => {
    const { data, error } = await supabase
      .from('rides')
      .insert([
        {
          ...rideData,
          user_id: user.value?.id,
          status: 'recording',
          created_at: new Date().toISOString()
        }
      ])
      .select()
    
    return { data, error }
  }

  const updateRide = async (rideId: string, updates: any) => {
    const { data, error } = await supabase
      .from('rides')
      .update(updates)
      .eq('id', rideId)
      .select()
    
    return { data, error }
  }

  const finishRide = async (rideId: string, rideData: {
    end_location: {
      lat: number
      lng: number
      address?: string
    }
    duration: number
    distance: number
    route_points: any[]
  }) => {
    const { data, error } = await supabase
      .from('rides')
      .update({
        ...rideData,
        status: 'completed',
        finished_at: new Date().toISOString()
      })
      .eq('id', rideId)
      .select()
    
    return { data, error }
  }

  const getUserRides = async (limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('user_id', user.value?.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    return { data, error }
  }

  const getRideById = async (rideId: string) => {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('id', rideId)
      .single()
    
    return { data, error }
  }

  const deleteRide = async (rideId: string) => {
    const { data, error } = await supabase
      .from('rides')
      .delete()
      .eq('id', rideId)
    
    return { data, error }
  }

  return {
    createRide,
    updateRide,
    finishRide,
    getUserRides,
    getRideById,
    deleteRide
  }
}

// Route points composable
export const useRoutePoints = () => {
  const { supabase } = useSupabase()

  const addRoutePoint = async (rideId: string, point: {
    lat: number
    lng: number
    timestamp: string
    speed?: number
    altitude?: number
  }) => {
    const { data, error } = await supabase
      .from('route_points')
      .insert([
        {
          ride_id: rideId,
          ...point
        }
      ])
      .select()
    
    return { data, error }
  }

  const getRoutePoints = async (rideId: string) => {
    const { data, error } = await supabase
      .from('route_points')
      .select('*')
      .eq('ride_id', rideId)
      .order('timestamp', { ascending: true })
    
    return { data, error }
  }

  const bulkAddRoutePoints = async (rideId: string, points: any[]) => {
    const pointsWithRideId = points.map(point => ({
      ride_id: rideId,
      ...point
    }))

    const { data, error } = await supabase
      .from('route_points')
      .insert(pointsWithRideId)
      .select()
    
    return { data, error }
  }

  return {
    addRoutePoint,
    getRoutePoints,
    bulkAddRoutePoints
  }
} 