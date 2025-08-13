# Rider Tracker App - Development Restrictions

## 🚨 High-Level Architecture Restrictions

### **MANDATORY: Anti-Monolithic Enforcement**
- **MAX 200 lines per composable file** - Split immediately if exceeded
- **Single Responsibility Principle**: Each composable/service must do ONE thing
- **No direct API calls in UI components** - Use server API routes only
- **Zero business logic in pages/** - All logic in composables/server APIs

### **Performance Restrictions (Mobile-First)**
- **Bundle size < 500KB initial** - Code splitting mandatory
- **Time to Interactive < 3s on 3G** - SSR required for all map pages
- **API response < 200ms** - Server-side caching required (extend to 2s for complex queries with proper caching)
- **GPS tracking interval: EXACTLY 3000ms** - Configurable via runtime config only

## 📁 Directory Structure Restrictions

### **Enforced Nuxt 3 Structure**
```
MUST FOLLOW - Zero exceptions:
rider-tracker-app/
├── composables/           # Auto-imported composables only
│   ├── location/         # GPS and tracking
│   ├── map/             # Map initialization and interaction
│   ├── storage/         # Local storage and sync
│   └── auth/            # User authentication
├── server/              # API routes only
│   ├── api/v1/          # RESTful endpoints
│   ├── utils/           # Server utilities
│   └── middleware/      # Route middleware
├── utils/               # Shared utilities
│   ├── services/        # Service implementations
│   ├── types/          # TypeScript definitions
│   └── constants/      # App constants
├── plugins/            # Nuxt 3 plugins only
├── middleware/         # Route middleware
├── pages/             # UI only - NO business logic
├── layouts/           # Layout components
├── components/        # Reusable components
├── assets/            # Static assets
└── public/            # Public files
```

## 🔗 Memfire Backend Connection Restrictions

### **Database Design Requirements**
```sql
-- MANDATORY tables with exact structure:
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT NOT NULL CHECK (char_length(display_name) >= 3),
  avatar_url TEXT CHECK (avatar_url ~ '^https?://'),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT CHECK (char_length(title) <= 100),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL CHECK (start_time <= NOW()),
  end_time TIMESTAMP WITH TIME ZONE CHECK (end_time >= start_time),
  distance_meters INTEGER DEFAULT 0 CHECK (distance_meters >= 0),
  duration_seconds INTEGER DEFAULT 0 CHECK (duration_seconds >= 0),
  status TEXT CHECK (status IN ('active', 'completed', 'paused', 'cancelled')) DEFAULT 'active',
  metadata JSONB DEFAULT '{}' CHECK (jsonb_typeof(metadata) = 'object'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE route_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude DECIMAL(11, 8) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  accuracy_meters DECIMAL(5, 2) CHECK (accuracy_meters >= 0),
  altitude_meters DECIMAL(8, 2),
  speed_mps DECIMAL(5, 2) CHECK (speed_mps >= 0),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL CHECK (timestamp <= NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_route_points_ride_id ON route_points(ride_id);
CREATE INDEX idx_route_points_timestamp ON route_points(timestamp);

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID REFERENCES rides(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 100),
  description TEXT CHECK (char_length(description) <= 500),
  is_public BOOLEAN DEFAULT false,
  max_participants INTEGER DEFAULT 10 CHECK (max_participants >= 1 AND max_participants <= 100),
  start_location JSONB CHECK (start_location IS NULL OR jsonb_typeof(start_location) = 'object'),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE activity_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

CREATE INDEX idx_activity_participants_activity_id ON activity_participants(activity_id);
CREATE INDEX idx_activity_participants_user_id ON activity_participants(user_id);

CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 50),
  type TEXT CHECK (type IN ('activity', 'direct')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
  message_type TEXT CHECK (message_type IN ('text', 'image', 'location', 'system')) DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
```

### **Row Level Security (RLS) - MANDATORY**
```sql
-- Enable RLS on ALL tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER handle_rides_updated_at BEFORE UPDATE ON rides
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER handle_activities_updated_at BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT 
  TO authenticated, anon
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Rides policies
CREATE POLICY "Users can view own rides" ON rides 
  FOR SELECT 
  TO authenticated, anon
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own rides" ON rides 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rides" ON rides 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own rides" ON rides 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Route points policies (cascade from rides)
CREATE POLICY "Users can view route points for own rides" ON route_points 
  FOR SELECT 
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM rides 
      WHERE rides.id = route_points.ride_id 
      AND rides.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create route points for own rides" ON route_points 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rides 
      WHERE rides.id = route_points.ride_id 
      AND rides.user_id = auth.uid()
    )
  );

-- Activities policies
CREATE POLICY "Public activities are viewable by all" ON activities 
  FOR SELECT 
  TO authenticated, anon
  USING (is_public = true);

CREATE POLICY "Users can view own activities" ON activities 
  FOR SELECT 
  TO authenticated, anon
  USING (created_by = auth.uid());

CREATE POLICY "Users can create activities" ON activities 
  FOR INSERT 
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own activities" ON activities 
  FOR UPDATE 
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Activity participants policies
CREATE POLICY "Activity participants can view participants" ON activity_participants 
  FOR SELECT 
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM activities 
      WHERE activities.id = activity_participants.activity_id 
      AND (activities.is_public = true OR activities.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can join activities" ON activity_participants 
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave activities" ON activity_participants 
  FOR DELETE 
  TO authenticated
  USING (user_id = auth.uid());

-- Chat rooms policies
CREATE POLICY "Activity participants can view chat rooms" ON chat_rooms 
  FOR SELECT 
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM activities 
      WHERE activities.id = chat_rooms.activity_id 
      AND (activities.is_public = true OR activities.created_by = auth.uid())
    )
  );

-- Chat messages policies
CREATE POLICY "Activity participants can view messages" ON chat_messages 
  FOR SELECT 
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms cr
      JOIN activities a ON a.id = cr.activity_id
      WHERE cr.id = chat_messages.room_id
      AND (a.is_public = true OR a.created_by = auth.uid())
    )
  );

CREATE POLICY "Authenticated users can send messages" ON chat_messages 
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 🔒 UNIVERSAL DATABASE SECURITY RULES 🔒
-- All new tables MUST follow this exact pattern:
-- 1. Every table MUST have user_id UUID column referencing auth.users
-- 2. Every table MUST have created_at, updated_at, and deleted_at timestamps
-- 3. Every table MUST have RLS enabled
-- 4. Every table MUST have standard policies below
-- 5. Every table MUST have proper indexes on foreign keys

-- Standard policy template for any new table:
-- CREATE POLICY "Users can view own [table]" ON [table] FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
-- CREATE POLICY "Users can create own [table]" ON [table] FOR INSERT WITH CHECK (auth.uid() = user_id);
-- CREATE POLICY "Users can update own [table]" ON [table] FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- CREATE POLICY "Users can soft delete own [table]" ON [table] FOR UPDATE USING (auth.uid() = user_id);

-- Enhanced schema with soft deletes:
-- ALTER TABLE [table] ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
-- CREATE INDEX idx_[table]_deleted_at ON [table](deleted_at) WHERE deleted_at IS NULL;

-- Schema Extension Rules:
-- 1. UUID Primary Keys: All tables must use UUID primary keys with gen_random_uuid()
-- 2. Timestamp Consistency: created_at DEFAULT NOW(), updated_at with trigger, deleted_at for soft deletes
-- 3. User Association: Every record must belong to a user via user_id (except system tables)
-- 4. Soft Delete Pattern: Use deleted_at TIMESTAMP instead of hard deletes
-- 5. Audit Trail: All changes logged to [table_name]_audit table with JSONB storage
-- 6. Data Validation: Use CHECK constraints for data integrity
-- 7. Indexing: Create indexes on foreign keys and frequently queried columns

-- Enhanced audit table template:
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'SOFT_DELETE', 'RESTORE')),
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES auth.users(id),
  session_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, user_id, session_user_id)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), auth.uid(), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
      INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id, session_user_id)
      VALUES (TG_TABLE_NAME, NEW.id, 'SOFT_DELETE', to_jsonb(OLD), to_jsonb(NEW), auth.uid(), auth.uid());
    ELSIF NEW.deleted_at IS NULL AND OLD.deleted_at IS NOT NULL THEN
      INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id, session_user_id)
      VALUES (TG_TABLE_NAME, NEW.id, 'RESTORE', to_jsonb(OLD), to_jsonb(NEW), auth.uid(), auth.uid());
    ELSE
      INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id, session_user_id)
      VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), auth.uid(), auth.uid());
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, record_id, action, new_data, user_id, session_user_id)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), auth.uid(), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Soft delete function
CREATE OR REPLACE FUNCTION soft_delete(table_name TEXT, record_id UUID)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE %I SET deleted_at = NOW() WHERE id = $1', table_name) USING record_id;
END;
$$ LANGUAGE plpgsql;

-- Restore function
CREATE OR REPLACE FUNCTION restore_record(table_name TEXT, record_id UUID)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE %I SET deleted_at = NULL WHERE id = $1', table_name) USING record_id;
END;
$$ LANGUAGE plpgsql;

-- API Integration Rules (Memfire-specific):
-- 1. All queries must use .eq('user_id', auth.uid()) for user-owned data AND .is('deleted_at', null)
-- 2. Public queries must explicitly check is_public = true AND deleted_at IS NULL
-- 3. Use .rpc('soft_delete', {table_name: 'table', record_id: 'uuid'}) for soft deletes
-- 4. Always include error handling for RLS violations (PGRST116 status code)
-- 5. Use server-side validation before database operations
-- 6. Implement rate limiting at API level, not just database level
-- 7. Use prepared statements with parameter binding to prevent SQL injection
-- 8. Validate UUID format before using in queries
-- 9. Use connection pooling with appropriate limits
-- 10. Monitor query performance with pg_stat_statements

-- Enhanced Security Checklist for New Tables:
-- [ ] RLS enabled with ALTER TABLE [table] ENABLE ROW LEVEL SECURITY
-- [ ] Primary key is UUID with gen_random_uuid() default
-- [ ] user_id column exists with foreign key to auth.users
-- [ ] created_at, updated_at, deleted_at timestamps exist
-- [ ] Appropriate CHECK constraints for data validation
-- [ ] Indexes on foreign keys and frequently queried columns
-- [ ] Standard CRUD policies with soft delete support
-- [ ] Audit trigger attached to table
-- [ ] Policies tested with auth.uid() matching/non-matching users
-- [ ] Anonymous access tested (should fail for protected resources)
-- [ ] Performance tested with large datasets
-- [ ] Migration scripts created for production deployment

-- Policy Naming Convention (Enhanced):
-- "Users can [action] own [table]" - for user-owned data (includes deleted_at check)
-- "Public [table] are viewable" - for public data (includes deleted_at check)
-- "[Context] can [action] [table]" - for complex relationships
-- "System [action] [table]" - for administrative operations
-- All policies must include comments explaining business logic and edge cases

-- Testing Requirements (Memfire-specific):
-- 1. Test each policy with auth.uid() = target_user_id (should succeed)
-- 2. Test with auth.uid() != target_user_id (should fail with 403)
-- 3. Test with NULL auth.uid() (anonymous access - should fail for protected resources)
-- 4. Test with deleted_at IS NOT NULL (soft deleted records should be invisible)
-- 5. Test composite policies with JOIN operations and subqueries
-- 6. Test with edge cases: empty arrays, NULL values, invalid UUIDs
-- 7. Test performance with 100k+ records
-- 8. Test concurrent access and locking behavior
-- 9. Test audit trail functionality
-- 10. Test soft delete/restore operations
```

### **Environment Variables - STRICT FORMAT**
```bash
# Required - NO exceptions
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]
AMAP_KEY=[AMAP_JS_KEY]
AMAP_SECURITY_KEY=[AMAP_SECURITY_KEY]

# Optional - With defaults
GEOLOCATION_TIMEOUT=10000
TRACKING_INTERVAL=3000
MAX_ACCURACY=50

# Nuxt runtime config (prefix with NUXT_PUBLIC_ for client-side exposure)
NUXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NUXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
NUXT_PUBLIC_AMAP_KEY=$AMAP_KEY
NUXT_PUBLIC_AMAP_SECURITY_KEY=$AMAP_SECURITY_KEY
```

## 🎯 UX/UI Restrictions

### **Mobile-First Design Rules**
- **Touch targets minimum 44x44px** - No exceptions
- **Thumb-friendly bottom navigation** - Primary actions within thumb reach
- **Safe area handling** - Respect iOS/Android safe areas
- **Loading states** - Skeleton screens for all async operations
- **Error states** - User-friendly messages with retry actions

### **Performance Budgets**
```javascript
// Enforced limits in nuxt.config.ts
export default defineNuxtConfig({
  build: {
    analyze: true,
    maxChunkSize: 500 * 1024, // 500KB max per chunk
  },
  experimental: {
    payloadExtraction: false, // Disable for mobile performance
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
  }
})
```

## 🔧 Technical Implementation Restrictions

### **Composables Standards**
```typescript
// REQUIRED pattern for ALL composables
export const use[Feature] = () => {
  // 1. Configuration from runtime config
  const config = useRuntimeConfig()
  
  // 2. State management - use Pinia for complex global state, useState for local
  // For shared state across components: use Pinia stores
  // For component-specific state: useState('[feature]-state', () => initialState)
  const localState = useState('[feature]-local', () => initialState)
  
  // 3. Server API calls only - distinguish client vs server
  // Client-side: $fetch('/api/v1/[endpoint]')
  // Server-side: use server API routes for data fetching
  const [action] = async () => {
    return await $fetch('/api/v1/[endpoint]', { method: 'POST' })
  }
  
  // 4. Return readonly state and actions
  return {
    state: readonly(localState),
    action,
  }
}

// For complex global state, use Pinia stores instead of useState
// stores/[feature]Store.ts
export const use[Feature]Store = defineStore('[feature]', () => {
  const state = ref(initialState)
  const actions = {
    async fetchData() {
      return await $fetch('/api/v1/[endpoint]')
    }
  }
  return { state, ...actions }
})
```

### **Server API Standards**
```typescript
// REQUIRED modular pattern for server endpoints
// server/utils/validation.ts
export const validateRideInput = (body: any) => {
  // Extract validation logic to reusable utils
  return schema.parse(body)
}

// server/utils/auth.ts
export const requireAuth = async (event: H3Event) => {
  // Centralized auth logic
  const token = getHeader(event, 'authorization')
  return await verifyToken(token)
}

// server/utils/rateLimit.ts
export const rateLimit = async (event: H3Event, key: string) => {
  // Reusable rate limiting
  return await checkRateLimit(getIP(event), key)
}

// server/api/v1/rides.get.ts
export default defineEventHandler(async (event) => {
  // 1. Input validation
  const query = getQuery(event)
  const validatedQuery = validateRideQuery(query)
  
  // 2. Authentication check
  const user = await requireAuth(event)
  
  // 3. Rate limiting
  await rateLimit(event, 'rides-list')
  
  // 4. Database operation with RLS
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .eq('user_id', user.id)
  
  // 5. Error handling with proper HTTP codes
  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }
  
  // Allow longer response times for complex queries (up to 2s with caching)
  setHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  
  return data
})
```

### **Type Safety Requirements**
```typescript
// MANDATORY - All types in utils/types/
// utils/types/ride.ts
export interface Ride {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  distance: number // meters
  duration: number // seconds
  status: 'active' | 'completed' | 'paused'
  metadata: Record<string, unknown>
}

// utils/types/location.ts
export interface Location {
  latitude: number
  longitude: number
  accuracy: number // meters
  altitude?: number
  speed?: number // m/s
  timestamp: Date
}
```

## 🚀 Extensibility Restrictions

### **Plugin System Architecture**
```typescript
// plugins/service-loader.client.ts
export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  
  // Auto-load services based on config
  const services = {
    map: config.public.mapProvider === 'amap' ? useAmapService() : useGoogleService(),
    storage: config.public.storageProvider === 'supabase' ? useSupabaseService() : useFirebaseService(),
  }
  
  return {
    provide: {
      services
    }
  }
})
```

### **Feature Flags System**
```typescript
// utils/constants/features.ts
export const FEATURE_FLAGS = {
  AI_RECOMMENDATIONS: false, // Enable when AI ready
  SOCIAL_FEATURES: true,
  OFFLINE_MODE: true,
  ADVANCED_ANALYTICS: false,
  GROUP_ACTIVITIES: true,
} as const
```

## 🧪 Testing Restrictions

### **Testing Exemptions & Guidelines**
- **Integration tests**: May exceed 200 lines for complex test setups
- **Test utilities**: Exempt from line limits in `tests/utils/`
- **Mock data**: Exempt from type checking in `tests/fixtures/`
- **E2E flows**: May skip unit tests if covered by E2E

### **Required Test Coverage**
- **Unit tests**: 80% coverage for composables
- **API tests**: 100% coverage for server endpoints
- **E2E tests**: Critical user flows (recording, sharing, chat)
- **Performance tests**: Bundle size, load time benchmarks
- **Offline tests**: Network failure scenarios
- **State recovery tests**: Page refresh during recording

### **Testing Structure**
```
tests/
├── unit/              # Composable tests
├── api/               # Server endpoint tests
├── e2e/              # End-to-end tests
├── performance/      # Bundle size and load tests
├── offline/          # Offline-first tests
├── recovery/         # State recovery tests
└── utils/            # Test utilities (exempt from restrictions)
```

## 📱 Offline-First State Management

### **Offline Storage Strategy**
```typescript
// composables/storage/useOfflineStorage.ts
export const useOfflineStorage = () => {
  const config = useRuntimeConfig()
  
  // Local storage for immediate persistence
  const localStorage = useLocalStorage('rides', [])
  
  // IndexedDB for large datasets
  const indexedDB = useIndexedDB('route-points')
  
  // Sync queue for offline operations
  const syncQueue = useState('sync-queue', () => [])
  
  return {
    saveOffline: async (ride: Ride) => {
      await localStorage.setItem(ride.id, ride)
      await indexedDB.setItem(`points-${ride.id}`, ride.routePoints)
    },
    syncWhenOnline: async () => {
      const queue = syncQueue.value
      for (const operation of queue) {
        await $fetch('/api/sync', { method: 'POST', body: operation })
      }
    }
  }
}
```

### **State Recovery Patterns**
```typescript
// composables/recovery/useStateRecovery.ts
export const useStateRecovery = () => {
  const activeRide = useState<Ride | null>('active-ride')
  const isRecovering = useState('is-recovering', () => false)
  
  const recoverFromOffline = async () => {
    isRecovering.value = true
    
    try {
      // Check local storage for incomplete rides
      const incompleteRides = await getIncompleteRides()
      if (incompleteRides.length > 0) {
        activeRide.value = incompleteRides[0]
        return true
      }
      
      return false
    } finally {
      isRecovering.value = false
    }
  }
  
  return { recoverFromOffline, isRecovering }
}
```

### **Conflict Resolution**
```typescript
// composables/sync/useConflictResolution.ts
export const useConflictResolution = () => {
  const resolveConflicts = async (localData: any, serverData: any) => {
    // Last-write-wins for non-critical data
    if (localData.updated_at > serverData.updated_at) {
      return localData
    }
    
    // User confirmation for critical conflicts
    if (hasCriticalChanges(localData, serverData)) {
      return await promptUserForResolution(localData, serverData)
    }
    
    return serverData
  }
  
  return { resolveConflicts }
}
```

### **Offline Capabilities**
- **GPS tracking continues offline** - Store points locally
- **Ride creation offline** - Sync when connection restored
- **Chat messages queue** - Send when online
- **Map tiles cache** - Preload for offline viewing
- **User preferences local** - Always available

### **Connection State Management**
```typescript
// composables/network/useConnectionState.ts
export const useConnectionState = () => {
  const isOnline = useState('is-online', () => true)
  const connectionType = useState('connection-type', () => 'wifi')
  
  const updateConnectionState = () => {
    isOnline.value = navigator.onLine
    connectionType.value = navigator.connection?.effectiveType || 'unknown'
  }
  
  return { isOnline, connectionType, updateConnectionState }
}
```

### **Migration Strategy**
```typescript
// Migration plan for existing code
export const migrationPlan = {
  phase1: 'Create new directory structure',
  phase2: 'Move existing composables to new structure',
  phase3: 'Create server API endpoints',
  phase4: 'Migrate business logic to server',
  phase5: 'Update UI components to use new composables',
  phase6: 'Implement offline-first storage layer',
  phase7: 'Add state recovery mechanisms'
}
```

### **Legacy Code Support**
- **Phased deprecation**: 90-day deprecation cycle with warnings
- **Feature flags**: Toggle old/new implementations via FEATURE_FLAGS
- **Migration timeline**: 6-month max dual-mode support
- **Deprecation notices**: Console warnings + documentation
- **Data migration**: Automated scripts for user data transition
- **Clean removal**: Remove old code after successful 30-day production run

### **Migration Safety Nets**
- **Feature flags**: Toggle between old/new implementations
- **Rollback plan**: Instant reversion if issues detected
- **Data migration**: Seamless transition of user data
- **Offline compatibility**: Ensure new code works offline
- **Performance monitoring**: Track metrics during migration

## 📊 Monitoring Restrictions

### **Required Analytics**
- **Performance metrics**: TTI, bundle size, API response times
- **User engagement**: Feature usage, retention rates
- **Error tracking**: GPS failures, API errors
- **Business metrics**: Route shares, chat engagement

### **Monitoring Setup**
```typescript
// plugins/analytics.client.ts
export default defineNuxtPlugin(() => {
  // Performance monitoring
  usePerformanceMetrics()
  
  // Error tracking
  useErrorTracking()
  
  // User behavior
  useAnalytics()
})
```

## 🔒 Security Restrictions

### **Authentication Requirements**
- **JWT tokens only** - No session cookies, use Supabase auth with proper refresh token handling
- **Row Level Security** - Database-level security with proper role-based access (authenticated, anon)
- **Input sanitization** - All user inputs sanitized using parameterized queries
- **Rate limiting** - 100 requests per minute per user (implement at API level, not just database)
- **HTTPS enforcement** - All traffic over HTTPS (enforced by Supabase)
- **Service role key protection** - Never expose SUPABASE_SERVICE_ROLE_KEY in client code
- **Token refresh handling** - Implement automatic token refresh before expiration
- **Session management** - Use Supabase auth session with proper cleanup on logout
- **CORS configuration** - Configure appropriate CORS origins in Supabase dashboard
- **Auth hooks** - Use auth hooks for post-authentication actions (profile creation, etc.)

### **Data Privacy**
- **Location data encrypted at rest** - AES-256 encryption
- **User data deletion** - GDPR compliant delete endpoints
- **Data retention** - 90 days for location data, 365 days for rides
- **Audit logging** - All data access logged

### **Memfire Cloud Configuration**
```typescript
// nuxt.config.ts - Supabase configuration
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    redirect: false, // Handle redirects manually for better UX
    cookieOptions: {
      maxAge: 60 * 60 * 8, // 8 hours
      sameSite: 'lax',
      secure: true
    }
  },
  runtimeConfig: {
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY, // Server-side only
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    }
  }
})
```

### **Memfire-specific API Patterns**
```typescript
// server/utils/supabase-admin.ts
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// server/utils/supabase-client.ts
export const supabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// Use admin client for server-side operations, client for user operations
```

### **Memfire Real-time Configuration**
```typescript
// composables/useRealtime.ts
export const useRealtime = () => {
  const supabase = useSupabaseClient()
  
  const subscribeToRides = (userId: string) => {
    return supabase
      .channel('rides-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rides', filter: `user_id=eq.${userId}` },
        (payload) => {
          // Handle real-time updates
        }
      )
      .subscribe()
  }
  
  return { subscribeToRides }
}
```

### **Memfire Storage Configuration**
```typescript
// Storage buckets configuration (run in Supabase SQL editor)
-- Create storage buckets for rider app
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('ride-images', 'ride-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('route-data', 'route-data', false, 5242880, ARRAY['application/json', 'application/gpx+xml']);

-- Storage policies for avatars
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'avatars');

CREATE POLICY "Users can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
```

---

**⚠️ VIOLATION CONSEQUENCES:**
- **Build fails** if any restriction violated
- **PR blocked** until compliance achieved
- **Performance regression** triggers immediate rollback
- **Security issue** = emergency hotfix deployment

**✅ APPROVAL REQUIRED:**
- Any composable >200 lines
- New API endpoints
- Third-party service integration
- Database schema changes
- Performance budget increases
- Internationalization setup
- Deployment pipeline changes
- Documentation standards updates

## 🌐 Internationalization Standards
### **Nuxt i18n Module Configuration**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n'
  ],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json' },
      { code: 'zh-CN', iso: 'zh-CN', file: 'zh-CN.json' },
      { code: 'ja', iso: 'ja-JP', file: 'ja.json' },
      { code: 'ko', iso: 'ko-KR', file: 'ko.json' },
      { code: 'ar', iso: 'ar-SA', file: 'ar.json', dir: 'rtl' }
    ],
    lazy: true,
    langDir: 'locales/',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'rider_tracker_locale',
      redirectOn: 'root'
    }
  }
})

// locales/en.json
{
  "navigation": {
    "track": "Track Ride",
    "history": "Ride History",
    "profile": "Profile"
  },
  "tracking": {
    "start": "Start Ride",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop"
  }
}
```

## 📋 Deployment Checklist
- [ ] All tests pass (unit, e2e, performance)
- [ ] Bundle size verified <500KB
- [ ] Offline functionality tested
- [ ] Security scan completed
- [ ] Database migrations applied
- [ ] Feature flags configured
- [ ] Monitoring dashboards active
- [ ] Rollback plan tested

## 🔄 Code Splitting & Bundle Strategy

### **Dynamic Import Guidelines**
```typescript
// Lazy load heavy components
const MapComponent = defineAsyncComponent(() => 
  import('~/components/map/MapComponent.vue')
)

// Route-based code splitting
// pages/track.vue
export default definePageMeta({
  component: () => import('~/components/map/MapWrapper.vue')
})
```

### **Bundle Analysis Setup**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    analyze: {
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false
    }
  },
  webpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          amap: {
            test: /[\\/]node_modules[\\/]@amap/,
            name: 'amap-vendor',
            priority: 20,
            reuseExistingChunk: true
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true
          }
        }
      }
    }
  }
})
```

### **Tree Shaking Rules**
- **Import specific functions**: `import { ref } from 'vue'` not `import * as Vue`
- **Use dynamic imports** for non-critical features
- **SideEffects**: false in package.json for pure ESM packages
- **Bundlephobia checks** for new dependencies

## 🌐 Advanced Internationalization

### **Locale-Specific Configuration**
```typescript
// utils/i18n/locale-config.ts
export const LOCALE_CONFIG = {
  'en': {
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    rtl: false,
    mapLanguage: 'en'
  },
  'zh-CN': {
    dateFormat: 'YYYY/MM/DD',
    timeFormat: '24h',
    rtl: false,
    mapLanguage: 'zh_cn'
  },
  'ar': {
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    rtl: true,
    mapLanguage: 'ar'
  }
} as const
```

### **RTL Support Guidelines**
```css
/* assets/css/rtl.css */
[dir="rtl"] {
  .map-controls {
    left: 1rem;
    right: auto;
  }
  
  .ride-stats {
    direction: rtl;
  }
}
```

## 🏗️ State Management Architecture

### **Centralized Store Pattern**
```typescript
// stores/rideStore.ts
export const useRideStore = defineStore('rides', () => {
  const rides = ref<Ride[]>([])
  const activeRide = ref<Ride | null>(null)
  const isLoading = ref(false)
  
  const fetchRides = async () => {
    isLoading.value = true
    try {
      rides.value = await $fetch('/api/v1/rides')
    } finally {
      isLoading.value = false
    }
  }
  
  return { rides, activeRide, isLoading, fetchRides }
})
```

### **Cross-Composable Communication**
```typescript
// composables/useRideSync.ts
export const useRideSync = () => {
  const rideStore = useRideStore()
  const offlineStorage = useOfflineStorage()
  
  const syncRideData = async () => {
    if (navigator.onLine) {
      await rideStore.fetchRides()
      await offlineStorage.syncWhenOnline()
    }
  }
  
  return { syncRideData }
}
```

## 🚨 UI Error Boundaries

### **Nuxt 3 Error Handling Strategy**
```typescript
// layouts/error.vue - Global error page
<template>
  <div class="error-layout">
    <h1>{{ error?.statusCode }}</h1>
    <p>{{ error?.message || 'An error occurred' }}</p>
    <button @click="handleError">Try Again</button>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

// plugins/error-handler.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  // Global error handler
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Global error:', error)
    
    // Use Nuxt's built-in error handling
    showError({
      statusCode: 500,
      statusMessage: 'Something went wrong',
      data: { error: error.message }
    })
  }
})

// composables/useErrorBoundary.ts
export const useErrorBoundary = (component: string) => {
  const error = ref<Error | null>(null)
  const retryCount = ref(0)
  
  const handleError = (err: Error) => {
    error.value = err
    console.error(`${component} error:`, err)
  }
  
  const retry = async () => {
    retryCount.value++
    error.value = null
  }
  
  return { error, retryCount, handleError, retry }
}
```


## 🔄 Git Workflow & CI/CD

### **Branch Strategy**
```bash
main              # Production releases
├── develop       # Integration branch
├── feature/*     # Feature branches
├── hotfix/*      # Emergency fixes
└── release/*     # Release preparation
```

### **Required Git Hooks**
```bash
# .husky/pre-commit
npm run lint
npm run typecheck
npm run test:unit
npm run build:size-check
```

### **CI/CD Pipeline**
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:unit
      - run: npm run test:e2e:ci
      - run: npm run build
      - run: npm run build:size-check
```

### **Release Checklist**
- [ ] Version bump in package.json
- [ ] CHANGELOG.md updated
- [ ] Migration scripts tested
- [ ] Feature flags configured
- [ ] Performance benchmarks run
- [ ] Security audit passed
- [ ] Accessibility review completed
- [ ] Documentation updated

## 📚 Documentation Standards
```typescript
// Required documentation for each API endpoint
/**
 * @api POST /api/v1/rides
 * @description Creates a new ride record
 * @param {RideInput} body - Ride creation data
 * @returns {Ride} Created ride object
 * @throws {400} Invalid input data
 * @throws {401} Unauthorized
 * @example
 * const ride = await $fetch('/api/v1/rides', {
 *   method: 'POST',
 *   body: { title: 'Morning Ride' }
 * })
 */
```

## 🎨 Global Theme Control System

### **Theme Configuration File**
```typescript
// utils/themes/theme-config.ts
export const THEME_CONFIG = {
  light: {
    name: 'Light',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1E293B',
      textSecondary: '#64748B',
      border: '#E2E8F0',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      mapControls: '#FFFFFF',
      mapControlsText: '#1E293B'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#60A5FA',
      secondary: '#A78BFA',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      border: '#334155',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      mapControls: '#1E293B',
      mapControlsText: '#F1F5F9'
    }
  },
  auto: {
    name: 'Auto',
    colors: {} // Uses system preference
  }
} as const

export type ThemeName = keyof typeof THEME_CONFIG
export type ThemeColors = typeof THEME_CONFIG[ThemeName]['colors']
```

### **Theme Composable**
```typescript
// composables/theme/useTheme.ts
export const useTheme = () => {
  const config = useRuntimeConfig()
  const currentTheme = useState<ThemeName>('current-theme', () => 'light')
  
  const setTheme = (theme: ThemeName) => {
    currentTheme.value = theme
    localStorage.setItem('rider-tracker-theme', theme)
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme)
    
    // Update Amap theme if applicable
    if (theme !== 'auto' && window.AMap) {
      updateMapTheme(theme)
    }
  }
  
  const getThemeColors = computed(() => {
    if (currentTheme.value === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return THEME_CONFIG[prefersDark ? 'dark' : 'light'].colors
    }
    return THEME_CONFIG[currentTheme.value].colors
  })
  
  const initTheme = () => {
    const saved = localStorage.getItem('rider-tracker-theme') as ThemeName
    setTheme(saved || 'light')
  }
  
  return {
    currentTheme: readonly(currentTheme),
    colors: getThemeColors,
    setTheme,
    initTheme
  }
}
```

### **CSS Variables Integration**
```css
/* assets/css/themes.css */
:root[data-theme="light"] {
  --color-primary: #3B82F6;
  --color-secondary: #8B5CF6;
  --color-background: #FFFFFF;
  --color-surface: #F8FAFC;
  --color-text: #1E293B;
  --color-text-secondary: #64748B;
  --color-border: #E2E8F0;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
}

:root[data-theme="dark"] {
  --color-primary: #60A5FA;
  --color-secondary: #A78BFA;
  --color-background: #0F172A;
  --color-surface: #1E293B;
  --color-text: #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-border: #334155;
  --color-success: #34D399;
  --color-warning: #FBBF24;
  --color-error: #F87171;
}

/* Component-specific theme variables */
:root[data-theme="light"] {
  --map-controls-bg: #FFFFFF;
  --map-controls-text: #1E293B;
  --tracking-button-bg: #3B82F6;
  --tracking-button-text: #FFFFFF;
}

:root[data-theme="dark"] {
  --map-controls-bg: #1E293B;
  --map-controls-text: #F1F5F9;
  --tracking-button-bg: #60A5FA;
  --tracking-button-text: #0F172A;
}

```

### **Theme Selector Component**
```typescript
// components/ThemeSelector.vue
<template>
  <div class="theme-selector">
    <button 
      v-for="theme in availableThemes" 
      :key="theme.key"
      @click="setTheme(theme.key)"
      :class="{ active: currentTheme === theme.key }"
      :style="{ backgroundColor: theme.preview }"
    >
      {{ theme.name }}
    </button>
  </div>
</template>

<script setup>
const { currentTheme, setTheme } = useTheme()

const availableThemes = computed(() => 
  Object.entries(THEME_CONFIG).map(([key, config]) => ({
    key,
    name: config.name,
    preview: config.colors.primary
  }))
)
</script>
```

### **Adding New Themes (Developer Only)**
```typescript
// To add a new theme, simply add it to THEME_CONFIG
// utils/themes/theme-config.ts
export const THEME_CONFIG = {
  ...existingThemes,
  sunset: {
    name: 'Sunset',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      background: '#FFF8F0',
      surface: '#FFE8D6',
      text: '#2D1B00',
      textSecondary: '#8B4513',
      border: '#FFB347',
      success: '#32CD32',
      warning: '#FF8C00',
      error: '#DC143C',
      mapControls: '#FFF8F0',
      mapControlsText: '#2D1B00'
    }
  }
} as const
```

### **Theme Persistence**
- **Local storage**: User theme preference saved automatically
- **System sync**: Respects OS dark/light mode when 'auto' selected
- **Amap integration**: Map themes update automatically with app theme
- **Instant preview**: Theme changes apply immediately without reload
- **No build required**: New themes work without recompilation