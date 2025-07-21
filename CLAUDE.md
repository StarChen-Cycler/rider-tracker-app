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
│   └── useMapSettings.ts # Map themes and configuration
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