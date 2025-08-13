export const useChatFiltering = () => {
  const filterActivities = (activities: ChatActivity[], searchQuery: string) => {
    if (!searchQuery.trim()) {
      return activities
    }
    
    const query = searchQuery.toLowerCase().trim()
    return activities.filter((activity: ChatActivity) => 
      activity.title.toLowerCase().includes(query) ||
      activity.type.toLowerCase().includes(query)
    )
  }

  return {
    filterActivities
  }
}