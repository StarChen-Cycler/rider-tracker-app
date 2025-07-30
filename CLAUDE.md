# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rider Tracker App** is a mobile-first GPS tracking application for cyclists and motorbike riders, built with Nuxt 3 and Amap (高德地图) integration. The app provides real-time GPS tracking, route recording, and ride analytics with a focus on mobile UX and performance.

## Architecture

### Core Stack
- **Frontend**: Nuxt 3 + Vue 3 + TypeScript
- **Styling**: Tailwind CSS + Headless UI
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Maps**: Amap (高德地图) JS API 2.0
- **State**: Vue 3 Composition API via composables
- **Deployment**: HTTPS required for geolocation API access

### Key Directories
```
rider-tracker-app/
├── composables/          # Core business logic (Vue 3 Composition API)
│   ├── useSupabase.ts   # Supabase client and auth
│   ├── useAmap.ts       # Amap map initialization
│   ├── useLocationTracking.ts  # GPS tracking logic
│   ├── useOrientTracking.ts    # Device orientation for compass
│   ├── useGlobalMap.ts  # Global map state management
│   ├── useMapSettings.ts # Map themes and configuration
│   └── useRideRecording.ts # Ride data management and persistence
├── pages/               # File-based routing
├── database/            # Supabase schema and migrations
├── types/               # TypeScript type definitions
└── layouts/             # Mobile-optimized layouts
```

## Environment Setup

### Required Environment Variables
```bash
NUXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NUXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NUXT_PUBLIC_AMAP_KEY=your_amap_api_key
NUXT_PUBLIC_AMAP_SECURITY_KEY=your_amap_security_key
```

### Database Schema
Three main tables with RLS:
- `profiles` - User preferences and settings
- `rides` - Ride metadata and tracking data
- `route_points` - Individual GPS coordinates with timestamps

## Development Commands

### Essential Commands
```bash
pnpm dev                    # Start dev server on https://localhost:3000
pnpm build                  # Build for production
pnpm preview               # Preview production build
pnpm build:prod            # Build with legacy Node.js support
dev:clean                  # Clean build with Node.js deprecation warnings suppressed
```

### Development Workflow
1. **Setup**: `cp .env.example .env` and configure API keys
2. **Database**: Run `/database/schema.sql` in Supabase SQL editor
3. **Development**: `pnpm dev` (HTTPS required for geolocation)
4. **Production**: `pnpm build` then serve via Nginx with HTTPS

## Mobile-First Architecture

### Core Composables
- **useLocationTracking**: Real-time GPS tracking with configurable intervals
- **useOrientTracking**: Device orientation for compass heading
- **useMapSettings**: Map themes (11 Amap themes) and feature toggles
- **useGlobalMap**: Global map state management across components
- **useSupabase**: Supabase client with auth and database operations
- **useAmap**: Amap map initialization and API integration
- **useRideRecording**: Ride data management with local and remote persistence

### Mobile UX Patterns
- Touch targets: Minimum 44px for accessibility
- Bottom navigation for thumb-friendly interaction
- Safe area handling for iOS devices
- Responsive breakpoints: xs(320), sm(640), md(768), lg(1024), xl(1280), xxl(1536)

### Key Features
- **Real-time GPS tracking** with 3-second default interval
- **Device orientation** support for compass heading
- **Map themes**: 11 Amap themes including dark, light, fresh, macaron
- **Route recording** with automatic distance/duration calculation
- **Offline capability** for recording without internet
- **Row Level Security** on all database tables

## Code Patterns

### Composable Architecture
All business logic is encapsulated in composables following Vue 3 patterns:
- Reactive state using `ref` and `reactive`
- Global state management via shared reactive stores
- Event cleanup with `onUnmounted`
- Error handling and permission management

### Type Safety
- Full TypeScript support with Supabase types
- Database schema types in `/types/database.ts`
- Strict type checking for maps, vehicles, and ride status

### Mobile Optimization
- PWA features with manifest.json
- Image optimization with WebP/AVIF formats
- Asset compression and caching
- HTTPS enforcement for geolocation API

## Deployment

### HTTPS Setup (Required)
Geolocation API requires HTTPS in modern browsers. The development server automatically creates HTTPS:

- **Development**: `pnpm dev` serves on https://localhost:3000 with auto-generated SSL certificate
- **Production**: Build with `pnpm build`, then serve via your preferred hosting platform
- **Mobile testing**: Use local network IP with HTTPS - the dev server handles SSL automatically

## Database Operations

### Supabase Integration
All database operations use Supabase client with RLS policies:
- Profiles: User preferences and vehicle type
- Rides: Ride metadata with start/end locations
- Route points: GPS coordinates linked to rides

### Type Usage
```typescript
import type { Ride, RoutePoint, Profile } from '~/types/database'
```

## Testing Considerations

### Mobile Testing
- Test on actual mobile devices for GPS accuracy
- Verify HTTPS access for geolocation
- Test offline recording capabilities
- Check device orientation permissions

### Performance
- Monitor bundle size with mobile networks
- Test on slower devices
- Verify map loading performance
- Check GPS battery usage

## Development Environment Schema

### Development Mode Structure

The application implements a **dual-mode architecture** that provides maximum developer convenience during development while maintaining production security:

```
Development Mode (import.meta.dev = true)
├── 🔓 Authentication Bypassed
├── 🛠️ Development Tools Enabled  
├── 📊 Enhanced Debugging
├── 🎨 Visual Development Indicators
└── 🧪 Testing Utilities

Production Mode (import.meta.dev = false)  
├── 🔒 Full Authentication Required
├── 🚫 Development Tools Disabled
├── 📈 Production Logging
├── 🎯 Clean User Interface
└── 🛡️ Security Enforced
```

### Authentication Development System

#### **Middleware Behavior**
- **`middleware/auth.ts`**: Completely bypasses authentication checks in development
- **`middleware/guest.ts`**: Allows login page access for testing in development
- **Visual Indicators**: Yellow banners and dots indicate when auth is bypassed

#### **Environment Detection**
```javascript
// Modern Nuxt 3 environment detection
const isDev = import.meta.dev
const isClient = import.meta.client

// Used throughout the app for conditional behavior
if (isDev) {
  // Development-only code
  console.log('🔧 Development Mode Active')
}
```

### Development Tools Pages

#### **`/dev-utils` - Primary Developer Dashboard**

**Purpose**: Comprehensive development and testing utilities hub

**Core Features**:
- **Quick Navigation**: Direct links to all pages with icons
- **Environment Monitor**: Real-time config and auth state display
- **Test Actions**: Notification testing, storage management, page reload
- **Console Logger**: In-app log viewer with timestamps
- **Security**: Only accessible in development mode

**Key Functions**:
```javascript
// Test notification system
testNotification() // Displays timed test messages

// Clear application state  
clearLocalStorage() // Resets localStorage and sessionStorage

// Development logging
addLog(message) // Adds timestamped logs to in-app console
```

**When to Modify**:
- **Adding New Pages**: Update quick navigation grid
- **New Test Features**: Add buttons to test actions section
- **Environment Variables**: Add new config checks to environment info
- **Debugging Tools**: Extend console logger with new message types

#### **`/debug-auth` - Authentication Diagnostics**

**Purpose**: Specialized authentication debugging and connection testing

**Core Features**:
- **Configuration Validation**: MemFire Cloud URL and key verification
- **Auth State Monitoring**: Real-time authentication status display
- **Connection Testing**: Direct MemFire Cloud connectivity tests
- **Error Diagnosis**: Detailed error reporting and resolution hints

**Key Functions**:
```javascript
// Test MemFire Cloud connection
testSupabaseConnection() // Validates API connectivity

// Reset authentication state
reinitializeAuth() // Forces auth system restart
```

**When to Modify**:
- **New Auth Methods**: Add testing for phone/WeChat authentication
- **Additional Providers**: Add configuration checks for new services
- **Enhanced Diagnostics**: Add more detailed connection tests
- **Error Handling**: Improve error message clarity and solutions

### Development Indicators System

#### **Visual Development Cues**

```html
<!-- Yellow Development Banner (layouts/default.vue) -->
<div class="bg-yellow-500 text-yellow-900">
  🔧 开发模式 - 已跳过身份验证
</div>

<!-- Development Status Indicators -->
<div class="w-3 h-3 bg-yellow-500 rounded-full" 
     title="Development Mode"></div>
```

#### **Console Logging Standards**

The application uses **emoji-prefixed logging** for easy identification:

```javascript
console.log('🔧 Development Mode: Action description')  // Dev mode actions
console.log('🚀 Initializing: Component/system name')   // Initialization  
console.log('✅ Success: Operation completed')           // Success states
console.log('❌ Error: Problem description')            // Error states
console.log('⏳ Loading: Process description')          // Loading states
console.log('📱 Mobile: Device-specific actions')       // Mobile events
console.log('🔐 Auth: Authentication events')           // Auth operations
```

### Construction Guidance

#### **Adding New Development Tools**

1. **Create Development-Only Components**:
```vue
<template>
  <div v-if="isDev">
    <!-- Development tool UI -->
  </div>
</template>

<script setup>
const isDev = import.meta.dev
</script>
```

2. **Add Navigation Links**:
- Update `/dev-utils` quick navigation grid
- Add appropriate icons and descriptions
- Ensure responsive design for mobile testing

3. **Implement Security Checks**:
```javascript
// Always check development mode
if (!import.meta.dev) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found'
  })
}
```

#### **Extending Authentication Development**

1. **New Authentication Methods**:
- Add test functions to `/debug-auth`
- Include configuration validation
- Create mock user states for testing
- Add visual indicators for new auth states

2. **Enhanced Debugging**:
- Extend console logging with new auth events
- Add more detailed error diagnostics  
- Include connection quality metrics
- Implement auth flow visualization

#### **Development Environment Variables**

```bash
# Essential Development Configuration
NUXT_PUBLIC_MEMFIRE_URL=your_memfire_url
NUXT_PUBLIC_MEMFIRE_ANON_KEY=your_memfire_key

# Optional Development Settings  
NUXT_DEV_SSL_CERT=path_to_cert    # For HTTPS development
NUXT_DEV_LOG_LEVEL=debug          # Enhanced logging
NUXT_DEV_MOCK_AUTH=true           # Mock authentication responses
```

### Future Development Guidelines

#### **When Adding New Features**

1. **Always Consider Development Mode**:
   - Will this feature need testing tools?
   - Should this be accessible without authentication in dev?
   - Does this need visual debugging indicators?

2. **Update Development Tools**:
   - Add relevant links to `/dev-utils` navigation
   - Create specific debugging tools in `/debug-auth` if auth-related
   - Include appropriate logging throughout the feature

3. **Maintain Security Boundaries**:
   - Ensure production builds exclude development code
   - Test that development tools are inaccessible in production
   - Verify authentication still works correctly in production

#### **Testing Development Environment**

```bash
# Test Development Mode
pnpm dev
# ✅ Check yellow development indicators
# ✅ Verify all pages accessible without login  
# ✅ Test development tools functionality

# Test Production Mode
pnpm build && pnpm start
# ✅ Confirm authentication required
# ✅ Verify no development indicators visible
# ✅ Test development tools are blocked
```

### Development Tools Maintenance

#### **Regular Updates Required**

1. **Environment Configuration**:
   - Add new runtime config checks
   - Update connection testing for new services
   - Include new dependency versions

2. **Navigation Updates**:
   - Add new pages to quick navigation
   - Update page descriptions and icons
   - Maintain mobile-responsive design

3. **Logging Enhancements**:
   - Add new log categories for new features
   - Improve log formatting and filtering
   - Include performance metrics

#### **Best Practices**

- **Keep Development Tools Simple**: Focus on essential debugging features
- **Use Consistent Visual Language**: Maintain yellow theme for dev indicators
- **Provide Clear Documentation**: Each tool should explain its purpose
- **Test Across Devices**: Ensure mobile compatibility for development tools
- **Security First**: Never expose sensitive data in development tools

This development schema ensures efficient development workflow while maintaining production security and code quality.