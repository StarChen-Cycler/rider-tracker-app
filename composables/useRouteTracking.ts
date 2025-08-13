import { ref } from 'vue'

export const useRouteTracking = () => {
  const isRecording = ref(false)
  
  const startRecording = async () => {
    isRecording.value = true
    console.log('📍 Route tracking started')
  }
  
  const stopRecording = async () => {
    isRecording.value = false
    console.log('📍 Route tracking stopped')
  }
  
  return {
    isRecording,
    startRecording,
    stopRecording
  }
}