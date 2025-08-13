export default defineNuxtRouteMiddleware(async (to) => {
  // Skip authentication in development mode
  if (import.meta.dev) {
    console.log('🔧 Development Mode: Skipping auth check for route:', to.path)
    return
  }

  const { user, loading, initializeAuth } = useAuth()

  console.log('🛡️ Auth middleware (Production):', {
    route: to.path,
    hasUser: !!user.value,
    loading: loading.value,
    userEmail: user.value?.email
  })

  // Ensure auth is initialized
  if (!user.value) {
    await initializeAuth()
  }

  // Wait for auth to initialize (with timeout)
  let attempts = 0
  while (loading.value && attempts < 10) {
    console.log('⏳ Waiting for auth initialization...', attempts)
    await new Promise(resolve => setTimeout(resolve, 100))
    attempts++
  }

  // If no user is authenticated, redirect to login
  if (!user.value) {
    console.log('🚫 No authenticated user, redirecting to login')
    
    // Store the intended destination for redirect after login
    const redirect = to.fullPath !== '/login' ? to.fullPath : '/'
    
    return navigateTo({
      path: '/login',
      query: { redirect }
    })
  }

  console.log('✅ Auth middleware passed for user:', user.value.email)
}) 