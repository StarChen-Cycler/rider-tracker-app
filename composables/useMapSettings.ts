import { ref, reactive, provide, inject, getCurrentInstance, toRef } from 'vue'
import { useGlobalMap } from './useGlobalMap'

// Map theme options based on the AMap documentation
export const MAP_THEMES = {
  normal: { name: '标准', value: 'normal' },
  dark: { name: '幻影黑', value: 'dark' },
  light: { name: '月光银', value: 'light' },
  whitesmoke: { name: '远山黛', value: 'whitesmoke' },
  fresh: { name: '草色青', value: 'fresh' },
  grey: { name: '雅士灰', value: 'grey' },
  graffiti: { name: '涂鸦', value: 'graffiti' },
  macaron: { name: '马卡龙', value: 'macaron' },
  blue: { name: '靛青蓝', value: 'blue' },
  darkblue: { name: '极夜蓝', value: 'darkblue' },
  wine: { name: '酱籽', value: 'wine' }
} as const

// Map feature options based on the AMap documentation
export const MAP_FEATURES = {
  bg: { name: '区域面', value: 'bg' },
  road: { name: '道路', value: 'road' },
  building: { name: '建筑物', value: 'building' },
  point: { name: '标注', value: 'point' }
} as const

// Types
export type MapTheme = keyof typeof MAP_THEMES
export type MapFeature = keyof typeof MAP_FEATURES

interface MapSettingsState {
  currentTheme: MapTheme
  enabledFeatures: MapFeature[]
}

// Symbol for dependency injection
const MAP_SETTINGS_KEY = Symbol('map-settings')

// Create reactive store for map settings
const mapSettingsStore = reactive<MapSettingsState>({
  currentTheme: 'dark', // Default theme
  enabledFeatures: ['bg', 'road', 'building', 'point'] // All features enabled by default
})

// ================================================ PROVIDER COMPOSABLE ================================================
export const useMapSettingsProvider = () => {
  const globalMap = useGlobalMap()
  
  // Wait for map to be ready before applying settings
  const waitForMapReady = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const checkMap = () => {
        if (globalMap.mapInstance.value && window.AMap && globalMap.isMapReady.value) {
          resolve(true)
        } else {
          setTimeout(checkMap, 100)
        }
      }
      checkMap()
    })
  }
  
  // Set map theme (with map readiness check)
  const setMapTheme = async (theme: MapTheme): Promise<boolean> => {
    // Wait for map to be ready first
    await waitForMapReady()
    
    if (!globalMap.mapInstance.value) {
      console.warn('Map instance not available after wait')
      return false
    }
    
    try {
      const styleUrl = `amap://styles/${theme}`
      globalMap.mapInstance.value.setMapStyle(styleUrl)
      mapSettingsStore.currentTheme = theme
      console.log(`✅ Map theme changed to: ${theme} (after map ready)`)
      return true
    } catch (error) {
      console.error('❌ Failed to set map theme:', error)
      return false
    }
  }
  
  // Set map features (with map readiness check)
  const setMapFeatures = async (features: MapFeature[]): Promise<boolean> => {
    // Wait for map to be ready first
    await waitForMapReady()
    
    if (!globalMap.mapInstance.value) {
      console.warn('Map instance not available after wait')
      return false
    }
    
    try {
      globalMap.mapInstance.value.setFeatures(features)
      mapSettingsStore.enabledFeatures = [...features]
      console.log(`✅ Map features changed to: ${features.join(', ')} (after map ready)`)
      return true
    } catch (error) {
      console.error('❌ Failed to set map features:', error)
      return false
    }
  }
  
  // Toggle a specific feature (async since setMapFeatures is async)
  const toggleFeature = async (feature: MapFeature): Promise<boolean> => {
    const currentFeatures = [...mapSettingsStore.enabledFeatures]
    const index = currentFeatures.indexOf(feature)
    
    if (index > -1) {
      currentFeatures.splice(index, 1)
    } else {
      currentFeatures.push(feature)
    }
    
    return await setMapFeatures(currentFeatures)
  }
  
  // Get available themes
  const getAvailableThemes = () => {
    return Object.entries(MAP_THEMES).map(([key, value]) => ({
      key: key as MapTheme,
      ...value
    }))
  }
  
  // Get available features
  const getAvailableFeatures = () => {
    return Object.entries(MAP_FEATURES).map(([key, value]) => ({
      key: key as MapFeature,
      ...value
    }))
  }
  
  const mapSettings = {
    // State
    currentTheme: toRef(mapSettingsStore, 'currentTheme'),
    enabledFeatures: toRef(mapSettingsStore, 'enabledFeatures'),
    
    // Methods
    setMapTheme,
    setMapFeatures,
    toggleFeature,
    getAvailableThemes,
    getAvailableFeatures
  }
  
  // Provide to child components
  if (getCurrentInstance()) {
    provide(MAP_SETTINGS_KEY, mapSettings)
  }
  
  return mapSettings
}

// ================================================ CONSUMER COMPOSABLE ================================================
export const useMapSettings = () => {
  const globalMap = useGlobalMap()
  
  // Wait for map to be ready before applying settings
  const waitForMapReady = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const checkMap = () => {
        if (globalMap.mapInstance.value && window.AMap && globalMap.isMapReady.value) {
          resolve(true)
        } else {
          setTimeout(checkMap, 100)
        }
      }
      checkMap()
    })
  }
  
  // Direct access implementation
  const directAccess = {
    // State
    currentTheme: toRef(mapSettingsStore, 'currentTheme'),
    enabledFeatures: toRef(mapSettingsStore, 'enabledFeatures'),
    
    // Methods (async with map readiness checks)
    setMapTheme: async (theme: MapTheme): Promise<boolean> => {
      // Wait for map to be ready first
      await waitForMapReady()
      
      if (!globalMap.mapInstance.value) {
        console.warn('Map instance not available after wait')
        return false
      }
      
      try {
        const styleUrl = `amap://styles/${theme}`
        globalMap.mapInstance.value.setMapStyle(styleUrl)
        mapSettingsStore.currentTheme = theme
        console.log(`✅ Map theme changed to: ${theme} (after map ready)`)
        return true
      } catch (error) {
        console.error('❌ Failed to set map theme:', error)
        return false
      }
    },
    
    setMapFeatures: async (features: MapFeature[]): Promise<boolean> => {
      // Wait for map to be ready first
      await waitForMapReady()
      
      if (!globalMap.mapInstance.value) {
        console.warn('Map instance not available after wait')
        return false
      }
      
      try {
        globalMap.mapInstance.value.setFeatures(features)
        mapSettingsStore.enabledFeatures = [...features]
        console.log(`✅ Map features changed to: ${features.join(', ')} (after map ready)`)
        return true
      } catch (error) {
        console.error('❌ Failed to set map features:', error)
        return false
      }
    },
    
    toggleFeature: async (feature: MapFeature): Promise<boolean> => {
      const currentFeatures = [...mapSettingsStore.enabledFeatures]
      const index = currentFeatures.indexOf(feature)
      
      if (index > -1) {
        currentFeatures.splice(index, 1)
      } else {
        currentFeatures.push(feature)
      }
      
      return await directAccess.setMapFeatures(currentFeatures)
    },
    
    getAvailableThemes: () => {
      return Object.entries(MAP_THEMES).map(([key, value]) => ({
        key: key as MapTheme,
        ...value
      }))
    },
    
    getAvailableFeatures: () => {
      return Object.entries(MAP_FEATURES).map(([key, value]) => ({
        key: key as MapFeature,
        ...value
      }))
    }
  }
  
  // Try to get injected state first
  const mapSettings = inject(MAP_SETTINGS_KEY, null)
  
  // Return injected state or direct access
  return mapSettings || directAccess
} 