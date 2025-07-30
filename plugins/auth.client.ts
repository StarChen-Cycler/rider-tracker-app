export default defineNuxtPlugin(async () => {
  const { initializeAuth } = useAuth()
  
  // Initialize auth on app start
  await initializeAuth()
}) 