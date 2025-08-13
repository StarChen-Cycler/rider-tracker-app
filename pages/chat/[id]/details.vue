<template>
  <div class="page-container">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 safe-area-top sticky top-0 z-10">
      <div class="flex items-center px-4 py-3">
        <button
          class="p-2 rounded-full hover:bg-gray-100 transition-colors mr-3"
          @click="navigateBack"
        >
          <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600" />
        </button>
        
        <div class="flex items-center flex-1 min-w-0">
          <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
            <Icon
              :name="getActivityIcon(activity?.type || '')"
              class="w-6 h-6 text-primary-600"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="font-bold text-gray-900 truncate">Activity Details</h1>
            <p class="text-xs text-gray-500">{{ activity?.title || 'Loading...' }}</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Scrollable Content -->
    <div class="content-scrollable">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <div class="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600">Loading activity details...</p>
      </div>

      <!-- Activity Details -->
      <div v-else-if="activity" class="space-y-6 p-4">
        <!-- Activity Header -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-start">
            <div class="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
              <Icon
                :name="getActivityIcon(activity.type)"
                class="w-8 h-8 text-primary-600"
              />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ activity.title }}</h2>
              <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                  {{ activity.type }}
                </span>
                <span class="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {{ activity.date }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Stats -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Activity Stats</h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600">{{ activity.distance }}</div>
              <div class="text-sm text-gray-500 mt-1">Distance</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600">{{ activity.duration }}</div>
              <div class="text-sm text-gray-500 mt-1">Duration</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600">{{ activity.pace }}</div>
              <div class="text-sm text-gray-500 mt-1">Avg Pace</div>
            </div>
          </div>
        </div>

        <!-- Route Information -->
        <div v-if="activity.route" class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Route</h3>
          <div class="space-y-3">
            <div class="flex items-center">
              <Icon name="heroicons:map-pin" class="w-5 h-5 text-green-500 mr-2" />
              <span class="text-sm text-gray-700"><strong>Start:</strong> {{ activity.route.start }}</span>
            </div>
            <div class="flex items-center">
              <Icon name="heroicons:flag" class="w-5 h-5 text-red-500 mr-2" />
              <span class="text-sm text-gray-700"><strong>End:</strong> {{ activity.route.end }}</span>
            </div>
            <div v-if="activity.route.waypoints && activity.route.waypoints.length" class="flex items-start">
              <Icon name="heroicons:location-marker" class="w-5 h-5 text-orange-500 mr-2 mt-0.5" />
              <div>
                <span class="text-sm text-gray-700"><strong>Waypoints:</strong></span>
                <ul class="mt-1 space-y-1">
                  <li v-for="(waypoint, index) in activity.route.waypoints" :key="index" class="text-sm text-gray-600 ml-4">
                    • {{ waypoint }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="activity.description" class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Description</h3>
          <p class="text-sm text-gray-700 leading-relaxed">{{ activity.description }}</p>
        </div>

        <!-- Participants -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Participants ({{ participants.length }})</h3>
            <button
              v-if="canInvite"
              @click="showInviteModal = true"
              class="text-sm bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Invite Users
            </button>
          </div>
          
          <div v-if="loadingParticipants" class="flex items-center justify-center py-8">
            <div class="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
          
          <div v-else-if="participants.length === 0" class="text-center py-8 text-gray-500">
            No participants yet
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="participant in participants"
              :key="participant.userId"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <div class="relative">
                  <div class="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center mr-3">
                    <span class="text-sm font-bold text-primary-800">
                      {{ participant.userName.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div 
                    v-if="participant.isOnline" 
                    class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  ></div>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <div class="font-medium text-gray-900">{{ participant.userName }}</div>
                    <span 
                      v-if="participant.role === 'owner'"
                      class="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium"
                    >
                      Owner
                    </span>
                    <span 
                      v-else-if="participant.role === 'admin'"
                      class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium"
                    >
                      Admin
                    </span>
                    <span 
                      v-if="participant.status === 'pending'"
                      class="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium"
                    >
                      Pending
                    </span>
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ participant.status === 'pending' ? 'Invitation sent' : 'Active member' }}
                    <span v-if="!participant.isOnline && participant.lastSeen">
                      • Last seen {{ formatLastSeen(participant.lastSeen) }}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                v-if="canRemoveParticipant(participant)"
                @click="confirmRemoveParticipant(participant)"
                class="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            @click="enterChat(activity)"
            class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
          >
            <Icon name="heroicons:chat-bubble-left-right" class="w-5 h-5 mr-2" />
            Enter Chatroom
          </button>
          
          <button
            @click="navigateBack"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-xl transition-colors duration-200"
          >
            Back to Activities
          </button>
        </div>
      </div>

      <!-- Invite User Modal -->
      <div v-if="showInviteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Invite User</h3>
            <button
              @click="showInviteModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon name="heroicons:x-mark" class="w-6 h-6" />
            </button>
          </div>
          
          <form @submit.prevent="inviteUser">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  v-model="inviteEmail"
                  type="email"
                  required
                  placeholder="user@example.com"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  v-model="inviteRole"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div class="flex gap-3 mt-6">
              <button
                type="button"
                @click="showInviteModal = false"
                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="inviting || !inviteEmail"
                class="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {{ inviting ? 'Sending...' : 'Send Invitation' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Remove Participant Modal -->
      <div v-if="showRemoveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <div class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-600" />
            </div>
            
            <h3 class="text-lg font-bold text-gray-900 mb-2">Remove Participant</h3>
            <p class="text-gray-600 mb-4">
              Are you sure you want to remove <strong>{{ participantToRemove?.userName }}</strong> from this activity?
              They will no longer be able to participate in the chat or access activity details.
            </p>
            
            <div class="flex gap-3">
              <button
                type="button"
                @click="showRemoveModal = false"
                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                :disabled="removing"
                @click="removeParticipant"
                class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {{ removing ? 'Removing...' : 'Remove' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && !activity" class="flex flex-col items-center justify-center py-12">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Icon name="heroicons:exclamation-triangle" class="w-10 h-10 text-red-600" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Activity not found</h3>
        <p class="text-gray-600 mb-6">The activity you're looking for doesn't exist.</p>
        <button
          @click="navigateBack"
          class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Back to Activities
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatActivity, ChatParticipant, ActivityParticipantsResponse } from '~/types/chat'

// Page meta
definePageMeta({
  middleware: 'auth'
})

// Route params
const route = useRoute()
const activityId = computed(() => {
  const id = route.params.id
  console.log('Route params:', route.params)
  return Array.isArray(id) ? id[0] : id
})

// Composables
const { getActivityIcon, navigateBack, enterChat } = useChatNavigation()

// State
const activity = ref<ChatActivity | null>(null)
const loading = ref(false)
const participants = ref<ChatParticipant[]>([])
const loadingParticipants = ref(false)
const showInviteModal = ref(false)
const showRemoveModal = ref(false)
const participantToRemove = ref<ChatParticipant | null>(null)
const inviteEmail = ref('')
const inviteRole = ref<'member' | 'admin'>('member')
const inviting = ref(false)
const removing = ref(false)

// Computed
const canInvite = computed(() => {
  return activity.value?.permissions?.includes('invite_members') ?? false
})

const canRemove = computed(() => {
  return activity.value?.permissions?.includes('remove_members') ?? false
})

// Methods
const fetchActivityDetails = async () => {
  if (!activityId.value) return
  
  loading.value = true
  try {
    const response = await $fetch(`/api/v1/chat/activities/${activityId.value}`)
    activity.value = response as ChatActivity
  } catch (error) {
    console.error('Failed to fetch activity details:', error)
    activity.value = null
  } finally {
    loading.value = false
  }
}

const fetchParticipants = async () => {
  if (!activityId.value) return
  
  loadingParticipants.value = true
  try {
    const response = await $fetch<ActivityParticipantsResponse>(`/api/v1/chat/activities/${activityId.value}/participants`)
    participants.value = response.participants
  } catch (error) {
    console.error('Failed to fetch participants:', error)
    participants.value = []
  } finally {
    loadingParticipants.value = false
  }
}

const canRemoveParticipant = (participant: ChatParticipant) => {
  if (!canRemove.value) return false
  if (participant.role === 'owner') return false
  if (activity.value?.role === 'admin' && participant.role === 'admin') return false
  return true
}

const formatLastSeen = (lastSeen: string) => {
  const date = new Date(lastSeen)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

const confirmRemoveParticipant = (participant: ChatParticipant) => {
  participantToRemove.value = participant
  showRemoveModal.value = true
}

const inviteUser = async () => {
  if (!inviteEmail.value || !activityId.value) return
  
  inviting.value = true
  try {
    await $fetch(`/api/v1/chat/activities/${activityId.value}/invite`, {
      method: 'POST',
      body: {
        email: inviteEmail.value,
        role: inviteRole.value
      }
    })
    
    // Refresh participants list
    await fetchParticipants()
    
    // Reset form
    inviteEmail.value = ''
    inviteRole.value = 'member'
    showInviteModal.value = false
    
    // Show success message
    // TODO: Add toast notification
  } catch (error) {
    console.error('Failed to invite user:', error)
    // TODO: Show error message
  } finally {
    inviting.value = false
  }
}

const removeParticipant = async () => {
  if (!participantToRemove.value || !activityId.value) return
  
  removing.value = true
  try {
    await $fetch(`/api/v1/chat/activities/${activityId.value}/participants/${participantToRemove.value.userId}`, {
      method: 'DELETE'
    })
    
    // Refresh participants list
    await fetchParticipants()
    
    // Reset form
    showRemoveModal.value = false
    participantToRemove.value = null
    
    // Show success message
    // TODO: Add toast notification
  } catch (error) {
    console.error('Failed to remove participant:', error)
    // TODO: Show error message
  } finally {
    removing.value = false
  }
}

// Lifecycle
onMounted(() => {
  console.log('🔍 CHAT DETAILS ROUTE MOUNTED')
  console.log('📍 Route params:', route.params)
  console.log('🆔 Activity ID:', activityId.value)
  fetchActivityDetails()
  fetchParticipants()
})

// Meta
useHead({
  title: computed(() => `${activity.value?.title || 'Activity'} Details - Rider Tracker`)
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
}
</style>