<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Main Content Area -->
    <main class="flex-1 relative">
      <slot />
    </main>

    <!-- Mobile Navigation -->
    <nav class="mobile-nav">
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
        
        <NuxtLink
          to="/profile"
          class="flex flex-col items-center p-2 rounded-lg transition-colors"
          :class="{ 'text-primary-600 bg-primary-50': $route.path === '/profile' }"
        >
          <Icon name="heroicons:user-circle" class="w-6 h-6" />
          <span class="text-xs mt-1">Profile</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
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