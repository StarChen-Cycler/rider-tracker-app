import { ref, watch } from 'vue'

export const useTrackUIState = () => {
  const selectedVehicle = ref('bicycle')
  const selectedTheme = ref('normal')
  const enabledFeatures = ref([])
  
  const { setMapTheme, setMapFeatures, getAvailableThemes, getAvailableFeatures } = useMapSettings()
  const { saveTempUISettings, getTempUISettings } = useRideStorage()

  const availableThemes = computed(() => getAvailableThemes())
  const availableFeatures = computed(() => getAvailableFeatures())

  const onThemeChange = async (theme) => {
    try {
      await setMapTheme(theme)
      saveTempUISettings({ selectedTheme: theme })
    } catch (error) {
      console.error('Failed to change map theme:', error)
    }
  }

  const toggleMapFeature = async (featureKey) => {
    try {
      await setMapFeatures([...enabledFeatures.value])
      saveTempUISettings({ enabledFeatures: [...enabledFeatures.value] })
    } catch (error) {
      console.error('Failed to toggle map feature:', error)
    }
  }

  const isFeatureEnabled = (featureKey) => {
    return enabledFeatures.value.includes(featureKey)
  }

  const initializeUIState = async () => {
    const tempUISettings = getTempUISettings()
    
    if (tempUISettings.selectedVehicle) {
      selectedVehicle.value = tempUISettings.selectedVehicle
    }
    
    if (tempUISettings.selectedTheme) {
      selectedTheme.value = tempUISettings.selectedTheme
      try {
        await setMapTheme(tempUISettings.selectedTheme)
      } catch (error) {
        console.warn('⚠️ Failed to restore map theme:', error)
      }
    }
    
    if (tempUISettings.enabledFeatures && tempUISettings.enabledFeatures.length > 0) {
      enabledFeatures.value = tempUISettings.enabledFeatures
      try {
        await setMapFeatures(tempUISettings.enabledFeatures)
      } catch (error) {
        console.warn('⚠️ Failed to restore map features:', error)
      }
    }
  }

  watch(selectedVehicle, (newVehicle) => {
    saveTempUISettings({ selectedVehicle: newVehicle })
  })

  watch(enabledFeatures, (newFeatures) => {
    saveTempUISettings({ enabledFeatures: [...newFeatures] })
  }, { deep: true })

  return {
    selectedVehicle,
    selectedTheme,
    enabledFeatures,
    availableThemes,
    availableFeatures,
    onThemeChange,
    toggleMapFeature,
    isFeatureEnabled,
    initializeUIState
  }
}