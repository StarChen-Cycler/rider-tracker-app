<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Development Mode Banner -->
    <div 
      v-if="isDev" 
      class="bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium"
    >
      <div class="flex items-center justify-center gap-2">
        <Icon name="heroicons:wrench-screwdriver" class="w-4 h-4" />
        <span>开发模式 - 已跳过身份验证</span>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 relative">
      <slot />
    </main>

    <!-- Mobile Navigation -->
    <nav class="mobile-nav ">
      <div class="flex items-center justify-around py-2 px-4">
        <NuxtLink
          to="/"
          class="flex flex-col items-center p-2 rounded-lg transition-colors"
          :class="{ 'text-primary-600 bg-primary-50': $route.path === '/' }"
        >
          <Icon name="heroicons:home" class="w-6 h-6" />
          <span class="text-xs mt-1">Home</span>
        </NuxtLink>
        
        <NuxtLink
          to="/track"
          class="flex flex-col items-center p-2 rounded-lg transition-colors"
          :class="{ 'text-primary-600 bg-primary-50': $route.path === '/track' }"
        >
          <Icon name="heroicons:play-circle" class="w-6 h-6" />
          <span class="text-xs mt-1">Track</span>
        </NuxtLink>
        
        <NuxtLink
          to="/rides"
          class="flex flex-col items-center p-2 rounded-lg transition-colors"
          :class="{ 'text-primary-600 bg-primary-50': $route.path === '/rides' }"
        >
          <Icon name="heroicons:map" class="w-6 h-6" />
          <span class="text-xs mt-1">Rides</span>
        </NuxtLink>
        
        <div class="relative">
          <NuxtLink
            to="/profile"
            class="flex flex-col items-center p-2 rounded-lg transition-colors"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === '/profile' }"
          >
            <Icon name="heroicons:user-circle" class="w-6 h-6" />
            <span class="text-xs mt-1">Profile</span>
          </NuxtLink>
          
          <!-- Auth status indicator (only show in production) -->
          <div 
            v-if="user && !isDev"
            class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
            title="Authenticated"
          ></div>
          
          <!-- Development mode indicator -->
          <div 
            v-if="isDev"
            class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white"
            title="Development Mode"
          ></div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useSupabase'

// Get auth state
const { user } = useAuth()

// Check if in development mode
const isDev = import.meta.dev

// Add padding bottom to account for mobile navigation
useHead({
  bodyAttrs: {
    class: 'pb-16' // Height of mobile navigation
  }
})
</script>

<style scoped>
/* Additional mobile-specific styles */
.mobile-nav {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
}

@supports (backdrop-filter: blur(10px)) {
  .mobile-nav {
    background-color: rgba(255, 255, 255, 0.8);
  }
}
</style> 