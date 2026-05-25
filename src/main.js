import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
import App from './App.vue'

// Создаём и экспортируем pinia
export const pinia = createPinia()

import './main.ce.js'

const app = createApp(App)
app.use(pinia)
app.mount('#app')