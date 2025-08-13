import type { ChatActivity } from '~/types/chat'

export const useChatActivities = () => {
  const activities = useState<ChatActivity[]>('chat-activities', () => [])
  const loading = useState<boolean>('chat-loading', () => false)
  const refreshing = useState<boolean>('chat-refreshing', () => false)
  const total = useState<number>('chat-total', () => 0)
  const hasMore = useState<boolean>('chat-has-more', () => false)

  const fetchActivities = async (params?: {
    search?: string
    limit?: number
    offset?: number
  }) => {
    loading.value = true
    
    try {
      const response = await $fetch<{
        activities: ChatActivity[]
        total: number
        hasMore: boolean
      }>('/api/v1/chat/activities', {
        query: params
      })

      if (params?.offset && params.offset > 0) {
        activities.value.push(...response.activities)
      } else {
        activities.value = response.activities
      }

      total.value = response.total
      hasMore.value = response.hasMore

      return response
    } catch (error) {
      console.error('Failed to fetch activities:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const refreshActivities = async () => {
    refreshing.value = true
    
    try {
      await fetchActivities()
    } catch (error) {
      console.error('Failed to refresh activities:', error)
      throw error
    } finally {
      refreshing.value = false
    }
  }

  const loadMore = async () => {
    if (!hasMore.value || loading.value) return
    
    await fetchActivities({
      offset: activities.value.length
    })
  }

  const getActivityById = async (id: string) => {
    try {
      return await $fetch<ChatActivity>(`/api/v1/chat/activities/${id}`)
    } catch (error) {
      console.error(`Failed to fetch activity ${id}:`, error)
      throw error
    }
  }

  return {
    activities: readonly(activities),
    loading: readonly(loading),
    refreshing: readonly(refreshing),
    total: readonly(total),
    hasMore: readonly(hasMore),
    fetchActivities,
    refreshActivities,
    loadMore,
    getActivityById
  }
}