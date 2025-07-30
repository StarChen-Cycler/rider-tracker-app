import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'
import type { User } from '@supabase/supabase-js'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  // Use MemFire Cloud endpoints (compatible with Supabase client)
  // Fallback to legacy Supabase variables for backward compatibility
  const supabaseUrl = (config.public.memfireUrl || config.public.supabaseUrl) as string
  const supabaseKey = (config.public.memfireAnonKey || config.public.supabaseAnonKey) as string
  
  // Debug logging in development
  if (import.meta.dev) {
    console.log('🔧 Supabase Config:', {
      url: supabaseUrl,
      hasKey: !!supabaseKey,
      keyLength: supabaseKey?.length || 0
    })
  }
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('MemFire Cloud URL and Anonymous Key are required. Please check your environment variables.')
  }
  
  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  return {
    supabase
  }
}

// Global auth state using Nuxt's useState
const useAuthState = () => ({
  user: useState<User | null>('auth.user', () => null),
  loading: useState<boolean>('auth.loading', () => true),
  error: useState<string | null>('auth.error', () => null),
  initialized: useState<boolean>('auth.initialized', () => false)
})

// Auth composable
export const useAuth = () => {
  const { supabase } = useSupabase()
  const { user, loading, error, initialized } = useAuthState()

  // Phone authentication methods
  const signUpWithPhone = async (phone: string, password: string) => {
    error.value = null
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        phone,
        password
      })
      
      if (signUpError) {
        error.value = signUpError.message
        throw signUpError
      }
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Phone sign up failed'
      error.value = errorMessage
      return { data: null, error: err }
    }
  }

  const signInWithPhone = async (phone: string, password: string) => {
    error.value = null
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        phone,
        password
      })
      
      if (signInError) {
        error.value = signInError.message
        throw signInError
      }
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Phone sign in failed'
      error.value = errorMessage
      return { data: null, error: err }
    }
  }

  const sendSmsOtp = async (phone: string) => {
    error.value = null
    
    try {
      const { data, error: otpError } = await supabase.auth.signInWithOtp({
        phone
      })
      
      if (otpError) {
        error.value = otpError.message
        throw otpError
      }
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send SMS'
      error.value = errorMessage
      return { data: null, error: err }
    }
  }

  const verifyPhoneOtp = async (phone: string, token: string) => {
    error.value = null
    
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      })
      
      if (verifyError) {
        error.value = verifyError.message
        throw verifyError
      }
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OTP verification failed'
      error.value = errorMessage
      return { data: null, error: err }
    }
  }

  // WeChat authentication
  const signInWithWechat = async (redirectTo?: string) => {
    error.value = null
    
    try {
      const { data, error: wechatError } = await supabase.auth.signInWithOAuth({
        provider: 'wechat_qr' as any,
        options: redirectTo ? { redirectTo } : undefined
      })
      
      if (wechatError) {
        error.value = wechatError.message
        throw wechatError
      }
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'WeChat login failed'
      error.value = errorMessage
      return { data: null, error: err }
    }
  }

  const signUp = async (email: string, password: string, options?: { 
    data?: Record<string, any>
    redirectTo?: string 
  }) => {
    error.value = null
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options
      })
      
      if (signUpError) {
        error.value = signUpError.message
        throw signUpError
      }
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed'
      error.value = errorMessage
      return { data: null, error: err }
    }
  }

  const signIn = async (email: string, password: string) => {
    error.value = null
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (signInError) {
        error.value = signInError.message
        throw signInError
      }
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed'
      error.value = errorMessage
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    error.value = null
    
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        error.value = signOutError.message
        throw signOutError
      }
      
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed'
      error.value = errorMessage
      return { error: err }
    }
  }

  const resetPassword = async (email: string, redirectTo?: string) => {
    error.value = null
    
    try {
      const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo || `${window.location.origin}/reset-password`
      })
      
      if (resetError) {
        error.value = resetError.message
        throw resetError
      }
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed'
      error.value = errorMessage
      return { data: null, error: err }
    }
  }

  const getCurrentUser = async () => {
    try {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        error.value = userError.message
        throw userError
      }
      
      return { user: currentUser, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user'
      error.value = errorMessage
      return { user: null, error: err }
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize auth state (only once)
  const initializeAuth = async () => {
    if (initialized.value) return
    
    console.log('🚀 Initializing auth...')
    
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError)
        error.value = sessionError.message
      } else if (session?.user) {
        console.log('✅ User authenticated:', session.user.email)
        user.value = session.user
      } else {
        console.log('ℹ️ No active session')
        user.value = null
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'no user')
        
        user.value = session?.user ?? null
        loading.value = false
        
        if (event === 'SIGNED_OUT') {
          error.value = null
        }
      })

      initialized.value = true
    } catch (err) {
      console.error('❌ Auth initialization failed:', err)
      error.value = err instanceof Error ? err.message : 'Auth initialization failed'
    } finally {
      loading.value = false
    }
  }

  // Auto-initialize on client side
  if (import.meta.client && !initialized.value) {
    initializeAuth()
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    signUpWithPhone,
    signInWithPhone,
    sendSmsOtp,
    verifyPhoneOtp,
    signInWithWechat,
    signUp,
    signIn,
    signOut,
    resetPassword,
    getCurrentUser,
    clearError,
    initializeAuth
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