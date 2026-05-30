import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useSectionPoints = defineStore('sectionPoints', () => {
  const slug = ref(null)
  const isReq = ref(false)
  function setSlug(slugg) {
    slug.value = slugg
    getPoints()
  }

  async function getPoints() {
    isReq.value = false
    try {
      const response = await axios.get(`${API_URL}/threads/map/${slug.value}`)
      points.value = response.data.data
      
    } catch (e) {
      console.log(e)
    }
    isReq.value = true
  }

  const points = ref([
    // {
    //   id: 1,
    //   coords: [34.292367, 53.357879],
    //   title: "Автосервис RedLine. Отзывы"
    // },
  ])

  return { points, slug, isReq, setSlug }
})