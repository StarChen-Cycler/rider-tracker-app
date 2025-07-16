// Global middleware to set the default layout to map-layout
export default defineNuxtRouteMiddleware((to) => {
  // Skip setting layout if the page already has one defined
  if (to.meta.layout === undefined) {
    to.meta.layout = 'map-layout'
  }
}) 