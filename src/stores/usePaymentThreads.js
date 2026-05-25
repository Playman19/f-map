import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePaymentThreads = defineStore('paymentThreads', () => {
  const points = ref([
    {
      id: 1,
      coords: [34.289879, 53.265803],
      title: "Рёбра на огне и парилочка. Сибирские бани",
      likes_count: 543
    },
    {
      id: 2,
      coords: [34.329733, 53.270063], 
      title: "Квартиры от застройщика. ЖК Новый город",
      likes_count: 1022
    },
    {
      id: 3,
      coords: [34.324984, 53.240674],
      title: "Пахлава, сухофрукты и специи от поставщика",
      likes_count: 324
    },
    
  ])

  return { points }
})