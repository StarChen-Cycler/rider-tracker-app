export const useChatUI = () => {
  const showActivityDetails = useState<boolean>('chat-show-activity-details', () => false)
  const showEmojiPicker = useState<boolean>('chat-show-emoji-picker', () => false)
  const showParticipants = useState<boolean>('chat-show-participants', () => false)
  const isScrolling = useState<boolean>('chat-is-scrolling', () => false)

  const toggleActivityDetails = () => {
    showActivityDetails.value = !showActivityDetails.value
  }

  const toggleEmojiPicker = () => {
    showEmojiPicker.value = !showEmojiPicker.value
  }

  const toggleParticipants = () => {
    showParticipants.value = !showParticipants.value
  }

  const closeAllModals = () => {
    showActivityDetails.value = false
    showEmojiPicker.value = false
    showParticipants.value = false
  }

  const setScrolling = (scrolling: boolean) => {
    isScrolling.value = scrolling
  }

  return {
    showActivityDetails: readonly(showActivityDetails),
    showEmojiPicker: readonly(showEmojiPicker),
    showParticipants: readonly(showParticipants),
    isScrolling: readonly(isScrolling),
    toggleActivityDetails,
    toggleEmojiPicker,
    toggleParticipants,
    closeAllModals,
    setScrolling
  }
}