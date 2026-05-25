import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useNominatimStore = defineStore('nominatim', () => {
  const loading = ref('empty')
  const geoData = ref([])

  async function getGeoData(lon,lat) {
    // console.log(lon, lat)
    loading.value = 'loading'
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en`)
      geoData.value = response.data
      loading.value = 'success'
    }
    catch (e) {
      console.log(e)
      loading.value = 'empty'
    }
  }

  function reset() {
    loading.value = 'empty'
    geoData.value = []
  }

  return { loading, geoData, getGeoData, reset }
})