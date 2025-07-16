export interface Database {
  public: {
    Tables: {
      rides: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          vehicle_type: 'bicycle' | 'motorbike'
          status: 'recording' | 'paused' | 'completed' | 'cancelled'
          start_location: {
            lat: number
            lng: number
            address?: string
          }
          end_location: {
            lat: number
            lng: number
            address?: string
          } | null
          duration: number | null
          distance: number | null
          route_points: any[] | null
          created_at: string
          finished_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          vehicle_type: 'bicycle' | 'motorbike'
          status: 'recording' | 'paused' | 'completed' | 'cancelled'
          start_location: {
            lat: number
            lng: number
            address?: string
          }
          end_location?: {
            lat: number
            lng: number
            address?: string
          } | null
          duration?: number | null
          distance?: number | null
          route_points?: any[] | null
          created_at?: string
          finished_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          vehicle_type?: 'bicycle' | 'motorbike'
          status?: 'recording' | 'paused' | 'completed' | 'cancelled'
          start_location?: {
            lat: number
            lng: number
            address?: string
          }
          end_location?: {
            lat: number
            lng: number
            address?: string
          } | null
          duration?: number | null
          distance?: number | null
          route_points?: any[] | null
          created_at?: string
          finished_at?: string | null
        }
      }
      route_points: {
        Row: {
          id: string
          ride_id: string
          lat: number
          lng: number
          timestamp: string
          speed: number | null
          altitude: number | null
        }
        Insert: {
          id?: string
          ride_id: string
          lat: number
          lng: number
          timestamp: string
          speed?: number | null
          altitude?: number | null
        }
        Update: {
          id?: string
          ride_id?: string
          lat?: number
          lng?: number
          timestamp?: string
          speed?: number | null
          altitude?: number | null
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          avatar_url: string | null
          preferred_vehicle: 'bicycle' | 'motorbike' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          avatar_url?: string | null
          preferred_vehicle?: 'bicycle' | 'motorbike' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string | null
          avatar_url?: string | null
          preferred_vehicle?: 'bicycle' | 'motorbike' | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific types for easier usage
export type Ride = Tables<'rides'>
export type RoutePoint = Tables<'route_points'>
export type Profile = Tables<'profiles'>

export type RideInsert = TablesInsert<'rides'>
export type RoutePointInsert = TablesInsert<'route_points'>
export type ProfileInsert = TablesInsert<'profiles'>

export type RideUpdate = TablesUpdate<'rides'>
export type RoutePointUpdate = TablesUpdate<'route_points'>
export type ProfileUpdate = TablesUpdate<'profiles'> 