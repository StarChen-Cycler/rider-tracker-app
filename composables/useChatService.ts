export const useChatService = () => {
  const isConnected = useState<boolean>('chat-connected', () => false)
  const reconnectAttempts = useState<number>('chat-reconnect-attempts', () => 0)
  
  // WebSocket simulation for real-time features
  const connect = (activityId: string) => {
    console.log(`Connecting to chat room: ${activityId}`)
    isConnected.value = true
    reconnectAttempts.value = 0
  }

  const disconnect = () => {
    console.log('Disconnecting from chat room')
    isConnected.value = false
    reconnectAttempts.value = 0
  }

  const sendTyping = (activityId: string, isTyping: boolean) => {
    if (!isConnected.value) return
    
    console.log(`Sending typing status: ${isTyping} for activity: ${activityId}`)
    // In real app, send via WebSocket
  }

  const handleNewMessage = (callback: (message: any) => void) => {
    // In real app, listen for WebSocket messages
    // For now, just return a mock listener
    return () => {
      console.log('Message listener set up')
    }
  }

  const handleTypingIndicator = (callback: (user: string, isTyping: boolean) => void) => {
    // In real app, listen for typing indicators
    return () => {
      console.log('Typing indicator listener set up')
    }
  }

  const reconnect = async (activityId: string) => {
    if (reconnectAttempts.value >= 3) {
      console.error('Max reconnection attempts reached')
      return false
    }

    reconnectAttempts.value++
    console.log(`Attempting reconnection (${reconnectAttempts.value}/3)`)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000 * reconnectAttempts.value))
      connect(activityId)
      return true
    } catch (error) {
      console.error('Reconnection failed:', error)
      return false
    }
  }

  return {
    isConnected: readonly(isConnected),
    reconnectAttempts: readonly(reconnectAttempts),
    connect,
    disconnect,
    sendTyping,
    handleNewMessage,
    handleTypingIndicator,
    reconnect
  }
}