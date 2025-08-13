export const useChatSearch = () => {
  const searchQuery = useState<string>('chat-search-query', () => '')
  const isSearchVisible = useState<boolean>('chat-search-visible', () => false)

  const clearSearch = () => {
    searchQuery.value = ''
    isSearchVisible.value = false
  }

  const showSearch = () => {
    isSearchVisible.value = true
  }

  const hideSearch = () => {
    isSearchVisible.value = false
  }

  const toggleSearch = () => {
    isSearchVisible.value = !isSearchVisible.value
  }

  return {
    searchQuery: readonly(searchQuery),
    isSearchVisible: readonly(isSearchVisible),
    clearSearch,
    showSearch,
    hideSearch,
    toggleSearch
  }
}