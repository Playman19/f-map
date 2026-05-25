import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSectionPoints = defineStore('sectionPoints', () => {
  const slug = ref(null)
  function setSlug(slugg) {
    slug.value = slugg
  }

  const points = ref([
    {
      id: 1,
      coords: [34.292367, 53.357879],
      title: "Автосервис RedLine. Отзывы"
    },
    {
      id: 2,
      coords: [34.485032, 53.444484],
      title: "Как мы гуляли на Брянских мальдивах?"
    },
    {
      id: 3,
      coords: [34.578934, 53.241173],
      title: "MillWood, купание зимой. Отзывы"
    },
    {
      id: 4,
      coords: [34.681175, 53.217148],
      title: "Белые Берега, сплав на сапах"
    },
    {
      id: 5,
      coords: [34.161269, 53.043624],
      title: "Суровое левобережье Десны, Залядка, велопоход"
    }
  ])

  return { points, slug, setSlug }
})