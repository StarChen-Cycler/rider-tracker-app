export const useChatInput = () => {
  const newMessage = useState<string>('chat-new-message', () => '')
  const isTyping = useState<boolean>('chat-is-typing', () => false)
  let typingTimeout: NodeJS.Timeout | null = null

  const handleTyping = () => {
    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Set typing state
    isTyping.value = true

    // Reset typing state after 1 second of inactivity
    typingTimeout = setTimeout(() => {
      isTyping.value = false
    }, 1000)
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      // Let parent handle the send action
    }

    if (event.key === 'Escape') {
      newMessage.value = ''
    }
  }

  const clearInput = () => {
    newMessage.value = ''
    isTyping.value = false
    
    if (typingTimeout) {
      clearTimeout(typingTimeout)
      typingTimeout = null
    }
  }

  const focusInput = () => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (textarea) {
      textarea.focus()
    }
  }

  const setInputValue = (value: string) => {
    newMessage.value = value
  }

  return {
    newMessage: readonly(newMessage),
    isTyping: readonly(isTyping),
    handleTyping,
    handleKeydown,
    clearInput,
    focusInput,
    setInputValue
  }
}