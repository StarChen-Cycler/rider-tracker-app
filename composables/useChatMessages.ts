import type { ChatMessage } from '~/types/chat'

export const useChatMessages = () => {
  const messages = useState<ChatMessage[]>('chat-messages', () => [])
  const loading = useState<boolean>('chat-messages-loading', () => false)
  const error = useState<string | null>('chat-messages-error', () => null)
  const typingUsers = useState<string[]>('chat-typing-users', () => [])
  
  const fetchMessages = async (activityId: string, params?: {
    limit?: number
    before?: string
    after?: string
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{
        messages: ChatMessage[]
        hasMore: boolean
        total: number
      }>(`/api/v1/chat/activities/${activityId}/messages`, {
        query: params
      })

      if (params?.after) {
        // Append new messages
        messages.value.push(...response.messages)
      } else if (params?.before) {
        // Prepend older messages
        messages.value.unshift(...response.messages)
      } else {
        // Replace all messages
        messages.value = response.messages
      }

      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch messages'
      throw err
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (activityId: string, content: string, replyTo?: string) => {
    try {
      const response = await $fetch<{
        message: ChatMessage
        success: boolean
      }>(`/api/v1/chat/activities/${activityId}/messages`, {
        method: 'POST',
        body: {
          content: content.trim(),
          replyTo
        }
      })

      if (response.success) {
        messages.value.push(response.message)
        return response.message
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to send message'
      throw err
    }
  }

  const addMessage = (message: ChatMessage) => {
    messages.value.push(message)
  }

  const clearMessages = () => {
    messages.value = []
    error.value = null
  }

  const setTypingUsers = (users: string[]) => {
    typingUsers.value = users
  }

  const addTypingUser = (userName: string) => {
    if (!typingUsers.value.includes(userName)) {
      typingUsers.value.push(userName)
    }
  }

  const removeTypingUser = (userName: string) => {
    typingUsers.value = typingUsers.value.filter(user => user !== userName)
  }

  return {
    messages: readonly(messages),
    loading: readonly(loading),
    error: readonly(error),
    typingUsers: readonly(typingUsers),
    fetchMessages,
    sendMessage,
    addMessage,
    clearMessages,
    setTypingUsers,
    addTypingUser,
    removeTypingUser
  }
}