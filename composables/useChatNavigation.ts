export const useChatNavigation = () => {
  const enterChat = (activity: ChatActivity) => {
    console.log('🚀 Navigating to chat:', activity.id)
    navigateTo(`/chat/${activity.id}`)
  }

  const viewDetails = (activity: ChatActivity) => {
    console.log('🚀 Navigating to details:', activity.id)
    navigateTo(`/chat/${activity.id}/details`)
  }

  const joinActivity = () => {
    navigateTo('/activities')
  }

  const navigateBack = () => {
    navigateTo('/chats')
  }

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cycling':
        return 'heroicons-outline:adjustments-horizontal'
      case 'motorbike':
        return 'heroicons-outline:bolt'
      case 'running':
        return 'heroicons-outline:play'
      case 'walking':
        return 'heroicons-outline:home'
      default:
        return 'heroicons-outline:user-group'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    // Less than 1 minute
    if (diff < 60000) {
      return 'now'
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return `${minutes}m ago`
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      return `${hours}h ago`
    }
    
    // More than 24 hours
    return date.toLocaleDateString()
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (remainingMinutes === 0) {
      return `${hours}h`
    }
    
    return `${hours}h ${remainingMinutes}m`
  }

  const scrollToBottom = (container: HTMLElement) => {
    container.scrollTop = container.scrollHeight
  }

  const scrollToMessage = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return {
    enterChat,
    viewDetails,
    joinActivity,
    navigateBack,
    getActivityIcon,
    formatTime,
    formatDuration,
    scrollToBottom,
    scrollToMessage
  }
}