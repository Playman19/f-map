import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserLocation = defineStore('userLocation', () => {
  const position = ref(null)     // [lon, lat]
  const accuracy = ref(null)
  const timestamp = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  const getCurrentPosition = async () => {
    isLoading.value = true
    error.value = null

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation не поддерживается вашим браузером')
      }

      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        })
      })

      position.value = [pos.coords.longitude, pos.coords.latitude]
      accuracy.value = pos.coords.accuracy
      timestamp.value = pos.timestamp

      return position.value
    } catch (err) {
      error.value = err.message || 'Не удалось получить геолокацию'
      console.error('Geolocation error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    position,
    accuracy,
    timestamp,
    error,
    isLoading,
    getCurrentPosition
  }
})