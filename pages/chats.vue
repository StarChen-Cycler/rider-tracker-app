<template>
  <div class="page-container">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 safe-area-top sticky top-0 z-10">
      <div class="flex items-center justify-between px-4 py-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
            <Icon name="heroicons:chat-bubble-left-right" class="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">Group Chat</h1>
            <p class="text-xs text-gray-500">{{ filteredActivities.length }} active conversations</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            @click="isSearchVisible = !isSearchVisible"
          >
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-600" />
          </button>
          <button
            class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            @click="refreshActivities"
          >
            <Icon name="heroicons:arrow-path" class="w-5 h-5 text-gray-600" :class="{ 'animate-spin': refreshing }" />
          </button>
        </div>
      </div>
      
      <!-- Search Bar -->
      <div v-if="isSearchVisible" class="px-4 pb-4 transition-all duration-300 ease-in-out">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search conversations..."
            class="form-input w-full py-3 px-4 pl-12 text-base rounded-xl shadow-sm"
          />
          <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
          <button 
            v-if="searchQuery" 
            @click="clearSearch"
            class="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          >
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>

    <!-- Scrollable Content Area -->
    <div class="content-scrollable">
      <!-- Activities List -->
      <div class="space-y-4 p-4">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12">
          <div class="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600">Loading conversations...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredActivities.length === 0" class="py-12">
          <div class="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md mx-auto">
            <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="heroicons:chat-bubble-left-right" class="w-10 h-10 text-primary-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No conversations yet</h3>
            <p class="text-gray-600 mb-8">Join an activity to start chatting with other riders!</p>
            <UiAppButton
              variant="primary"
              size="lg"
              icon="heroicons:plus"
              @click="joinActivity"
              class="w-full max-w-xs mx-auto"
            >
              Join Activity
            </UiAppButton>
          </div>
        </div>

        <!-- Activities List -->
        <div v-else class="space-y-4">
          <div
            v-for="activity in filteredActivities"
            :key="activity.id"
            class="card hover:shadow-md transition-all duration-300 bg-white rounded-2xl p-5 border border-gray-100 hover:border-primary-200"
          >
            <!-- Activity Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div class="relative">
                  <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                    <Icon
                      :name="getActivityIcon(activity.type)"
                      class="w-6 h-6 text-primary-600"
                    />
                  </div>
                  <!-- Owner Badge -->
                  <div 
                    v-if="activity.isOwner" 
                    class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                    title="You are the owner"
                  >
                    <Icon name="heroicons:crown" class="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center">
                    <h3 class="font-bold text-gray-900 text-lg truncate">{{ activity.title }}</h3>
                    <!-- Role Badge -->
                    <span 
                      :class="[
                        'ml-2 text-xs font-medium px-2 py-0.5 rounded-full',
                        activity.isOwner 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      ]"
                    >
                      {{ activity.isOwner ? 'Owner' : 'Member' }}
                    </span>
                  </div>
                  <div class="flex items-center mt-1">
                    <span class="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full mr-2">
                      {{ activity.type }}
                    </span>
                    <span class="text-xs text-gray-500">{{ activity.date }}</span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Created by {{ activity.isOwner ? 'You' : activity.creatorName }}
                  </div>
                </div>
              </div>
              <!-- Unread Indicator -->
              <div v-if="activity.unreadCount > 0" class="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center ml-2">
                <span class="text-xs text-white font-bold">{{ activity.unreadCount }}</span>
              </div>
            </div>

            <!-- Activity Stats -->
            <div class="grid grid-cols-3 gap-3 mb-4">
              <div class="text-center bg-gray-50 rounded-lg p-3">
                <div class="text-sm font-bold text-gray-900">
                  {{ activity.distance }}
                </div>
                <div class="text-xs text-gray-500 mt-1">Distance</div>
              </div>
              <div class="text-center bg-gray-50 rounded-lg p-3">
                <div class="text-sm font-bold text-gray-900">
                  {{ activity.duration }}
                </div>
                <div class="text-xs text-gray-500 mt-1">Duration</div>
              </div>
              <div class="text-center bg-gray-50 rounded-lg p-3">
                <div class="text-sm font-bold text-gray-900">
                  {{ activity.pace }}
                </div>
                <div class="text-xs text-gray-500 mt-1">Avg Pace</div>
              </div>
            </div>

            <!-- Last Message Preview -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <p class="text-sm text-gray-600 truncate max-w-[70%]">
                <span class="font-medium">You:</span> {{ activity.lastMessage }}
              </p>
              <span class="text-xs text-gray-500 whitespace-nowrap ml-2">{{ activity.lastMessageTime }}</span>
            </div>
            
            <!-- Participants -->
            <div class="flex items-center mt-3 pt-3 border-t border-gray-100">
              <div class="flex -space-x-2">
                <div 
                  v-for="n in Math.min(3, activity.participants)" 
                  :key="n"
                  class="w-8 h-8 bg-primary-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-primary-800"
                >
                  {{ String.fromCharCode(64 + n) }}
                </div>
                <div 
                  v-if="activity.participants > 3"
                  class="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600"
                >
                  +{{ activity.participants - 3 }}
                </div>
              </div>
              <span class="text-xs text-gray-500 ml-2">{{ activity.participants }} participants</span>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 mt-4 pt-4 border-t border-gray-100">
              <button
                @click="viewDetails(activity)"
                :class="[
                  'flex-1 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm',
                  activity.isOwner 
                    ? 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                ]"
              >
                <Icon name="heroicons:information-circle" class="w-4 h-4 mr-2" />
                {{ activity.isOwner ? 'Manage' : 'Details' }}
              </button>
              <button
                @click="enterChat(activity)"
                :class="[
                  'flex-1 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm',
                  activity.isOwner 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                ]"
              >
                <Icon name="heroicons:chat-bubble-left-right" class="w-4 h-4 mr-2" />
                Chatroom
                <span v-if="activity.isOwner" class="ml-1 text-xs">(Admin)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatActivity } from '~/types/chat'

// Page meta with auth middleware
definePageMeta({
  middleware: 'auth'
})

// Meta
useHead({
  title: 'Group Chat - Rider Tracker'
})

// Composables
const { activities, loading, refreshing, fetchActivities, refreshActivities } = useChatActivities()
const { searchQuery, isSearchVisible, clearSearch } = useChatSearch()
const { enterChat, viewDetails, joinActivity, getActivityIcon } = useChatNavigation()
const { filterActivities } = useChatFiltering()

// Computed
const filteredActivities = computed(() => 
  filterActivities(activities.value, searchQuery.value)
)

// Lifecycle
onMounted(() => {
  fetchActivities()
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

.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.form-input {
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Smooth transitions for search bar */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>