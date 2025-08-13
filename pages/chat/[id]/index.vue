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
            <h1 class="font-bold text-gray-900 truncate">{{ activity?.title || 'Loading...' }}</h1>
            <p class="text-xs text-gray-500">{{ onlineParticipants }} online</p>
          </div>
        </div>

        <button
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
          @click="showActivityDetails = true"
        >
          <Icon name="heroicons:information-circle" class="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>

    <!-- Messages Area -->
    <div class="messages-area" ref="messagesContainer">
      <!-- Loading State -->
      <div v-if="loadingMessages" class="flex justify-center py-8">
        <div class="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>

      <!-- Messages List -->
      <div v-else class="messages-list">
        <!-- Date Separator -->
        <div v-if="messages.length > 0" class="text-center my-4">
          <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Today</span>
        </div>

        <!-- Message Items -->
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-item"
          :class="{ 'own': message.isCurrentUser }"
        >
          <!-- Other User's Message -->
          <div v-if="!message.isCurrentUser" class="flex items-start mb-4">
            <div class="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 mr-2">
              <div class="w-full h-full rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                {{ message.userName.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="max-w-[70%]">
              <div class="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm border border-gray-100">
                <p class="text-sm text-gray-900">{{ message.content }}</p>
              </div>
              <p class="text-xs text-gray-500 mt-1 ml-1">{{ formatTime(message.timestamp) }}</p>
            </div>
          </div>

          <!-- Current User's Message -->
          <div v-else class="flex items-start mb-4 justify-end">
            <div class="max-w-[70%]">
              <div class="bg-primary-500 text-white rounded-2xl rounded-tr-sm p-3 shadow-sm">
                <p class="text-sm">{{ message.content }}</p>
              </div>
              <p class="text-xs text-gray-500 mt-1 mr-1 text-right">{{ formatTime(message.timestamp) }}</p>
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="typingUsers.length > 0" class="flex items-center mb-4 ml-10">
          <div class="bg-gray-100 rounded-2xl rounded-tl-sm p-3">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="message-input-area safe-area-bottom">
      <div class="bg-white border-t border-gray-200 p-4">
        <div class="flex items-end space-x-3">
          <button
            class="p-2 rounded-full hover:bg-gray-100 transition-colors"
            @click="showEmojiPicker = true"
          >
            <Icon name="heroicons:face-smile" class="w-5 h-5 text-gray-600" />
          </button>
          
          <div class="flex-1">
            <textarea
              v-model="newMessage"
              placeholder="Type a message..."
              class="w-full p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows="1"
              @keydown="handleKeydown"
              @input="handleTyping"
            ></textarea>
          </div>

          <button
            class="p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!newMessage.trim()"
            @click="sendMessage"
          >
            <Icon name="heroicons:paper-airplane" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Activity Details Modal -->
    <div
      v-if="showActivityDetails"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center"
      @click="showActivityDetails = false"
    >
      <div
        class="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md mx-auto max-h-[80vh] overflow-hidden"
        @click.stop
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold">Activity Details</h2>
            <button
              @click="showActivityDetails = false"
              class="p-2 rounded-full hover:bg-gray-100"
            >
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>
          
          <div v-if="activity" class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-900">{{ activity.title }}</h3>
              <p class="text-sm text-gray-600">{{ activity.type }} • {{ activity.date }}</p>
            </div>
            
            <div class="grid grid-cols-3 gap-3">
              <div class="text-center bg-gray-50 rounded-lg p-3">
                <div class="text-sm font-bold">{{ activity.distance }}</div>
                <div class="text-xs text-gray-500">Distance</div>
              </div>
              <div class="text-center bg-gray-50 rounded-lg p-3">
                <div class="text-sm font-bold">{{ activity.duration }}</div>
                <div class="text-xs text-gray-500">Duration</div>
              </div>
              <div class="text-center bg-gray-50 rounded-lg p-3">
                <div class="text-sm font-bold">{{ activity.pace }}</div>
                <div class="text-xs text-gray-500">Pace</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '~/types/chat'

// Page meta
definePageMeta({
  middleware: 'auth' 
})

// Route params
const route = useRoute()
const activityId = computed(() => {
  const id = route.params.id
  console.log('Chat index route params:', route.params)
  return Array.isArray(id) ? id[0] : id
})

// Composables
const { activity, loading: activityLoading, fetchActivity } = useChatActivity()
const { messages, loading: messagesLoading, sendMessage: sendChatMessage, typingUsers, fetchMessages } = useChatMessages()
const { newMessage, handleTyping, handleKeydown } = useChatInput()
const { showActivityDetails } = useChatUI()
const { getActivityIcon, formatTime, navigateBack, scrollToBottom } = useChatNavigation()

// Refs
const messagesContainer = ref<HTMLElement | null>(null)

// Computed
const loadingMessages = computed(() => messagesLoading.value)
const onlineParticipants = computed(() => {
  // Mock online count - in real app would come from presence system
  return Math.max(1, Math.floor(Math.random() * 5) + 1)
})

// Methods
const sendMessage = async () => {
  if (!newMessage.value.trim() || !activityId.value) return
  
  try {
    await sendChatMessage(activityId.value, newMessage.value)
    newMessage.value = '' // Clear input after successful send
  } catch (error) {
    console.error('Failed to send message:', error)
    // In real app, show error toast
  }
}

// Watch for new messages and scroll to bottom
watch(messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      scrollToBottom(messagesContainer.value)
    }
  })
}, { flush: 'post' })

// Lifecycle
onMounted(async () => {
  console.log('🔍 CHAT INDEX ROUTE MOUNTED')
  console.log('📍 Route params:', route.params)
  console.log('🆔 Activity ID:', activityId.value)
  
  try {
    await fetchActivity(activityId.value)
    console.log('✅ Activity fetched:', activity.value)
    
    await fetchMessages(activityId.value)
    console.log('✅ Messages fetched:', messages.value.length, 'messages')
  } catch (error) {
    console.error('❌ Error loading chat:', error)
  }
})
</script>

<style scoped>
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f9fafb;
}

.messages-list {
  max-width: 100%;
}

.message-item.own {
  align-self: flex-end;
}

.message-input-area {
  background: white;
  border-top: 1px solid #e5e7eb;
}

textarea {
  min-height: 44px;
  max-height: 120px;
  font-family: inherit;
}

textarea::-webkit-scrollbar {
  display: none;
}

/* Smooth animations */
.message-item {
  transition: all 0.3s ease;
}

@media (max-width: 640px) {
  .messages-area {
    padding: 0.75rem;
  }
  
  .message-item .max-w-\[70\%\] {
    max-width: 85%;
  }
}
</style>