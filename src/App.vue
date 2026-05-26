<template>
  <div class="app">

    <Visualize :test-connect-data-props="testConnectDataProps" :test-connect-emits-data="testConnectEmitsData" @setProps="setVisualizerProps" />
    <div class="map-wrapper">
      <!-- :threadCoord="[33.7355, 53.2210]" -->

      <!-- locationSelectMode: true -->

      <ol-map-widget v-bind="testConnectDataProps" @map-ready="setMapReady" @location-selected="setLocationSelected" @geo-data-selected="setGeoDataSelected" />
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import Visualize from './components/Visualize.vue';

// Пропсы
const testConnectDataProps = reactive({
  threadCoord: null,
  locationSelectMode: false,
  threadsSlug: 'travel',
})

// Данные по эмитам и обработчики
const testConnectEmitsData = reactive({
  mapReady: null,
  locationSelected: null,
  geoDataSelected: null
})

function setMapReady(data) {
  // console.log(data)
  testConnectEmitsData.mapReady = data.detail[0]
}

function setLocationSelected(data) {
  // console.log(data)
  testConnectEmitsData.locationSelected = data.detail[0]
}

function setGeoDataSelected(data) {
  // console.log(data)
  testConnectEmitsData.geoDataSelected = data.detail[0]
}



// Функции для управления пропсами из визуалайзера
function setVisualizerProps(data) {
  if(data.type === 'thread-coord') {
    if(data.switch) {
      testConnectDataProps.threadCoord = data.payload
    }
    else {
      testConnectDataProps.threadCoord = undefined
    }
  }
  else if('location-select-mode') {
    testConnectDataProps.locationSelectMode = data.switch
  }
}


</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  box-sizing: border-box;
  overflow-y: hidden;
  overflow-x: hidden;
}
.app {
  font-family: system-ui, sans-serif;
  height: 100vh;
  margin: 0;
  display: flex;
}

h1 {
  margin-bottom: 10px;
}

/* Важно для высоты */
#app {
  height: 100vh;
}
.map-wrapper {
  flex: 1;
  border: 1px solid #ccc;
  position: relative;
}
</style>