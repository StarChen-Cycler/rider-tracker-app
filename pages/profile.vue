<template>
  <div class="page-container">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 safe-area-top">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center">
          <Icon name="heroicons:user-circle" class="w-6 h-6 text-primary-600 mr-2" />
          <h1 class="text-lg font-semibold text-gray-900">Profile</h1>
        </div>
        <div class="flex items-center space-x-2">
          <button
            class="p-2 rounded-lg hover:bg-gray-100"
            @click="showSettings = !showSettings"
          >
            <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>

    <!-- Scrollable Content Area -->
    <div class="content-scrollable">
      <!-- Profile Section -->
      <div class="bg-white border-b border-gray-200 p-6">
        <div class="flex items-center space-x-4">
          <!-- Avatar -->
          <div class="relative">
            <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="heroicons:user" class="w-10 h-10 text-primary-600" />
            </div>
            <button
              class="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center"
              @click="editAvatar"
            >
              <Icon name="heroicons:camera" class="w-3 h-3 text-white" />
            </button>
          </div>

          <!-- User Info -->
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-gray-900">{{ profile.displayName || 'Anonymous Rider' }}</h2>
            <p class="text-sm text-gray-600">{{ profile.email || 'No email' }}</p>
            <p class="text-xs text-gray-500 mt-1">
              Member since {{ formatDate(profile.createdAt || new Date()) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="bg-white border-b border-gray-200 p-4">
        <h3 class="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-lg font-semibold text-gray-900">{{ stats.totalRides }}</div>
            <div class="text-xs text-gray-500">Total Rides</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-lg font-semibold text-gray-900">{{ formatDistance(stats.totalDistance) }}</div>
            <div class="text-xs text-gray-500">Total Distance</div>
          </div>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="space-y-1 p-4">
        <!-- Account Settings -->
        <div class="bg-white rounded-lg overflow-hidden">
          <button
            class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            @click="editProfile"
          >
            <div class="flex items-center">
              <Icon name="heroicons:user-circle" class="w-5 h-5 text-gray-600 mr-3" />
              <div class="text-left">
                <div class="text-sm font-medium text-gray-900">Edit Profile</div>
                <div class="text-xs text-gray-500">Update your personal information</div>
              </div>
            </div>
            <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400" />
          </button>

          <div class="border-t border-gray-100">
            <button
              class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              @click="managePreferences"
            >
              <div class="flex items-center">
                <Icon name="heroicons:adjustments-horizontal" class="w-5 h-5 text-gray-600 mr-3" />
                <div class="text-left">
                  <div class="text-sm font-medium text-gray-900">Preferences</div>
                  <div class="text-xs text-gray-500">Vehicle type, units, notifications</div>
                </div>
              </div>
              <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div class="border-t border-gray-100">
            <button
              class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              @click="managePrivacy"
            >
              <div class="flex items-center">
                <Icon name="heroicons:shield-check" class="w-5 h-5 text-gray-600 mr-3" />
                <div class="text-left">
                  <div class="text-sm font-medium text-gray-900">Privacy & Security</div>
                  <div class="text-xs text-gray-500">Control your data and privacy</div>
                </div>
              </div>
              <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- App Settings -->
        <div class="bg-white rounded-lg overflow-hidden mt-4">
          <button
            class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            @click="exportData"
          >
            <div class="flex items-center">
              <Icon name="heroicons:arrow-down-tray" class="w-5 h-5 text-gray-600 mr-3" />
              <div class="text-left">
                <div class="text-sm font-medium text-gray-900">Export Data</div>
                <div class="text-xs text-gray-500">Download your ride data</div>
              </div>
            </div>
            <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400" />
          </button>

          <div class="border-t border-gray-100">
            <button
              class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              @click="showHelp"
            >
              <div class="flex items-center">
                <Icon name="heroicons:question-mark-circle" class="w-5 h-5 text-gray-600 mr-3" />
                <div class="text-left">
                  <div class="text-sm font-medium text-gray-900">Help & Support</div>
                  <div class="text-xs text-gray-500">Get help and contact support</div>
                </div>
              </div>
              <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div class="border-t border-gray-100">
            <button
              class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              @click="showAbout"
            >
              <div class="flex items-center">
                <Icon name="heroicons:information-circle" class="w-5 h-5 text-gray-600 mr-3" />
                <div class="text-left">
                  <div class="text-sm font-medium text-gray-900">About</div>
                  <div class="text-xs text-gray-500">App version and information</div>
                </div>
              </div>
              <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- Auth Actions -->
        <div class="bg-white rounded-lg overflow-hidden mt-4">
          <button
            v-if="!isSignedIn"
            class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            @click="signIn"
          >
            <div class="flex items-center">
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5 text-primary-600 mr-3" />
              <div class="text-left">
                <div class="text-sm font-medium text-primary-600">Sign In</div>
                <div class="text-xs text-gray-500">Access your account and sync data</div>
              </div>
            </div>
            <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400" />
          </button>

          <button
            v-else
            class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            @click="signOut"
          >
            <div class="flex items-center">
              <Icon name="heroicons:arrow-left-on-rectangle" class="w-5 h-5 text-red-600 mr-3" />
              <div class="text-left">
                <div class="text-sm font-medium text-red-600">Sign Out</div>
                <div class="text-xs text-gray-500">Sign out of your account</div>
              </div>
            </div>
            <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <!-- App Version -->
      <div class="p-4 text-center">
        <p class="text-xs text-gray-500">
          Rider Tracker v{{ appVersion }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatDate, formatDistance } from '~/utils/formatters'
import { APP_CONFIG } from '~/utils/constants'

// Page meta with auth middleware
definePageMeta({
  middleware: 'auth'
})

// Meta
useHead({
  title: 'Profile - Rider Tracker'
})

// Reactive data
const showSettings = ref(false)
const isSignedIn = ref(false)
const profile = ref({
  displayName: '',
  email: '',
  avatarUrl: '',
  createdAt: new Date(),
  preferredVehicle: 'bicycle'
})

const stats = ref({
  totalRides: 0,
  totalDistance: 0,
  totalDuration: 0
})

// Computed
const appVersion = computed(() => APP_CONFIG.version)

// Methods
const editProfile = () => {
  console.log('Edit profile')
  // Navigate to profile edit page or show modal
}

const editAvatar = () => {
  console.log('Edit avatar')
  // Open image picker
}

const managePreferences = () => {
  console.log('Manage preferences')
  // Navigate to preferences page
}

const managePrivacy = () => {
  console.log('Manage privacy')
  // Navigate to privacy settings page
}

const exportData = () => {
  console.log('Export data')
  // Export user data as JSON/CSV
}

const showHelp = () => {
  console.log('Show help')
  // Navigate to help page or external URL
}

const showAbout = () => {
  console.log('Show about')
  // Show about modal or page
}

const signIn = () => {
  console.log('Sign in')
  // Navigate to sign in page or show modal
}

const signOut = async () => {
  try {
    const { signOut: authSignOut } = useAuth()
    await authSignOut()
    await navigateTo('/login')
  } catch (error) {
    console.error('Sign out error:', error)
  }
}

const loadProfile = async () => {
  try {
    // Load profile data
    // In real app, this would come from Supabase
    profile.value = {
      displayName: 'Demo User',
      email: 'demo@example.com',
      avatarUrl: '',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      preferredVehicle: 'bicycle'
    }

    stats.value = {
      totalRides: 12,
      totalDistance: 145000, // 145km
      totalDuration: 18000000 // 5 hours
    }

    isSignedIn.value = true
  } catch (error) {
    console.error('Failed to load profile:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.page-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.content-scrollable {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #f9fafb; /* Light gray background */
}

button {
  transition: background-color 0.2s;
}
</style> 