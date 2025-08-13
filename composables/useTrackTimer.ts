import { ref } from 'vue'

export const useTrackTimer = () => {
  const recordingDuration = ref(0)
  const timer = ref(null)
  const startTimestamp = ref(null)
  
  const { updateRecordingDuration } = useRideRecorder()

  const startTimer = () => {
    if (timer.value) clearInterval(timer.value)
    console.log('⏰ TRACK DEBUG: Starting timer')
    
    const existingDuration = recordingDuration.value
    startTimestamp.value = Date.now() - (existingDuration * 1000)
    
    timer.value = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimestamp.value) / 1000)
      recordingDuration.value = elapsed
      updateRecordingDuration(elapsed)
      
      console.log('⏰ TRACK DEBUG: Timer tick:', {
        elapsed,
        recordingDuration: recordingDuration.value
      })
    }, 1000)
  }

  const stopTimer = () => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }

  const resetTimer = () => {
    stopTimer()
    recordingDuration.value = 0
    startTimestamp.value = null
  }

  return {
    recordingDuration,
    startTimer,
    stopTimer,
    resetTimer
  }
}