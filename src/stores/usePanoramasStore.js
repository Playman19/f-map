import { defineStore } from 'pinia'
import { ref } from 'vue'

import axios from 'axios'

export const usePanoramasStore = defineStore('panoramas', () => {
  const loadingStatus = ref('empty')

  // id: 8,
  // coords: [34.203231, 53.215805],
  // title: "Аэропорт. Сады",
  // thumb_path: "/thumbs/aeroport-sadi.webp",
  // panorama_path: "http://localhost:5173/panorams/aeroport-sadi.jpg",
  // likes_count: 86

  const items = ref([])

  const getPanoramas = async () => {
    loadingStatus.value = 'loading'
    try {
      const response = await axios.get(`${API_URL}/panoramas/all`)
      items.value = response.data.data
    }
    catch (e) {
      console.log(e)
    }
    loadingStatus.value = 'success'
  }

  return {
    items,
    getPanoramas,
    loadingStatus
  }
})