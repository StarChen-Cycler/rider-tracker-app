<template>
  <div class="min-h-screen bg-gray-50 p-4 safe-area-top safe-area-bottom">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Auth Debug Information</h1>
      
      <!-- Environment Configuration -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Environment Configuration</h2>
        <div class="space-y-2 font-mono text-sm">
          <div class="flex items-center">
            <span class="w-4 h-4 rounded-full mr-3" :class="envStatus.url.status ? 'bg-green-500' : 'bg-red-500'"></span>
            <span class="font-medium">MemFire URL:</span>
            <span class="ml-2 text-gray-600">{{ envStatus.url.value || 'Not configured' }}</span>
          </div>
          <div class="flex items-center">
            <span class="w-4 h-4 rounded-full mr-3" :class="envStatus.key.status ? 'bg-green-500' : 'bg-red-500'"></span>
            <span class="font-medium">MemFire Key:</span>
            <span class="ml-2 text-gray-600">{{ envStatus.key.status ? `Configured (${envStatus.key.length} chars)` : 'Not configured' }}</span>
          </div>
        </div>
      </div>

      <!-- Auth State -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Authentication State</h2>
        <div class="space-y-3">
          <div class="flex items-center">
            <span class="w-4 h-4 rounded-full mr-3" :class="authState.initialized ? 'bg-green-500' : 'bg-yellow-500'"></span>
            <span class="font-medium">Initialized:</span>
            <span class="ml-2 text-gray-600">{{ authState.initialized ? 'Yes' : 'No' }}</span>
          </div>
          <div class="flex items-center">
            <span class="w-4 h-4 rounded-full mr-3" :class="authState.loading ? 'bg-yellow-500' : 'bg-green-500'"></span>
            <span class="font-medium">Loading:</span>
            <span class="ml-2 text-gray-600">{{ authState.loading ? 'Yes' : 'No' }}</span>
          </div>
          <div class="flex items-center">
            <span class="w-4 h-4 rounded-full mr-3" :class="authState.hasUser ? 'bg-green-500' : 'bg-gray-400'"></span>
            <span class="font-medium">User:</span>
            <span class="ml-2 text-gray-600">{{ authState.userEmail || 'Not signed in' }}</span>
          </div>
          <div v-if="authState.error" class="flex items-start">
            <span class="w-4 h-4 rounded-full mr-3 bg-red-500 mt-1"></span>
            <div>
              <span class="font-medium">Error:</span>
              <div class="ml-2 text-red-600 text-sm bg-red-50 p-2 rounded mt-1">{{ authState.error }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Test Actions -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Test Actions</h2>
        <div class="space-y-3">
          <button
            @click="testSupabaseConnection"
            :disabled="testLoading"
            class="btn-primary w-full"
          >
            {{ testLoading ? 'Testing...' : 'Test MemFire Connection' }}
          </button>
          
          <button
            @click="reinitializeAuth"
            :disabled="testLoading"
            class="btn-secondary w-full"
          >
            Reinitialize Authentication
          </button>
          
          <div v-if="testResult" class="p-3 rounded-lg" :class="testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
            <div class="font-medium">{{ testResult.success ? 'Success' : 'Error' }}</div>
            <div class="text-sm mt-1">{{ testResult.message }}</div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex gap-3">
        <NuxtLink to="/login" class="btn-primary flex-1 text-center">
          Go to Login
        </NuxtLink>
        <NuxtLink to="/" class="btn-secondary flex-1 text-center">
          Go to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuth, useSupabase } from '~/composables/useSupabase'

// Page meta
definePageMeta({
  layout: false
})

useHead({
  title: 'Auth Debug - Rider Tracker'
})

const config = useRuntimeConfig()
const { user, loading, error, initializeAuth } = useAuth()
const { supabase } = useSupabase()

// Environment status
const envStatus = computed(() => ({
  url: {
    value: config.public.memfireUrl || config.public.supabaseUrl,
    status: !!(config.public.memfireUrl || config.public.supabaseUrl)
  },
  key: {
    length: (config.public.memfireAnonKey || config.public.supabaseAnonKey)?.length || 0,
    status: !!(config.public.memfireAnonKey || config.public.supabaseAnonKey)
  }
}))

// Auth state
const authState = computed(() => ({
  initialized: !loading.value,
  loading: loading.value,
  hasUser: !!user.value,
  userEmail: user.value?.email,
  error: error.value
}))

// Test functionality
const testLoading = ref(false)
const testResult = ref(null)

const testSupabaseConnection = async () => {
  testLoading.value = true
  testResult.value = null
  
  try {
    // Test basic connection
    const { data, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`)
    }
    
    testResult.value = {
      success: true,
      message: `Connection successful! Session: ${data.session ? 'Active' : 'None'}`
    }
  } catch (err) {
    testResult.value = {
      success: false,
      message: err.message || 'Unknown connection error'
    }
  } finally {
    testLoading.value = false
  }
}

const reinitializeAuth = async () => {
  testLoading.value = true
  testResult.value = null
  
  try {
    await initializeAuth()
    testResult.value = {
      success: true,
      message: 'Auth reinitialized successfully'
    }
  } catch (err) {
    testResult.value = {
      success: false,
      message: err.message || 'Failed to reinitialize auth'
    }
  } finally {
    testLoading.value = false
  }
}
</script> 