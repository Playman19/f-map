import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMPN = defineStore('mpn', () => {
  const items = [
    { id: 1, type: 'payment-threads', icon: 'si:lightning-fill', title: 'В тренде', },
    { id: 2, type: 'panoramas' , icon: 'fa6-solid:panorama', title: 'Панорамы' },
    { id: 3, type: 'sections', icon: 'material-symbols:hotel', title: 'Отели', slug: 'hotels' },
    { id: 4, type: 'sections', icon: 'streamline-plump:fork-plate-solid', title: 'Еда', slug: 'food' },
    { id: 5, type: 'sections', icon: 'mdi:routes', title: 'Экскурсии', slug: 'routes-and-excursions' },
  ]
  return { items }
})