import { useGlobalMapProvider } from '~/composables/useGlobalMap'

export default defineNuxtPlugin((nuxtApp) => {
  console.log('Initializing global map provider plugin')
  
  // Initialize the global map provider
  const globalMapState = useGlobalMapProvider()
  
  // Return the provider - don't use nuxtApp.provide directly
  return {
    provide: {
      globalMap: globalMapState
    }
  }
}) 