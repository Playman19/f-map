<template>
  <div class="app">
    <h1>🧪 Тест OpenLayers карты (dev режим)</h1>
    
    <div class="controls" style="margin-bottom: 15px;">
      <button @click="flyToMoscow">Москва</button>
      <button @click="flyToSPb">Санкт-Петербург</button>
      <button @click="flyToSochi">Сочи</button>
    </div>

    <!-- Тестируем Web Component -->
    <ol-map-widget
      ref="mapWidget"
      :initial-center="[37.618423, 55.751244]"
      :initial-zoom="10"
      style="width: 100%; height: 700px; border: 2px solid #333; border-radius: 8px;"
      @map-ready="onMapReady"
      @center-changed="onCenterChanged"
      @zoom-changed="onZoomChanged"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mapWidget = ref(null)

const onMapReady = (ready) => {
  console.log('✅ Карта полностью готова к работе')
}

// const onCenterChanged = (center) => {
//   console.log('📍 Центр изменился:', center)
// }

// const onZoomChanged = (zoom) => {
//   console.log('🔍 Зум изменился:', zoom)
// }

// Примеры методов
const flyToMoscow = () => {
  mapWidget.value?.flyTo(37.618423, 55.751244, 11)
}

const flyToSPb = () => {
  mapWidget.value?.flyTo(30.3141, 59.9386, 13)
}

const flyToSochi = () => {
  mapWidget.value?.flyTo(39.7203, 43.5855, 12)
}
</script>

<style>
.app {
  padding: 20px;
}

.controls button {
  margin-right: 10px;
  padding: 8px 16px;
}
</style>
