// Plugin to set map layout as the default layout
export default defineNuxtPlugin((nuxtApp) => {
  // Set the default layout to map-layout
  nuxtApp.hook('app:mounted', () => {
    // This will be executed when the app is mounted
    console.log('Map layout plugin initialized')
  })
}) 