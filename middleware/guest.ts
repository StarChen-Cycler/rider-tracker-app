export default defineNuxtRouteMiddleware(async () => {
  // In development mode, allow access to login page for testing
  if (import.meta.dev) {
    console.log('🔧 Development Mode: Allowing access to login page for testing')
    return
  }

  const { user, loading, initializeAuth } = useAuth()

  console.log('👤 Guest middleware (Production):', {
    hasUser: !!user.value,
    loading: loading.value,
    userEmail: user.value?.email
  })

  // Ensure auth is initialized
  if (!loading.value && !user.value) {
    await initializeAuth()
  }

  // Wait for auth to initialize (with timeout)
  let attempts = 0
  while (loading.value && attempts < 10) {
    console.log('⏳ Guest middleware waiting for auth...', attempts)
    await new Promise(resolve => setTimeout(resolve, 100))
    attempts++
  }

  // If user is authenticated, redirect to home page
  if (user.value) {
    console.log('✅ User is authenticated, redirecting from login to home')
    return navigateTo('/')
  }

  console.log('✅ Guest middleware passed - no authenticated user')
}) 