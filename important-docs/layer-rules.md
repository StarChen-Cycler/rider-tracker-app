## 🏗️ **Architecture Layer - Nuxt 3 Native**
- **File size enforcement**: Composables hard-limited to 200 lines - build fails via ESLint rule
- **Absolute SRP**: Each composable exports exactly one function - useAutoImport composables only
- **API boundary**: UI components use `$fetch('/api/v1/...')` exclusively - direct Supabase client calls forbidden
- **Logic isolation**: Pages contain only `<template>` and `<script setup>` - zero business logic allowed
- **Anti-monolithic**: Single responsibility per file - split immediately when complexity increases
- **Performance budget**: Bundle size <500KB initial - code splitting mandatory via dynamic imports
- **Mobile-first**: Time to Interactive <3s on 3G - SSR required for all map pages

## 📁 **Directory Structure - Nuxt 3 Enforced**
- **Auto-import zones**: Composables in `/composables/**` auto-import without explicit imports
- **Server isolation**: All API routes in `/server/api/v1/**` with `defineEventHandler`
- **Runtime config**: Environment variables via `useRuntimeConfig()` - no process.env in client
- **Asset pipeline**: Static assets in `/public/` or `/assets/` - Webpack/Vite handles optimization
- **Type safety**: All types in `/utils/types/` with strict TypeScript enforcement
- **Shared utilities**: `/utils/` for cross-layer shared code - no business logic duplication
- **Plugin system**: `/plugins/` for Nuxt 3 plugins only - service loader pattern for extensibility

## 🔗 **Database Layer - Memfire PostgreSQL Native**
- **UUID enforcement**: ALL primary keys use `gen_random_uuid()` - no serial/auto-increment
- **RLS activation**: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` mandatory for every table
- **User association**: Every table MUST have `user_id UUID REFERENCES auth.users(id)` column
- **Timestamp trilogy**: `created_at DEFAULT NOW()`, `updated_at` via trigger, `deleted_at` for soft delete
- **Policy naming**: Exact format `"Users can [action] own [table]"` with `auth.uid() = user_id` condition
- **Soft delete pattern**: Use `deleted_at TIMESTAMP` instead of hard deletes - never remove data
- **Audit logging**: All changes logged to `audit_logs` table with JSONB storage of old/new data
- **Index optimization**: Create indexes on foreign keys and frequently queried columns
- **Constraint validation**: CHECK constraints for data integrity - validate ranges and formats
- **Connection pooling**: Use Supabase connection pooling with appropriate limits

## 🔧 **API Layer - Nuxt 3 Nitro Native**
- **Handler pattern**: `defineEventHandler(async (event) => {})` for every endpoint
- **Validation chain**: `getQuery()`/`readBody()` → `zod` schema → `createError()` for 400 responses
- **Auth middleware**: `requireAuth(event)` helper using Supabase JWT from `getHeader(event, 'authorization')`
- **Rate limiting**: `useRateLimit(event, 'endpoint-name')` with Redis-backed sliding window
- **Caching headers**: `setHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate=300')`
- **Error handling**: Standardized error responses with proper HTTP status codes
- **Input sanitization**: Parameterized queries only - prevent SQL injection
- **UUID validation**: Validate UUID format before database operations
- **Performance limits**: API response <200ms - server-side caching required
- **Response compression**: Automatic compression via Nitro for JSON responses

## 📱 **Frontend Layer - Nuxt 3 + Vue 3 Native**
- **Bundle guard**: `nuxt.config.ts` with `build: { maxChunkSize: 500 * 1024 }` - build fails if exceeded
- **Performance budget**: `nuxt.config.ts` with `experimental: { payloadExtraction: false }` for mobile
- **Composables pattern**: `export const useRide = () => { const state = useState('ride-state'); return {state} }`
- **Offline storage**: `useLocalStorage('rides', [])` + `useIndexedDB('route-points')` via `@vueuse/integrations`
- **PWA integration**: `nuxt.config.ts` with `@vite-pwa/nuxt` for offline GPS tracking
- **State management**: Pinia stores for complex global state - useState for component-specific
- **Touch targets**: Minimum 44x44px for all interactive elements
- **Thumb-friendly**: Primary actions within thumb reach on mobile
- **Safe areas**: Respect iOS/Android safe areas with CSS env() variables
- **Loading states**: Skeleton screens for all async operations

## 🧪 **Testing Layer - Nuxt 3 Native**
- **Vitest unit tests**: `tests/unit/composables/*.test.ts` with `nuxt-vitest`
- **API testing**: `tests/api/*.test.ts` with `supertest` against Nitro server
- **E2E Playwright**: `tests/e2e/*.spec.ts` with offline simulation via `context.setOffline(true)`
- **Bundle analysis**: `npm run build` with `nuxt analyze` - fails if >500KB
- **Performance CI**: `lighthouse-ci` in GitHub Actions with 90+ score requirement
- **Test structure**: Unit/Integration/E2E/Performance/Offline/Recovery test categories
- **Coverage requirements**: 80% unit test coverage, 100% API endpoint coverage
- **Test exemptions**: Integration tests may exceed 200 lines, test utilities exempt from restrictions
- **Mock data**: Test fixtures in `tests/fixtures/` - exempt from type checking
- **Performance benchmarks**: Bundle size, load time, and TTI benchmarks

## 🔄 **Agent Communication - Configuration Native**
- **File-based contracts**: JSON configuration files in `/config/[agent]/[feature].json`
- **Schema validation**: `zod` schemas for each configuration file format
- **Version pinning**: Each config file includes `"version": "1.0.0"` for compatibility
- **Merge strategy**: Integration Agent uses deep merge with conflict resolution rules
- **Validation gate**: `npm run validate-config` runs before any agent processes configs
- **Additive configuration**: New features append to existing configurations - no replacements
- **Feature isolation**: Each feature gets its own configuration namespace
- **Backward compatibility**: All new features must maintain compatibility
- **Configuration drift**: Automated validation detects drift via HT-Validation Agent
- **Rollback capability**: Instant reversion to previous stable configuration

## 🔒 **Security Layer - Supabase Auth Native**
- **JWT enforcement**: Supabase auth tokens via `@nuxtjs/supabase` - no custom auth
- **RLS policies**: PostgreSQL policies with `auth.uid()` function - not application-level checks
- **Service role**: `supabaseAdmin` client with `SUPABASE_SERVICE_ROLE_KEY` server-side only
- **Rate limiting**: `supabase_rate_limit` PostgreSQL extension with per-user limits
- **CORS setup**: Supabase dashboard configuration - no manual CORS headers
- **Token refresh**: Automatic token refresh before expiration via Supabase client
- **Session management**: Use Supabase auth session with cleanup on logout
- **Input validation**: Server-side validation before database operations
- **Data encryption**: Location data encrypted at rest with AES-256
- **GDPR compliance**: User data deletion endpoints with audit logging

## 🌐 **i18n Layer - Nuxt i18n Native**
- **Module integration**: `@nuxtjs/i18n` with `locales/` directory auto-loading
- **Runtime config**: `NUXT_PUBLIC_LOCALE` environment variable for build-time optimization
- **RTL support**: `dir="rtl"` auto-detection from locale configuration
- **Date formatting**: `useI18n().d(new Date(), 'short')` with locale-specific formats
- **Asset optimization**: Separate bundles per locale via `lazy: true` configuration
- **Locale detection**: Browser language detection with cookie persistence
- **Pluralization**: Built-in pluralization rules via i18n module
- **Number formatting**: Locale-specific number and currency formatting
- **Asset paths**: Locale-specific assets in `/locales/[locale]/assets/`
- **SEO optimization**: Hreflang tags automatically generated

## 🎨 **Theme Layer - CSS Variables Native**
- **CSS variables**: Theme colors defined as CSS custom properties
- **System sync**: Automatic dark/light mode detection from system preferences
- **Runtime switching**: Instant theme changes without page reload
- **Amap integration**: Map themes update automatically with app theme
- **Persistence**: User preference saved in localStorage
- **No build required**: New themes work without recompilation
- **Accessibility**: High contrast mode support
- **Component variables**: Theme-specific component styling variables
- **Preview mode**: Instant theme preview before saving preference
- **Theme extension**: Easy addition of new themes via configuration

## 📊 **Monitoring Layer - Analytics Native**
- **Performance metrics**: TTI, bundle size, API response times via built-in analytics
- **Error tracking**: GPS failures, API errors with stack traces
- **User engagement**: Feature usage, retention rates, session duration
- **Business metrics**: Route shares, chat engagement, social features usage
- **Real-time dashboards**: Live performance monitoring via Supabase Realtime
- **Alert thresholds**: Automatic alerts for performance degradation
- **Offline analytics**: Queue analytics events when offline, sync when online
- **Privacy compliance**: GDPR-compliant analytics with user consent
- **Custom events**: Track custom business events via composables
- **Performance budgets**: Enforced via CI/CD pipeline with automatic rollback

## 🚀 **Deployment Layer - CI/CD Native**
- **Git workflow**: Feature branches with mandatory PR reviews
- **Pre-commit hooks**: ESLint, type checking, unit tests, bundle size validation
- **CI pipeline**: GitHub Actions with matrix testing across Node.js versions
- **Staging environment**: Automatic deployment to staging on PR creation
- **Production deployment**: Manual approval required with rollback plan
- **Health checks**: Automated health checks post-deployment
- **Feature flags**: Toggle features via runtime configuration
- **Database migrations**: Automated migration deployment with rollback capability
- **Asset optimization**: Automatic image optimization and compression
- **CDN integration**: Static assets served via global CDN

---

## 🔗 **Calling Dependency Chain - Nuxt 3 Native**

### **Layer-to-Layer Calling Dependencies**

```
pages/ (UI Layer)
  ↓ uses $fetch
server/api/v1/ (API Layer)
  ↓ uses supabaseAdmin
utils/supabase-admin.ts (Service Provider)
  ↓ uses @supabase/supabase-js
Memfire PostgreSQL (Backend)

components/ (Reusable UI)
  ↓ uses composables
composables/ (Business Logic)
  ↓ uses utils/types
utils/types/ (TypeScript Definitions)
  ↓ uses zod schemas
utils/validation/ (Schema Validation)

composables/useRide.ts (Example)
  ↓ uses useState
useState('ride-state') (Nuxt 3 State)
  ↓ uses server API
$fetch('/api/v1/rides') (API Call)
  ↓ returns typed data
types/database.ts (Type Safety)

plugins/ (Nuxt 3 Extensions)
  ↓ provides services
composables/services/ (Service Layer)
  ↓ uses runtime config
useRuntimeConfig() (Environment)
  ↓ accesses
NUXT_PUBLIC_* variables (Configuration)

utils/themes/ (Theme System)
  ↓ uses CSS variables
assets/css/themes.css (Styling)
  ↓ applies to
components/ (Visual Components)

stores/ (Pinia State)
  ↓ uses composables
composables/ (Data Fetching)
  ↓ syncs with
IndexedDB/LocalStorage (Offline Storage)
```

### **Enforcement Rules**
- **No direct database calls** from UI layer - must use API routes
- **No business logic** in pages/components - only in composables
- **Type safety** enforced at every boundary with zod schemas
- **Auto-import** for composables - no manual imports needed
- **Single direction** flow: UI → API → Service → Database

---

## 📚 **Professional Terminology & Abbreviations Reference**

### 🏗️ **Architecture Layer Terms**
- **SRP** - Single Responsibility Principle: Each module/class/function should have one reason to change
- **Composable** - Reusable Vue 3 composition functions (similar to React hooks)
- **SSR** - Server-Side Rendering: HTML generated on server for faster initial page loads
- **TTI** - Time to Interactive: How long until page becomes fully interactive
- **Bundle size** - Total JavaScript/CSS assets downloaded by browser
- **Code splitting** - Breaking code into smaller chunks loaded on-demand
- **Auto-import** - Nuxt 3 feature that automatically imports composables without explicit import statements

### 📁 **Directory Structure Terms**
- **Auto-import zones** - Directories where Nuxt automatically imports files
- **Runtime config** - Environment variables accessible via `useRuntimeConfig()` composable
- **Asset pipeline** - Automated processing/optimization of static assets
- **Webpack/Vite** - Build tools that bundle and optimize JavaScript/CSS
- **Type safety** - TypeScript enforcement preventing runtime type errors

### 🔗 **Database Layer Terms**
- **UUID** - Universally Unique Identifier: 128-bit identifier for database records
- **RLS** - Row Level Security: PostgreSQL feature restricting row access per user
- **gen_random_uuid()** - PostgreSQL function generating cryptographically secure UUIDs
- **Soft delete** - Marking records as deleted instead of removing them physically
- **JSONB** - PostgreSQL binary JSON format for storing structured data
- **Index optimization** - Database indexes for faster query performance
- **Connection pooling** - Reusing database connections to reduce overhead

### 🔧 **API Layer Terms**
- **Nitro** - Nuxt 3's server engine powering API routes
- **defineEventHandler** - Nuxt 3 function for creating API endpoints
- **H3Event** - Event object representing HTTP request/response
- **zod** - TypeScript-first schema validation library
- **createError** - Nuxt 3 utility for standardized error responses
- **Rate limiting** - Restricting API requests per user/timeframe
- **Cache-Control** - HTTP headers controlling browser/proxy caching
- **Parameterized queries** - SQL queries preventing injection attacks

### 📱 **Frontend Layer Terms**
- **Vue 3** - Progressive JavaScript framework for building UIs
- **Nuxt 3** - Vue.js meta-framework with SSR, routing, and more
- **Pinia** - Vue 3 state management library (official Vuex replacement)
- **useState** - Nuxt 3 composable for reactive state management
- **PWA** - Progressive Web App: Web app with native app capabilities
- **useLocalStorage** - VueUse composable for browser localStorage
- **useIndexedDB** - VueUse composable for browser IndexedDB
- **Safe areas** - iOS/Android screen areas avoiding system UI
- **Skeleton screens** - Placeholder UI shown during async loading

### 🧪 **Testing Layer Terms**
- **Vitest** - Fast unit testing framework for Vite projects
- **Playwright** - E2E testing framework for web applications
- **Supertest** - HTTP assertion library for testing API endpoints
- **Lighthouse CI** - Automated performance testing in CI/CD
- **Coverage** - Percentage of code executed during tests
- **E2E** - End-to-End: Testing complete user workflows
- **Mock data** - Simulated data for testing purposes

### 🔄 **Agent Communication Terms**
- **zod schemas** - Runtime type validation schemas
- **Version pinning** - Locking dependency versions for stability
- **Deep merge** - Merging nested objects without overwriting
- **Configuration drift** - Gradual deviation from intended configuration
- **Additive configuration** - Appending new features without breaking existing ones
- **Namespace collision** - Multiple features using same configuration keys

### 🔒 **Security Layer Terms**
- **JWT** - JSON Web Token: Secure token for authentication
- **Supabase Auth** - Authentication service built on PostgreSQL
- **Service role key** - Server-only authentication key with elevated permissions
- **AES-256** - Advanced Encryption Standard with 256-bit key
- **GDPR** - General Data Protection Regulation (EU privacy law)
- **Audit logging** - Tracking all data access and modifications
- **Rate limiting** - Restricting API usage to prevent abuse

### 🌐 **i18n Layer Terms**
- **i18n** - Internationalization (18 letters between 'i' and 'n')
- **RTL** - Right-to-Left: Languages like Arabic, Hebrew
- **Locale** - Specific regional language/dialect (e.g., 'en-US', 'zh-CN')
- **Pluralization** - Handling different plural forms per language
- **Hreflang tags** - HTML tags indicating page language/regional targeting
- **Lazy loading** - Loading translation files only when needed

### 🎨 **Theme Layer Terms**
- **CSS variables** - CSS custom properties for dynamic theming
- **CSS custom properties** - Native CSS variables accessible via `var(--name)`
- **System sync** - Automatic theme detection from OS preferences
- **Runtime switching** - Theme changes without page reload
- **High contrast mode** - Accessibility feature for visually impaired users

### 📊 **Monitoring Layer Terms**
- **TTI** - Time to Interactive: Page responsiveness metric
- **Lighthouse** - Google's automated tool for web performance auditing
- **Real-time dashboards** - Live performance monitoring interfaces
- **Performance budgets** - Enforced limits on bundle size, load time, etc.
- **Alert thresholds** - Automated notifications for performance degradation
- **Offline analytics** - Queuing analytics events during network outages

### 🚀 **Deployment Layer Terms**
- **CI/CD** - Continuous Integration/Continuous Deployment
- **GitHub Actions** - GitHub's CI/CD automation platform
- **Pre-commit hooks** - Automated checks run before git commits
- **Feature flags** - Runtime toggles enabling/disabling features
- **Health checks** - Automated endpoint monitoring for service availability
- **Rollback capability** - Instant reversion to previous stable version
- **CDN** - Content Delivery Network: Global asset distribution

---

## 🔧 **Packages & Plugins Explained**

### **Nuxt 3 Core**
- **@nuxtjs/supabase** - Official Nuxt integration for Supabase backend services
- **@nuxtjs/i18n** - Official Nuxt internationalization module
- **@vite-pwa/nuxt** - PWA plugin for service workers and offline functionality
- **@nuxt/devtools** - Development debugging tools for Nuxt applications

### **Testing Stack**
- **Vitest** - Fast Vite-native testing framework (alternative to Jest)
- **Playwright** - Cross-browser E2E testing framework supporting mobile/desktop
- **Supertest** - HTTP assertion library for testing API endpoints
- **Lighthouse CI** - Performance regression testing in CI/CD pipelines
- **bundlesize** - Bundle size monitoring and enforcement

### **Vue Ecosystem**
- **Pinia** - Vue 3 official state management library (replaces Vuex)
- **VueUse** - Collection of Vue 3 composition utilities (@vueuse/core, @vueuse/integrations)
- **zod** - TypeScript-first schema validation for runtime type checking

### **Database & Backend**
- **@supabase/supabase-js** - JavaScript client for Supabase backend services
- **PostgreSQL** - Advanced open-source relational database
- **Redis** - In-memory data store for caching and rate limiting (mentioned in rate limiting)

### **Development Tools**
- **ESLint** - JavaScript/TypeScript linting for code quality
- **TypeScript** - Typed superset of JavaScript for better development experience
- **Webpack/Vite** - Build tools (Webpack: traditional, Vite: modern faster alternative)

### **CSS & Styling**
- **Tailwind CSS** - Utility-first CSS framework (mentioned in frontend templates)
- **CSS env() variables** - Native CSS for handling device safe areas

### **Build & Optimization**
- **bundlesize** - Bundle size monitoring with configurable thresholds
- **lighthouse-ci** - Performance testing integrated into CI/CD
- **workbox** - PWA service worker library (used by @vite-pwa/nuxt)