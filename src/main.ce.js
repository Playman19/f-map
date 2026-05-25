// src/main.ce.js
import { defineCustomElement } from 'vue'
import { pinia } from './main.js'
import MapContainer from './components/MapContainer.ce.vue'

// Защита от повторной регистрации
if (!customElements.get('ol-map-widget')) {
  const MapElement = defineCustomElement(MapContainer, {
    configureApp(app) {
      app.use(pinia)
    }
  })

  customElements.define('ol-map-widget', MapElement)
  console.log('🧩 ol-map-widget успешно зарегистрирован')
} else {
  console.log('🧩 ol-map-widget уже зарегистрирован')
}