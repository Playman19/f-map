import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePanoramasStore = defineStore('panoramas', () => {
  const items = ref([
    {
      id: 1,
      coords: [ 34.008, 52.6739 ],
      title: "Гора в Арельске",
      thumb_path: "/thumbs/arelsk_gora.webp",
      panorama_path: "http://localhost:5173/panorams/arelsk_gora.jpg",
      likes_count: 122
      
    },
    {
      id: 2,
      coords: [34.0193, 52.7045],
      title: "Монастырище. Устье реки Навля",
      thumb_path: "/thumbs/monastirishe_navlya.webp",
      panorama_path: "http://localhost:5173/panorams/monastirishe_navlya.jpg",
      likes_count: 133
    },
    {
      id: 3,
      coords: [33.9741, 52.8895],
      title: "Саврасова Круча",
      thumb_path: "/thumbs/savrasova_krucha.webp",
      panorama_path: "http://localhost:5173/panorams/savrasova_krucha.jpg",
      likes_count: 444
    },
    {
      id: 4,
      coords: [34.3124, 53.2008],
      title: "Супонево. Вид на пойму Десны",
      thumb_path: "/thumbs/suponevo_voroshilova.webp",
      panorama_path: "http://localhost:5173/panorams/suponevo_voroshilova.jpg",
      likes_count: 555
    },
    {
      id: 5,
      coords: [33.7739, 52.5753], 
      title: "Трубчевск. Ротонда",
      thumb_path: "/thumbs/trubchevsk_park.webp",
      panorama_path: "http://localhost:5173/panorams/trubchevsk_park.jpg",
      likes_count: 333
    },
    {
      id: 6,
      coords: [34.016051, 52.979393],
      title: "Переторги. Мост",
      thumb_path: "/thumbs/peretorgi-most.webp",
      panorama_path: "http://localhost:5173/panorams/peretorgi-most.jpg",
      likes_count: 121
    },
    {
      id: 7,
      coords: [34.392077, 52.847489],
      title: "Алешинка. Озеро",
      thumb_path: "/thumbs/aleshinka-ozero.webp",
      panorama_path: "http://localhost:5173/panorams/aleshinka-ozero.jpg",
      likes_count: 777
    },
    {
      id: 8,
      coords: [34.203231, 53.215805],
      title: "Аэропорт. Сады",
      thumb_path: "/thumbs/aeroport-sadi.webp",
      panorama_path: "http://localhost:5173/panorams/aeroport-sadi.jpg",
      likes_count: 86
    },

  ])

  return {
    items
  }
})