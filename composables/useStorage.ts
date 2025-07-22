import { ref } from 'vue'
import type { User } from '@supabase/supabase-js'

export const useStorage = () => {
  const { supabase } = useSupabase()
  const uploading = ref(false)
  const downloadUrl = ref<string | null>(null)

  const uploadAvatar = async (file: File, userId: string) => {
    try {
      uploading.value = true
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      downloadUrl.value = urlData.publicUrl
      return { data, error: null, url: urlData.publicUrl }
    } catch (error: any) {
      console.error('Error uploading avatar:', error.message)
      return { data: null, error, url: null }
    } finally {
      uploading.value = false
    }
  }

  const uploadRidePhoto = async (file: File, rideId: string, userId: string) => {
    try {
      uploading.value = true
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${rideId}/${userId}-${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('ride-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('ride-photos')
        .getPublicUrl(fileName)

      return { data, error: null, url: urlData.publicUrl }
    } catch (error: any) {
      console.error('Error uploading ride photo:', error.message)
      return { data: null, error, url: null }
    } finally {
      uploading.value = false
    }
  }

  const downloadFile = async (bucket: string, filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(filePath)

      if (error) throw error

      const url = URL.createObjectURL(data)
      return { data, error: null, url }
    } catch (error: any) {
      console.error('Error downloading file:', error.message)
      return { data: null, error, url: null }
    }
  }

  const deleteFile = async (bucket: string, filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) throw error
      return { data, error: null }
    } catch (error: any) {
      console.error('Error deleting file:', error.message)
      return { data: null, error }
    }
  }

  const exportRouteAsGPX = async (rideId: string, routePoints: any[], rideTitle: string) => {
    try {
      uploading.value = true
      
      // Generate GPX content
      const gpxContent = generateGPX(routePoints, rideTitle)
      const blob = new Blob([gpxContent], { type: 'application/gpx+xml' })
      
      const fileName = `${rideId}-${Date.now()}.gpx`
      
      const { data, error } = await supabase.storage
        .from('route-exports')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      return { data, error: null, fileName }
    } catch (error: any) {
      console.error('Error exporting route:', error.message)
      return { data: null, error, fileName: null }
    } finally {
      uploading.value = false
    }
  }

  const generateGPX = (routePoints: any[], title: string): string => {
    const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Rider Tracker App" 
     xmlns="http://www.topografix.com/GPX/1/1" 
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <trk>
    <name>${title}</name>
    <trkseg>`

    const gpxPoints = routePoints.map(point => `
      <trkpt lat="${point.lat}" lon="${point.lng}">
        <time>${point.timestamp}</time>
        ${point.altitude ? `<ele>${point.altitude}</ele>` : ''}
        ${point.speed ? `<speed>${point.speed}</speed>` : ''}
      </trkpt>`).join('')

    const gpxFooter = `
    </trkseg>
  </trk>
</gpx>`

    return gpxHeader + gpxPoints + gpxFooter
  }

  return {
    uploading: readonly(uploading),
    downloadUrl: readonly(downloadUrl),
    uploadAvatar,
    uploadRidePhoto,
    downloadFile,
    deleteFile,
    exportRouteAsGPX
  }
} 