import type { ChatActivity } from '~/types/chat'

export const useChatActivity = () => {
  const activity = useState<ChatActivity | null>('chat-current-activity', () => null)
  const loading = useState<boolean>('chat-activity-loading', () => false)
  const error = useState<string | null>('chat-activity-error', () => null)

  const fetchActivity = async (activityId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<ChatActivity>(`/api/v1/chat/activities/${activityId}`)
      activity.value = response
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch activity'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearActivity = () => {
    activity.value = null
    error.value = null
  }

  return {
    activity: readonly(activity),
    loading: readonly(loading),
    error: readonly(error),
    fetchActivity,
    clearActivity
  }
}