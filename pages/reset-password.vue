<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 safe-area-top safe-area-bottom">
    <!-- Reset Password Card -->
    <div class="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-6 w-full max-w-md">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
          <Icon name="heroicons:key" class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Reset Password</h1>
        <p class="text-gray-600 mt-2">Enter your new password</p>
      </div>

      <!-- Error Message -->
      <div 
        v-if="error" 
        class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg"
      >
        <div class="flex items-center">
          <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-red-500 mr-2" />
          <span class="text-sm text-red-700">{{ error }}</span>
        </div>
      </div>

      <!-- Success Message -->
      <div 
        v-if="success" 
        class="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg"
      >
        <div class="flex items-center">
          <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2" />
          <span class="text-sm text-green-700">{{ success }}</span>
        </div>
      </div>

      <!-- Reset Form -->
      <form v-if="!success" @submit.prevent="handleResetPassword">
        <!-- New Password Input -->
        <div class="mb-4">
          <label class="form-label" for="password">New Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Enter your new password"
            required
            :disabled="loading"
            minlength="6"
          />
        </div>

        <!-- Confirm Password Input -->
        <div class="mb-6">
          <label class="form-label" for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="form-input"
            placeholder="Confirm your new password"
            required
            :disabled="loading"
            minlength="6"
          />
        </div>

        <!-- Submit Button -->
        <AppButton
          :loading="loading"
          type="submit"
          variant="primary"
          size="lg"
          full-width
          class="mb-4"
        >
          Update Password
        </AppButton>
      </form>

      <!-- Success Actions -->
      <div v-else class="text-center">
        <AppButton
          variant="primary"
          size="lg"
          full-width
          @click="$router.push('/login')"
        >
          Go to Login
        </AppButton>
      </div>

      <!-- Back to Login -->
      <div class="text-center">
        <NuxtLink 
          to="/login" 
          class="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

// Set page layout
definePageMeta({
  layout: false
})

// Page meta
useHead({
  title: 'Reset Password - Rider Tracker',
  meta: [
    { name: 'description', content: 'Reset your Rider Tracker account password' }
  ]
})

// Supabase client
const { supabase } = useSupabase()

// Form state
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

// Handle password reset
const handleResetPassword = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: password.value
    })

    if (updateError) throw updateError

    success.value = 'Password updated successfully! You can now log in with your new password.'
    
    // Clear form
    password.value = ''
    confirmPassword.value = ''
  } catch (err) {
    console.error('Password reset error:', err)
    error.value = err.message || 'Failed to update password'
  } finally {
    loading.value = false
  }
}

// Check if user has valid reset session on mount
onMounted(() => {
  // The reset token is handled automatically by Supabase
  // when the user clicks the reset link in their email
})
</script>

<style scoped>
/* Ensure full height on mobile */
@media (max-height: 640px) {
  .min-h-screen {
    min-height: 100vh;
    min-height: 100svh;
  }
}

/* Custom focus styles for better mobile UX */
input:focus {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

/* Improve touch targets on mobile */
button, input {
  touch-action: manipulation;
}
</style> 